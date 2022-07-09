import { WebSocketServer } from 'ws'
import { parse } from 'url'

const pages = new Map()

export default (server, browserManager) => {
  const wss1 = new WebSocketServer({ noServer: true })
  const wss2 = new WebSocketServer({ noServer: true })

  wss1.on('connection', async (ws, request) => {
    ws.on('message', async message => {
      const params = JSON.parse(message)
      try {
        const result = await browserManager[params.method](params.params)
        ws.send(JSON.stringify({ id: params.id, result }))
      } catch (error) {
        ws.send(JSON.stringify({ id: params.id, error: { message: error.message } }))
      }
    })
  })
  wss1.on('connection', async (ws, request) => {})

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url)
    if (pathname === '/page') {
      wss1.handleUpgrade(request, socket, head, function done(ws) {
        wss1.emit('connection', ws, request)
      })
    } else if (pathname === '/bar') {
      wss2.handleUpgrade(request, socket, head, function done(ws) {
        wss2.emit('connection', ws, request)
      })
    } else {
      socket.destroy()
    }
  })
}
