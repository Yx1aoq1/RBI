import { CONSOLE_ENABLE } from '@/config'
import { EventEmitter } from './EventEmitter'
import { ProtocolError } from './Error'
import { ProtocolMapping } from './Protocol'

const debugProtocolSend = function (value: any) {
  if (!CONSOLE_ENABLE) return
  return console.log('protocol:SEND ►', value)
}
const debugProtocolReceive = function (value: any) {
  if (!CONSOLE_ENABLE) return
  return console.log('protocol:RECV ◀', value)
}

export interface ConnectionTransport {
  send(message: string): void
  close(): void
  onmessage?: (message: string) => void
  onclose?: () => void
}

export interface ConnectionCallback {
  resolve(args: unknown): void
  reject(args: unknown): void
  error: any
  method: string
}

export class Connection extends EventEmitter {
  #url: string
  #transport: ConnectionTransport
  #delay: number
  #lastId = 0
  #closed = false
  #callbacks: Map<number, ConnectionCallback> = new Map()

  constructor(url: string, transport: ConnectionTransport, delay = 0) {
    super()
    this.#url = url
    this.#delay = delay

    this.#transport = transport
    this.#transport.onmessage = this.onMessage.bind(this)
    this.#transport.onclose = this.#onClose.bind(this)
  }

  send<T extends keyof ProtocolMapping.Commands>(
    method: T,
    ...paramArgs: ProtocolMapping.Commands[T]['paramsType']
  ): Promise<ProtocolMapping.Commands[T]['returnType']> {
    const params = paramArgs.length ? paramArgs[0] : undefined
    const id = this._rawSend({ method, params })
    return new Promise((resolve, reject) => {
      this.#callbacks.set(id, {
        resolve,
        reject,
        error: new ProtocolError(),
        method,
      })
    })
  }

  _rawSend(message: Record<string, unknown>): number {
    const id = ++this.#lastId
    const stringifiedMessage = JSON.stringify(Object.assign({}, message, { id }))
    debugProtocolSend(stringifiedMessage)
    this.#transport.send(stringifiedMessage)
    return id
  }

  protected async onMessage(message: string): Promise<void> {
    if (this.#delay) {
      await new Promise(f => {
        return setTimeout(f, this.#delay)
      })
    }
    debugProtocolReceive(message)
    const object = JSON.parse(message)
    if (object.id) {
      const callback = this.#callbacks.get(object.id)
      // Callbacks could be all rejected if someone has called `.dispose()`.
      if (callback) {
        this.#callbacks.delete(object.id)
        if (object.error) {
          callback.reject(createProtocolError(callback.error, callback.method, object))
        } else {
          callback.resolve(object.result)
        }
      }
    } else {
      this.emit(object.method, object.params)
    }
  }

  #onClose() {
    if (this.#closed) {
      return
    }
    this.#closed = true
    this.#transport.onmessage = undefined
    this.#transport.onclose = undefined
    for (const callback of this.#callbacks.values()) {
      callback.reject(rewriteError(callback.error, `Protocol error (${callback.method}): Target closed.`))
    }
    this.#callbacks.clear()
  }

  dispose(): void {
    this.#onClose()
    this.#transport.close()
  }
}

function createProtocolError(
  error: ProtocolError,
  method: string,
  object: { error: { message: string; data: any; code: number } }
): Error {
  let message = `Protocol error (${method}): ${object.error.message}`
  if ('data' in object.error) {
    message += ` ${object.error.data}`
  }
  return rewriteError(error, message, object.error.message)
}

function rewriteError(error: ProtocolError, message: string, originalMessage?: string): Error {
  error.message = message
  error.originalMessage = originalMessage ?? error.originalMessage
  return error
}
