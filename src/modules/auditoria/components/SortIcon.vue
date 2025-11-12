<template>
  <svg 
    class="w-4 h-4" 
    :class="{
      'text-gray-400': field !== currentSort,
      'text-amajac-green': field === currentSort
    }"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      v-if="field === currentSort && order === 'asc'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M5 15l7-7 7 7"
    />
    <path 
      v-else-if="field === currentSort && order === 'desc'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M19 9l-7 7-7-7"
    />
    <path 
      v-else
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
    />
  </svg>
</template>

<script setup>
defineProps({
  field: {
    type: String,
    required: true
  },
  currentSort: {
    type: String,
    required: true
  },
  order: {
    type: String,
    required: true
  }
})
</script>