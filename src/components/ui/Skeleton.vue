<template>
  <div 
    aria-busy="true"
    class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
    :class="className"
  ></div>
</template>

<script setup>
defineProps({
  className: { type: String, default: 'h-4' }
})
</script>