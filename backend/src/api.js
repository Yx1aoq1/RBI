import Express from 'express'
const router = Express.Router()

// 数据返回处理
const responseClient = (res, httpCode = 500, message = '服务端异常', data = {}) => {
  let responseData = {}
  responseData.message = message
  responseData.content = data
  res.status(httpCode).json(responseData)
}

export default browser => {
  // 初始化一个窗口
  router.get('/page/create', async (req, res) => {
    const url = browser.wsEndpoint()
    console.log(`wsEndpoint: ${url}`)
    responseClient(res, 200, 'Success.', url)
  })

  return router
}
