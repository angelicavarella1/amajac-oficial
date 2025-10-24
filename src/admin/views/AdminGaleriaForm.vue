<template>
  <div class="space-y-6">
    <!-- CABEÇALHO -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Upload de Imagem</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Adicione uma nova imagem à galeria</p>
      </div>
      <button 
        @click="$router.push('/admin/galeria')"
        class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors flex items-center"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Voltar
      </button>
    </div>

    <!-- ALERTAS -->
    <div v-if="statusMessage" :class="statusClass" class="p-4 rounded-lg flex items-center">
      <i :class="statusIcon" class="mr-3"></i>
      {{ statusMessage }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- COLUNA PRINCIPAL -->
      <div class="lg:col-span-2 space-y-6">
        <!-- UPLOAD COM DRAG & DROP FUNCIONAL -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Upload da Imagem <span class="text-red-500">*</span>
          </h3>
          
          <div 
            @click="triggerFileInput"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            :class="[
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300',
              isDragging 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 border-4' 
                : form.file 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
            
            <template v-if="!form.file">
              <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Arraste e solte sua imagem aqui
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">ou</p>
              <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                <i class="fas fa-search mr-2"></i>
                Clique para selecionar
              </button>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
                PNG, JPG, JPEG, WEBP até 10MB
              </p>
            </template>

            <template v-else>
              <p class="text-green-600 dark:text-green-400 font-medium mb-2">
                <i class="fas fa-check-circle mr-2"></i>
                Imagem selecionada!
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ form.file.name }} ({{ formatFileSize(form.tamanho) }})
              </p>
            </template>

            <input 
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            >
          </div>

          <!-- PREVIEW -->
          <div v-if="form.url" class="mt-6">
            <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Preview:</h4>
            <div class="relative bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
              <img 
                :src="form.url" 
                :alt="form.titulo || 'Preview'" 
                class="max-w-full max-h-96 object-contain mx-auto rounded"
              >
              <button
                @click="clearImage"
                class="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                title="Remover imagem"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- DETALHES DA IMAGEM -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Detalhes da Imagem <span class="text-red-500">*</span>
          </h3>
          
          <div class="space-y-4">
            <!-- TÍTULO -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título da Imagem *
              </label>
              <input
                type="text"
                v-model="form.titulo"
                placeholder="Ex: Evento de Inauguração 2024"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                :class="{ 'border-red-500': !form.titulo && formSubmitted }"
              >
              <div v-if="!form.titulo && formSubmitted" class="text-red-600 dark:text-red-400 text-sm mt-1">
                <i class="fas fa-exclamation-circle mr-1"></i>
                O título é obrigatório
              </div>
            </div>

            <!-- DESCRIÇÃO -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                v-model="form.descricao"
                rows="4"
                placeholder="Descreva a imagem, contexto do evento, pessoas presentes..."
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
              ></textarea>
            </div>

            <!-- CATEGORIA -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select
                v-model="form.categoria"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              >
                <option value="geral">Geral</option>
                <option value="eventos">Eventos</option>
                <option value="workshops">Workshops</option>
                <option value="reunioes">Reuniões</option>
                <option value="infraestrutura">Infraestrutura</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- BARRA LATERAL -->
      <div class="space-y-6">
        <!-- INFORMAÇÕES -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações</h3>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span class="text-gray-500 dark:text-gray-400">Status:</span>
              <span :class="statusColor" class="font-medium">
                {{ getStatusText() }}
              </span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span class="text-gray-500 dark:text-gray-400">Formato:</span>
              <span class="text-gray-900 dark:text-white font-medium">{{ fileInfo.format || '-' }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span class="text-gray-500 dark:text-gray-400">Tamanho:</span>
              <span class="text-gray-900 dark:text-white font-medium">{{ fileInfo.size || '-' }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-500 dark:text-gray-400">Dimensões:</span>
              <span class="text-gray-900 dark:text-white font-medium">{{ fileInfo.dimensions || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- BOTÃO SALVAR - FUNCIONAL -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Salvar Imagem</h3>
          
          <div class="space-y-3">
            <!-- PROGRESSO DO UPLOAD -->
            <div v-if="uploading" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-blue-700 dark:text-blue-300 text-sm font-medium">Fazendo upload...</span>
                <span class="text-blue-700 dark:text-blue-300 text-sm">{{ progress }}%</span>
              </div>
              <div class="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
            </div>

            <!-- BOTÃO SALVAR PRINCIPAL -->
            <button
              @click="salvarImagem"
              :disabled="!podeSalvar || uploading || salvando"
              class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center font-semibold text-lg disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <template v-if="salvando">
                <i class="fas fa-spinner fa-spin mr-3"></i>
                Salvando no Banco...
              </template>
              <template v-else-if="uploading">
                <i class="fas fa-cloud-upload-alt mr-3"></i>
                Fazendo Upload ({{ progress }}%)
              </template>
              <template v-else>
                <i class="fas fa-save mr-3"></i>
                SALVAR IMAGEM
              </template>
            </button>

            <!-- BOTÃO ALTERNATIVO -->
            <button
              v-if="!podeSalvar"
              disabled
              class="w-full bg-gray-400 text-gray-200 py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center font-medium"
            >
              <i class="fas fa-lock mr-2"></i>
              Preencha os campos obrigatórios
            </button>
            
            <button
              @click="$router.push('/admin/galeria')"
              class="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <i class="fas fa-times mr-2"></i>
              Cancelar
            </button>

            <!-- INSTRUÇÕES -->
            <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <p class="font-medium mb-1 text-green-600">Como salvar:</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>Selecione uma imagem</li>
                <li>Digite um título</li>
                <li>Clique em "SALVAR IMAGEM"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useGaleria } from '@/admin/composables/useGaleria'
import { useImageUpload } from '@/admin/composables/useImageUpload'
import { supabase } from '@/supabase' // ✅ IMPORT CRÍTICA ADICIONADA

const router = useRouter()
const uiStore = useUIStore()

// Composables
const { adicionarImagem } = useGaleria(true)
const { 
  uploading, 
  progress, 
  error: uploadError, 
  uploadImagemGaleria 
} = useImageUpload()

// Refs
const fileInput = ref(null)
const salvando = ref(false)
const formSubmitted = ref(false)
const isDragging = ref(false)

// Estados
const statusMessage = ref('')
const statusClass = ref('')
const statusIcon = ref('')

// Dados do formulário
const form = ref({
  titulo: '',
  descricao: '',
  categoria: 'geral',
  url: '',
  largura: 0,
  altura: 0,
  tamanho: 0,
  file: null 
})

// Computed
const fileInfo = computed(() => {
  if (!form.value.url) return {}
  
  return {
    format: form.value.file?.name.split('.').pop().toUpperCase() || '-',
    size: formatFileSize(form.value.tamanho),
    dimensions: form.value.largura && form.value.altura ? `${form.value.largura} × ${form.value.altura}px` : '-'
  }
})

const podeSalvar = computed(() => {
  return form.value.file && form.value.titulo.trim()
})

const statusColor = computed(() => {
  if (!form.value.file) return 'text-gray-500'
  if (!form.value.titulo) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
})

// Métodos
function getStatusText() {
  if (!form.value.file) return 'Aguardando imagem'
  if (!form.value.titulo) return 'Digite um título'
  return 'Pronto para salvar'
}

// DRAG & DROP FUNCIONAL
function handleDragOver(event) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(event) {
  event.preventDefault()
  isDragging.value = false
}

function handleDrop(event) {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const files = event.target.files
  if (files.length > 0) {
    processFile(files[0])
  }
  // Reset input para permitir selecionar o mesmo arquivo novamente
  event.target.value = ''
}

function processFile(file) {
  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    showStatus('Por favor, selecione apenas arquivos de imagem.', 'error', 'fas fa-exclamation-triangle')
    return
  }

  // Validar tamanho do arquivo (10MB)
  if (file.size > 10 * 1024 * 1024) {
    showStatus('O arquivo deve ter no máximo 10MB.', 'error', 'fas fa-exclamation-triangle')
    return
  }

  // Criar URL temporária para preview
  const url = URL.createObjectURL(file)
  
  // Obter dimensões da imagem
  const img = new Image()
  img.onload = function() {
    form.value.largura = this.width
    form.value.altura = this.height
    form.value.tamanho = file.size
    
    // Usar nome do arquivo como título padrão
    if (!form.value.titulo) {
      form.value.titulo = file.name
        .split('.')[0]
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
    }
    
    URL.revokeObjectURL(img.src)
    showStatus('Imagem carregada com sucesso! Agora preencha o título e clique em SALVAR.', 'success', 'fas fa-check-circle')
  }
  
  img.onerror = () => {
    showStatus('Erro ao carregar a imagem.', 'error', 'fas fa-exclamation-triangle')
    URL.revokeObjectURL(url)
  }
  
  img.src = url
  form.value.url = url
  form.value.file = file
}

function clearImage() {
  if (form.value.url) {
    URL.revokeObjectURL(form.value.url)
  }
  form.value.url = ''
  form.value.file = null
  form.value.tamanho = 0
  form.value.largura = 0
  form.value.altura = 0
  showStatus('Imagem removida.', 'info', 'fas fa-info-circle')
}

function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function showStatus(message, type = 'info', icon = 'fas fa-info-circle') {
  statusMessage.value = message
  statusIcon.value = icon
  statusClass.value = {
    info: 'bg-blue-100 border border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300',
    success: 'bg-green-100 border border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300',
    error: 'bg-red-100 border border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-300',
    warning: 'bg-yellow-100 border border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300'
  }[type]
}

// ✅ CORREÇÃO: Função principal de salvar corrigida
async function salvarImagem() {
  formSubmitted.value = true
  
  if (!podeSalvar.value) {
    showStatus('Preencha todos os campos obrigatórios.', 'error', 'fas fa-exclamation-triangle')
    return
  }

  salvando.value = true

  try {
    console.log('🚀 Iniciando processo de salvamento...')
    
    // 1. Fazer upload para o Supabase Storage
    showStatus('Fazendo upload da imagem para o storage...', 'info', 'fas fa-cloud-upload-alt')
    
    const uploadResult = await uploadImagemGaleria(form.value.file)
    
    if (!uploadResult || !uploadResult.publicUrl) {
      throw new Error('Falha no upload: URL pública não retornada')
    }

    console.log('✅ Upload concluído:', uploadResult.publicUrl)

    // 2. ✅ CORREÇÃO: Usar imagem_url em vez de url
    const imageData = {
      titulo: form.value.titulo.trim(),
      descricao: form.value.descricao.trim(),
      // ✅ CORREÇÃO: Campo correto é imagem_url, não url
      imagem_url: uploadResult.publicUrl,
      categoria: form.value.categoria,
      created_at: new Date().toISOString()
    }

    console.log('💾 Dados para salvar na tabela galeria:', imageData)

    // 3. Salvar no banco de dados
    showStatus('Salvando informações na tabela galeria...', 'info', 'fas fa-database')
    
    const { data: imagemSalva, error: dbError } = await supabase
      .from('galeria')
      .insert([imageData])
      .select()
      .single()

    if (dbError) {
      console.error('❌ Erro ao salvar no banco:', dbError)
      throw new Error(`Erro no banco: ${dbError.message}`)
    }

    console.log('✅ Imagem salva na tabela galeria:', imagemSalva)

    // 4. Sucesso!
    showStatus('Imagem salva com sucesso! Redirecionando...', 'success', 'fas fa-check-circle')

    // Redirecionar após 2 segundos
    setTimeout(() => {
      router.push('/admin/galeria')
    }, 2000)
    
  } catch (error) {
    console.error('❌ Erro completo ao salvar imagem:', error)
    showStatus(
      error.message || 'Erro ao salvar imagem. Verifique o console.', 
      'error', 
      'fas fa-exclamation-triangle'
    )
  } finally {
    salvando.value = false
  }
}

onMounted(() => {
  // Inicialização se necessário
})
</script>

<style scoped>
.sticky {
  position: sticky;
}
</style>