<!-- src/admin/components/RelatorioCard.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ title }}</h3>
    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ formattedValue }}</p>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ description }}</p>
    <div v-if="trend !== 'neutral'" class="mt-2 flex items-center">
      <i 
        :class="[
          'text-xs',
          trend === 'up' ? 'fas fa-arrow-up text-green-500' :
          trend === 'down' ? 'fas fa-arrow-down text-red-500' :
          'fas fa-minus text-gray-400'
        ]"
      />
      <span class="text-xs ml-1" :class="trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'">
        {{ trendValue }}%
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  description: { type: String, default: '' },
  trend: { type: String, default: 'neutral' }, // 'up', 'down', 'neutral'
  trendValue: { type: [Number, String], default: '0' }
})

// Formatar números automaticamente
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('pt-BR')
  }
  return props.value
})
</script>

<style scoped>
/* Estilos específicos do card */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}
</style>