<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      :class="toastClasses"
      class="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <i :class="iconClasses" class="text-lg"></i>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="$emit('close')"
              class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span class="sr-only">Fechar</span>
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue' // ← ADICIONE ESTA LINHA

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  message: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

// Computed properties
const toastClasses = computed(() => {
  const baseClasses = 'border-l-4'
  const typeClasses = {
    success: 'border-green-400 bg-green-50 dark:bg-green-900/20',
    error: 'border-red-400 bg-red-50 dark:bg-red-900/20',
    warning: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    info: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
  }
  return `${baseClasses} ${typeClasses[props.type] || typeClasses.info}`
})

const iconClasses = computed(() => {
  const baseClasses = 'fas'
  const typeIcons = {
    success: 'fa-check-circle text-green-400',
    error: 'fa-exclamation-circle text-red-400',
    warning: 'fa-exclamation-triangle text-yellow-400',
    info: 'fa-info-circle text-blue-400'
  }
  return `${baseClasses} ${typeIcons[props.type] || typeIcons.info}`
})
</script>