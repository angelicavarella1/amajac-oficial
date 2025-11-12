<!-- src/modules/classificados/components/AvaliarClassificado.vue -->
<template>
  <div class="avaliar-classificado">
    <button
      @click="abrirModal"
      class="px-4 py-2 bg-amajac-green text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
    >
      <i class="mdi mdi-star"></i>
      Avaliar
    </button>

    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Avaliar Serviço
          </h3>
          <button
            @click="fecharModal"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="enviarAvaliacao" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Seu nome *
            </label>
            <input
              v-model="form.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ex: Maria Silva"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Seu e-mail *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sua avaliação *
            </label>
            <div class="flex gap-1">
              <button
                v-for="estrela in 5"
                :key="estrela"
                type="button"
                @click="form.nota = estrela"
                class="text-2xl transition-colors"
                :class="estrela <= form.nota ? 'text-yellow-500' : 'text-gray-300'"
              >
                <i class="mdi mdi-star"></i>
              </button>
            </div>
          </div>

          <div>
            <label for="comentario" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comentário (opcional)
            </label>
            <textarea
              id="comentario"
              v-model="form.comentario"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amajac-green focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Conte sua experiência com este serviço..."
            ></textarea>
          </div>

          <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm dark:bg-red-900/20 dark:text-red-200">
            {{ error }}
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              :disabled="enviando"
              class="px-4 py-2 bg-amajac-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center gap-2 flex-1 justify-center"
            >
              <i v-if="enviando" class="mdi mdi-loading mdi-spin"></i>
              <i v-else class="mdi mdi-send"></i>
              {{ enviando ? 'Enviando...' : 'Enviar Avaliação' }}
            </button>
            <button
              type="button"
              @click="fecharModal"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient'

const props = defineProps({
  classificadoId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['avaliacao-enviada'])

const mostrarModal = ref(false)
const form = ref({ nome: '', email: '', nota: 0, comentario: '' })
const enviando = ref(false)
const error = ref(null)

const abrirModal = () => {
  mostrarModal.value = true
  form.value = { nome: '', email: '', nota: 0, comentario: '' }
  error.value = null
}

const fecharModal = () => {
  mostrarModal.value = false
}

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const enviarAvaliacao = async () => {
  if (!form.value.nome?.trim()) {
    error.value = 'Nome é obrigatório.'
    return
  }
  if (!validateEmail(form.value.email)) {
    error.value = 'E-mail válido é obrigatório.'
    return
  }
  if (!form.value.nota) {
    error.value = 'Por favor, selecione uma nota.'
    return
  }

  enviando.value = true
  error.value = null

  try {
    // Verificar se há usuário logado para obter o usuario_id
    const { data: { user } } = await supabase.auth.getUser()
    
    const dadosAvaliacao = {
      classificado_id: props.classificadoId,
      nota: form.value.nota,
      comentario: form.value.comentario?.trim() || null,
      nome_avaliador: form.value.nome.trim(),
      email_avaliador: form.value.email.trim().toLowerCase(),
      created_at: new Date().toISOString(),
      usuario_id: user?.id || null // Inclui usuario_id se disponível
    }

    console.log('Enviando avaliação:', dadosAvaliacao)

    const { data, error: supabaseError } = await supabase
      .from('avaliacoes_classificados')
      .insert([dadosAvaliacao])
      .select()

    if (supabaseError) {
      // Se for erro de NOT NULL constraint, tenta sem usuario_id
      if (supabaseError.code === '23502' && supabaseError.message.includes('usuario_id')) {
        console.log('Tentando enviar sem usuario_id...')
        
        const { data: dataSemUsuario, error: errorSemUsuario } = await supabase
          .from('avaliacoes_classificados')
          .insert([{
            ...dadosAvaliacao,
            usuario_id: null
          }])
          .select()

        if (errorSemUsuario) throw errorSemUsuario
      } else {
        throw supabaseError
      }
    }

    emit('avaliacao-enviada')
    fecharModal()
  } catch (err) {
    console.error('Erro ao enviar avaliação:', err)
    error.value = 'Erro ao enviar avaliação. Tente novamente.'
  } finally {
    enviando.value = false
  }
}
</script>