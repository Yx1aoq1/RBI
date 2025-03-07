import { ConnectionTransport } from './Connection'

export class WebSocketTransport implements ConnectionTransport {
  static create(url: string): Promise<WebSocketTransport> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url)

      ws.addEventListener('open', () => {
        return resolve(new WebSocketTransport(ws))
      })
      ws.addEventListener('error', reject)
    })
  }

  #ws: WebSocket
  onmessage?: (message: string) => void
  onclose?: () => void

  constructor(ws: WebSocket) {
    this.#ws = ws
    this.#ws.addEventListener('message', event => {
      if (this.onmessage) {
        this.onmessage.call(null, event.data)
      }
    })
    this.#ws.addEventListener('close', () => {
      if (this.onclose) {
        this.onclose.call(null)
      }
    })
    this.#ws.addEventListener('error', () => {})
  }

  send(message: string): void {
    this.#ws.send(message)
  }

  close(): void {
    this.#ws.close()
  }
}
