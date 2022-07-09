<template>
  <div class="browser">
    <BrowserNavigationBar v-model="url" @navigate="navigate" @back="back" @forward="forward" @reload="reload" />
    <div class="browser-window"></div>
  </div>
</template>
<script setup lang="ts">
import { logger } from '@/utils'
import { ref, computed, onMounted, nextTick } from 'vue'
import BrowserNavigationBar from './BrowserNavigationBar.vue'
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
</script>
