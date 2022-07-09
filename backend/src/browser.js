import { uuid } from './utils.js'

export default class BrowserManager {
  constructor(browser) {
    this.browser = browser
    this.pages = new Map()
  }

  async initialize(params) {
    const page = await this.browser.newPage()
    const id = uuid()
    console.log(id)
    if (page) {
      this.pages.set(id, page)
    } else {
      throw new Error('page initialize failed')
    }
    return {
      frameId: id,
    }
  }

  async close(params) {
    if (this.pages.has(params.frameId)) {
      const page = this.pages.get(params.frameId)
      await page.close()
    } else {
      throw new Error('no such page')
    }
    return {}
  }

  async setViewport(params) {
    let result = false
    if (this.pages.has(params.frameId)) {
      const page = this.pages.get(params.frameId)
      result = await page.setViewport(params)
    } else {
      throw new Error('no such page')
    }
    return result
  }
}
