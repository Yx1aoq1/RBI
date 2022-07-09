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
  return Page._create(connection, defaultViewport)
}

export class Page extends EventEmitter {
  static async _create(connection: Connection, defaultViewport: Protocol.Viewport): Promise<Page> {
    const page = new Page(connection, defaultViewport)
    await page.#initialize()
    return page
  }
  #client: Connection
  #viewport: Protocol.Viewport
  frameId!: string
  constructor(client: Connection, defaultViewport: Protocol.Viewport) {
    super()
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
    // 初始化窗口大小
    // 获取当前页面的DOM数据
    const { frameId } = await this.#client.send('initialize')
    this.frameId = frameId
    await Promise.all([this.setViewport(this.#viewport)])
  }

  async setViewport(viewport: { width: number; height: number }): Promise<boolean> {
    const needsReload = await this.#client.send('setViewport', {
      frameId: this.frameId,
      width: viewport.width,
      height: viewport.height,
      isMobile: this.isMobile(),
      deviceScaleFactor: 1,
      hasTouch: this.isMobile(),
    })
    return needsReload
  }

  close(): void {
    if (!this.frameId) return
    this.#client.send('close', { frameId: this.frameId })
  }
}
