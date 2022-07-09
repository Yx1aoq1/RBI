import Express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import puppeteer from 'puppeteer'
import axios from 'axios'
import { createServer } from 'http'
import api from './api.js'
import websocket from './ws.js'

const CONFIG = {
  hostname: '127.0.0.1',
  server_port: 9233,
  chrome_port: 9222,
}

const start = async () => {
  const browser = await puppeteer.connect({
    browserURL: `http://${CONFIG.hostname}:${CONFIG.chrome_port}`,
  })
  const app = Express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(
    cors({
      credentials: true, // 未配置会导致cookie丢失无法判断session
      origin: 'http://localhost:3000', // 调试时启动的web地址
    })
  ) // 设置跨域

  app.use('/api', api(browser))

  const server = createServer(app)

  websocket(server, browser)

  server.listen(CONFIG.port, function (err) {
    if (err) {
      console.error('err:', err)
    } else {
      console.info(`===> api server is running at ${CONFIG.hostname}:${CONFIG.server_port}`)
    }
  })
}

start()
