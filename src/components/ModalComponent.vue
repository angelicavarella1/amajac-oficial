<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
         @click="closeModal"
         aria-hidden="true"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
           role="dialog"
           :aria-labelledby="titleId"
           :aria-describedby="descriptionId"
           aria-modal="true">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 :id="titleId" class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>
            <p v-if="description" :id="descriptionId" class="text-sm text-gray-600 mt-1">
              {{ description }}
            </p>
          </div>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amajac-500 focus-visible:ring-offset-2 rounded"
            aria-label="Fechar modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <slot name="content"></slot>
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'

export default {
  name: 'ModalComponent',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'update:isOpen'],
  setup(props, { emit }) {
    const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`
    const descriptionId = `modal-description-${Math.random().toString(36).substr(2, 9)}`

    const closeModal = () => {
      emit('close')
      emit('update:isOpen', false)
    }

    const handleEscape = (event) => {
      if (props.closeOnEscape && event.key === 'Escape') {
        closeModal()
      }
    }

    onMounted(() => {
      if (props.closeOnEscape) {
        document.addEventListener('keydown', handleEscape)
      }
      
      // Prevenir scroll do body quando modal estiver aberto
      if (props.isOpen) {
        document.body.style.overflow = 'hidden'
      }
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    })

    return {
      titleId,
      descriptionId,
      closeModal
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  }
}
</script>