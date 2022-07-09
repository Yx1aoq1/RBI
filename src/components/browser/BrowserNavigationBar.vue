<template>
  <div class="browser-navigation-bar">
    <div class="navigation-bar-btns" @click="handleGoback">
      <svg-icon name="direction-left"></svg-icon>
    </div>
    <div class="navigation-bar-btns" @click="handleGoForward">
      <svg-icon name="direction-right"></svg-icon>
    </div>
    <div class="navigation-bar-btns" @click="handleReload">
      <svg-icon name="refresh"></svg-icon>
    </div>
    <input class="navigation-bar-input" :value="modelValue" @input="handleInput" @keyup.enter="handleNavigate" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'navigate', 'back', 'forward', 'reload'])

function handleInput(e: Event): void {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
function handleNavigate(): void {
  emit('navigate', props.modelValue)
}
function handleGoback(): void {
  emit('back')
}
function handleGoForward(): void {
  emit('forward')
}
function handleReload(): void {
  emit('reload')
}
</script>
