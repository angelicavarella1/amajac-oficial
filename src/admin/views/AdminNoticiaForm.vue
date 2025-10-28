<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEditing ? 'Editar Notícia' : 'Nova Notícia' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ isEditing ? 'Atualize os dados da notícia' : 'Crie uma nova notícia para o site' }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="$router.push('/admin/noticias')"
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"/>
          Voltar
        </button>
        
        <!-- BOTÃO DE TESTE TEMPORÁRIO -->
        <button 
          v-if="!isEditing"
          @click="testarUploadCorrigido"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
        >
          <i class="fas fa-vial mr-2"/>
          Testar Upload
        </button>
      </div>
    </div>

    <!-- ALERTA DE ERRO -->
    <div v-if="noticiasStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 mr-3"/>
        <div>
          <h3 class="text-sm font-medium text-red-800 dark:text-red-300">Erro</h3>
          <p class="text-sm text-red-700 dark:text-red-400 mt-1">{{ noticiasStore.error }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações Básicas</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título da Notícia *
              </label>
              <input
                type="text"
                v-model="form.titulo"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Digite o título da notícia"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resumo *
              </label>
              <textarea
                v-model="form.resumo"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                placeholder="Digite um resumo da notícia (máximo 300 caracteres)"
                maxlength="300"
                required
              />
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {{ form.resumo?.length || 0 }}/300 caracteres
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conteúdo Completo *
              </label>
              <textarea
                v-model="form.conteudo"
                rows="12"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                placeholder="Digite o conteúdo completo da notícia..."
                required
              />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Imagem de Capa</h3>
          
          <div class="space-y-4">
            <div 
              v-if="!form.imagem_url"
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
              @click="triggerFileInput"
            >
              <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"/>
              <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">Clique para fazer upload</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, JPEG, WEBP até 10MB</p>
              <input 
                ref="fileInput"
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                class="hidden"
                @change="handleImageUpload"
              />
            </div>

            <div v-else class="relative">
              <img :src="form.imagem_url" alt="Preview" class="w-full h-64 object-cover rounded-lg"/>
              <button
                @click="form.imagem_url = ''"
                class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
              >
                <i class="fas fa-times"/>
              </button>
            </div>

            <!-- INFORMAÇÕES SOBRE FORMATOS ACEITOS -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div class="flex items-start">
                <i class="fas fa-info-circle text-blue-600 dark:text-blue-400 mt-0.5 mr-3"/>
                <div class="text-sm">
                  <h4 class="font-medium text-blue-800 dark:text-blue-300">Formatos de imagem aceitos:</h4>
                  <ul class="text-blue-700 dark:text-blue-400 mt-1 list-disc list-inside space-y-1">
                    <li><strong>PNG</strong> - Imagens com transparência</li>
                    <li><strong>JPG/JPEG</strong> - Imagens fotográficas</li>
                    <li><strong>WEBP</strong> - Formato moderno com melhor compressão</li>
                  </ul>
                  <p class="mt-2 text-blue-600 dark:text-blue-400">
                    <strong>Tamanho máximo:</strong> 10MB
                  </p>
                </div>
              </div>
            </div>

            <div v-if="uploading" class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <i class="fas fa-spinner fa-spin"/>
              <span>Fazendo upload...</span>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Publicação</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="form.ativo"
                    :value="true"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Ativa</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="form.ativo"
                    :value="false"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Inativa (Rascunho)</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Publicação
              </label>
              <input
                type="date"
                v-model="form.data_publicacao"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="form.destaque"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Destacar esta notícia</span>
              </label>
            </div>

            <div class="flex space-x-3">
              <button
                @click="saveNoticia(false)"
                :disabled="saving"
                class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="saving">Salvando...</span>
                <span v-else>Salvar Rascunho</span>
              </button>
              
              <button
                @click="saveNoticia(true)"
                :disabled="saving"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="saving">Publicando...</span>
                <span v-else>{{ isEditing ? 'Atualizar' : 'Publicar' }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Autor</h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Autor *
            </label>
            <input
              type="text"
              v-model="form.autor"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Digite o nome do autor"
              required
            />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Título:</span>
              <span class="text-gray-900 dark:text-white font-medium truncate max-w-xs">{{ form.titulo || 'Não definido' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Status:</span>
              <span 
                :class="form.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'" 
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {{ form.ativo ? 'Ativa' : 'Rascunho' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Destaque:</span>
              <span 
                :class="form.destaque ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'" 
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              >
                <i class="fas fa-star mr-1 text-xs"/>
                {{ form.destaque ? 'Sim' : 'Não' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Data:</span>
              <span class="text-gray-900 dark:text-white">{{ form.data_publicacao ? formatDate(form.data_publicacao) : 'Não definida' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Autor:</span>
              <span class="text-gray-900 dark:text-white">{{ form.autor || 'Não definido' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Visualizações:</span>
              <span class="text-gray-900 dark:text-white">{{ form.visualizacoes || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoticiasStore } from '@/modules/noticias/stores/noticias'

const route = useRoute()
const router = useRouter()
const noticiasStore = useNoticiasStore()

const fileInput = ref(null)
const saving = ref(false)
const uploading = ref(false)

const isEditing = computed(() => route.params.id)

// FORMULÁRIO CORRIGIDO
const form = ref({
  titulo: '',
  resumo: '',
  conteudo: '',
  imagem_url: '',
  autor: 'AMAJAC',
  ativo: false,
  destaque: false,
  data_publicacao: new Date().toISOString().split('T')[0],
  visualizacoes: 0
})

onMounted(async () => {
  // 🧪 TESTE TEMPORÁRIO - descomente para testar upload
  // await testarUploadCorrigido()
  
  if (isEditing.value) {
    await loadNoticia()
  } else {
    // Inicialização para nova notícia
    form.value = {
      titulo: '',
      resumo: '',
      conteudo: '',
      imagem_url: '',
      autor: 'AMAJAC',
      ativo: false,
      destaque: false,
      data_publicacao: new Date().toISOString().split('T')[0],
      visualizacoes: 0
    }
  }
})

// 🧪 FUNÇÃO DE TESTE TEMPORÁRIA
const testarUploadCorrigido = async () => {
  try {
    console.log('🧪 TESTE: Upload no bucket NOTICIAS (corrigido)...')
    
    // Cria um arquivo de teste
    const blob = new Blob(['conteúdo de teste para notícia'], { type: 'image/png' })
    const testFile = new File([blob], 'teste-noticia-corrigido.png', { type: 'image/png' })
    
    console.log('📤 Fazendo upload no bucket "noticias"...')
    const url = await noticiasStore.uploadImagem(testFile)
    
    console.log('🎉 UPLOAD FUNCIONOU! URL:', url)
    alert('✅ SUCESSO! Upload funcionou no bucket "noticias":\n' + url)
    
    // Preenche automaticamente no formulário para teste
    form.value.imagem_url = url
    
  } catch (error) {
    console.error('💥 FALHA NO UPLOAD:', error)
    alert('❌ ERRO no upload:\n' + error.message + '\n\nVerifique o console para detalhes.')
  }
}

async function loadNoticia() {
  try {
    console.log('📖 Carregando notícia para edição:', isEditing.value)
    const noticia = await noticiasStore.carregarNoticia(isEditing.value)
    
    if (noticia) {
      form.value = {
        titulo: noticia.titulo || '',
        resumo: noticia.resumo || '',
        conteudo: noticia.conteudo || '',
        imagem_url: noticia.imagem_url || '',
        autor: noticia.autor || 'AMAJAC',
        ativo: noticia.ativo !== undefined ? noticia.ativo : false,
        destaque: noticia.destaque !== undefined ? noticia.destaque : false,
        data_publicacao: noticia.data_publicacao ? new Date(noticia.data_publicacao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        visualizacoes: noticia.visualizacoes || 0
      }
      console.log('✅ Notícia carregada para edição')
    }
  } catch (error) {
    console.error('❌ Erro ao carregar notícia:', error)
    alert('Erro ao carregar notícia para edição: ' + error.message)
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    alert('Tipo de arquivo não permitido. Use apenas PNG, JPG, JPEG ou WEBP.')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('O arquivo é muito grande. Tamanho máximo: 10MB')
    return
  }

  uploading.value = true

  try {
    // 1. Cria preview local
    const imageUrl = URL.createObjectURL(file)
    form.value.imagem_url = imageUrl
    
    console.log('📷 Preview local criado:', imageUrl)
    
    // 2. Faz upload REAL para o Supabase (bucket 'noticias')
    console.log('📤 Iniciando upload para Supabase (bucket noticias)...', file.name)
    const publicUrl = await noticiasStore.uploadImagem(file)
    
    console.log('✅ Upload concluído. URL pública:', publicUrl)
    
    // 3. Substitui o blob URL pela URL pública permanente
    form.value.imagem_url = publicUrl
    
    // 4. Limpa o blob URL da memória
    URL.revokeObjectURL(imageUrl)
    
  } catch (error) {
    console.error('❌ Erro ao fazer upload da imagem:', error)
    alert('Erro ao fazer upload da imagem: ' + error.message)
    form.value.imagem_url = '' // Limpa a imagem em caso de erro
  } finally {
    uploading.value = false
    // Limpa o input file
    event.target.value = ''
  }
}

async function saveNoticia(publicar = false) {
  try {
    saving.value = true

    // Validações
    if (!form.value.titulo?.trim()) {
      alert('O título é obrigatório')
      return
    }
    if (!form.value.resumo?.trim()) {
      alert('O resumo é obrigatório')
      return
    }
    if (!form.value.conteudo?.trim()) {
      alert('O conteúdo é obrigatório')
      return
    }
    if (!form.value.autor?.trim()) {
      alert('O autor é obrigatório')
      return
    }

    // Prepara os dados para salvar
    const dadosNoticia = {
      titulo: form.value.titulo.trim(),
      resumo: form.value.resumo.trim(),
      conteudo: form.value.conteudo.trim(),
      imagem_url: form.value.imagem_url,
      autor: form.value.autor.trim(),
      ativo: publicar ? true : form.value.ativo,
      destaque: form.value.destaque,
      data_publicacao: form.value.data_publicacao || new Date().toISOString().split('T')[0],
      visualizacoes: form.value.visualizacoes || 0
    }

    console.log('💾 Salvando notícia:', dadosNoticia)

    let resultado
    if (isEditing.value) {
      resultado = await noticiasStore.atualizarNoticia(isEditing.value, dadosNoticia)
      console.log('✅ Notícia atualizada:', resultado)
    } else {
      resultado = await noticiasStore.criarNoticia(dadosNoticia)
      console.log('✅ Notícia criada:', resultado)
    }

    // Redireciona para a lista de notícias
    router.push('/admin/noticias')

  } catch (error) {
    console.error('❌ Erro ao salvar notícia:', error)
    alert(`Erro ao salvar notícia: ${error.message}`)
  } finally {
    saving.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Data não informada'
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}
</script>

<style scoped>
/* Estilos mantidos do seu original */
</style>