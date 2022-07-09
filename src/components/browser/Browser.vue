<template>
  <div class="browser">
    <BrowserNavigationBar v-model="url" @navigate="navigate" @back="back" @forward="forward" @reload="reload" />
    <div class="browser-window" ref="browserWindowEl"></div>
  </div>
</template>
<script setup lang="ts">
import { logger } from '@/utils'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { connectToPage, Page } from '@/models/Page'
import BrowserNavigationBar from './BrowserNavigationBar.vue'
import elementResizeDetectorMaker from 'element-resize-detector'
/** page init start */
let page!: Page
let browserWindowWidth: number
let browserWinodwHeight: number
const erd = elementResizeDetectorMaker()
const browserWindowEl = ref()
// 视窗大小
const viewport = computed(() => {
  return {
    width: browserWindowWidth,
    height: browserWinodwHeight,
  }
})
/**
 * 窗口变化时视窗大小更新
 * @param elem
 */
function resize(elem: HTMLElement): void {
  browserWindowWidth = elem.offsetWidth
  browserWinodwHeight = elem.offsetHeight
  logger.info('resize', viewport.value)
}
onMounted(async () => {
  if (browserWindowEl.value) {
    browserWindowWidth = browserWindowEl.value.offsetWidth
    browserWinodwHeight = browserWindowEl.value.offsetWidth
    // 监听窗口大小变化
    erd.listenTo(browserWindowEl.value, resize)
    page = await connectToPage({
      pageWsURL: 'ws://localhost:9233/page',
      defaultViewport: viewport.value,
    })
    logger.info('page', page)
  }
})
onUnmounted(async () => {
  page.close()
})
/** page init end */
/** navigate bar start */
const url = ref('')
function navigate(url: string): void {
  logger.info('navigate', url)
}
function back(): void {
  logger.info('back')
}
function forward(): void {
  logger.info('forward')
}
function reload(): void {
  logger.info('reload')
}
/** navigate bar end */
</script>
