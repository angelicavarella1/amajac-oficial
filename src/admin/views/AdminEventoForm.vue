<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ ehEdicao ? 'Editar Evento' : 'Novo Evento' }}
      </h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ ehEdicao ? 'Atualize os dados do evento' : 'Crie um novo evento para a associação' }}
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <form @submit.prevent="salvar" class="space-y-6 p-6">
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label for="titulo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título do Evento *
            </label>
            <input
              id="titulo"
              v-model="form.titulo"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Digite o título do evento"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="data_evento" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data do Evento *
              </label>
              <input
                id="data_evento"
                v-model="form.data_evento"
                type="date"
                required
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            <div>
              <label for="horario" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Horário *
              </label>
              <input
                id="horario"
                v-model="form.horario"
                type="time"
                required
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="local" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Local do Evento *
            </label>
            <input
              id="local"
              v-model="form.local"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Digite o local do evento"
            />
          </div>

          <div>
            <label for="descricao" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição do Evento *
            </label>
            <textarea
              id="descricao"
              v-model="form.descricao"
              rows="4"
              required
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Descreva o evento em detalhes..."
            />
          </div>

          <div>
            <label for="informacoes_adicionais" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Informações Adicionais
            </label>
            <textarea
              id="informacoes_adicionais"
              v-model="form.informacoes_adicionais"
              rows="3"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Informações extras como o que levar, restrições, etc."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status de Publicação
            </label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  v-model="form.ativo"
                  type="radio"
                  :value="true"
                  class="text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Publicado</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  v-model="form.ativo"
                  type="radio"
                  :value="false"
                  class="text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Rascunho</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="inline-flex items-center cursor-pointer">
              <input 
                v-model="form.destaque" 
                type="checkbox" 
                class="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Marcar como Destaque na Home</span>
            </label>
          </div>
        </div>

        <div v-if="success" class="rounded-md bg-green-50 dark:bg-green-900 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800 dark:text-green-200">
                Evento {{ ehEdicao ? 'atualizado' : 'criado' }} com sucesso!
              </p>
            </div>
          </div>
        </div>

        <div v-if="store.error" class="rounded-md bg-red-50 dark:bg-red-900 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">
                Erro: {{ store.error }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <RouterLink
            to="/admin/eventos"
            class="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300"
          >
            Cancelar
          </RouterLink>
          <button
            type="submit"
            :disabled="store.loading"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <span v-if="store.loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Salvando...
            </span>
            <span v-else>{{ ehEdicao ? 'Atualizar' : 'Criar' }} Evento</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventosStore } from '@/modules/eventos/stores/eventos' // 👈 Importando a Store correta

const route = useRoute()
const router = useRouter()
const store = useEventosStore()

const ehEdicao = computed(() => route.params.id) // Simplificado: Se há ID, é edição
const success = ref(false)

const form = reactive({
  titulo: '',
  data_evento: '', // YYYY-MM-DD
  horario: '10:00', // HH:MM
  local: '',
  descricao: '',
  // OBS: 'informacoes_adicionais' não existe na sua tabela, será ignorado na submissão
  ativo: true, // Corresponde ao campo 'ativo' no DB
  destaque: false, // Novo campo
})

/**
 * Combina data_evento e horario em data_hora_evento no formato ISO 8601
 * O formato é crucial para o PostgreSQL/Supabase.
 */
const prepareDataForSubmission = () => {
  const { data_evento, horario, ...rest } = form
  
  // Combina YYYY-MM-DD e HH:MM em uma string completa: YYYY-MM-DDTHH:MM
  const datetimeString = `${data_evento}T${horario}:00` // Adiciona :00 para segundos

  // Cria um objeto Date para validação e formatação ISO final (com fuso horário)
  const dateObj = new Date(datetimeString)

  if (isNaN(dateObj.getTime())) {
    throw new Error('Data e/ou Horário inválidos. Verifique os campos.')
  }
  
  // O Supabase/PostgreSQL prefere o formato ISO, preferencialmente com 'Z' ou offset.
  // Usaremos o formato 'YYYY-MM-DDTHH:MM:SSZ' (UTC) para consistência.
  // Se você quiser usar o fuso horário local do navegador, ajuste toISOString() para formatar sem ele.
  // Para simplicidade e compatibilidade com timestamptz, usamos o ISO:
  const dataHoraEvento = dateObj.toISOString()

  return {
    ...rest,
    data_evento, // Manter data_evento e horario para que a Store os receba (Store vai garantir a formatação final)
    horario,
    data_hora_evento: dataHoraEvento, // O valor principal que o backend precisa
    // O backend da Store irá usar data_evento e horario deste payload para garantir a inserção
    // nos campos individuais também.
  }
}


const salvar = async () => {
  success.value = false
  store.error = null // Limpa o erro anterior

  try {
    const dadosCompletos = prepareDataForSubmission() // Prepara os dados

    let result
    if (ehEdicao.value) {
      result = await store.atualizarEvento(route.params.id, dadosCompletos)
    } else {
      result = await store.criarEvento(dadosCompletos)
    }

    if (result) { // Se a Store retornar o objeto criado/atualizado
      success.value = true
      // Redireciona após sucesso na criação, mas permanece na edição (se for o caso)
      setTimeout(() => {
        if (!ehEdicao.value) {
            router.push('/admin/eventos')
        }
      }, 1500)
    }

  } catch (err) {
    store.error = err.message || 'Erro desconhecido ao salvar evento.'
  }
}

// Lógica de Carregamento para Edição
onMounted(async () => {
  if (ehEdicao.value) {
    const eventoId = route.params.id
    const eventoCarregado = await store.carregarEventoPorId(eventoId)

    if (eventoCarregado) {
      // Mapeia os dados do banco para o formulário
      form.id = eventoCarregado.id
      form.titulo = eventoCarregado.titulo
      form.local = eventoCarregado.local || ''
      form.descricao = eventoCarregado.descricao || ''
      form.ativo = eventoCarregado.ativo
      form.destaque = eventoCarregado.destaque

      // Extrai data e horário do campo timestamptz para preencher os inputs do formulário
      if (eventoCarregado.data_hora_evento) {
        // Cria um objeto Date
        const dateObj = new Date(eventoCarregado.data_hora_evento)

        // Preenche input type="date" (YYYY-MM-DD)
        form.data_evento = dateObj.toISOString().split('T')[0]
        
        // Preenche input type="time" (HH:MM) - toLocaleTimeString em en-GB garante 24h
        form.horario = dateObj.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        })
      }

    } else if (store.error) {
       // Se houve erro no carregamento (além de não encontrar)
       console.error('Falha ao carregar evento para edição:', store.error)
    } else {
        // Se o evento não foi encontrado (código PGRST116)
        router.push('/admin/eventos') 
    }
  }
})
</script>