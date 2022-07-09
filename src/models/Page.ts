import { EventEmitter } from './EventEmitter'
import { Connection, ConnectionTransport } from './Connection'
import { WebSocketTransport as WebSocketClass } from './WebSocket'
import { Protocol } from './Protocol'

export interface ConnectOptions {
  defaultViewport: Protocol.Viewport
  pageWsURL?: string
  transport?: ConnectionTransport
  slowMo?: number
}

export async function connectToPage(options: ConnectOptions): Promise<Page> {
  const { pageWsURL, defaultViewport, transport, slowMo = 0 } = options

  let connection!: Connection
  if (transport) {
    connection = new Connection('', transport, slowMo)
  } else if (pageWsURL) {
    const connectionTransport: ConnectionTransport = await WebSocketClass.create(pageWsURL)
    connection = new Connection(pageWsURL, connectionTransport, slowMo)
  }
  const { id } = await connection.send('initialize')
  return Page._create(id, connection, defaultViewport)
}

export class Page extends EventEmitter {
  static async _create(id: string, connection: Connection, defaultViewport: Protocol.Viewport): Promise<Page> {
    const page = new Page(id, connection, defaultViewport)
    await page.#initialize()
    return page
  }
  id: string
  #client: Connection
  #viewport: Protocol.Viewport
  constructor(id: string, client: Connection, defaultViewport: Protocol.Viewport) {
    super()
    this.id = id
    this.#client = client
    this.#viewport = defaultViewport
  }

  isMobile(): boolean {
    if (
      navigator.userAgent.match(/Mobi/i) ||
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPhone/i)
    ) {
      return true
    }
    return false
  }

  async #initialize(): Promise<void> {
    await Promise.all([this.setViewport(this.#viewport)])
  }

  async setViewport(viewport: { width: number; height: number }): Promise<boolean> {
    const needsReload = await this.#client.send('setViewport', {
      id: this.id,
      width: viewport.width,
      height: viewport.height,
      isMobile: this.isMobile(),
      deviceScaleFactor: 1,
      hasTouch: this.isMobile(),
    })
    return needsReload
  }

  close(): void {
    this.#client.send('close', { id: this.id })
  }

  navigate(url: string): void {
    this.#client.send('navigate', { id: this.id, url })
  }

  back(): void {
    this.#client.send('back', { id: this.id })
  }

  forward(): void {
    this.#client.send('forward', { id: this.id })
  }

  reload(): void {
    this.#client.send('reload', { id: this.id })
  }

  resize(width: number, height: number): void {
    this.#viewport.width = width
    this.#viewport.height = height
    this.setViewport(this.#viewport)
  }
}
