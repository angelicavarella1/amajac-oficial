<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="`w-12 h-12 bg-${cor}-100 dark:bg-${cor}-900 rounded-lg flex items-center justify-center`">
            <i :class="`${icone} text-${cor}-600 dark:text-${cor}-400 text-xl`"/>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ titulo }}</p>
          <div v-if="loading" class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1 w-16"/>
          <p v-else class="text-2xl font-bold text-gray-900 dark:text-white">{{ valor }}</p>
        </div>
      </div>
      
      <!-- Trend Indicator -->
      <div v-if="!loading" class="flex items-center">
        <span 
          :class="[
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
            trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          ]"
        >
          <i 
            :class="[
              'mr-1 text-xs',
              trend === 'up' ? 'fas fa-arrow-up' :
              trend === 'down' ? 'fas fa-arrow-down' :
              'fas fa-minus'
            ]"
          />
          {{ trendValue }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: String,
  valor: Number,
  icone: String,
  cor: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'purple', 'yellow', 'red'].includes(value)
  },
  trend: {
    type: String,
    default: 'neutral',
    validator: (value) => ['up', 'down', 'neutral'].includes(value)
  },
  trendValue: String,
  loading: Boolean
})
</script>