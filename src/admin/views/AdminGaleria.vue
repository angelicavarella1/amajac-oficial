<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Galeria de Imagens</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Gerencie as imagens e álbuns da galeria</p>
      </div>
      <div class="flex space-x-3">
        <button 
          @click="showCreateAlbum = true"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <i class="fas fa-folder-plus mr-2"/>
          Novo Álbum
        </button>
        <button 
          @click="novaImagem"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <i class="fas fa-plus mr-2"/>
          Nova Imagem
        </button>
      </div>
    </div>

    <!-- Modal de Criar Álbum -->
    <div v-if="showCreateAlbum" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCreateAlbum = false"/>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                <i class="fas fa-folder-plus text-blue-600 dark:text-blue-400"/>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Criar Novo Álbum</h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Álbum *
                    </label>
                    <input
                      v-model="newAlbum.nome"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ex: Eventos 2024"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      v-model="newAlbum.descricao"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Descrição do álbum (opcional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="criarAlbum"
              :disabled="!newAlbum.nome || loadingAlbum"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i v-if="loadingAlbum" class="fas fa-spinner fa-spin mr-2"/>
              {{ loadingAlbum ? 'Criando...' : 'Criar Álbum' }}
            </button>
            <button
              @click="showCreateAlbum = false"
              :disabled="loadingAlbum"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros e Busca -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div class="flex flex-wrap gap-4">
          <select
            v-model="filters.album"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos os Álbuns</option>
            <option v-for="album in albums" :key="album.id" :value="album.id">{{ album.nome }}</option>
          </select>
          
          <select
            v-model="filters.sort"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigas</option>
            <option value="name">Nome A-Z</option>
          </select>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 inline-flex border border-gray-300 dark:border-gray-600">
            <button 
              @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
              class="p-2 rounded transition-colors"
              title="Visualização em Grid"
            >
              <i class="fas fa-th"/>
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
              class="p-2 rounded transition-colors"
              title="Visualização em Lista"
            >
              <i class="fas fa-list"/>
            </button>
          </div>
        </div>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            v-model="filters.search"
            placeholder="Buscar imagens..."
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
              <i class="fas fa-images text-blue-600 dark:text-blue-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Imagens</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-folder text-green-600 dark:text-green-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Álbuns</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.albuns }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-hdd text-yellow-600 dark:text-yellow-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Espaço Usado</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.espaco }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-cloud-upload-alt text-purple-600 dark:text-purple-400 text-xl"/>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Último Upload</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.ultimoUpload }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de Ações em Massa -->
    <div v-if="selectedImages.length > 0" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
      <div class="flex items-center justify-between">
        <div class="text-green-700 dark:text-green-300 flex items-center">
          <i class="fas fa-check-circle mr-2"/>
          {{ selectedImages.length }} imagem(ns) selecionada(s)
        </div>
        <div class="flex space-x-2">
          <select 
            v-model="bulkAction" 
            class="px-3 py-2 border border-green-300 dark:border-green-700 rounded bg-white dark:bg-green-800 text-green-700 dark:text-green-300 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Ações em massa</option>
            <option value="move">Mover para álbum</option>
            <option value="delete">Excluir selecionadas</option>
          </select>
          <button 
            @click="applyBulkAction"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Aplicar
          </button>
          <button 
            @click="selectedImages = []"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>

    <!-- Visualização em Grid -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div 
        v-for="imagem in imagensPaginadas" 
        :key="imagem.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group border border-gray-200 dark:border-gray-700"
      >
        <div class="relative aspect-square overflow-hidden">
          <img 
            :src="imagem.imagem_url" 
            :alt="imagem.imagem_alt || imagem.titulo"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            @load="handleImageLoad(imagem)"
            @error="handleImageError(imagem)"
          />
          
          <!-- Loading State -->
          <div v-if="imagem.loading" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"/>
          </div>
          
          <!-- Error State -->
          <div v-if="imagem.error" class="absolute inset-0 bg-red-50 flex items-center justify-center">
            <div class="text-center">
              <i class="fas fa-exclamation-triangle text-red-500 text-xl mb-2"/>
              <p class="text-red-600 text-sm">Erro ao carregar</p>
            </div>
          </div>

          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
            <button 
              @click="previewImage(imagem)"
              class="bg-white bg-opacity-90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
              title="Visualizar"
            >
              <i class="fas fa-eye text-sm"/>
            </button>
            <button 
              @click="editImage(imagem)"
              class="bg-white bg-opacity-90 hover:bg-white text-green-600 p-2 rounded-full transition-colors"
              title="Editar"
            >
              <i class="fas fa-edit text-sm"/>
            </button>
            <button 
              @click="confirmarExclusao(imagem)"
              class="bg-white bg-opacity-90 hover:bg-white text-red-600 p-2 rounded-full transition-colors"
              title="Excluir"
            >
              <i class="fas fa-trash text-sm"/>
            </button>
          </div>

          <div class="absolute top-2 left-2">
            <input 
              type="checkbox" 
              :value="imagem.id"
              v-model="selectedImages"
              class="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </div>

          <!-- Categoria Badge -->
          <div class="absolute top-2 right-2">
            <span class="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {{ imagem.categoria || 'geral' }}
            </span>
          </div>
        </div>

        <div class="p-4">
          <h3 class="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">{{ imagem.titulo || 'Sem título' }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ imagem.tamanho ? formatFileSize(imagem.tamanho) : 'Tamanho não disponível' }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(imagem.created_at) }}</span>
            <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
              {{ imagem.categoria || 'geral' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Visualização em Lista -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div v-if="loading && imagens.length === 0" class="flex justify-center items-center py-12 flex-col">
        <i class="fas fa-spinner fa-spin text-3xl text-green-600 mb-4"/>
        <p class="text-gray-600 dark:text-gray-400">Carregando imagens...</p>
      </div>

      <div v-else-if="error" class="text-center py-12 text-red-600 dark:text-red-400">
        <i class="fas fa-exclamation-triangle text-2xl mb-4"/>
        <p class="text-lg font-medium mb-2">Erro ao carregar imagens</p>
        <p class="text-sm mb-4">{{ error }}</p>
        <button
          @click="carregarGaleria"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i class="fas fa-redo mr-2"/>Tentar Novamente
        </button>
      </div>

      <div v-else-if="imagensFiltradas.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Imagem
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Título
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Categoria
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
              v-for="imagem in imagensPaginadas" 
              :key="imagem.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <img 
                  :src="imagem.imagem_url" 
                  :alt="imagem.imagem_alt || imagem.titulo"
                  class="h-12 w-12 object-cover rounded-lg"
                  @load="handleImageLoad(imagem)"
                  @error="handleImageError(imagem)"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ imagem.titulo || 'Sem título' }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                  {{ imagem.descricao || 'Sem descrição' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 dark:text-white">{{ imagem.categoria || 'geral' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(imagem.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="previewImage(imagem)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Visualizar"
                  >
                    <i class="fas fa-eye"/>
                  </button>

                  <button 
                    @click="editImage(imagem)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                    title="Editar"
                  >
                    <i class="fas fa-edit"/>
                  </button>

                  <button 
                    @click="confirmarExclusao(imagem)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Excluir"
                  >
                    <i class="fas fa-trash"/>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!loading && imagensFiltradas.length === 0" class="text-center py-12">
        <i class="fas fa-images text-4xl text-gray-400 mb-4"/>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma imagem encontrada</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Comece fazendo upload de suas primeiras imagens.</p>
        <button 
          @click="novaImagem"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
        >
          <i class="fas fa-plus mr-2"/>
          Fazer Upload
        </button>
      </div>

      <!-- Paginação -->
      <div v-if="imagensFiltradas.length > itemsPerPage" class="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, imagensFiltradas.length) }}</span> de
            <span class="font-medium">{{ imagensFiltradas.length }}</span> resultados
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
              :disabled="currentPage * itemsPerPage >= imagensFiltradas.length"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Preview -->
    <div v-if="previewImageData" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="previewImageData = null"/>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="absolute top-0 right-0 pt-4 pr-4">
            <button 
              @click="previewImageData = null"
              class="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-2"
            >
              <i class="fas fa-times"/>
            </button>
          </div>
          
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <img 
              :src="previewImageData.imagem_url" 
              :alt="previewImageData.imagem_alt || previewImageData.titulo"
              class="w-full h-96 object-contain rounded-lg mb-4"
            />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ previewImageData.titulo || 'Sem título' }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ previewImageData.descricao || 'Sem descrição' }}</p>
              </div>
              
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Categoria:</label>
                  <p class="text-gray-900 dark:text-white">{{ previewImageData.categoria || 'geral' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Upload:</label>
                  <p class="text-gray-900 dark:text-white">{{ formatDate(previewImageData.created_at) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Alt Text:</label>
                  <p class="text-gray-900 dark:text-white">{{ previewImageData.imagem_alt || 'Não definido' }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="editImage(previewImageData)"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              <i class="fas fa-edit mr-2"/>
              Editar Imagem
            </button>
            <button 
              @click="previewImageData = null"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="imagemParaExcluir" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="imagemParaExcluir = null"/>

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
                    Tem certeza que deseja excluir a imagem <strong>"{{ imagemParaExcluir?.titulo }}"</strong>? Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="excluirImagem"
              :disabled="loadingExclusao"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i v-if="loadingExclusao" class="fas fa-spinner fa-spin mr-2"/>
              {{ loadingExclusao ? 'Excluindo...' : 'Excluir' }}
            </button>
            <button
              @click="imagemParaExcluir = null"
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
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useUIStore } from '@/shared/stores/ui'

const router = useRouter()
const uiStore = useUIStore()

// Estados
const loading = ref(false)
const loadingExclusao = ref(false)
const loadingAlbum = ref(false)
const error = ref(null)
const viewMode = ref('grid')
const showCreateAlbum = ref(false)
const previewImageData = ref(null)
const selectedImages = ref([])
const bulkAction = ref('')
const imagemParaExcluir = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(12)

const filters = ref({
  album: '',
  sort: 'newest',
  search: ''
})

const newAlbum = ref({
  nome: '',
  descricao: ''
})

// Dados REAIS do banco
const albums = ref([])
const imagens = ref([])

// Stats como reactive object
const stats = ref({
  total: 0,
  albuns: 0,
  espaco: 'Calculando...',
  ultimoUpload: 'N/A'
})

// ✅ CORREÇÃO: Função para nova imagem
const novaImagem = () => {
  console.log('📸 Navegando para formulário de nova imagem...')
  router.push('/admin/galeria/nova')
}

// Função para calcular espaço usado
const calcularEspacoUsado = async () => {
  try {
    const totalImagens = imagens.value.length
    
    if (totalImagens === 0) return 0
    
    // Estimativa: 500KB por imagem
    const tamanhoMedioPorImagem = 500 * 1024
    const totalBytes = totalImagens * tamanhoMedioPorImagem
    
    console.log(`📊 Estimando espaço: ${totalImagens} imagens × 500KB = ${formatFileSize(totalBytes)}`)
    
    return totalBytes
  } catch (err) {
    console.error('Erro ao calcular espaço usado:', err)
    return 0
  }
}

// FUNÇÃO PARA CRIAR ÁLBUM
const criarAlbum = async () => {
  if (!newAlbum.value.nome.trim()) return

  loadingAlbum.value = true
  try {
    console.log('Criando álbum:', newAlbum.value)
    
    // Simulação de criação
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    uiStore.showToast(`Álbum "${newAlbum.value.nome}" criado com sucesso!`, 'success')
    
    // Limpa o formulário e fecha o modal
    newAlbum.value = { nome: '', descricao: '' }
    showCreateAlbum.value = false
    
    // Recarrega os álbuns
    await carregarAlbuns()
    
  } catch (err) {
    console.error('Erro ao criar álbum:', err)
    uiStore.showToast('Erro ao criar álbum', 'error')
  } finally {
    loadingAlbum.value = false
  }
}

// FUNÇÃO PARA CARREGAR ÁLBUNS
const carregarAlbuns = async () => {
  try {
    albums.value = []
    console.log('Álbuns carregados:', albums.value)
  } catch (err) {
    console.error('Erro ao carregar álbuns:', err)
  }
}

// Função principal simplificada
const carregarGaleria = async () => {
  console.log('🔄 Carregando galeria do banco...')
  loading.value = true
  error.value = null
  imagens.value = []

  try {
    // Busca imagens
    const { data, error: supabaseError } = await supabase
      .from('galeria')
      .select('*')
      .order('created_at', { ascending: false })

    if (supabaseError) throw supabaseError

    if (data && data.length > 0) {
      console.log(`✅ ${data.length} imagens encontradas na galeria`)
      
      imagens.value = data.map(imagem => ({
        ...imagem,
        loading: true,
        error: false
      }))

      // Atualiza stats diretamente
      stats.value.total = data.length
      stats.value.albuns = new Set(data.map(img => img.categoria)).size
      
      // Calcula espaço usado (estimativa)
      const totalBytes = await calcularEspacoUsado()
      stats.value.espaco = formatFileSize(totalBytes)
      
      // Último upload
      const ultimoUpload = data.length > 0 ? 
        new Date(Math.max(...data.map(img => new Date(img.created_at)))) 
        : 'N/A'
      stats.value.ultimoUpload = ultimoUpload !== 'N/A' ? formatDate(ultimoUpload) : 'N/A'

      console.log(`💾 Espaço estimado: ${stats.value.espaco}`)
      
    } else {
      console.log('📭 Nenhuma imagem encontrada na tabela galeria')
      imagens.value = []
      stats.value.total = 0
      stats.value.albuns = 0
      stats.value.espaco = '0 Bytes'
      stats.value.ultimoUpload = 'N/A'
    }

  } catch (err) {
    console.error('❌ Erro crítico ao carregar galeria:', err)
    error.value = err.message || 'Erro ao carregar galeria'
    stats.value.espaco = 'Erro'
  } finally {
    loading.value = false
  }
}

// FUNÇÕES DE MANIPULAÇÃO DE IMAGEM
const handleImageLoad = (imagem) => {
  console.log(`✅ Imagem carregada: ${imagem.titulo}`)
  imagem.loading = false
  imagem.error = false
}

const handleImageError = (imagem) => {
  console.error(`❌ Erro ao carregar imagem: ${imagem.titulo}`)
  console.error(`   URL: ${imagem.imagem_url}`)
  imagem.loading = false
  imagem.error = true
}

// AÇÕES EM MASSA
const applyBulkAction = async () => {
  if (!bulkAction.value || selectedImages.value.length === 0) return

  if (bulkAction.value === 'delete') {
    if (confirm(`Deseja excluir ${selectedImages.value.length} imagem(ns) selecionada(s)?`)) {
      for (const imageId of selectedImages.value) {
        const imagem = imagens.value.find(img => img.id === imageId)
        if (imagem) {
          await excluirImagemDirect(imagem)
        }
      }
      selectedImages.value = []
      bulkAction.value = ''
    }
  }
}

const excluirImagemDirect = async (imagem) => {
  try {
    const { error } = await supabase
      .from('galeria')
      .delete()
      .eq('id', imagem.id)

    if (error) throw error

    const index = imagens.value.findIndex(i => i.id === imagem.id)
    if (index > -1) {
      imagens.value.splice(index, 1)
    }
  } catch (err) {
    console.error('Erro ao excluir imagem:', err)
    uiStore.showToast('Erro ao excluir imagem', 'error')
  }
}

// FUNÇÃO MELHORADA PARA FORMATAR TAMANHO DE ARQUIVO
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  // Formata com 2 casas decimais para MB e GB, 0 para Bytes e KB
  const decimals = i < 2 ? 0 : 2
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))
  
  return `${formattedSize} ${sizes[i]}`
}

// Computed
const imagensFiltradas = computed(() => {
  let result = [...imagens.value]

  // Filtro por categoria (substituindo álbum)
  if (filters.value.album) {
    result = result.filter(imagem => imagem.categoria === filters.value.album)
  }

  // Filtro por pesquisa
  if (filters.value.search) {
    const termo = filters.value.search.toLowerCase()
    result = result.filter(imagem => 
      imagem.titulo?.toLowerCase().includes(termo) ||
      imagem.descricao?.toLowerCase().includes(termo) ||
      imagem.imagem_alt?.toLowerCase().includes(termo)
    )
  }

  // Ordenação
  switch (filters.value.sort) {
    case 'oldest':
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'name':
      result.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''))
      break
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  // Resetar a página ao filtrar
  currentPage.value = 1
  return result
})

const imagensPaginadas = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return imagensFiltradas.value.slice(startIndex, endIndex)
})

// Métodos
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

function previewImage(imagem) {
  previewImageData.value = imagem
}

function editImage(imagem) {
  router.push(`/admin/galeria/editar/${imagem.id}`)
}

function confirmarExclusao(imagem) {
  if (!imagem?.id) return
  imagemParaExcluir.value = imagem
}

async function excluirImagem() {
  if (!imagemParaExcluir.value?.id) return

  loadingExclusao.value = true
  try {
    const { error } = await supabase
      .from('galeria')
      .delete()
      .eq('id', imagemParaExcluir.value.id)

    if (error) throw error

    const index = imagens.value.findIndex(i => i.id === imagemParaExcluir.value.id)
    if (index > -1) {
      const deletedTitle = imagens.value[index].titulo
      imagens.value.splice(index, 1)
      console.log(`✅ Imagem "${deletedTitle}" excluída com sucesso`)
      uiStore.showToast('Imagem excluída com sucesso', 'success')
      
      // Atualiza stats após exclusão
      stats.value.total = imagens.value.length
      const totalBytes = await calcularEspacoUsado()
      stats.value.espaco = formatFileSize(totalBytes)
    }
  } catch (err) {
    console.error('❌ Erro ao excluir imagem:', err)
    uiStore.showToast('Erro ao excluir imagem', 'error')
  } finally {
    loadingExclusao.value = false
    imagemParaExcluir.value = null
    selectedImages.value = []
  }
}

function nextPage() {
  if (currentPage.value * itemsPerPage.value < imagensFiltradas.value.length) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Ciclo de Vida
onMounted(() => {
  console.log('🚀 AdminGaleria montado - carregando imagens reais...')
  carregarGaleria()
  carregarAlbuns()
})
</script>