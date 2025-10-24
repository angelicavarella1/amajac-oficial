<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Cabeçalho -->
    <header class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-40">
      <div class="container mx-auto px-4">
        <nav class="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
          <!-- Logo e Nome -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg overflow-hidden">
              <img 
                :src="logoImageUrl" 
                alt="Logo AMAJAC" 
                class="w-full h-full object-cover"
                v-if="!logoLoading && !logoError"
              />
              <div v-else-if="logoLoading" class="w-full h-full bg-gray-300 animate-pulse"></div>
              <div v-else class="w-full h-full bg-red-100 flex items-center justify-center">
                <span class="text-red-500 text-xs">Erro</span>
              </div>
            </div>
            <router-link to="/" class="text-green-600 dark:text-green-400 font-bold text-xl">
              {{ safeString(configuracoesStore.site?.site_nome || 'AMAJAC') }}
            </router-link>
          </div>

          <!-- Menu Desktop -->
          <div class="hidden md:flex space-x-5">
            <router-link to="/" class="text-green-600 dark:text-green-400 font-semibold">Início</router-link>
            <a href="#quem-somos" @click.prevent="scrollToSection('#quem-somos')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Quem Somos</a>
            <a href="#galeria" @click.prevent="scrollToSection('#galeria')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Galeria</a>
            <a href="#eventos" @click.prevent="scrollToSection('#eventos')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Eventos</a>
            <a href="#noticias" @click.prevent="scrollToSection('#noticias')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Notícias</a>
            <a href="#classificados" @click.prevent="scrollToSection('#classificados')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Classificados</a>
            <a href="#colaboradores" @click.prevent="scrollToSection('#colaboradores')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Parceiros</a>
            <a href="#contato" @click.prevent="scrollToFooter" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Contato</a>
          </div>

          <div class="flex items-center space-x-3">
            <DarkModeToggle />
            <button @click="uiStore.toggleMobileMenu" class="md:hidden text-gray-700 dark:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </nav>

        <!-- Linha 2: Info e Botões COM RELÓGIO AUMENTADO -->
        <div class="hidden md:flex justify-between items-center py-2">
          <div class="flex items-center gap-6">
            <!-- RELÓGIO AUMENTADO E CORRIGIDO -->
            <div v-if="configuracoesStore.sistema?.info_relogio_ativado === 'true'" 
                 class="flex items-center gap-3 text-lg font-bold text-gray-700 dark:text-gray-300">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-mono text-xl bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600">
                {{ horaAtual }}
              </span>
            </div>
            
            <!-- Previsão do Tempo -->
            <WeatherInfo v-if="configuracoesStore.sistema?.info_clima_ativado === 'true'" />
          </div>

          <div class="flex items-center space-x-2">
            <a href="https://associacoes.softaliza.com.br/amajac" target="_blank" class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-md hover:bg-green-700 transition-colors">
              ASSOCIADO
            </a>
            <a href="https://sosjacapp.amajac.org.br" target="_blank" class="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-700 transition-colors">
              SOSJAC
            </a>
            <a :href="adminUrl" target="_blank" class="px-4 py-2 bg-gray-700 text-white text-sm font-bold rounded-md hover:bg-gray-800 transition-colors">
              ÁREA RESTRITA
            </a>
          </div>
        </div>

        <!-- Menu Mobile COM RELÓGIO -->
        <div v-if="uiStore.mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col space-y-3">
            <router-link to="/" class="text-green-600 dark:text-green-400 font-semibold" @click="uiStore.closeMobileMenu">Início</router-link>
            <a href="#quem-somos" @click.prevent="scrollToSection('#quem-somos', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Quem Somos</a>
            <a href="#galeria" @click.prevent="scrollToSection('#galeria', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Galeria</a>
            <a href="#eventos" @click.prevent="scrollToSection('#eventos', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Eventos</a>
            <a href="#noticias" @click.prevent="scrollToSection('#noticias', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Notícias</a>
            <a href="#classificados" @click.prevent="scrollToSection('#classificados', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Classificados</a>
            <a href="#colaboradores" @click.prevent="scrollToSection('#colaboradores', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Parceiros</a>
            <a href="#contato" @click.prevent="scrollToFooter" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Contato</a>
            
            <!-- Relógio Mobile Aumentado -->
            <div v-if="configuracoesStore.sistema?.info_relogio_ativado === 'true'" 
                 class="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300 pt-4 border-t border-gray-200 dark:border-gray-700">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-mono">{{ horaAtual }}</span>
            </div>

            <div class="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a href="https://associacoes.softaliza.com.br/amajac" target="_blank" class="inline-flex justify-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-md hover:bg-green-700">
                ASSOCIADO
              </a>
              <a href="https://sosjacapp.amajac.org.br" target="_blank" class="inline-flex justify-center px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-700">
                SOSJAC
              </a>
              <a :href="adminUrl" target="_blank" class="inline-flex justify-center px-4 py-2 bg-gray-700 text-white text-sm font-bold rounded-md hover:bg-gray-800">
                ÁREA RESTRITA
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal - COM pt-36 PARA DESCER O BANNER -->
    <main class="pt-36">
      <!-- Banner Hero -->
      <section class="relative h-screen overflow-hidden">
        <div class="absolute inset-0">
          <!-- Loading state para hero -->
          <div v-if="heroLoading" class="w-full h-full bg-gray-300 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <img 
            v-else
            :src="heroImageUrl" 
            :alt="safeString(configuracoesStore.hero?.hero_titulo || 'Bandeira AMAJAC')"
            class="w-full h-full object-cover"
            loading="eager"
          />
          <div v-if="heroError" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <span class="text-red-500 text-lg">Falha ao carregar imagem do banner</span>
          </div>
        </div>
      </section>

      <!-- Conteúdo Abaixo do Banner -->
      <section class="py-16 bg-white dark:bg-gray-800">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl md:text-6xl font-black mb-8 text-green-700 dark:text-green-500 tracking-tight">
            {{ safeString(configuracoesStore.hero?.hero_titulo || 'PORTAL DO MORADOR') }}
          </h1>
          
          <p class="text-2xl md:text-3xl font-bold mb-3 text-green-700 dark:text-green-500">
            {{ safeString(configuracoesStore.hero?.hero_subtitulo || 'Associação de Moradores e Amigos do Jardim Atlântico Central') }}
          </p>
          
          <p class="text-xl mb-6 text-green-700 dark:text-green-500 font-bold">
            {{ safeString(configuracoesStore.hero?.hero_local || 'Jardim Atlântico Central') }}
          </p>
          
          <div class="max-w-3xl mx-auto space-y-6 mb-10">
            <p class="text-xl text-gray-800 dark:text-white font-medium leading-relaxed">
              {{ safeString(configuracoesStore.hero?.hero_descricao || 'Trabalhamos juntos para transformar nosso bairro através de ações coletivas.') }}
            </p>
            <p class="text-xl text-gray-800 dark:text-white font-bold">
              Unindo a comunidade por um bairro melhor.
            </p>
          </div>
          
          <div class="border-t-2 border-green-300 dark:border-green-600 max-w-3xl mx-auto pt-8"></div>
        </div>
      </section>

      <!-- Quem Somos -->
      <section id="quem-somos" class="py-12 bg-white dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">{{ safeString(configuracoesStore.about?.quem_somos_titulo || 'Quem Somos') }}</h2>
            <p class="text-gray-600 dark:text-gray-300">{{ safeString(configuracoesStore.about?.quem_somos_subtitulo || 'Conheça nossa associação e nossa missão') }}</p>
          </div>
          <div class="max-w-4xl mx-auto">
            <div class="mb-8">
              <h3 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">Nossa História</h3>
              <p class="text-gray-700 dark:text-gray-300">
                {{ safeString(configuracoesStore.about?.quem_somos_historia || 'A AMAJAC é uma associação sem fins lucrativos, que há mais de 20 anos tem atuado na defesa dos interesses dos moradores do Jardim Atlântico Central.') }}
              </p>
            </div>

            <div class="md:flex gap-8 items-start">
              <div class="md:w-1/2">
                <h3 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">{{ safeString(configuracoesStore.about?.quem_somos_missao_titulo || 'Nossa Missão') }}</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                  {{ safeString(configuracoesStore.about?.quem_somos_missao || 'Nossa missão principal é atuar como elo entre a comunidade e o Poder Público.') }}
                </p>

                <div v-if="configuracoesStore.about?.quem_somos_valores" class="mt-6">
                  <h4 class="text-xl font-bold text-green-700 dark:text-green-400 mb-3">{{ safeString(configuracoesStore.about?.quem_somos_valores_titulo || 'Nossos Valores') }}</h4>
                  <ul class="space-y-2">
                    <li v-for="(valor, index) in safeArray(configuracoesStore.about.quem_somos_valores.split('\n').filter(v => v.trim()))" 
                        :key="index" 
                        class="flex items-start text-gray-700 dark:text-gray-300">
                      <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      {{ safeString(valor.trim()) }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="md:w-1/2 mt-6 md:mt-0">
                <div class="rounded-lg overflow-hidden shadow-lg">
                  <div class="relative">
                    <div v-if="aboutImageLoading" class="w-full h-64 md:h-80 bg-gray-300 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <img 
                      v-else
                      :src="aboutImageUrl" 
                      :alt="safeString('Comunidade AMAJAC')" 
                      class="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div v-if="aboutImageError" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <span class="text-red-500 text-sm">Falha ao carregar imagem</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="configuracoesStore.about?.quem_somos_estatisticas_familias" class="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div class="text-2xl font-bold text-green-700 dark:text-green-400">{{ safeString(configuracoesStore.about.quem_somos_estatisticas_familias) }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">Famílias Atendidas</div>
                  </div>
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div class="text-2xl font-bold text-green-700 dark:text-green-400">{{ safeString(configuracoesStore.about?.quem_somos_estatisticas_ano || new Date().getFullYear()) }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">Ano de Fundação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Galeria COM PAGINAÇÃO CORRIGIDA -->
      <section v-if="configuracoesStore.sistema?.info_galeria_ativado === 'true'" id="galeria" class="py-12 bg-green-50 dark:bg-green-900/20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Galeria</h2>
            <p class="text-gray-700 dark:text-gray-300">Veja fotos dos nossos eventos e conquistas</p>
          </div>
          
          <!-- Loading State -->
          <div v-if="galeriaStore.loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div v-for="n in 8" :key="n" class="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          
          <!-- Galeria com Paginação -->
          <div v-else-if="galeriaComImagens.length > 0">
            <!-- Grid de Imagens -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div 
                v-for="(foto, index) in imagensPaginadas" 
                :key="foto.id || index" 
                class="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer relative"
                @click="abrirPreview(foto)"
              >
                <div class="image-wrapper w-full h-full">
                  <img 
                    v-if="!foto.imageState?.loading && !foto.imageState?.error"
                    :src="foto.imageState?.imageUrl" 
                    :alt="safeString(foto.titulo || `Imagem ${index + 1}`)" 
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    :loading="index < 4 ? 'eager' : 'lazy'"
                    @load="foto.imageState?.lazyLoad"
                  />
                  <div v-else-if="foto.imageState?.loading" class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div v-else-if="foto.imageState?.error" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <span class="text-red-500 text-xs">Falha ao carregar</span>
                  </div>
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <i class="fas fa-search-plus text-white text-2xl opacity-0 hover:opacity-100 transition-opacity"></i>
                </div>
              </div>
            </div>
            
            <!-- Paginação -->
            <div v-if="totalPaginas > 1" class="flex justify-center items-center gap-4 mt-8">
              <button 
                @click="paginaAnterior"
                :disabled="paginaAtual === 1"
                class="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <i class="fas fa-chevron-left"></i>
                Anterior
              </button>
              
              <span class="text-gray-700 dark:text-gray-300 font-medium">
                Página {{ paginaAtual }} de {{ totalPaginas }}
              </span>
              
              <button 
                @click="proximaPagina"
                :disabled="paginaAtual === totalPaginas"
                class="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                Próxima
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Galeria vazia</h3>
              <p class="text-gray-500 dark:text-gray-400">Em breve teremos fotos dos nossos eventos!</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Eventos -->
      <section v-if="configuracoesStore.sistema?.info_eventos_ativado === 'true'" id="eventos" class="py-12 bg-white dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Eventos</h2>
            <p class="text-gray-600 dark:text-gray-300">Participe dos eventos da nossa comunidade</p>
          </div>
          
          <div v-if="eventosStore.loading" class="max-w-2xl mx-auto space-y-4">
            <div v-for="n in 3" :key="n" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-500 animate-pulse">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-full"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>

          <div v-else-if="eventosComImagens.length > 0" class="max-w-2xl mx-auto space-y-4">
            <div 
              v-for="evento in safeArray(eventosComImagens)" 
              :key="evento.id" 
              class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow cursor-pointer"
              @click="verEvento(evento)"
            >
              <div v-if="evento.imagem_url" class="mb-4 rounded-lg overflow-hidden">
                <div class="relative h-40">
                  <div class="image-wrapper w-full h-full">
                    <img 
                      v-if="!evento.imageState?.loading && !evento.imageState?.error"
                      :src="evento.imageState?.imageUrl" 
                      :alt="safeString(evento.titulo)" 
                      class="w-full h-full object-cover"
                      @load="evento.imageState?.lazyLoad"
                    />
                    <div v-else-if="evento.imageState?.loading" class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div v-else-if="evento.imageState?.error" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <span class="text-red-500 text-sm">Falha ao carregar imagem</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-2">{{ safeString(evento.titulo) }}</h4>
              <p class="text-gray-600 dark:text-gray-300 mb-3">{{ safeString(evento.descricao) }}</p>
              <div class="text-sm text-green-700 dark:text-green-400 font-semibold">
                {{ formatarDataHora(evento.data_hora_evento) }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <i class="fas fa-map-marker-alt mr-2"></i>
                {{ safeString(evento.local) }}
              </div>
              
              <div class="mt-4">
                <router-link 
                  :to="`/eventos/${evento.id}`"
                  class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <span>Ver Detalhes</span>
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Nenhum evento agendado</h3>
              <p class="text-gray-500 dark:text-gray-400">Fique atento para os próximos eventos!</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Notícias -->
      <section v-if="configuracoesStore.sistema?.info_noticias_ativado === 'true'" id="noticias" class="py-12 bg-gray-50 dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Notícias</h2>
            <p class="text-gray-600 dark:text-gray-300">Fique por dentro das novidades</p>
          </div>
          
          <div v-if="noticiasStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 3" :key="n" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>

          <div v-else-if="noticiasComImagens.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article 
              v-for="(noticia, index) in safeArray(noticiasComImagens)" 
              :key="noticia.id" 
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              @click="verNoticia(noticia)"
            >
              <div class="h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                <div class="image-wrapper w-full h-full">
                  <img 
                    v-if="!noticia.imageState?.loading && !noticia.imageState?.error"
                    :src="noticia.imageState?.imageUrl" 
                    :alt="safeString(noticia.titulo)" 
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    :loading="index < 2 ? 'eager' : 'lazy'"
                    @load="noticia.imageState?.lazyLoad"
                  />
                  <div v-else-if="noticia.imageState?.loading" class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div v-else-if="noticia.imageState?.error" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <span class="text-red-500 text-sm">Falha ao carregar imagem</span>
                  </div>
                </div>
              </div>
              
              <div class="p-4">
                <div class="text-sm text-green-700 dark:text-green-400 mb-2">
                  {{ noticia.dataFormatada }}
                </div>
                
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                  {{ noticia.tituloSeguro }}
                </h3>
                
                <p class="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                  {{ safeString(noticia.resumo || noticia.conteudo || 'Sem descrição disponível.') }}
                </p>
                
                <div class="text-green-700 dark:text-green-400 font-semibold hover:underline inline-flex items-center">
                  Ler mais 
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="text-center py-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m0 0V6a2 2 0 012-2h2a2 2 0 012 2v3m0 0v3"/>
              </svg>
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nenhuma notícia encontrada
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                Aguardem as próximas novidades!
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Classificados -->
      <section v-if="configuracoesStore.sistema?.info_classificados_ativado === 'true'" id="classificados" class="py-12 bg-white dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Serviços dos Associados</h2>
            <p class="text-gray-600 dark:text-gray-300">Encontre profissionais qualificados da nossa comunidade</p>
          </div>

          <!-- Filtros Rápidos -->
          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <button
              v-for="categoria in categoriasPrincipais"
              :key="categoria.id"
              @click="filtrarPorCategoria(categoria.id)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                filtroCategoria === categoria.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20'
              ]"
            >
              <i :class="categoria.icon" class="mr-2"></i>
              {{ categoria.nome }}
            </button>
            <button
              @click="limparFiltro"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                filtroCategoria === null
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20'
              ]"
            >
              <i class="fas fa-times mr-2"></i>
              Limpar Filtro
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="classificadosStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-l-4 border-green-500 animate-pulse">
              <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-3 w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-1/2"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3 w-full"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
            </div>
          </div>

          <!-- Classificados -->
          <div v-else-if="classificadosFiltrados.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article 
              v-for="servico in classificadosFiltrados.slice(0, 6)" 
              :key="servico.id" 
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <!-- Cabeçalho do Serviço -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <i :class="getCategoriaIcon(servico.categoria_id)" class="text-green-600 dark:text-green-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white line-clamp-2">{{ safeString(servico.titulo) }}</h3>
                    <span class="text-sm text-green-600 dark:text-green-400 font-medium">
                      {{ getCategoriaNome(servico.categoria_id) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Descrição -->
              <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {{ safeString(servico.descricao) }}
              </p>

              <!-- Informações do Prestador -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <i class="fas fa-user mr-2 text-green-600 dark:text-green-400"></i>
                  <span class="font-medium">{{ safeString(servico.associado_nome) }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <i class="fas fa-phone mr-2 text-green-600 dark:text-green-400"></i>
                  <span>{{ formatarTelefoneDisplay(servico.telefone) }}</span>
                </div>
                <div v-if="servico.avaliacao_media" class="flex items-center text-sm">
                  <div class="flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    <span class="font-medium text-gray-700 dark:text-gray-300">{{ servico.avaliacao_media }}</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">({{ servico.total_avaliacoes || 0 }})</span>
                  </div>
                </div>
              </div>

              <!-- Ações -->
              <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                <button 
                  @click="contatarServico(servico)"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <i class="fas fa-phone mr-2"></i>
                  Contatar
                </button>
                <button 
                  @click="abrirModalAvaliacao(servico)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <i class="fas fa-star mr-2"></i>
                  Avaliar
                </button>
              </div>
            </article>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <i class="fas fa-tools text-4xl text-gray-400 mb-4"></i>
              <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {{ filtroCategoria ? 'Nenhum serviço nesta categoria' : 'Nenhum serviço disponível' }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-6">
                {{ filtroCategoria ? 'Tente outra categoria ou verifique novamente em breve.' : 'Seja o primeiro a anunciar seu serviço!' }}
              </p>
              <button 
                @click="abrirModalAssociado"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
              >
                <i class="fas fa-user-plus mr-2"></i>
                Tornar-se Associado
              </button>
            </div>
          </div>

          <!-- Ver Mais -->
          <div v-if="classificadosFiltrados.length > 6" class="text-center mt-8">
            <button 
              @click="verMaisClassificados"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              <i class="fas fa-eye mr-2"></i>
              Ver Todos os Serviços
            </button>
          </div>
        </div>
      </section>

      <!-- Parceiros Comerciais -->
      <section v-if="configuracoesStore.sistema?.info_colaboradores_ativado === 'true'" id="colaboradores" class="py-12 bg-gray-50 dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Parceiros Comerciais</h2>
            <p class="text-gray-600 dark:text-gray-300">Conheça nossos parceiros e estabelecimentos locais</p>
          </div>
          
          <!-- Lista de Parceiros -->
          <div v-if="colaboradoresStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div class="h-48 bg-gray-300 dark:bg-gray-700"></div>
              <div class="p-6 space-y-3">
                <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          
          <div v-else-if="parceirosComImagens.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="parceiro in parceirosComImagens"
              :key="parceiro.id"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-600 cursor-pointer"
              @click="verParceiro(parceiro)"
            >
              <div class="h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center p-4 relative">
                <div class="image-wrapper w-full h-full">
                  <img
                    v-if="!parceiro.imageState?.loading && !parceiro.imageState?.error"
                    :src="parceiro.imageState?.imageUrl"
                    :alt="parceiro.texto_alternativo || `Logo ${parceiro.nome}`"
                    class="max-w-full max-h-full object-contain"
                    @load="parceiro.imageState?.lazyLoad"
                  />
                  <div v-else-if="parceiro.imageState?.loading" class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div v-else-if="parceiro.imageState?.error" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <span class="text-red-500 text-sm">Falha ao carregar logo</span>
                  </div>
                </div>
              </div>

              <!-- Conteúdo -->
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                  {{ parceiro.nome }}
                </h3>
                
                <div v-if="parceiro.ramo" class="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                  <i class="fas fa-store mr-2 text-sm"></i>
                  <span class="text-sm font-medium">{{ parceiro.ramo }}</span>
                </div>

                <!-- Descrição -->
                <p v-if="parceiro.descricao" class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {{ parceiro.descricao }}
                </p>

                <!-- Informações de Contato -->
                <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <!-- Telefone -->
                  <div v-if="parceiro.telefone" class="flex items-center">
                    <i class="fas fa-phone mr-2 w-4 text-green-600 dark:text-green-400"></i>
                    <a 
                      :href="`tel:${parceiro.telefone}`"
                      class="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      @click.stop
                    >
                      {{ formatarTelefoneDisplay(parceiro.telefone) }}
                    </a>
                  </div>

                  <!-- Endereço -->
                  <div v-if="parceiro.endereco" class="flex items-start">
                    <i class="fas fa-map-marker-alt mr-2 mt-0.5 w-4 text-green-600 dark:text-green-400"></i>
                    <span class="line-clamp-2">{{ parceiro.endereco }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <i class="fas fa-store text-4xl text-gray-400 mb-4"></i>
              <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nenhum parceiro comercial
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                Em breve teremos parceiros comerciais!
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Rodapé -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-8">
        <div class="grid md:grid-cols-3 gap-8">
          
          <!-- Coluna 1: Logo e Descrição -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg overflow-hidden">
                <img 
                  :src="logoImageUrl" 
                  alt="Logo AMAJAC" 
                  class="w-full h-full object-cover"
                  v-if="!logoLoading && !logoError"
                />
                <div v-else-if="logoLoading" class="w-full h-full bg-gray-300 animate-pulse"></div>
                <div v-else class="w-full h-full bg-red-100 flex items-center justify-center">
                  <span class="text-red-500 text-xs">Erro</span>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ safeString(configuracoesStore.site?.site_nome || 'AMAJAC') }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  {{ safeString(configuracoesStore.site?.site_descricao || 'Associação de Moradores e Amigos do Jardim Atlântico Central') }}
                </p>
              </div>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              {{ safeString(configuracoesStore.hero?.hero_descricao || 'Unindo a comunidade por um bairro melhor. Trabalhamos juntos para transformar nosso bairro através de ações coletivas.') }}
            </p>
          </div>

          <!-- Coluna 2: Navegação -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white">Navegação</h4>
            <nav class="grid grid-cols-2 gap-2">
              <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                Início
              </router-link>
              <a href="#quem-somos" @click.prevent="scrollToSection('#quem-somos')" class="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                Quem Somos
              </a>
              <a href="#noticias" @click.prevent="scrollToSection('#noticias')" class="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                Notícias
              </a>
              <a href="#eventos" @click.prevent="scrollToSection('#eventos')" class="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                Eventos
              </a>
              <a href="#galeria" @click.prevent="scrollToSection('#galeria')" class="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                Galeria
              </a>
              <a href="#colaboradores" @click.prevent="scrollToSection('#colaboradores')" class="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                Parceiros
              </a>
              <a href="#classificados" @click.prevent="scrollToSection('#classificados')" class="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                Classificados
              </a>
              <a href="#contato" @click.prevent="scrollToFooter" class="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                Contato
              </a>
            </nav>
          </div>

          <!-- Coluna 3: Contato Rápido -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white">Contato Rápido</h4>
            <ul class="space-y-3">
              <li class="flex items-start">
                <i class="fas fa-map-marker-alt text-green-600 dark:text-green-400 mr-3 mt-1"></i>
                <span class="text-gray-600 dark:text-gray-300 text-sm">{{ safeString(configuracoesStore.contato?.endereco || 'Rua Izabel Cristina Ouvina, 112 - Jardim Atlântico Central, Maricá - RJ') }}</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-phone-alt text-green-600 dark:text-green-400 mr-3 mt-1"></i>
                <span class="text-gray-600 dark:text-gray-300 text-sm">{{ safeString(configuracoesStore.contato?.telefone_contato || '(21) 97897-9840') }}</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-envelope text-green-600 dark:text-green-400 mr-3 mt-1"></i>
                <span class="text-gray-600 dark:text-gray-300 text-sm">{{ safeString(configuracoesStore.contato?.email_contato || 'comunicacao@amajac.org.br') }}</span>
              </li>
            </ul>
            
            <!-- Botão para abrir modal de contato -->
            <button 
              @click="abrirModalContato"
              class="w-full bg-green-600 text-white py-2 px-4 rounded font-semibold hover:bg-green-700 transition-colors mt-4"
            >
              <i class="fas fa-paper-plane mr-2"></i>
              Enviar Mensagem
            </button>
          </div>
        </div>
      </div>
      
      <!-- Rodapé inferior -->
      <div class="bg-gray-100 dark:bg-gray-900 py-4">
        <div class="container mx-auto px-4 text-center">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {{ new Date().getFullYear() }} {{ safeString(configuracoesStore.site?.site_nome || 'AMAJAC') }}. Todos os direitos reservados.
          </p>
          <p class="mt-1 text-gray-700 dark:text-gray-300 text-sm">
            Desenvolvido com ❤️ por 
            <span class="text-green-600 dark:text-green-400 font-semibold">Angelica Varella</span>
            <br>
            <span class="text-green-700 dark:text-green-500">Front-end Developer & UI/UX Designer</span>
          </p>
        </div>
      </div>
    </footer>

    <!-- ✅ MODAL DE PREVIEW PARA GALERIA CORRIGIDO -->
    <div v-if="previewImageData" class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div class="relative max-w-4xl max-h-full w-full">
        <!-- Botão Fechar -->
        <button 
          @click="fecharPreview"
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
        
        <!-- Botões Navegação -->
        <button 
          v-if="temImagemAnterior"
          @click="imagemAnterior"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
        >
          <i class="fas fa-chevron-left text-xl"></i>
        </button>
        
        <button 
          v-if="temProximaImagem"
          @click="proximaImagem"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
        >
          <i class="fas fa-chevron-right text-xl"></i>
        </button>
        
        <!-- Conteúdo do Modal -->
        <div class="bg-gray-900 rounded-lg overflow-hidden">
          <!-- Imagem do Modal -->
          <div class="flex items-center justify-center min-h-[400px] max-h-[70vh] p-4">
            <!-- Loading -->
            <div v-if="previewLoading" class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p class="text-white text-sm">Carregando imagem...</p>
            </div>
            
            <!-- Imagem CORRIGIDA -->
            <div v-else-if="!previewError" class="w-full h-full flex items-center justify-center">
              <img
                :src="previewImageData.imageState?.imageUrl || previewImageData.imagem_url"
                :alt="previewImageData.titulo || 'Imagem da galeria'"
                class="max-w-full max-h-full object-contain"
                @load="previewLoaded"
                @error="previewErro"
              />
            </div>
            
            <!-- Error -->
            <div v-else class="text-center text-white">
              <i class="fas fa-exclamation-triangle text-3xl text-red-400 mb-2"></i>
              <p class="text-red-400">Falha ao carregar imagem</p>
              <p class="text-gray-400 text-sm mt-2">URL: {{ previewImageData.imagem_url }}</p>
            </div>
          </div>
          
          <!-- Informações da Imagem -->
          <div v-if="previewImageData && !previewError" class="p-6 bg-gray-800">
            <h3 class="text-xl font-semibold text-white mb-2">{{ previewImageData.titulo || 'Sem título' }}</h3>
            <p v-if="previewImageData.descricao" class="text-gray-300 text-sm mb-3">
              {{ previewImageData.descricao }}
            </p>
            <div class="flex justify-between items-center text-xs text-gray-400">
              <span>{{ formatarData(previewImageData.created_at) }}</span>
              <span v-if="previewImageData.categoria" class="bg-gray-700 px-3 py-1 rounded">
                {{ previewImageData.categoria }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Avaliação -->
    <div v-if="showModalAvaliacao" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-green-600 text-white p-6 flex-shrink-0">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold">Avaliar Serviço</h2>
              <p class="text-green-100 mt-1">Avalie: {{ servicoSelecionado?.titulo }}</p>
            </div>
            <button 
              @click="fecharModalAvaliacao"
              class="text-white hover:text-green-200 transition-colors p-2 rounded-full hover:bg-green-700"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto flex-1">
          <form @submit.prevent="enviarAvaliacao" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sua Avaliação (1-5 estrelas) *
              </label>
              <div class="flex space-x-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="formAvaliacao.nota = star"
                  class="text-2xl focus:outline-none transition-transform hover:scale-110"
                  :class="star <= formAvaliacao.nota ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </button>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Nota selecionada: {{ formAvaliacao.nota }}/5
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu nome *
              </label>
              <input 
                v-model="formAvaliacao.avaliador_nome"
                type="text" 
                required 
                placeholder="Digite seu nome"
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comentário (opcional)
              </label>
              <textarea 
                v-model="formAvaliacao.comentario"
                rows="3" 
                placeholder="Deixe um comentário sobre o serviço..."
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors resize-vertical"
              ></textarea>
            </div>
          </form>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          <button 
            type="submit" 
            :disabled="loadingAvaliacao || formAvaliacao.nota === 0"
            @click="enviarAvaliacao"
            class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="loadingAvaliacao" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>{{ loadingAvaliacao ? 'Enviando...' : 'Enviar Avaliação' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Contato -->
    <div v-if="showModalContato" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-green-600 text-white p-6 flex-shrink-0">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold">Enviar Mensagem</h2>
              <p class="text-green-100 mt-1">Entre em contato conosco</p>
            </div>
            <button 
              @click="fecharModalContato"
              class="text-white hover:text-green-200 transition-colors p-2 rounded-full hover:bg-green-700"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto flex-1">
          <form @submit.prevent="enviarMensagemContato" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu nome *
              </label>
              <input 
                v-model="formContato.nome"
                type="text" 
                required 
                placeholder="Digite seu nome completo"
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu email *
              </label>
              <input 
                v-model="formContato.email"
                type="email" 
                required 
                placeholder="seu@email.com"
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assunto *
              </label>
              <select 
                v-model="formContato.assunto"
                required
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
              >
                <option value="" class="text-gray-500 dark:text-gray-400">Selecione o assunto</option>
                <option value="duvida" class="text-gray-800 dark:text-white">Dúvida</option>
                <option value="sugestao" class="text-gray-800 dark:text-white">Sugestão</option>
                <option value="reclamacao" class="text-gray-800 dark:text-white">Reclamação</option>
                <option value="classificado" class="text-gray-800 dark:text-white">Classificado</option>
                <option value="associacao" class="text-gray-800 dark:text-white">Associação</option>
                <option value="evento" class="text-gray-800 dark:text-white">Evento</option>
                <option value="outro" class="text-gray-800 dark:text-white">Outro</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sua mensagem *
              </label>
              <textarea 
                v-model="formContato.mensagem"
                rows="4" 
                required 
                placeholder="Digite sua mensagem..."
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors resize-vertical"
              ></textarea>
            </div>
          </form>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          <button 
            type="submit" 
            :disabled="loadingContato"
            @click="enviarMensagemContato"
            class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="loadingContato" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>{{ loadingContato ? 'Enviando...' : 'Enviar Mensagem' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast/Notificação -->
    <div v-if="uiStore.toast.show" 
      class="fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50 transition-all duration-300"
      :class="{
        'bg-green-600': uiStore.toast.type === 'success',
        'bg-red-600': uiStore.toast.type === 'error',
        'bg-blue-600': uiStore.toast.type === 'info'
      }">
      {{ uiStore.toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useConfiguracoesStore } from '@/stores/configuracoes'
import { useUIStore } from '@/stores/ui'
import { useClassificadosStore } from '@/stores/classificados'
import { useNoticiasStore } from '@/stores/noticias'
import { useEventosStore } from '@/stores/eventos'
import { useColaboradoresStore } from '@/stores/colaboradores'
import { useGaleriaStore } from '@/stores/galeria'
import { useSafeImage } from '@/composables/useSafeImage'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import WeatherInfo from '@/components/WeatherInfo.vue'

const router = useRouter()
const configuracoesStore = useConfiguracoesStore()
const uiStore = useUIStore()
const classificadosStore = useClassificadosStore()
const noticiasStore = useNoticiasStore()
const eventosStore = useEventosStore()
const colaboradoresStore = useColaboradoresStore()
const galeriaStore = useGaleriaStore()

// ✅ VARIÁVEIS DE PAGINAÇÃO PARA GALERIA
const paginaAtual = ref(1)
const imagensPorPagina = ref(20) // Ajuste conforme necessidade

// ✅ COMPUTED PROPERTIES PARA PAGINAÇÃO
const totalPaginas = computed(() => {
  return Math.ceil(galeriaComImagens.value.length / imagensPorPagina.value)
})

const imagensPaginadas = computed(() => {
  const startIndex = (paginaAtual.value - 1) * imagensPorPagina.value
  const endIndex = startIndex + imagensPorPagina.value
  return galeriaComImagens.value.slice(startIndex, endIndex)
})

// ✅ MÉTODOS DE PAGINAÇÃO
const proximaPagina = () => {
  if (paginaAtual.value < totalPaginas.value) {
    paginaAtual.value++
    // Rolagem suave para o topo da galeria
    const galeriaSection = document.getElementById('galeria')
    if (galeriaSection) {
      galeriaSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

const paginaAnterior = () => {
  if (paginaAtual.value > 1) {
    paginaAtual.value--
    // Rolagem suave para o topo da galeria
    const galeriaSection = document.getElementById('galeria')
    if (galeriaSection) {
      galeriaSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// ✅ VARIÁVEIS DO MODAL DE PREVIEW
const previewImageData = ref(null)
const previewLoading = ref(false)
const previewError = ref(false)
const indicePreview = ref(0)

// ✅ COMPUTED PROPERTIES PARA NAVEGAÇÃO
const temImagemAnterior = computed(() => {
  if (!previewImageData.value) return false
  const currentIndex = galeriaComImagens.value.findIndex(img => img.id === previewImageData.value.id)
  return currentIndex > 0
})

const temProximaImagem = computed(() => {
  if (!previewImageData.value) return false
  const currentIndex = galeriaComImagens.value.findIndex(img => img.id === previewImageData.value.id)
  return currentIndex < galeriaComImagens.value.length - 1
})

// ✅ MÉTODOS DO MODAL DE PREVIEW CORRIGIDOS
function abrirPreview(imagem) {
  previewImageData.value = imagem
  previewLoading.value = true
  previewError.value = false
  
  const index = galeriaComImagens.value.findIndex(img => img.id === imagem.id)
  indicePreview.value = index
  
  console.log('🖼️ Preview aberto:', imagem.titulo, 'Índice:', index, 'Total:', galeriaComImagens.value.length)
  
  // Forçar o carregamento da imagem
  if (imagem.imageState?.imageUrl || imagem.imagem_url) {
    const imgUrl = imagem.imageState?.imageUrl || imagem.imagem_url
    const img = new Image()
    img.onload = () => {
      previewLoading.value = false
    }
    img.onerror = () => {
      previewLoading.value = false
      previewError.value = true
    }
    img.src = imgUrl
  } else {
    previewLoading.value = false
    previewError.value = true
  }
}

function fecharPreview() {
  previewImageData.value = null
  previewLoading.value = false
  previewError.value = false
}

function previewLoaded() {
  previewLoading.value = false
}

function previewErro() {
  previewLoading.value = false
  previewError.value = true
}

function imagemAnterior() {
  if (temImagemAnterior.value) {
    indicePreview.value--
    const novaImagem = galeriaComImagens.value[indicePreview.value]
    abrirPreview(novaImagem)
  }
}

function proximaImagem() {
  if (temProximaImagem.value) {
    indicePreview.value++
    const novaImagem = galeriaComImagens.value[indicePreview.value]
    abrirPreview(novaImagem)
  }
}

// ✅ NAVEGAÇÃO POR TECLADO
const handleKeydown = (event) => {
  if (!previewImageData.value) return
  
  switch (event.key) {
    case 'Escape':
      fecharPreview()
      break
    case 'ArrowLeft':
      if (temImagemAnterior.value) {
        event.preventDefault()
        imagemAnterior()
      }
      break
    case 'ArrowRight':
      if (temProximaImagem.value) {
        event.preventDefault()
        proximaImagem()
      }
      break
  }
}

// ✅ FUNÇÃO PARA EVENTOS
function verEvento(evento) {
  if (evento && evento.id) {
    router.push(`/eventos/${evento.id}`)
  }
}

// ✅ FUNÇÃO PARA PARCEIROS
function verParceiro(parceiro) {
  console.log('Ver parceiro:', parceiro.nome)
  uiStore.showToast(`Visualizando ${parceiro.nome}`, 'info')
}

// ✅ useSafeImage para imagens principais
const { 
  imageUrl: heroImageUrl, 
  loading: heroLoading, 
  error: heroError,
  setUrl: setHeroUrl 
} = useSafeImage()

const { 
  imageUrl: logoImageUrl, 
  loading: logoLoading,
  error: logoError,
  setUrl: setLogoUrl 
} = useSafeImage()

const { 
  imageUrl: aboutImageUrl, 
  loading: aboutImageLoading, 
  error: aboutImageError,
  setUrl: setAboutUrl 
} = useSafeImage()

// ✅ Estados para o modal de avaliação
const showModalAvaliacao = ref(false)
const servicoSelecionado = ref(null)
const loadingAvaliacao = ref(false)
const loadingContato = ref(false)

// ✅ Formulário de avaliação
const formAvaliacao = reactive({
  nota: 0,
  avaliador_nome: '',
  comentario: ''
})

// ✅ Interval do relógio como ref
const relogioInterval = ref(null)

// ✅ FUNÇÕES PARA O MODAL DE AVALIAÇÃO
const abrirModalAvaliacao = (servico) => {
  servicoSelecionado.value = servico
  showModalAvaliacao.value = true
}

const fecharModalAvaliacao = () => {
  showModalAvaliacao.value = false
  servicoSelecionado.value = null
  formAvaliacao.nota = 0
  formAvaliacao.avaliador_nome = ''
  formAvaliacao.comentario = ''
}

const enviarAvaliacao = async () => {
  if (formAvaliacao.nota === 0) {
    uiStore.showToast('Por favor, selecione uma nota', 'error')
    return
  }

  if (!formAvaliacao.avaliador_nome.trim()) {
    uiStore.showToast('Por favor, informe seu nome', 'error')
    return
  }

  loadingAvaliacao.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    uiStore.showToast(`Avaliação enviada para ${servicoSelecionado.value.titulo}!`, 'success')
    fecharModalAvaliacao()
  } catch (error) {
    uiStore.showToast('Erro ao enviar avaliação. Tente novamente.', 'error')
  } finally {
    loadingAvaliacao.value = false
  }
}

// URL dinâmica para o dashboard
const adminUrl = import.meta.env.DEV 
  ? 'http://localhost:5173/admin' 
  : 'https://amajac.org.br/admin'

// Variáveis reativas
const horaAtual = ref('')
const showModalAssociado = ref(false)
const showModalContato = ref(false)
const loadingAssociado = ref(false)
const filtroCategoria = ref(null)
const filtroRamoParceiro = ref(null)

// Categorias de serviços para filtros
const categoriasPrincipais = ref([
  { id: 1, nome: 'Cuidados Domiciliares', icon: 'fas fa-home-heart' },
  { id: 2, nome: 'Cuidador de Pessoas', icon: 'fas fa-user-nurse' },
  { id: 6, nome: 'Manutenção Elétrica', icon: 'fas fa-bolt' },
  { id: 7, nome: 'Manutenção Hidráulica', icon: 'fas fa-faucet' },
  { id: 10, nome: 'Faxina Completa', icon: 'fas fa-broom' },
  { id: 9, nome: 'Jardinagem', icon: 'fas fa-leaf' }
])

// Formulário de Associado
const formAssociado = reactive({
  nome: '',
  cpf: '',
  rg: '',
  data_nascimento: '',
  estado_civil: '',
  nacionalidade: 'Brasileira',
  telefone: '',
  email: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: 'Jardim Atlântico Central',
  cidade: 'Maricá',
  estado: 'RJ',
  profissao: '',
  local_trabalho: '',
  aceitou_termos: false
})

// Formulário de Contato
const formContato = reactive({
  nome: '',
  email: '',
  assunto: '',
  mensagem: ''
})

// ✅ Estados reativos para imagens dinâmicas
const noticiasComImagens = ref([])
const galeriaComImagens = ref([])
const eventosComImagens = ref([])
const parceirosComImagens = ref([])

// ✅ CORREÇÃO: REGISTRAR onUnmounted ANTES DE QUALQUER OPERAÇÃO ASSÍNCRONA
onUnmounted(() => {
  if (relogioInterval.value) {
    clearInterval(relogioInterval.value)
    relogioInterval.value = null
  }
  document.removeEventListener('keydown', handleKeydown)
})

// ✅ FUNÇÕES DE SEGURANÇA
const safeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>"']/g, '').trim()
}

const safeArray = (arr) => {
  if (!Array.isArray(arr)) return []
  return arr
}

// ✅ WATCHERS para inicializar useSafeImage quando os dados chegarem
watch(() => noticiasStore.noticiasHome, (noticias) => {
  if (noticias && noticias.length > 0) {
    noticiasComImagens.value = noticias.slice(0, 6).map(noticia => {
      const imageState = useSafeImage(noticia.imagem_url || '')
      return {
        ...noticia,
        tituloSeguro: safeString(noticia.titulo || 'Sem título'),
        dataFormatada: formatarData(noticia.data_publicacao),
        imageState
      }
    })
  }
})

// ✅ CORREÇÃO CRÍTICA: Usar TODAS as imagens sem limitar
watch(() => galeriaStore.imagens, (imagens) => {
  if (imagens && imagens.length > 0) {
    galeriaComImagens.value = imagens.map(imagem => {
      const imageState = useSafeImage(imagem.imagem_url || '')
      return {
        ...imagem,
        imageState
      }
    })
  }
})

watch(() => eventosStore.eventosFuturos, (eventos) => {
  if (eventos && eventos.length > 0) {
    eventosComImagens.value = eventos.slice(0, 3).map(evento => {
      const imageState = useSafeImage(evento.imagem_url || '')
      return {
        ...evento,
        imageState
      }
    })
  }
})

watch(() => colaboradoresStore.parceirosAtivos, (parceiros) => {
  if (parceiros && parceiros.length > 0) {
    parceirosComImagens.value = parceiros.map(parceiro => {
      const imageState = useSafeImage(parceiro.logo_url || '')
      return {
        ...parceiro,
        imageState
      }
    })
  }
})

// ✅ CLASSIFICADOS FILTRADOS
const classificadosFiltrados = computed(() => {
  const classificados = classificadosStore.classificados || []
  
  if (!filtroCategoria.value) {
    return classificados
  }
  
  return classificados.filter(servico => 
    servico.categoria_id === filtroCategoria.value
  )
})

// ✅ PARCEIROS FILTRADOS
const parceirosFiltrados = computed(() => {
  return parceirosComImagens.value
})

// ✅ CORREÇÃO: Funções de formatação de data
const formatarDataHora = (dataHoraString) => {
  if (!dataHoraString) return 'Data não informada'
  try {
    const data = new Date(dataHoraString)
    if (isNaN(data.getTime())) return 'Data inválida'
    
    return data.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Data inválida'
  }
}

const formatarData = (dataHoraString) => {
  if (!dataHoraString) return 'Data não informada'
  try {
    const data = new Date(dataHoraString)
    if (isNaN(data.getTime())) return 'Data inválida'
    
    return data.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'Data inválida'
  }
}

const formatarTelefoneDisplay = (telefone) => {
  if (!telefone) return 'Não informado'
  return telefone
}

// ✅ FUNÇÕES PARA CLASSIFICADOS
const filtrarPorCategoria = (categoriaId) => {
  filtroCategoria.value = categoriaId
}

const limparFiltro = () => {
  filtroCategoria.value = null
}

const contatarServico = (servico) => {
  if (servico.telefone) {
    const numeroLimpo = servico.telefone.replace(/\D/g, '')
    const urlWhatsapp = `https://wa.me/55${numeroLimpo}?text=Olá ${servico.associado_nome}, vi seu serviço "${servico.titulo}" no site da AMAJAC e gostaria de mais informações.`
    window.open(urlWhatsapp, '_blank')
  } else {
    uiStore.showToast('Telefone não disponível para contato', 'error')
  }
}

const verMaisClassificados = () => {
  scrollToSection('#classificados')
}

// ✅ FUNÇÕES PARA CATEGORIAS
const getCategoriaIcon = (categoriaId) => {
  const categoria = categoriasPrincipais.value.find(c => c.id === categoriaId)
  return categoria ? categoria.icon : 'fas fa-tools'
}

const getCategoriaNome = (categoriaId) => {
  const categoria = categoriasPrincipais.value.find(c => c.id === categoriaId)
  return categoria ? categoria.nome : 'Outros'
}

// ✅ CORREÇÃO CRÍTICA: Função verNoticia implementada corretamente
const verNoticia = (noticia) => {
  if (noticia && noticia.id) {
    router.push(`/noticias/${noticia.id}`)
  }
}

// Funções do Modal de Contato
const abrirModalContato = () => {
  showModalContato.value = true
  document.body.style.overflow = 'hidden'
}

const fecharModalContato = () => {
  showModalContato.value = false
  document.body.style.overflow = 'auto'
  
  if (formContato) {
    formContato.nome = ''
    formContato.email = ''
    formContato.assunto = ''
    formContato.mensagem = ''
  }
}

// Funções do Modal de Associado
const abrirModalAssociado = () => {
  showModalAssociado.value = true
  document.body.style.overflow = 'hidden'
}

const fecharModalAssociado = () => {
  showModalAssociado.value = false
  document.body.style.overflow = 'auto'
  
  if (formAssociado) {
    Object.keys(formAssociado).forEach(key => {
      if (key === 'nacionalidade') formAssociado[key] = 'Brasileira'
      else if (key === 'bairro') formAssociado[key] = 'Jardim Atlântico Central'
      else if (key === 'cidade') formAssociado[key] = 'Maricá'
      else if (key === 'estado') formAssociado[key] = 'RJ'
      else if (key === 'aceitou_termos') formAssociado[key] = false
      else formAssociado[key] = ''
    })
  }
}

const enviarMensagemContato = async () => {
  loadingContato.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    uiStore.showToast('Mensagem enviada com sucesso!', 'success')
    fecharModalContato()
  } catch (error) {
    uiStore.showToast('Erro ao enviar mensagem. Tente novamente.', 'error')
  } finally {
    loadingContato.value = false
  }
}

// Funções de Navegação
const scrollToSection = (hash, closeMenu = false) => {
  if (closeMenu) uiStore.closeMobileMenu()
  
  const element = document.querySelector(hash)
  if (!element) {
    return
  }
  
  const offset = 100
  const elementPosition = element.getBoundingClientRect().top + window.scrollY
  window.scrollTo({
    top: elementPosition - offset,
    behavior: 'smooth'
  })
  
  try {
    history.pushState(null, null, hash)
  } catch (error) {
    console.warn('Erro ao atualizar histórico:', error)
  }
}

const scrollToFooter = () => {
  const footer = document.querySelector('footer')
  if (footer) {
    footer.scrollIntoView({ behavior: 'smooth' })
  }
}

// ✅ CORREÇÃO: Função do relógio corrigida
const atualizarRelogio = () => {
  const agora = new Date()
  horaAtual.value = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// ✅ WATCHERS PARA ATUALIZAR IMAGENS DINAMICAMENTE
watch(() => configuracoesStore.hero?.hero_imagem_url, (newUrl) => {
  if (newUrl) {
    setHeroUrl(newUrl)
  }
})

watch(() => configuracoesStore.site?.site_logo, (newUrl) => {
  if (newUrl) {
    setLogoUrl(newUrl)
  }
})

watch(() => configuracoesStore.about?.quem_somos_imagem_url, (newUrl) => {
  if (newUrl) {
    setAboutUrl(newUrl)
  }
})

// ✅ RESETAR PAGINAÇÃO QUANDO ABRIR MODAL (OPCIONAL)
watch(previewImageData, (newVal) => {
  if (!newVal) {
    // Quando fechar o modal, volta para a página atual
    // Ou reseta para página 1 se preferir
    // paginaAtual.value = 1
  }
})

// ✅ FUNÇÃO DE CARREGAMENTO PRIORITÁRIO
const carregarDadosPrioritarios = async () => {
  try {
    await configuracoesStore.carregarConfiguracoes()
    
    if (configuracoesStore.hero?.hero_imagem_url) {
      setHeroUrl(configuracoesStore.hero.hero_imagem_url)
    }
    if (configuracoesStore.site?.site_logo) {
      setLogoUrl(configuracoesStore.site.site_logo)
    }
    if (configuracoesStore.about?.quem_somos_imagem_url) {
      setAboutUrl(configuracoesStore.about.quem_somos_imagem_url)
    }
    
    await classificadosStore.fetchClassificados()
    await noticiasStore.carregarNoticias()
    await colaboradoresStore.carregarColaboradores()
    
  } catch (error) {
    uiStore.showToast('Erro ao carregar conteúdo principal', 'error')
  }
}

// ✅ FUNÇÃO DE CARREGAMENTO SECUNDÁRIO
const carregarDadosSecundarios = async () => {
  const promises = [
    eventosStore.carregarEventos().catch(err => 
      console.warn('Eventos não carregados:', err)
    ),
    galeriaStore.fetchImagens().catch(err => 
      console.warn('Galeria não carregada:', err)
    )
  ]
  
  await Promise.allSettled(promises)
}

// ✅ CORREÇÃO: Lifecycle Hook
onMounted(async () => {
  uiStore.initializeDarkMode()
  atualizarRelogio()
  
  relogioInterval.value = setInterval(atualizarRelogio, 1000)
  
  // ✅ ADICIONE O EVENT LISTENER PARA O TECLADO
  document.addEventListener('keydown', handleKeydown)
  
  await carregarDadosPrioritarios()
  
  setTimeout(() => {
    carregarDadosSecundarios()
  }, 100)
})
</script>

<style scoped>
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgb(21, 128, 61);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-decoration: none;
  border: none;
  position: relative;
}

.btn-primary:hover {
  background-color: rgb(22, 101, 52);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(21, 128, 61, 0.3);
}

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

.transform-transition {
  transition: transform 0.3s ease-in-out;
}

.transition-all {
  transition: all 0.3s ease-in-out;
}

.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.transition-transform {
  transition: transform 0.3s ease-in-out;
}

.hover-scale {
  transition: transform 0.3s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.btn-primary::before,
.btn-primary::after {
  content: none !important;
  display: none !important;
  border: none !important;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.image-fallback {
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
}

.image-fallback img {
  filter: grayscale(20%);
}

.classificado-card {
  transition: all 0.3s ease-in-out;
}

.classificado-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.categoria-filtro {
  transition: all 0.2s ease-in-out;
}

.categoria-filtro:hover {
  transform: scale(1.05);
}

.relogio-grande {
  font-size: 1.25rem;
  font-weight: bold;
}

.relogio-mobile {
  font-size: 1rem;
  font-weight: 600;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>