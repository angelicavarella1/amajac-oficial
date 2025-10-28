<template>
  <div class="space-y-6">
    <!-- Estados -->
    <div v-if="loading && !saving" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <span class="text-blue-800 dark:text-blue-200">Carregando configurações do banco...</span>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle text-red-600 mr-3"/>
        <span class="text-red-800 dark:text-red-200">{{ error }}</span>
      </div>
    </div>

    <!-- Debug Info -->
    <div v-if="debugInfo" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div class="flex items-center">
        <i class="fas fa-bug text-yellow-600 mr-3"/>
        <div>
          <p class="text-yellow-800 dark:text-yellow-200 font-medium">Debug Info</p>
          <p class="text-yellow-700 dark:text-yellow-300 text-sm whitespace-pre-line">{{ debugInfo }}</p>
        </div>
      </div>
    </div>

    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Configurações do Site</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          <span v-if="configuracoesDb.length > 0">{{ configuracoesDb.length }} configurações carregadas do banco</span>
          <span v-else>Nenhuma configuração carregada</span>
          <span v-if="hasChanges" class="text-yellow-600 dark:text-yellow-400 ml-2">• Alterações não salvas</span>
        </p>
      </div>
      <div class="flex space-x-3">
        <button 
          @click="testarConexao"
          :disabled="loading || saving"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-bug mr-2"/>
          Testar Conexão
        </button>
        <button 
          @click="testarSalvamentoSimples"
          :disabled="loading || saving"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-vial mr-2"/>
          Teste Simples
        </button>
        <button 
          @click="resetToLastSaved"
          :disabled="loading || saving || !hasChanges"
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-undo mr-2"/>
          Descartar
        </button>
        <button 
          @click="saveSettings"
          :disabled="loading || saving || !hasChanges"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="saving">
            <i class="fas fa-spinner fa-spin mr-2"/>
            Salvando...
          </span>
          <span v-else>
            <i class="fas fa-save mr-2"/>
            Salvar Alterações
          </span>
        </button>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div v-if="!loading && configuracoesDb.length > 0" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Navegação -->
      <div class="lg:col-span-1">
        <nav class="space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left"
            :class="[
              activeTab === tab.id
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <i :class="[tab.icon, 'mr-3 flex-shrink-0 h-5 w-5']"/>
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Formulários -->
      <div class="lg:col-span-3">
        <!-- Aba Site -->
        <div v-if="activeTab === 'site'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações Gerais do Site</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Site
                </label>
                <input
                  type="text"
                  v-model="settings.site.nome"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="PORTAL DO MORADOR"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave no banco: site_nome</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição do Site
                </label>
                <textarea
                  v-model="settings.site.descricao"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Associação de Moradores e Amigos do Jardim Atlântico Central"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave no banco: site_descricao</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Palavras-chave (SEO)
                </label>
                <input
                  type="text"
                  v-model="settings.site.keywords"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="AMAJAC, associação de moradores, Jardim Atlântico Central"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave no banco: site_keywords</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Contato -->
        <div v-else-if="activeTab === 'contact'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações de Contato</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    v-model="settings.contato.email"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: email_contato</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    v-model="settings.contato.telefone"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: telefone_contato</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endereço
                </label>
                <textarea
                  v-model="settings.contato.endereco"
                  rows="2"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: endereco</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    v-model="settings.contato.whatsapp"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: contato_whatsapp</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    v-model="settings.contato.instagram"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: contato_instagram</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  v-model="settings.contato.horario_funcionamento"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: contato_horario_funcionamento</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Hero -->
        <div v-else-if="activeTab === 'hero'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Seção Hero (Banner Principal)</h3>
            <div class="space-y-6">
              <!-- Upload de Imagem do Banner -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Imagem do Banner
                </label>
                <div class="space-y-4">
                  <!-- Preview da Imagem -->
                  <div v-if="settings.hero.imagem_url" class="relative">
                    <img 
                      :src="settings.hero.imagem_url" 
                      alt="Banner Preview" 
                      class="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      @click="removerImagem('hero')"
                      class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                      title="Remover imagem"
                    >
                      <i class="fas fa-times text-sm"/>
                    </button>
                  </div>
                  
                  <!-- Upload Area -->
                  <div 
                    @click="triggerFileInput('hero')"
                    class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
                    :class="uploading.hero ? 'opacity-50 cursor-not-allowed' : ''"
                  >
                    <input
                      type="file"
                      ref="heroFileInput"
                      @change="(e) => handleImageUpload(e, 'hero')"
                      accept="image/*"
                      class="hidden"
                      :disabled="uploading.hero"
                    />
                    
                    <div v-if="uploading.hero" class="flex flex-col items-center">
                      <i class="fas fa-spinner fa-spin text-green-600 text-2xl mb-2"/>
                      <p class="text-gray-600 dark:text-gray-400">Fazendo upload da imagem...</p>
                    </div>
                    <div v-else>
                      <i class="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"/>
                      <p class="text-gray-600 dark:text-gray-400">
                        <span class="text-green-600 font-medium">Clique para upload</span> ou arraste uma imagem
                      </p>
                      <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">
                        PNG, JPG, JPEG até 5MB
                      </p>
                    </div>
                  </div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: hero_imagem_url</p>
              </div>

              <!-- Campos de Texto do Hero -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    v-model="settings.hero.titulo"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: hero_titulo</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    v-model="settings.hero.subtitulo"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: hero_subtitulo</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    v-model="settings.hero.local"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: hero_local</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    v-model="settings.hero.descricao"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: hero_descricao</p>
                </div>

                <!-- Botões de Ação -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Texto do Botão Primário
                    </label>
                    <input
                      type="text"
                      v-model="settings.hero.cta1_texto"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: hero_cta1_texto</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Link do Botão Primário
                    </label>
                    <input
                      type="text"
                      v-model="settings.hero.cta1_link"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: hero_cta1_link</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Texto do Botão Secundário
                    </label>
                    <input
                      type="text"
                      v-model="settings.hero.cta2_texto"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: hero_cta2_texto</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Link do Botão Secundário
                    </label>
                    <input
                      type="text"
                      v-model="settings.hero.cta2_link"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: hero_cta2_link</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Quem Somos -->
        <div v-else-if="activeTab === 'about'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Seção Quem Somos</h3>
            <div class="space-y-6">
              <!-- Upload de Imagem da Seção Quem Somos -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Imagem da Seção Quem Somos
                </label>
                <div class="space-y-4">
                  <!-- Preview da Imagem -->
                  <div v-if="settings.about.imagem_url" class="relative">
                    <img 
                      :src="settings.about.imagem_url" 
                      alt="Quem Somos Preview" 
                      class="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      @click="removerImagem('about')"
                      class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                      title="Remover imagem"
                    >
                      <i class="fas fa-times text-sm"/>
                    </button>
                  </div>
                  
                  <!-- Upload Area -->
                  <div 
                    @click="triggerFileInput('about')"
                    class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
                    :class="uploading.about ? 'opacity-50 cursor-not-allowed' : ''"
                  >
                    <input
                      type="file"
                      ref="aboutFileInput"
                      @change="(e) => handleImageUpload(e, 'about')"
                      accept="image/*"
                      class="hidden"
                      :disabled="uploading.about"
                    />
                    
                    <div v-if="uploading.about" class="flex flex-col items-center">
                      <i class="fas fa-spinner fa-spin text-green-600 text-2xl mb-2"/>
                      <p class="text-gray-600 dark:text-gray-400">Fazendo upload da imagem...</p>
                    </div>
                    <div v-else>
                      <i class="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"/>
                      <p class="text-gray-600 dark:text-gray-400">
                        <span class="text-green-600 font-medium">Clique para upload</span> ou arraste uma imagem
                      </p>
                      <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">
                        PNG, JPG, JPEG até 5MB
                      </p>
                    </div>
                  </div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_imagem_url</p>
              </div>

              <!-- Campos de Texto do Quem Somos -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    v-model="settings.about.titulo"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_titulo</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    v-model="settings.about.subtitulo"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_subtitulo</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    História
                  </label>
                  <textarea
                    v-model="settings.about.historia"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_historia</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título da Missão
                  </label>
                  <input
                    type="text"
                    v-model="settings.about.missao_titulo"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_missao_titulo</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Missão
                  </label>
                  <textarea
                    v-model="settings.about.missao"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_missao</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título dos Valores
                  </label>
                  <input
                    type="text"
                    v-model="settings.about.valores_titulo"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_valores_titulo</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valores
                  </label>
                  <textarea
                    v-model="settings.about.valores"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Digite cada valor em uma linha separada"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_valores</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número de Famílias
                    </label>
                    <input
                      type="number"
                      v-model="settings.about.estatisticas_familias"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_estatisticas_familias</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ano da Estatística
                    </label>
                    <input
                      type="text"
                      v-model="settings.about.estatisticas_ano"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Chave: quem_somos_estatisticas_ano</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Sistema -->
        <div v-else-if="activeTab === 'system'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações de Sistema</h3>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Clima</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Mostrar informações do clima no header</p>
                </div>
                <button
                  @click="settings.sistema.clima_ativado = !settings.sistema.clima_ativado"
                  :class="settings.sistema.clima_ativado ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <span
                    :class="settings.sistema.clima_ativado ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Relógio</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Mostrar relógio no header</p>
                </div>
                <button
                  @click="settings.sistema.relogio_ativado = !settings.sistema.relogio_ativado"
                  :class="settings.sistema.relogio_ativado ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <span
                    :class="settings.sistema.relogio_ativado ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Eventos</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Mostrar seção de eventos</p>
                </div>
                <button
                  @click="settings.sistema.eventos_ativado = !settings.sistema.eventos_ativado"
                  :class="settings.sistema.eventos_ativado ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <span
                    :class="settings.sistema.eventos_ativado ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicador de dados carregados -->
        <div v-else class="text-center p-8">
          <p class="text-gray-500 dark:text-gray-400">Selecione uma aba para configurar</p>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-if="!loading && configuracoesDb.length === 0" class="text-center py-12">
      <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-8 max-w-md mx-auto">
        <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"/>
        <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Nenhuma configuração carregada</h3>
        <p class="text-yellow-700 dark:text-yellow-300 mb-4">As configurações não foram carregadas do banco de dados.</p>
        <button 
          @click="loadSettings"
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useConfiguracoes } from '@/shared/composables/useConfiguracoes'
import { useUIStore } from '@/shared/stores/ui'

// Use o composable
const { 
  configuracoes: configuracoesDb, 
  loading, 
  error,
  fetchConfiguracoes, 
  atualizarConfiguracao,
  testarConexao: testarConexaoComposable,
  uploadImagem,
  deletarImagem
} = useConfiguracoes()

const uiStore = useUIStore()
const activeTab = ref('site')
const saving = ref(false)
const hasChanges = ref(false)
const debugInfo = ref('')

// Refs para os inputs de arquivo
const heroFileInput = ref(null)
const aboutFileInput = ref(null)

// Estado de upload para cada seção
const uploading = reactive({
  hero: false,
  about: false
})

const tabs = ref([
  { id: 'site', name: 'Site', icon: 'fas fa-globe' },
  { id: 'contact', name: 'Contato', icon: 'fas fa-address-book' },
  { id: 'hero', name: 'Hero', icon: 'fas fa-home' },
  { id: 'about', name: 'Quem Somos', icon: 'fas fa-users' },
  { id: 'system', name: 'Sistema', icon: 'fas fa-cog' }
])

// Estrutura VAZIA - será preenchida apenas do banco
const settings = reactive({
  site: { nome: '', descricao: '', keywords: '' },
  contato: { email: '', telefone: '', endereco: '', whatsapp: '', facebook: '', instagram: '', horario_funcionamento: '' },
  hero: { titulo: '', subtitulo: '', local: '', descricao: '', cta1_texto: '', cta1_link: '', cta2_texto: '', cta2_link: '', imagem_url: '' },
  about: { titulo: '', subtitulo: '', historia: '', missao_titulo: '', missao: '', valores_titulo: '', valores: '', estatisticas_familias: '', estatisticas_ano: '', imagem_url: '' },
  sistema: { clima_ativado: true, relogio_ativado: true, eventos_ativado: true }
})

// 🎯 MAPEAMENTO CORRETO baseado nas chaves reais do seu banco
const keyMapping = {
  'site_nome': { category: 'site', field: 'nome' },
  'site_descricao': { category: 'site', field: 'descricao' },
  'site_keywords': { category: 'site', field: 'keywords' },
  'email_contato': { category: 'contato', field: 'email' },
  'telefone_contato': { category: 'contato', field: 'telefone' },
  'endereco': { category: 'contato', field: 'endereco' },
  'contato_whatsapp': { category: 'contato', field: 'whatsapp' },
  'contato_facebook': { category: 'contato', field: 'facebook' },
  'contato_instagram': { category: 'contato', field: 'instagram' },
  'contato_horario_funcionamento': { category: 'contato', field: 'horario_funcionamento' },
  'hero_titulo': { category: 'hero', field: 'titulo' },
  'hero_subtitulo': { category: 'hero', field: 'subtitulo' },
  'hero_local': { category: 'hero', field: 'local' },
  'hero_descricao': { category: 'hero', field: 'descricao' },
  'hero_cta1_texto': { category: 'hero', field: 'cta1_texto' },
  'hero_cta1_link': { category: 'hero', field: 'cta1_link' },
  'hero_cta2_texto': { category: 'hero', field: 'cta2_texto' },
  'hero_cta2_link': { category: 'hero', field: 'cta2_link' },
  'hero_imagem_url': { category: 'hero', field: 'imagem_url' },
  'quem_somos_titulo': { category: 'about', field: 'titulo' },
  'quem_somos_subtitulo': { category: 'about', field: 'subtitulo' },
  'quem_somos_historia': { category: 'about', field: 'historia' },
  'quem_somos_missao_titulo': { category: 'about', field: 'missao_titulo' },
  'quem_somos_missao': { category: 'about', field: 'missao' },
  'quem_somos_valores_titulo': { category: 'about', field: 'valores_titulo' },
  'quem_somos_valores': { category: 'about', field: 'valores' },
  'quem_somos_estatisticas_familias': { category: 'about', field: 'estatisticas_familias', type: 'number' },
  'quem_somos_estatisticas_ano': { category: 'about', field: 'estatisticas_ano' },
  'quem_somos_imagem_url': { category: 'about', field: 'imagem_url' },
  'info_clima_ativado': { category: 'sistema', field: 'clima_ativado', type: 'boolean' },
  'info_relogio_ativado': { category: 'sistema', field: 'relogio_ativado', type: 'boolean' },
  'info_eventos_ativado': { category: 'sistema', field: 'eventos_ativado', type: 'boolean' }
}

onMounted(async () => {
  await loadSettings()
})

/**
 * Carrega configurações do banco de dados
 */
async function loadSettings() {
  try {
    debugInfo.value = '🔄 Carregando configurações do banco...'
    await fetchConfiguracoes()
    
    console.log('📊 Configurações carregadas do banco:', configuracoesDb.value)
    
    if (configuracoesDb.value.length === 0) {
      debugInfo.value = '❌ Nenhuma configuração encontrada no banco'
      return
    }
    
    let carregadas = 0
    let naoEncontradas = 0
    
    // Preencher APENAS com dados do banco
    Object.entries(keyMapping).forEach(([dbKey, mapping]) => {
      const configItem = configuracoesDb.value.find(c => c.chave === dbKey)
      
      if (configItem) {
        let value = configItem.valor
        
        // Converter tipos
        if (mapping.type === 'boolean') {
          value = value === 'true' || value === true
        } else if (mapping.type === 'number') {
          value = Number(value) || 0
        } else if (value === null) {
          value = ''
        }
        
        settings[mapping.category][mapping.field] = value
        carregadas++
      } else {
        console.warn(`⚠️ Configuração não encontrada: ${dbKey}`)
        naoEncontradas++
      }
    })
    
    console.log('✅ Configurações mapeadas:', settings)
    debugInfo.value = `✅ ${carregadas} configurações carregadas, ${naoEncontradas} não encontradas`
    hasChanges.value = false
    
  } catch (err) {
    console.error('❌ Erro ao carregar configurações:', err)
    debugInfo.value = `❌ Erro: ${err.message}`
  }
}

/**
 * Salva configurações no banco de dados - VERSÃO CORRIGIDA
 */
async function saveSettings() {
  if (saving.value) return

  saving.value = true
  debugInfo.value = '💾 Iniciando salvamento...'
  
  try {
    let salvas = 0
    let erros = 0
    
    // Salvar cada configuração individualmente
    for (const [dbKey, mapping] of Object.entries(keyMapping)) {
      let value = settings[mapping.category][mapping.field]
      
      // Converter para string para o banco
      if (mapping.type === 'boolean') {
        value = value ? 'true' : 'false'
      } else if (value === null || value === undefined) {
        value = ''
      } else {
        value = String(value)
      }
      
      console.log(`📝 Salvando: ${dbKey} = ${value}`)
      
      try {
        await atualizarConfiguracao(dbKey, value)
        salvas++
      } catch (err) {
        console.error(`❌ Erro ao salvar ${dbKey}:`, err)
        erros++
      }
    }

    debugInfo.value = `✅ ${salvas} configurações salvas, ${erros} erros`
    
    if (erros === 0) {
      hasChanges.value = false
      uiStore.showToast('Todas as configurações foram salvas com sucesso!', 'success')
    } else {
      uiStore.showToast(`Salvas ${salvas} configurações, ${erros} com erro`, 'warning')
    }
    
    // Recarregar para confirmar
    await loadSettings()
    
  } catch (err) {
    console.error('❌ Erro ao salvar configurações:', err)
    debugInfo.value = `❌ Erro geral: ${err.message}`
    uiStore.showToast('Erro ao salvar configurações', 'error')
  } finally {
    saving.value = false
  }
}

/**
 * Testa a conexão com o banco
 */
async function testarConexao() {
  debugInfo.value = '🔍 Testando conexão...'
  
  try {
    await testarConexaoComposable()
    debugInfo.value = '✅ Conexão com o banco estabelecida com sucesso!'
  } catch (err) {
    console.error('❌ Falha no teste:', err)
    debugInfo.value = `❌ Falha no teste: ${err.message}`
  }
}

/**
 * Teste simples de salvamento
 */
async function testarSalvamentoSimples() {
  try {
    debugInfo.value = '🧪 Testando salvamento simples...'
    
    // Testar com uma chave específica
    const resultado = await atualizarConfiguracao('site_nome', 'TESTE ' + new Date().toLocaleTimeString())
    
    debugInfo.value = `✅ Teste OK! Salvo: ${resultado.chave} = ${resultado.valor}`
    
    // Recarregar para confirmar
    await loadSettings()
  } catch (err) {
    debugInfo.value = `❌ Falha no teste: ${err.message}`
  }
}

/**
 * Reseta para último estado salvo
 */
async function resetToLastSaved() {
  if (hasChanges.value && confirm('Descartar alterações não salvas?')) {
    await loadSettings()
  }
}

// ========== FUNÇÕES DE UPLOAD DE IMAGEM ==========

/**
 * Aciona o input de arquivo baseado na seção
 */
function triggerFileInput(section) {
  const fileInput = section === 'hero' ? heroFileInput.value : aboutFileInput.value
  if (!uploading[section] && fileInput) {
    fileInput.click()
  }
}

/**
 * Manipula o upload da imagem para uma seção específica
 */
async function handleImageUpload(event, section) {
  const file = event.target.files[0]
  if (!file) return

  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    uiStore.showToast('Por favor, selecione apenas arquivos de imagem.', 'error')
    return
  }

  // Validar tamanho do arquivo (5MB)
  if (file.size > 5 * 1024 * 1024) {
    uiStore.showToast('A imagem deve ter no máximo 5MB.', 'error')
    return
  }

  uploading[section] = true
  debugInfo.value = `📤 Fazendo upload da imagem da seção ${section}...`

  try {
    // Definir pasta baseada na seção
    const pasta = section === 'hero' ? 'hero' : 'quem-somos'
    
    // Fazer upload da imagem
    const imageUrl = await uploadImagem(file, pasta)
    
    // Atualizar a configuração com a nova URL
    const configKey = section === 'hero' ? 'hero_imagem_url' : 'quem_somos_imagem_url'
    settings[section].imagem_url = imageUrl
    hasChanges.value = true
    
    debugInfo.value = `✅ Imagem da seção ${section} carregada com sucesso!`
    uiStore.showToast(`Imagem da seção ${section} carregada com sucesso!`, 'success')
    
    // Salvar automaticamente a URL no banco
    await atualizarConfiguracao(configKey, imageUrl)
    
  } catch (err) {
    console.error(`❌ Erro no upload da seção ${section}:`, err)
    debugInfo.value = `❌ Erro no upload: ${err.message}`
    uiStore.showToast(`Erro ao carregar imagem da seção ${section}`, 'error')
  } finally {
    uploading[section] = false
    // Limpar o input de arquivo
    const fileInput = section === 'hero' ? heroFileInput.value : aboutFileInput.value
    if (fileInput) {
      fileInput.value = ''
    }
  }
}

/**
 * Remove a imagem de uma seção específica
 */
async function removerImagem(section) {
  const imageUrl = settings[section].imagem_url
  if (!imageUrl) return

  const sectionName = section === 'hero' ? 'banner' : 'seção Quem Somos'
  
  if (confirm(`Tem certeza que deseja remover a imagem da ${sectionName}?`)) {
    try {
      debugInfo.value = `🗑️ Removendo imagem da ${sectionName}...`
      
      // Deletar a imagem do storage
      await deletarImagem(imageUrl)
      
      // Limpar a URL no settings
      settings[section].imagem_url = ''
      hasChanges.value = true
      
      // Salvar a alteração no banco
      const configKey = section === 'hero' ? 'hero_imagem_url' : 'quem_somos_imagem_url'
      await atualizarConfiguracao(configKey, '')
      
      debugInfo.value = `✅ Imagem da ${sectionName} removida com sucesso!`
      uiStore.showToast(`Imagem da ${sectionName} removida com sucesso!`, 'success')
      
    } catch (err) {
      console.error(`❌ Erro ao remover imagem da ${sectionName}:`, err)
      debugInfo.value = `❌ Erro ao remover imagem: ${err.message}`
      uiStore.showToast(`Erro ao remover imagem da ${sectionName}`, 'error')
    }
  }
}

// Watch para detectar mudanças
watch(settings, () => {
  hasChanges.value = true
}, { deep: true })
</script>

<style scoped>
/* Estilos específicos para melhorias visuais */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Melhorias para os botões de toggle */
.toggle-bg {
  transition: background-color 0.2s ease-in-out;
}

/* Animações suaves para transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Melhorias para áreas de upload */
.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #10B981;
  background-color: #f0fdf4;
}

.dark .upload-area:hover {
  background-color: #052e16;
}

/* Estilos para preview de imagens */
.image-preview {
  transition: transform 0.3s ease;
}

.image-preview:hover {
  transform: scale(1.02);
}

/* Scroll suave para áreas com muito conteúdo */
.scroll-area {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.scroll-area::-webkit-scrollbar {
  width: 6px;
}

.scroll-area::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.scroll-area::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.scroll-area::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .scroll-area {
  scrollbar-color: #475569 #1e293b;
}

.dark .scroll-area::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark .scroll-area::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .scroll-area::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>