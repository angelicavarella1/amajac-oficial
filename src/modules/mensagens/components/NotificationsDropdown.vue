<!-- src/modules/mensagens/components/NotificationsDropdown.vue -->
<template>
  <div class="relative">
    <!-- Botão de Notificações -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Notificações"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM8.5 14.5A2.5 2.5 0 0011 12V7a4 4 0 114 4v1.5m-5.5 2h7" />
      </svg>
      
      <!-- Badge de contagem -->
      <span
        v-if="count > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse"
      >
        {{ count > 99 ? '99+' : count }}
      </span>
    </button>

    <!-- Dropdown de Notificações -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Mensagens
          </h3>
          <div class="flex items-center gap-2">
            <span
              class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full font-medium"
            >
              {{ count }} nova(s)
            </span>
            <button
              v-if="count > 0"
              @click="marcarTodasComoLidasDropdown"
              :disabled="loading"
              class="text-xs text-amajac-green hover:text-green-700 font-medium disabled:opacity-50"
            >
              Marcar todas
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de Mensagens -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center">
          <svg class="w-5 h-5 mx-auto text-amajac-green animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-14.142l2.828 2.828m9.9 9.9l2.828 2.828" />
          </svg>
        </div>

        <div v-else-if="ultimasMensagens.length === 0" class="p-6 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Nenhuma nova mensagem
          </p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="mensagem in ultimasMensagens"
            :key="mensagem.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            @click="verMensagem(mensagem)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ mensagem.nome }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ mensagem.email }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                  {{ mensagem.assunto || 'Sem assunto' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatDate(mensagem.created_at) }}
                </p>
              </div>
              <button
                @click.stop="marcarComoLidaDropdown(mensagem.id)"
                class="ml-2 p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="Marcar como lida"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-gray-200 dark:border-gray-700">
        <router-link
          to="/admin/mensagens"
          class="block w-full text-center px-4 py-2 text-sm font-medium text-amajac-green hover:text-green-700 transition-colors"
          @click="isOpen = false"
        >
          Ver todas as mensagens
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMensagensNaoLidas } from '../composables/useMensagensNaoLidas'

const router = useRouter()
const isOpen = ref(false)

const { 
  count, 
  loading, 
  ultimasMensagens, 
  marcarComoLida, 
  marcarTodasComoLidas,
  refresh 
} = useMensagensNaoLidas()

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Atualiza as notificações quando o dropdown é aberto
    refresh()
  }
}

const verMensagem = (mensagem) => {
  isOpen.value = false
  // Navega para a página de mensagens com a mensagem específica
  router.push('/admin/mensagens')
  // Emite um evento global para abrir a mensagem específica
  window.dispatchEvent(new CustomEvent('abrir-mensagem', { 
    detail: { id: mensagem.id } 
  }))
}

const marcarTodasComoLidasDropdown = async () => {
  await marcarTodasComoLidas()
  refresh()
}

const marcarComoLidaDropdown = async (mensagemId) => {
  await marcarComoLida(mensagemId)
  // Não precisa chamar refresh() pois o realtime já atualiza automaticamente
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fechar dropdown ao clicar fora
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.relative')
  if (!dropdown) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
  
  .animate-spin {
    animation: none;
  }
}
</style>