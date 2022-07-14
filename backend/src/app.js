import puppeteer from 'puppeteer'
import { WebSocketServer } from 'ws'

const CONFIG = {
  hostname: '127.0.0.1',
  socket_port: 9233,
  chrome_port: 9222,
}

const screenshots = []

const start = async () => {
  const browser = await puppeteer.connect({
    browserURL: `http://${CONFIG.hostname}:${CONFIG.chrome_port}`,
  })
  // 初始化
  const page = await browser.newPage()
  const wss = new WebSocketServer({ port: CONFIG.socket_port })

  wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      
    })
  })
}

start()
