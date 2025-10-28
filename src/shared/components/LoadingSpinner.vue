<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-b-2 border-primary-600"
      :class="spinnerClasses"
      :style="spinnerStyle"
    />
    <span v-if="showText" class="ml-2 text-gray-600 dark:text-gray-400">{{ text }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  text: {
    type: String,
    default: 'Carregando...'
  },
  showText: {
    type: Boolean,
    default: false
  },
  containerClass: {
    type: String,
    default: ''
  }
})

const spinnerClasses = {
  small: 'h-4 w-4',
  medium: 'h-8 w-8',
  large: 'h-12 w-12'
}[props.size]

const spinnerStyle = {
  borderColor: `var(--color-${props.color}-600)`
}
</script>