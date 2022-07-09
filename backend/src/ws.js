import { WebSocketServer } from 'ws'
import { parse } from 'url'

export default (server, browser) => {
  const wss1 = new WebSocketServer({ noServer: true })
  const wss2 = new WebSocketServer({ noServer: true })

  wss1.on('connection', async (ws, request) => {})
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
