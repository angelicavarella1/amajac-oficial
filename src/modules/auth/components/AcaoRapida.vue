<!-- src/components/dashboard/AcaoRapida.vue -->
<template>
  <router-link
    :to="to"
    :class="actionClasses"
    class="flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
  >
    <div :class="iconContainerClasses" class="w-12 h-12 rounded-full flex items-center justify-center mb-2">
      <i :class="icone" class="text-lg"/>
    </div>
    <span class="text-sm font-medium text-center">{{ titulo }}</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  icone: {
    type: String,
    required: true
  },
  cor: {
    type: String,
    default: 'green',
    validator: (value) => {
      const coresValidas = ['green', 'blue', 'purple', 'red', 'yellow', 'indigo', 'gray']
      const valido = coresValidas.includes(value)
      
      if (!valido) {
        console.warn(`🚨 COR INVÁLIDA no AcaoRapida: "${value}"`)
        console.warn(`   Cores válidas: ${coresValidas.join(', ')}`)
      }
      
      return valido
    }
  }
})

// Computed
const actionClasses = computed(() => {
  const baseClasses = 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
  const hoverClasses = {
    green: 'hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20',
    blue: 'hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    purple: 'hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20',
    red: 'hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
    yellow: 'hover:border-yellow-300 dark:hover:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
    indigo: 'hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    gray: 'hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
  }
  return `${baseClasses} ${hoverClasses[props.cor] || hoverClasses.green}`
})

const iconContainerClasses = computed(() => {
  const classes = {
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }
  return classes[props.cor] || classes.green
})
</script>