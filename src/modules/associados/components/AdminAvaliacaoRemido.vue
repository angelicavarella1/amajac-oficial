<!-- src/modules/associados/components/AdminAvaliacaoRemido.vue -->
<template>
  <div class="admin-avaliacao-remido bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
    <h3 class="text-lg font-bold text-amajac-green mb-4">Avaliação de Sócio Remido</h3>
    <p class="text-gray-700 dark:text-gray-300 mb-4">
      <strong>{{ socio.nome }}</strong> solicitou enquadramento como Sócio Remido.
    </p>

    <div v-if="socio.observacoes_remido" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
      <p class="font-medium">Justificativa do candidato:</p>
      <p>{{ socio.observacoes_remido }}</p>
    </div>

    <div class="space-y-3">
      <label class="flex items-start gap-2">
        <input
          v-model="decisao"
          type="radio"
          value="aprovado"
          class="mt-1 h-4 w-4 text-green-600"
        />
        <span>
          <strong>Aprovar como Sócio Remido</strong><br />
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Sem contribuição mensal. Sem direito a voto.
          </span>
        </span>
      </label>

      <label class="flex items-start gap-2">
        <input
          v-model="decisao"
          type="radio"
          value="negado"
          class="mt-1 h-4 w-4 text-red-600"
        />
        <span>
          <strong>Negar solicitação</strong><br />
          <span class="text-sm text-gray-600 dark:text-gray-400">
            O candidato será convidado a ingressar como Sócio Benemérito.
          </span>
        </span>
      </label>
    </div>

    <div v-if="decisao === 'negado'" class="mt-4">
      <label for="motivoNegativa" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Motivo da negativa (opcional, para registro interno)
      </label>
      <textarea
        id="motivoNegativa"
        v-model="motivoNegativa"
        rows="2"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      ></textarea>
    </div>

    <div class="mt-6 flex gap-3">
      <button
        @click="confirmarDecisao"
        :disabled="!decisao || loading"
        class="px-4 py-2 bg-amajac-green text-white rounded font-medium hover:bg-green-700 disabled:opacity-70"
      >
        Confirmar Decisão
      </button>
      <button
        @click="$emit('close')"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  socio: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'decisao'])

const decisao = ref(null)
const motivoNegativa = ref('')
const loading = ref(false)

const confirmarDecisao = async () => {
  loading.value = true
  try {
    let novoStatus = 'pendente'
    let novaCategoria = props.socio.categoria

    if (decisao.value === 'aprovado') {
      novoStatus = 'ativo'
      novaCategoria = 'remido'
    } else if (decisao.value === 'negado') {
      // Mantém como 'pendente', mas categoria vira 'benemerito'
      novaCategoria = 'benemerito'
    }

    emit('decisao', {
      id: props.socio.id,
      updates: {
        status: novoStatus,
        categoria: novaCategoria,
        motivo_negativa_remido: motivoNegativa.value || null
      }
    })
  } finally {
    loading.value = false
  }
}
</script>