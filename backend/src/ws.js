import { WebSocketServer } from 'ws'
import { parse } from 'url'
import { uuid } from './utils.js'

const pages = new Map()

export default (server, browser) => {
  const wss1 = new WebSocketServer({ noServer: true })

  wss1.on('connection', async (ws, request) => {
    ws.on('message', async message => {
      const { id, method, params } = JSON.parse(message)
      console.log('rec >>>', id, method, params)
      let response = { id, result: {} }
      try {
        if (method === 'initialize') {
          const page = await browser.newPage()
          const pageId = uuid()
          if (page) {
            const client = await page.target().createCDPSession()
            client.on('Page.screencastFrame', params => {
              console.log(params)
            })
            pages.set(pageId, {
              page,
              client,
            })
            response = { id, result: { id: pageId } }
          } else {
            throw new Error('page initialize failed')
          }
        } else {
          if (!pages.has(params.id)) {
            throw new Error('page is not find')
          }
          const { page, client } = pages.get(params.id)
          switch (method) {
            case 'close':
              pages.delete(params.id)
              page.close()
              break
            case 'navigate':
              page.goto(params.url)
              break
            case 'back':
              page.goBack()
              break
            case 'forward':
              page.goForward()
              break
            case 'reload':
              page.reload()
              break
            case 'setViewport':
              response.result = await page.setViewport(params)
              break
            default:
              response = await client.send(method, params)
          }
        }
        ws.send(JSON.stringify(response))
      } catch (error) {
        ws.send(JSON.stringify({ id, error: { message: error.message } }))
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
    } else {
      socket.destroy()
    }
  })
}
