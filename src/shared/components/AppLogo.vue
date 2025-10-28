<!-- src/components/AppLogo.vue -->
<template>
  <img 
    :src="logoPath" 
    :alt="alt"
    :class="['object-contain', sizeClass]"
    @error="handleError"
  />
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  alt: {
    type: String,
    default: 'AMAJAC'
  }
})

const sizeClass = computed(() => {
  const sizes = {
    small: 'h-8 w-auto',
    medium: 'h-12 w-auto', 
    large: 'h-16 w-auto'
  }
  return sizes[props.size]
})

const logoPath = '/images/logo-amajac.png'

const handleError = (event) => {
  console.error('Logo não carregada:', event)
  // Fallback: mostrar texto
  event.target.style.display = 'none'
}
</script>