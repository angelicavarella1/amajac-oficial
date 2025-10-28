<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mensagens de Contato</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Gerencie as mensagens recebidas pelo site</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="exportMessages"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <i class="fas fa-download mr-2"/>
          Exportar
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div class="flex flex-wrap gap-4">
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos os Status</option>
            <option value="nao_lida">Não Lidas</option>
            <option value="lida">Lidas</option>
            <option value="respondida">Respondidas</option>
          </select>

          <select
            v-model="filters.assunto"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos os Assuntos</option>
            <option value="geral">Informações Gerais</option>
            <option value="suporte">Suporte Técnico</option>
            <option value="parceria">Parcerias</option>
            <option value="reclamacao">Reclamações</option>
            <option value="sugestao">Sugestões</option>
          </select>

          <select
            v-model="filters.sort"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigas</option>
          </select>
        </div>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            v-model="filters.search"
            placeholder="Buscar mensagens..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-envelope text-blue-600 dark:text-blue-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-envelope-open text-green-600 dark:text-green-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Lidas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.lidas }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-envelope text-yellow-600 dark:text-yellow-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Não Lidas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.nao_lidas }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-reply text-purple-600 dark:text-purple-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Respondidas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.respondidas }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Mensagens -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading && mensagens.length === 0" class="flex justify-center items-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-green-600 mb-4"/>
        <p class="text-gray-600 dark:text-gray-400">Carregando mensagens...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-600 dark:text-red-400">
        <i class="fas fa-exclamation-triangle text-2xl mb-4"/>
        <p class="text-lg font-medium mb-2">Erro ao carregar mensagens</p>
        <p class="text-sm mb-4">{{ error }}</p>
        <button
          @click="carregarMensagens"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i class="fas fa-redo mr-2"/>Tentar Novamente
        </button>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Remetente
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Assunto
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Mensagem
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="mensagem in mensagensPaginadas"
              :key="mensagem?.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': mensagem.id === selectedMessage?.id }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-green-600 dark:text-green-400"/>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ mensagem?.nome || 'Nome não disponível' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {{ mensagem?.email || 'Email não informado' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 dark:text-white font-medium">
                  {{ getAssuntoText(mensagem?.assunto) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                  {{ mensagem?.mensagem || 'Mensagem não disponível' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusBadgeClass(mensagem?.status || (mensagem?.lida ? 'lida' : 'nao_lida'))"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  <i :class="getStatusIcon(mensagem?.status || (mensagem?.lida ? 'lida' : 'nao_lida'))" class="mr-1"/>
                  {{ getStatusText(mensagem?.status || (mensagem?.lida ? 'lida' : 'nao_lida')) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="flex flex-col">
                  <span>{{ formatDate(mensagem?.data_envio || mensagem?.created_at) }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTime(mensagem?.data_envio || mensagem?.created_at) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <!-- Visualizar -->
                  <button
                    @click="viewMessage(mensagem)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Visualizar mensagem"
                  >
                    <i class="fas fa-eye"/>
                  </button>

                  <!-- Marcar como Lida -->
                  <button
                    v-if="mensagem?.status === 'nao_lida' || !mensagem?.lida"
                    @click="markAsRead(mensagem)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                    title="Marcar como lida"
                  >
                    <i class="fas fa-check"/>
                  </button>

                  <!-- Responder -->
                  <button
                    @click="viewMessage(mensagem)"
                    class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    title="Responder mensagem"
                  >
                    <i class="fas fa-reply"/>
                  </button>

                  <!-- Excluir -->
                  <button
                    @click="confirmarExclusao(mensagem)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Excluir mensagem"
                  >
                    <i class="fas fa-trash"/>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && mensagensFiltradas.length === 0" class="text-center py-12">
        <i class="fas fa-envelope-open text-4xl text-gray-400 mb-4"/>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma mensagem encontrada</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Todas as mensagens foram processadas ou não há mensagens recebidas.</p>
      </div>

      <!-- Paginação -->
      <div v-if="mensagensFiltradas.length > itemsPerPage" class="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, mensagensFiltradas.length) }}</span> de
            <span class="font-medium">{{ mensagensFiltradas.length }}</span> resultados
          </div>
          <div class="flex space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage * itemsPerPage >= mensagensFiltradas.length"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Visualização/Resposta -->
    <div v-if="selectedMessage" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="selectedMessage = null"/>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="absolute top-0 right-0 pt-4 pr-4">
            <button 
              @click="selectedMessage = null"
              class="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-2"
            >
              <i class="fas fa-times"/>
            </button>
          </div>
          
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ selectedMessage.nome }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedMessage.email }}</p>
                  <div class="flex items-center space-x-2 mt-2">
                    <span :class="getStatusBadgeClass(selectedMessage.status || (selectedMessage.lida ? 'lida' : 'nao_lida'))" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <i :class="getStatusIcon(selectedMessage.status || (selectedMessage.lida ? 'lida' : 'nao_lida'))" class="mr-1"/>
                      {{ getStatusText(selectedMessage.status || (selectedMessage.lida ? 'lida' : 'nao_lida')) }}
                    </span>
                    <span class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded">
                      {{ getAssuntoText(selectedMessage.assunto) }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(selectedMessage.data_envio || selectedMessage.created_at) }} às {{ formatTime(selectedMessage.data_envio || selectedMessage.created_at) }}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedMessage.telefone || 'Telefone não informado' }}</p>
                </div>
              </div>
            </div>

            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ selectedMessage.mensagem }}</p>
            </div>

            <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Responder Mensagem</h4>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assunto da Resposta
                  </label>
                  <input
                    type="text"
                    v-model="response.assunto"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Re: Sua mensagem sobre..."
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensagem de Resposta
                  </label>
                  <textarea
                    v-model="response.mensagem"
                    rows="6"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Digite sua resposta aqui..."
                  />
                </div>

                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="markAsResponded"
                    v-model="response.marcar_como_respondida"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label for="markAsResponded" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Marcar como respondida após envio
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="sendResponse"
              :disabled="sending"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              <span v-if="sending">
                <i class="fas fa-spinner fa-spin mr-2"/>
                Enviando...
              </span>
              <span v-else>
                <i class="fas fa-paper-plane mr-2"/>
                Enviar Resposta
              </span>
            </button>
            <button 
              @click="markAsRead(selectedMessage)"
              v-if="selectedMessage?.status === 'nao_lida' || !selectedMessage?.lida"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              <i class="fas fa-check mr-2"/>
              Marcar como Lida
            </button>
            <button 
              @click="selectedMessage = null"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="mensagemParaExcluir" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="mensagemParaExcluir = null"/>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400"/>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Confirmar Exclusão</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Tem certeza que deseja excluir a mensagem de <strong>"{{ mensagemParaExcluir?.nome }}"</strong>? Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="excluirMensagem"
              :disabled="loadingExclusao"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i v-if="loadingExclusao" class="fas fa-spinner fa-spin mr-2"/>
              {{ loadingExclusao ? 'Excluindo...' : 'Excluir' }}
            </button>
            <button
              @click="mensagemParaExcluir = null"
              :disabled="loadingExclusao"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMensagensStore } from '@/modules/mensagens/stores/mensagens'
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/shared/stores/ui'

const mensagensStore = useMensagensStore()
const uiStore = useUIStore()
const { mensagens, loading } = storeToRefs(mensagensStore)

// Estados
const error = ref(null)
const selectedMessage = ref(null)
const sending = ref(false)
const loadingExclusao = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const mensagemParaExcluir = ref(null)

const filters = ref({
  status: '',
  assunto: '',
  sort: 'newest',
  search: ''
})

const response = ref({
  assunto: '',
  mensagem: '',
  marcar_como_respondida: true
})

// Computed
const mensagensFiltradas = computed(() => {
  let result = [...mensagens.value]

  // Mapeia o campo 'lida' para 'status'
  result = result.map(m => ({
    ...m,
    status: m.status || (m.lida ? 'lida' : 'nao_lida')
  }))

  // Filtro por status
  if (filters.value.status) {
    result = result.filter(mensagem => mensagem.status === filters.value.status)
  }

  // Filtro por assunto
  if (filters.value.assunto) {
    result = result.filter(mensagem => mensagem.assunto === filters.value.assunto)
  }

  // Filtro por pesquisa
  if (filters.value.search) {
    const termo = filters.value.search.toLowerCase()
    result = result.filter(mensagem => 
      mensagem.nome?.toLowerCase().includes(termo) ||
      mensagem.email?.toLowerCase().includes(termo) ||
      mensagem.mensagem?.toLowerCase().includes(termo)
    )
  }

  // Ordenação
  if (filters.value.sort === 'oldest') {
    result.sort((a, b) => new Date(a.data_envio || a.created_at) - new Date(b.data_envio || b.created_at))
  } else {
    result.sort((a, b) => new Date(b.data_envio || b.created_at) - new Date(a.data_envio || a.created_at))
  }

  return result
})

const mensagensPaginadas = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return mensagensFiltradas.value.slice(startIndex, endIndex)
})

const stats = computed(() => {
  const total = mensagens.value.length
  const lidas = mensagens.value.filter(m => m.lida || m.status === 'respondida').length
  const nao_lidas = mensagens.value.filter(m => !m.lida && m.status !== 'respondida').length
  const respondidas = mensagens.value.filter(m => m.status === 'respondida').length

  return { total, lidas, nao_lidas, respondidas }
})

// Métodos
const carregarMensagens = async () => {
  error.value = null
  try {
    await mensagensStore.carregarMensagens()
  } catch (err) {
    console.error('Erro ao carregar mensagens:', err)
    error.value = err.message || 'Erro desconhecido ao carregar mensagens'
  }
}

function getStatusBadgeClass(status) {
  const classes = {
    nao_lida: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    lida: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    respondida: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
  return classes[status] || classes.nao_lida
}

function getStatusIcon(status) {
  const icons = {
    nao_lida: 'fas fa-envelope',
    lida: 'fas fa-envelope-open',
    respondida: 'fas fa-reply'
  }
  return icons[status] || 'fas fa-envelope'
}

function getStatusText(status) {
  const texts = {
    nao_lida: 'Não Lida',
    lida: 'Lida',
    respondida: 'Respondida'
  }
  return texts[status] || 'Não Lida'
}

function getAssuntoText(assunto) {
  const textos = {
    geral: 'Informações Gerais',
    suporte: 'Suporte Técnico',
    parceria: 'Parcerias',
    reclamacao: 'Reclamações',
    sugestao: 'Sugestões'
  }
  return textos[assunto] || assunto
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

function formatTime(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

async function viewMessage(mensagem) {
  selectedMessage.value = mensagem
  
  // Inicializar o v-model (assunto da resposta)
  response.value.assunto = `Re: ${getAssuntoText(mensagem.assunto)}`
  response.value.mensagem = '' 

  // Marcar como lida no Supabase se for 'nao_lida'
  if (mensagem.status === 'nao_lida' || !mensagem.lida) {
    await mensagensStore.marcarComoLida(mensagem.id)
    // Atualiza a visualização localmente
    mensagem.status = 'lida'
    mensagem.lida = true
  }
}

async function markAsRead(mensagem) {
  if (mensagem) {
    await mensagensStore.marcarComoLida(mensagem.id)
    mensagem.status = 'lida'
    mensagem.lida = true
    if (mensagem.id === selectedMessage.value?.id) {
      selectedMessage.value = null
    }
    uiStore.showToast('Mensagem marcada como lida', 'success')
  }
}

async function sendResponse() {
  try {
    sending.value = true
    
    if (!response.value.mensagem.trim()) {
      uiStore.showToast('Digite uma mensagem de resposta', 'error')
      return
    }

    // Simular envio de email/resposta
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Marcar como respondida se selecionado
    if (response.value.marcar_como_respondida && selectedMessage.value) {
      selectedMessage.value.status = 'respondida'
      // Aqui você implementaria a atualização no banco
    }

    // Limpar formulário
    response.value = {
      assunto: '', 
      mensagem: '',
      marcar_como_respondida: true
    }

    selectedMessage.value = null
    
    uiStore.showToast('Resposta enviada com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao enviar resposta:', error)
    uiStore.showToast('Erro ao enviar resposta. Tente novamente.', 'error')
  } finally {
    sending.value = false
  }
}

function confirmarExclusao(mensagem) {
  if (!mensagem?.id) return
  mensagemParaExcluir.value = mensagem
}

async function excluirMensagem() {
  if (!mensagemParaExcluir.value?.id) return

  loadingExclusao.value = true
  try {
    await mensagensStore.excluirMensagem(mensagemParaExcluir.value.id)
    mensagemParaExcluir.value = null
    uiStore.showToast('Mensagem excluída com sucesso', 'success')
  } catch (err) {
    console.error('Erro ao excluir mensagem:', err)
    uiStore.showToast('Erro ao excluir mensagem', 'error')
  } finally {
    loadingExclusao.value = false
  }
}

function exportMessages() {
  console.log('Exportando mensagens...')
  uiStore.showToast('Funcionalidade de exportação em desenvolvimento', 'info')
}

function nextPage() {
  if (currentPage.value * itemsPerPage.value < mensagensFiltradas.value.length) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Lifecycle
onMounted(() => {
  carregarMensagens()
})
</script>