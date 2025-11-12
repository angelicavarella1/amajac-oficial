<!-- src\modules\admin\pages\AdminConfiguracoes.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-amajac-green dark:text-amajac-green-light mb-6">
      Configurações do Sistema
    </h1>

    <div v-if="loading" class="text-gray-500">Carregando configurações...</div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="item in configuracoesFiltradas"
          :key="item.chave"
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ formatarChave(item.chave) }}
          </label>
          <textarea
            v-model="item.valor"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            :rows="item.chave.includes('descricao') || item.chave.includes('historia') || item.chave.includes('valores') ? 4 : 2"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <button
          @click="salvarTodas"
          :disabled="salvando"
          class="px-6 py-2 bg-amajac-green hover:bg-amajac-green-dark text-white font-medium rounded-lg transition-colors"
        >
          {{ salvando ? 'Salvando...' : 'Salvar Todas as Configurações' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/core/utils/supabaseClient'

const loading = ref(true)
const salvando = ref(false)
const configuracoes = ref([])

// Lista de chaves que NÃO devem aparecer no editor (como a JSON duplicada)
const chavesIgnoradas = ['configuracoes_gerais']

const configuracoesFiltradas = ref([])

const formatarChave = (chave) => {
  return chave
    .replace(/_/g, ' ')
    .replace(/\w+/g, palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
}

const carregarConfiguracoes = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('chave, valor')
      .order('chave', { ascending: true })

    if (error) throw error

    configuracoes.value = data.map(item => ({ ...item }))
    configuracoesFiltradas.value = configuracoes.value.filter(item => !chavesIgnoradas.includes(item.chave))
  } catch (err) {
    console.error('Erro ao carregar configurações:', err)
    alert('Erro ao carregar configurações.')
  } finally {
    loading.value = false
  }
}

const salvarTodas = async () => {
  salvando.value = true
  try {
    const updates = configuracoesFiltradas.value.map(item => ({
      chave: item.chave,
      valor: item.valor
    }))

    const { error } = await supabase
      .from('configuracoes')
      .upsert(updates, { onConflict: 'chave' })

    if (error) throw error
    alert('Configurações salvas com sucesso!')
  } catch (err) {
    console.error('Erro ao salvar:', err)
    alert('Erro ao salvar configurações.')
  } finally {
    salvando.value = false
  }
}

onMounted(() => {
  carregarConfiguracoes()
})
</script>