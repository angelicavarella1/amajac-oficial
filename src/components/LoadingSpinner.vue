<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div class="animate-spin rounded-full border-4 border-gray-300 border-t-amajac-500" 
         :class="spinnerClass"
         role="status"
         aria-label="Carregando">
    </div>
    <span v-if="showText" class="ml-3 text-gray-600">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    showText: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Carregando...'
    },
    containerClass: {
      type: String,
      default: 'py-8'
    }
  },
  computed: {
    spinnerClass() {
      const sizes = {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
      }
      return sizes[this.size]
    }
  }
}
</script>