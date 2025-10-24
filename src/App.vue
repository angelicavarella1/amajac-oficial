<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

onMounted(() => {
  uiStore.initializeDarkMode()
})
</script>