<!-- src/components/ui/ModalContato.vue -->
<template>
  <div 
    v-if="isOpen" 
    class="modal-overlay" 
    @click="closeOnOverlay"
  >
    <div class="modal-content" @click.stop>
      <!-- CABEÇALHO DO MODAL -->
      <div class="modal-header">
        <h2 class="modal-title">Fale Conosco</h2>
        <button @click="close" class="modal-close-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- FORMULÁRIO DE CONTATO -->
      <form @submit.prevent="enviarMensagemComModal" class="modal-form">
        <div class="form-group">
          <label for="nome" class="form-label">Nome *</label>
          <input
            id="nome"
            v-model="formData.nome"
            type="text"
            required
            class="form-input"
            placeholder="Seu nome completo"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">E-mail *</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="form-input"
            placeholder="seu@email.com"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="telefone" class="form-label">Telefone (opcional)</label>
          <input
            id="telefone"
            v-model="formData.telefone"
            type="tel"
            class="form-input"
            placeholder="(21) 99999-9999"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="assunto" class="form-label">Assunto *</label>
          <select
            id="assunto"
            v-model="formData.assunto"
            required
            class="form-input"
            :disabled="loading"
          >
            <option value="">Selecione um assunto</option>
            <option value="informacao">Informação</option>
            <option value="sugestao">Sugestão</option>
            <option value="reclamacao">Reclamação</option>
            <option value="associacao">Associação</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div class="form-group">
          <label for="mensagem" class="form-label">Mensagem *</label>
          <textarea
            id="mensagem"
            v-model="formData.mensagem"
            required
            rows="4"
            class="form-input"
            placeholder="Digite sua mensagem..."
            :disabled="loading"
          ></textarea>
        </div>

        <button 
          type="submit" 
          class="submit-btn"
          :disabled="loading"
        >
          <span v-if="loading">Enviando...</span>
          <span v-else>Enviar Mensagem</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useEnviarMensagem } from '@/modules/mensagens/composables/useEnviarMensagem'

// Props e Emits
const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

// ✅ CORREÇÃO: Criamos nosso próprio formData
const formData = reactive({
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  mensagem: ''
})

// ✅ CORREÇÃO: Usando o composable corretamente
const { loading, error, success, enviar } = useEnviarMensagem()

// Métodos
const close = () => {
  // Limpar formulário ao fechar
  Object.assign(formData, {
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })
  emit('close')
}

const closeOnOverlay = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    close()
  }
}

// ✅ CORREÇÃO: Enviar mensagem corretamente
const enviarMensagemComModal = async () => {
  try {
    await enviar(formData)
    
    if (success.value) {
      // Mensagem enviada com sucesso
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
      close()
    } else if (error.value) {
      // Mostrar erro se houver
      alert(`Erro ao enviar mensagem: ${error.value}`)
    }
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err)
    alert('Erro ao enviar mensagem. Tente novamente.')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dark .modal-content {
  background: #1f2937;
  color: white;
}

.modal-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .modal-header {
  border-bottom-color: #374151;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dark .modal-title {
  color: white;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.dark .modal-close-btn:hover {
  color: white;
  background: #374151;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.dark .form-label {
  color: #d1d5db;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.dark .form-input {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.form-input:focus {
  outline: none;
  border-color: #2E7D32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.dark .form-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.submit-btn {
  width: 100%;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #1B5E20;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsividade */
@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .modal-header,
  .modal-form {
    padding: 1rem;
  }
}
</style>