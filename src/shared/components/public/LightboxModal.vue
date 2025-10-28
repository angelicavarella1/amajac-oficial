<template>
  <div v-if="abertura" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
    <div class="relative max-w-4xl max-h-full w-full">
      <!-- Botão Fechar -->
      <button 
        @click="$emit('fechar')"
        class="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Imagem -->
      <div class="flex items-center justify-center h-full">
        <img 
          :src="imagem" 
          alt="Imagem em destaque"
          class="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LightboxModal',
  props: {
    abertura: Boolean,
    imagem: String
  },
  emits: ['fechar'],
  mounted() {
    // Fechar com a tecla ESC
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        this.$emit('fechar')
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    
    this.$once('hook:beforeUnmount', () => {
      document.removeEventListener('keydown', handleEscape)
    })
  }
}
</script>
