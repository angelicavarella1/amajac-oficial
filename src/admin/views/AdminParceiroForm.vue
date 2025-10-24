<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ editando ? 'Editar Parceiro' : 'Novo Parceiro Comercial' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ editando ? 'Atualize os dados do parceiro comercial' : 'Cadastre um novo comércio local parceiro' }}
        </p>
      </div>
      <div class="flex gap-2">
        <RouterLink
          to="/admin/parceiros"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Voltar
        </RouterLink>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="salvarParceiro" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Coluna 1: Informações Básicas -->
        <div class="space-y-6">
          <!-- Informações Básicas -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações Básicas</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Estabelecimento *
                </label>
                <input
                  v-model="form.nome"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: Padaria Sabor Local"
                >
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo
                  </label>
                  <select
                    v-model="form.tipo"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="restaurante">Restaurante</option>
                    <option value="loja">Loja</option>
                    <option value="servico">Serviço</option>
                    <option value="consultorio">Consultório</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ramo
                  </label>
                  <input
                    v-model="form.ramo"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: Alimentação"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição Curta *
                </label>
                <textarea
                  v-model="form.descrição_curta"
                  required
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Descreva brevemente o estabelecimento, promoções, serviços..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Logo e Imagem -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Logo e Imagem</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL do Logo
                </label>
                <input
                  v-model="form.logo_url"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://exemplo.com/logo.jpg"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Texto Alternativo da Imagem
                </label>
                <input
                  v-model="form.imagem_alt"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Descrição da imagem para acessibilidade"
                >
              </div>

              <!-- Preview do Logo -->
              <div v-if="form.logo_url" class="mt-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview do Logo
                </label>
                <div class="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    :src="form.logo_url" 
                    :alt="form.imagem_alt || 'Preview do logo'"
                    class="max-w-full max-h-full object-contain"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Status</h3>
            
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="form.ativo"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Parceiro ativo
                </label>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="ferias">Férias</option>
                  <option value="reforma">Em Reforma</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data de Início
                </label>
                <input
                  v-model="form.data_inicio"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna 2: Contato e Redes Sociais -->
        <div class="space-y-6">
          <!-- Contato e Localização -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Contato e Localização</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endereço
                </label>
                <textarea
                  v-model="form.endereco"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Endereço completo do estabelecimento"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    v-model="form.telefone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="(11) 99999-9999"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CNPJ
                  </label>
                  <input
                    v-model="form.cnpj"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="00.000.000/0000-00"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-mail para Contato
                </label>
                <input
                  v-model="form.email_contato"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="contato@empresa.com"
                >
              </div>
            </div>
          </div>

          <!-- Redes Sociais -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Redes Sociais</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site
                </label>
                <input
                  v-model="form.link_site"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://empresa.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  v-model="form.Facebook"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://facebook.com/empresa"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instagram
                </label>
                <input
                  v-model="form.Instagram"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://instagram.com/empresa"
                >
              </div>
            </div>
          </div>

          <!-- Etiquetas -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Etiquetas</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Etiquetas (separadas por vírgula)
                </label>
                <input
                  v-model="etiquetasInput"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="delivery, promoção, local, qualidade"
                  @blur="processarEtiquetas"
                >
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Ex: delivery, promoção, local, qualidade
                </p>
              </div>

              <!-- Preview das Etiquetas -->
              <div v-if="form.etiquetas && form.etiquetas.length" class="flex flex-wrap gap-2">
                <span
                  v-for="(etiqueta, index) in form.etiquetas"
                  :key="index"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                >
                  {{ etiqueta }}
                  <button
                    type="button"
                    @click="removerEtiqueta(index)"
                    class="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
        <RouterLink
          to="/admin/parceiros"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </RouterLink>
        <button
          type="submit"
          :disabled="salvando"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="salvando">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Salvando...
          </span>
          <span v-else>
            <i class="fas fa-save mr-2"></i>
            {{ editando ? 'Atualizar' : 'Salvar' }} Parceiro
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useColaboradoresStore } from '@/stores/colaboradores'
import { useUIStore } from '@/stores/ui'

const route = useRoute()
const router = useRouter()
const colaboradoresStore = useColaboradoresStore()
const uiStore = useUIStore()

const salvando = ref(false)
const etiquetasInput = ref('')

const form = ref({
  nome: '',
  tipo: '',
  logo_url: '',
  ativo: true,
  imagem_alt: '',
  telefone: '',
  endereco: '',
  cnpj: '',
  email_contato: '',
  ramo: '',
  data_inicio: '',
  status: 'ativo',
  descrição_curta: '',
  link_site: '',
  Facebook: '',
  Instagram: '',
  etiquetas: []
})

const editando = computed(() => !!route.params.id)

// Processar etiquetas do input
const processarEtiquetas = () => {
  if (etiquetasInput.value) {
    form.value.etiquetas = etiquetasInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  }
}

// Remover etiqueta
const removerEtiqueta = (index) => {
  form.value.etiquetas.splice(index, 1)
  etiquetasInput.value = form.value.etiquetas.join(', ')
}

// Carregar dados se for edição
onMounted(async () => {
  if (editando.value) {
    await carregarParceiro()
  }
})

async function carregarParceiro() {
  try {
    const parceiro = await colaboradoresStore.carregarColaboradorPorId(route.params.id)
    if (parceiro) {
      form.value = { ...parceiro }
      if (parceiro.etiquetas) {
        etiquetasInput.value = parceiro.etiquetas.join(', ')
      }
    }
  } catch (error) {
    uiStore.showToast('Erro ao carregar parceiro', 'error')
    router.push('/admin/parceiros')
  }
}

async function salvarParceiro() {
  salvando.value = true
  
  try {
    processarEtiquetas() // Garante que as etiquetas são processadas
    
    if (editando.value) {
      await colaboradoresStore.salvarColaborador(form.value, route.params.id)
      uiStore.showToast('Parceiro atualizado com sucesso!', 'success')
    } else {
      await colaboradoresStore.salvarColaborador(form.value)
      uiStore.showToast('Parceiro criado com sucesso!', 'success')
    }
    
    router.push('/admin/parceiros')
  } catch (error) {
    uiStore.showToast('Erro ao salvar parceiro: ' + error.message, 'error')
  } finally {
    salvando.value = false
  }
}
</script>