<template>
  <div class="container">
    <Browser />
  </div>
</template>

<script setup lang="ts">
import Browser from '@/components/browser'
</script>
<style lang="less">
.container {
  box-sizing: border-box;
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
}
</style>
