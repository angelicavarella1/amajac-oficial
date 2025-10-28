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
                src="/images/logo-amajac.png"
                alt="Logo AMAJAC"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            <router-link to="/" class="text-green-600 dark:text-green-400 font-bold text-xl">
              {{ safeString(siteConfig?.site_nome || 'AMAJAC') }}
            </router-link>
          </div>

          <!-- Menu Desktop COM LINHAS MAIS ALTAS -->
          <div class="hidden md:flex items-center space-x-6 h-16">
            <router-link to="/" class="text-green-600 dark:text-green-400 font-semibold text-lg flex items-center h-full border-b-2 border-green-600">Início</router-link>
            <a href="#quem-somos" @click.prevent="scrollToSection('#quem-somos')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg font-medium flex items-center h-full hover:border-b-2 hover:border-green-600 transition-all">Quem Somos</a>
            <a href="#galeria" @click.prevent="scrollToSection('#galeria')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg font-medium flex items-center h-full hover:border-b-2 hover:border-green-600 transition-all">Galeria</a>
            <a href="#eventos" @click.prevent="scrollToSection('#eventos')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg font-medium flex items-center h-full hover:border-b-2 hover:border-green-600 transition-all">Eventos</a>
            <a href="#noticias" @click.prevent="scrollToSection('#noticias')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg font-medium flex items-center h-full hover:border-b-2 hover:border-green-600 transition-all">Notícias</a>
            <a href="#classificados" @click.prevent="scrollToSection('#classificados')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg font-medium flex items-center h-full hover:border-b-2 hover:border-green-600 transition-all">Classificados</a>
            <a href="#colaboradores" @click.prevent="scrollToSection('#colaboradores')" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg font-medium flex items-center h-full hover:border-b-2 hover:border-green-600 transition-all">Parceiros</a>
            <a href="#contato" @click.prevent="scrollToFooter" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg font-medium flex items-center h-full hover:border-b-2 hover:border-green-600 transition-all">Contato</a>
          </div>

          <div class="flex items-center space-x-4 h-16">
            <!-- BOTÃO DE IDIOMA FUNCIONAL CORRIGIDO -->
            <div class="language-selector-header">
              <button 
                @click="toggleLanguage"
                class="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                :title="currentLanguage === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'"
                aria-label="Alternar idioma"
              >
                <i class="fas fa-globe text-gray-600 dark:text-gray-300"></i>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {{ currentLanguage === 'pt' ? 'PT' : 'EN' }}
                </span>
                <i class="fas fa-chevron-down text-xs text-gray-500"></i>
              </button>
            </div>
            
            <DarkModeToggle />
            <button @click="uiStore.toggleMobileMenu" class="md:hidden text-gray-700 dark:text-gray-300 flex items-center h-16" aria-label="Abrir menu mobile">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </nav>

        <!-- Linha 2: Info e Botões COM RELÓGIO AUMENTADO -->
        <div class="hidden md:flex justify-between items-center py-3">
          <div class="flex items-center gap-6">
            <!-- RELÓGIO AUMENTADO E CORRIGIDO -->
            <div v-if="sistemaConfig?.info_relogio_ativado === 'true'"
                 class="flex items-center gap-3 text-lg font-bold text-gray-700 dark:text-gray-300">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-mono text-xl bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                {{ horaAtual }}
              </span>
            </div>

            <!-- Previsão do Tempo -->
            <WeatherInfo v-if="sistemaConfig?.info_clima_ativado === 'true'" />
          </div>

          <div class="flex items-center space-x-3">
            <a href="https://associacoes.softaliza.com.br/amajac" target="_blank" class="px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md">
              <i class="fas fa-users mr-2"></i>
              Área do Associado
            </a>
            <a href="https://sosjacapp.amajac.org.br" target="_blank" class="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md">
              <i class="fas fa-first-aid mr-2"></i>
              SOSJAC
            </a>
            <a :href="adminUrl" target="_blank" class="px-5 py-2.5 bg-gray-700 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-md">
              <i class="fas fa-lock mr-2"></i>
              Área Restrita
            </a>
          </div>
        </div>

        <!-- Menu Mobile COM BOTÃO DE IDIOMA -->
        <div v-if="uiStore.mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col space-y-4">
            <!-- BOTÃO DE IDIOMA NO MOBILE -->
            <div class="flex justify-center pb-4 border-b border-gray-200 dark:border-gray-600">
              <button 
                @click="toggleLanguage"
                class="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Alternar idioma"
              >
                <i class="fas fa-globe text-gray-600 dark:text-gray-300"></i>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {{ currentLanguage === 'pt' ? 'Português' : 'English' }}
                </span>
                <i class="fas fa-chevron-down text-xs text-gray-500"></i>
              </button>
            </div>
            
            <router-link to="/" class="text-green-600 dark:text-green-400 font-semibold text-lg py-3 border-b border-gray-100 dark:border-gray-700" @click="uiStore.closeMobileMenu">Início</router-link>
            <a href="#quem-somos" @click.prevent="scrollToSection('#quem-somos', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg py-3 border-b border-gray-100 dark:border-gray-700">Quem Somos</a>
            <a href="#galeria" @click.prevent="scrollToSection('#galeria', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg py-3 border-b border-gray-100 dark:border-gray-700">Galeria</a>
            <a href="#eventos" @click.prevent="scrollToSection('#eventos', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg py-3 border-b border-gray-100 dark:border-gray-700">Eventos</a>
            <a href="#noticias" @click.prevent="scrollToSection('#noticias', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg py-3 border-b border-gray-100 dark:border-gray-700">Notícias</a>
            <a href="#classificados" @click.prevent="scrollToSection('#classificados', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg py-3 border-b border-gray-100 dark:border-gray-700">Classificados</a>
            <a href="#colaboradores" @click.prevent="scrollToSection('#colaboradores', true)" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg py-3 border-b border-gray-100 dark:border-gray-700">Parceiros</a>
            <a href="#contato" @click.prevent="scrollToFooter" class="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-lg py-3 border-b border-gray-100 dark:border-gray-700">Contato</a>

            <!-- Relógio Mobile Aumentado -->
            <div v-if="sistemaConfig?.info_relogio_ativado === 'true'"
                 class="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300 pt-4 border-t border-gray-200 dark:border-gray-700">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-mono">{{ horaAtual }}</span>
            </div>

            <div class="flex flex-col space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a href="https://associacoes.softaliza.com.br/amajac" target="_blank" class="inline-flex justify-center items-center px-4 py-3 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 shadow-md">
                <i class="fas fa-users mr-2"></i>
                Área do Associado
              </a>
              <a href="https://sosjacapp.amajac.org.br" target="_blank" class="inline-flex justify-center items-center px-4 py-3 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 shadow-md">
                <i class="fas fa-first-aid mr-2"></i>
                SOSJAC
              </a>
              <a :href="adminUrl" target="_blank" class="inline-flex justify-center items-center px-4 py-3 bg-gray-700 text-white text-sm font-bold rounded-lg hover:bg-gray-800 shadow-md">
                <i class="fas fa-lock mr-2"></i>
                Área Restrita
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal - COM pt-48 PARA DESCER MAIS O BANNER -->
    <main class="pt-48">
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
            :alt="safeString(heroConfig?.hero_titulo || 'Banner AMAJAC')"
            class="w-full h-full object-cover"
            loading="eager"
            @load="heroLoading = false"
            @error="handleHeroError"
          />
          <div v-if="heroError" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <span class="text-red-500 text-lg">Erro ao carregar banner</span>
          </div>
        </div>
      </section>

      <!-- Conteúdo Abaixo do Banner -->
      <section class="py-16 bg-white dark:bg-gray-800">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl md:text-6xl font-black mb-8 text-green-700 dark:text-green-500 tracking-tight">
            {{ safeString(heroConfig?.hero_titulo || 'PORTAL DO MORADOR') }}
          </h1>

          <p class="text-2xl md:text-3xl font-bold mb-3 text-green-700 dark:text-green-500">
            {{ safeString(heroConfig?.hero_subtitulo || 'Associação de Moradores e Amigos do Jardim Atlântico Central') }}
          </p>

          <p class="text-xl mb-6 text-green-700 dark:text-green-500 font-bold">
            {{ safeString(heroConfig?.hero_local || 'ITAIPUAÇU - MARICÁ') }}
          </p>

          <div class="max-w-3xl mx-auto space-y-6 mb-10">
            <p class="text-xl text-gray-800 dark:text-white font-medium leading-relaxed">
              {{ safeString(heroConfig?.hero_descricao || 'Trabalhamos juntos para transformar nosso bairro através de ações coletivas.') }}
            </p>
            <p class="text-xl text-gray-800 dark:text-white font-bold">
              Unidos por um bairro melhor!
            </p>
          </div>

          <div class="border-t-2 border-green-300 dark:border-green-600 max-w-3xl mx-auto pt-8"/>
        </div>
      </section>

      <!-- Quem Somos -->
      <section id="quem-somos" class="py-12 bg-white dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">{{ safeString(aboutConfig?.quem_somos_titulo || 'Quem Somos') }}</h2>
            <p class="text-gray-600 dark:text-gray-300">{{ safeString(aboutConfig?.quem_somos_subtitulo || 'Conheça a história da Associação de Moradores e Amigos do Bairro Jardim Atlântico Central') }}</p>
          </div>
          <div class="max-w-4xl mx-auto">
            <div class="mb-8">
              <h3 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">Nossa História</h3>
              <p class="text-gray-700 dark:text-gray-300">
                {{ safeString(aboutConfig?.quem_somos_historia || 'A AMAJAC foi fundada com o objetivo de unir a comunidade e trabalhar em prol das melhorias necessárias para nosso bairro. Nossa trajetória começou com um grupo de moradores preocupados com o desenvolvimento e qualidade de vida no Jardim Atlântico Central.') }}
              </p>
            </div>

            <div class="md:flex gap-8 items-start">
              <div class="md:w-1/2">
                <h3 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">{{ safeString(aboutConfig?.quem_somos_missao_titulo || 'Nossa Missão') }}</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                  {{ safeString(aboutConfig?.quem_somos_missao || 'Representar e unir os moradores do Jardim Atlântico Central, promovendo ações que elevem a qualidade de vida, defendendo os interesses da comunidade e fomentando o desenvolvimento sustentável do bairro.') }}
                </p>

                <div v-if="aboutConfig?.quem_somos_valores" class="mt-6">
                  <h4 class="text-xl font-bold text-green-700 dark:text-green-400 mb-3">{{ safeString(aboutConfig?.quem_somos_valores_titulo || 'Nossos Valores') }}</h4>
                  <ul class="space-y-2">
                    <li v-for="(valor, index) in safeArray(aboutConfig.quem_somos_valores?.split('\n').filter(v => v.trim()))"
                        :key="index"
                        class="flex items-start text-gray-700 dark:text-gray-300">
                      <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      {{ safeString(valor?.trim()) }}
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
                      alt="Imagem sobre a AMAJAC"
                      class="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      @load="aboutImageLoading = false"
                      @error="handleAboutImageError"
                    />
                    <div v-if="aboutImageError" class="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <span class="text-red-500 text-sm">Erro ao carregar imagem</span>
                    </div>
                  </div>
                </div>

                <div v-if="aboutConfig?.quem_somos_estatisticas_familias" class="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div class="text-2xl font-bold text-green-700 dark:text-green-400">{{ safeString(aboutConfig.quem_somos_estatisticas_familias) }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">Famílias Atendidas</div>
                  </div>
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div class="text-2xl font-bold text-green-700 dark:text-green-400">{{ safeString(aboutConfig?.quem_somos_estatisticas_ano || new Date().getFullYear()) }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">Ano de Fundação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Galeria COM PAGINAÇÃO CORRIGIDA -->
      <section v-if="sistemaConfig?.info_galeria_ativado === 'true'" id="galeria" class="py-12 bg-green-50 dark:bg-green-900/20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Galeria</h2>
            <p class="text-gray-700 dark:text-gray-300">Conheça nossos momentos e eventos através das imagens</p>
          </div>

          <!-- Loading State -->
          <div v-if="galeriaStore.loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div v-for="n in 8" :key="n" class="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"/>
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
                    v-if="foto.imagem_url"
                    :src="foto.imagem_url"
                    :alt="safeString(foto.titulo || `Imagem ${index + 1}`)"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    :loading="index < 4 ? 'eager' : 'lazy'"
                    @error="handleImageError"
                  />
                  <div v-else class="absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <i class="fas fa-search-plus text-white text-2xl opacity-0 hover:opacity-100 transition-opacity"/>
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
                <i class="fas fa-chevron-left"/>
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
                <i class="fas fa-chevron-right"/>
              </button>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Galeria Vazia</h3>
              <p class="text-gray-500 dark:text-gray-400">Ainda não há imagens na galeria</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Eventos -->
      <section v-if="sistemaConfig?.info_eventos_ativado === 'true'" id="eventos" class="py-12 bg-white dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Eventos</h2>
            <p class="text-gray-600 dark:text-gray-300">Fique por dentro dos próximos eventos da comunidade</p>
          </div>

          <div v-if="eventosStore.loading" class="max-w-2xl mx-auto space-y-4">
            <div v-for="n in 3" :key="n" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-500 animate-pulse">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"/>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-full"/>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"/>
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
                  <img
                    :src="evento.imagem_url"
                    :alt="safeString(evento.titulo)"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
              </div>

              <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-2">{{ safeString(evento.titulo) }}</h4>
              <p class="text-gray-600 dark:text-gray-300 mb-3">{{ safeString(evento.descricao) }}</p>
              <div class="text-sm text-green-700 dark:text-green-400 font-semibold">
                {{ formatarDataHora(evento.data_hora_evento) }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <i class="fas fa-map-marker-alt mr-2"/>
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
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Nenhum Evento</h3>
              <p class="text-gray-500 dark:text-gray-400">Não há eventos programados no momento</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Notícias -->
      <section v-if="sistemaConfig?.info_noticias_ativado === 'true'" id="noticias" class="py-12 bg-gray-50 dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Notícias</h2>
            <p class="text-gray-600 dark:text-gray-300">Acompanhe as últimas notícias da comunidade</p>
          </div>

          <div v-if="noticiasStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 3" :key="n" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div class="h-48 bg-gray-200 dark:bg-gray-700"/>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"/>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded"/>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"/>
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
                <img
                  v-if="noticia.imagem_url"
                  :src="noticia.imagem_url"
                  :alt="safeString(noticia.titulo)"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  :loading="index < 2 ? 'eager' : 'lazy'"
                  @error="handleImageError"
                />
                <div v-else class="absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
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
                  {{ safeString(noticia.resumo || noticia.conteudo || 'Sem descrição disponível') }}
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
                Nenhuma Notícia
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                Não há notícias publicadas no momento
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Classificados -->
      <section v-if="sistemaConfig?.info_classificados_ativado === 'true'" id="classificados" class="py-12 bg-white dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Classificados</h2>
            <p class="text-gray-600 dark:text-gray-300">Encontre serviços e profissionais da nossa comunidade</p>
          </div>

          <!-- Loading State -->
          <div v-if="classificadosStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-l-4 border-green-500 animate-pulse">
              <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-3 w-3/4"/>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-1/2"/>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3 w-full"/>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"/>
            </div>
          </div>

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
                    <i :class="getCategoriaIcon(servico.categoria_id)" class="text-green-600 dark:text-green-400 text-lg"/>
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
                  <i class="fas fa-user mr-2 text-green-600 dark:text-green-400"/>
                  <span class="font-medium">{{ safeString(servico.associado_nome) }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <i class="fas fa-phone mr-2 text-green-600 dark:text-green-400"/>
                  <span>{{ formatarTelefoneDisplay(servico.telefone) }}</span>
                </div>
                <div v-if="servico.avaliacao_media" class="flex items-center text-sm">
                  <div class="flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"/>
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
                  <i class="fas fa-phone mr-2"/>
                  Contatar
                </button>
                <button
                  @click="abrirModalAvaliacao(servico)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <i class="fas fa-star mr-2"/>
                  Avaliar
                </button>
              </div>
            </article>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <i class="fas fa-tools text-4xl text-gray-400 mb-4"/>
              <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nenhum Classificado
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-6">
                Ainda não há serviços cadastrados nos classificados
              </p>
              <button
                @click="abrirModalAssociado"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
              >
                <i class="fas fa-user-plus mr-2"/>
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
              <i class="fas fa-eye mr-2"/>
              Ver Todos
            </button>
          </div>
        </div>
      </section>

      <!-- Parceiros Comerciais -->
      <section v-if="sistemaConfig?.info_colaboradores_ativado === 'true'" id="colaboradores" class="py-12 bg-gray-50 dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Parceiros Comerciais</h2>
            <p class="text-gray-600 dark:text-gray-300">Conheça nossos parceiros e apoiadores</p>
          </div>

          <!-- Lista de Parceiros -->
          <div v-if="colaboradoresStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div class="h-48 bg-gray-300 dark:bg-gray-700"/>
              <div class="p-6 space-y-3">
                <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"/>
                <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"/>
                <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"/>
                <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"/>
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
                <img
                  v-if="parceiro.imagem_url"
                  :src="parceiro.imagem_url"
                  :alt="parceiro.texto_alternativo || `Logo ${parceiro.nome}`"
                  class="max-w-full max-h-full object-contain"
                  @error="handleImageError"
                />
                <div v-else class="absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>

              <!-- Conteúdo -->
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                  {{ parceiro.nome }}
                </h3>

                <div v-if="parceiro.ramo" class="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                  <i class="fas fa-store mr-2 text-sm"/>
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
                    <i class="fas fa-phone mr-2 w-4 text-green-600 dark:text-green-400"/>
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
                    <i class="fas fa-map-marker-alt mr-2 mt-0.5 w-4 text-green-600 dark:text-green-400"/>
                    <span class="line-clamp-2">{{ parceiro.endereco }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <i class="fas fa-store text-4xl text-gray-400 mb-4"/>
              <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nenhum Parceiro
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                Ainda não há parceiros comerciais cadastrados
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
                  src="/images/logo-amajac.png"
                  alt="Logo AMAJAC"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ safeString(siteConfig?.site_nome || 'AMAJAC') }}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  {{ safeString(siteConfig?.site_descricao || 'Associação de Moradores e Amigos do Jardim Atlântico Central') }}
                </p>
              </div>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              {{ safeString(heroConfig?.hero_descricao || 'Trabalhamos juntos para transformar nosso bairro através de ações coletivas.') }}
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
                <i class="fas fa-map-marker-alt text-green-600 dark:text-green-400 mr-3 mt-1"/>
                <span class="text-gray-600 dark:text-gray-300 text-sm">{{ safeString(contatoConfig?.endereco || 'Rua Izabel Cristina Ouvina, 112 - Jardim Atlântico Central, Maricá - RJ, 24934-405') }}</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-phone-alt text-green-600 dark:text-green-400 mr-3 mt-1"/>
                <span class="text-gray-600 dark:text-gray-300 text-sm">{{ safeString(contatoConfig?.telefone_contato || '(21) 97897-9840') }}</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-envelope text-green-600 dark:text-green-400 mr-3 mt-1"/>
                <span class="text-gray-600 dark:text-gray-300 text-sm">{{ safeString(contatoConfig?.email_contato || 'comunicacao@amajac.org.br') }}</span>
              </li>
            </ul>

            <!-- Botão para abrir modal de contato -->
            <button
              @click="abrirModalContato"
              class="w-full bg-green-600 text-white py-2 px-4 rounded font-semibold hover:bg-green-700 transition-colors mt-4"
            >
              <i class="fas fa-paper-plane mr-2"/>
              Enviar Mensagem
            </button>
          </div>
        </div>
      </div>

      <!-- Rodapé inferior -->
      <div class="bg-gray-100 dark:bg-gray-900 py-4">
        <div class="container mx-auto px-4 text-center">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {{ new Date().getFullYear() }} {{ safeString(siteConfig?.site_nome || 'AMAJAC') }}. Todos os direitos reservados.
          </p>
          <p class="mt-1 text-gray-700 dark:text-gray-300 text-sm">
            Desenvolvido por
            <span class="text-green-600 dark:text-green-400 font-semibold">Angelica Varella</span>
            <br/>
            <span class="text-green-700 dark:text-green-500">Desenvolvedora Full Stack</span>
          </p>
        </div>
      </div>
    </footer>

    <!-- MODAL DE PREVIEW PARA GALERIA CORRIGIDO -->
    <div v-if="previewImageData" class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div class="relative max-w-4xl max-h-full w-full">
        <!-- Botão Fechar -->
        <button
          @click="fecharPreview"
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
          aria-label="Fechar visualização"
        >
          <i class="fas fa-times text-xl"/>
        </button>

        <!-- Botões Navegação -->
        <button
          v-if="temImagemAnterior"
          @click="imagemAnterior"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
          aria-label="Imagem anterior"
        >
          <i class="fas fa-chevron-left text-xl"/>
        </button>

        <button
          v-if="temProximaImagem"
          @click="proximaImagem"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
          aria-label="Próxima imagem"
        >
          <i class="fas fa-chevron-right text-xl"/>
        </button>

        <!-- Conteúdo do Modal -->
        <div class="bg-gray-900 rounded-lg overflow-hidden">
          <!-- Imagem do Modal -->
          <div class="flex items-center justify-center min-h-[400px] max-h-[70vh] p-4">
            <!-- Loading -->
            <div v-if="previewLoading" class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"/>
              <p class="text-white text-sm">Carregando imagem...</p>
            </div>

            <!-- Imagem CORRIGIDA -->
            <div v-else-if="!previewError" class="w-full h-full flex items-center justify-center">
              <img
                :src="previewImageData.imagem_url"
                :alt="previewImageData.titulo || 'Imagem sem título'"
                class="max-w-full max-h-full object-contain"
                @load="previewLoaded"
                @error="previewErro"
              />
            </div>

            <!-- Error -->
            <div v-else class="text-center text-white">
              <i class="fas fa-exclamation-triangle text-3xl text-red-400 mb-2"/>
              <p class="text-red-400">Erro ao carregar imagem</p>
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
              <p class="text-green-100 mt-1">Avalie o serviço: {{ servicoSelecionado?.titulo }}</p>
            </div>
            <button
              @click="fecharModalAvaliacao"
              class="text-white hover:text-green-200 transition-colors p-2 rounded-full hover:bg-green-700"
              aria-label="Fechar modal"
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
                Nota *
              </label>
              <div class="flex space-x-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="formAvaliacao.nota = star"
                  class="text-2xl focus:outline-none transition-transform hover:scale-110"
                  :class="star <= formAvaliacao.nota ? 'text-yellow-400' : 'text-gray-300'"
                  :aria-label="`Avaliar com ${star} estrela${star > 1 ? 's' : ''}`"
                >
                  ★
                </button>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Nota selecionada: {{ formAvaliacao.nota }} estrela{{ formAvaliacao.nota > 1 ? 's' : '' }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu Nome *
              </label>
              <input
                v-model="formAvaliacao.avaliador_nome"
                type="text"
                required
                placeholder="Digite seu nome"
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comentário
              </label>
              <textarea
                v-model="formAvaliacao.comentario"
                rows="3"
                placeholder="Deixe um comentário sobre o serviço..."
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors resize-vertical"
              />
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
              <h2 class="text-2xl font-bold">Entre em Contato</h2>
              <p class="text-green-100 mt-1">Envie sua mensagem para a AMAJAC</p>
            </div>
            <button
              @click="fecharModalContato"
              class="text-white hover:text-green-200 transition-colors p-2 rounded-full hover:bg-green-700"
              aria-label="Fechar modal"
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
                Nome *
              </label>
              <input
                v-model="formContato.nome"
                type="text"
                required
                placeholder="Seu nome completo"
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                v-model="formContato.email"
                type="email"
                required
                placeholder="seu@email.com"
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
              />
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
                <option value="" class="text-gray-500 dark:text-gray-400">Selecione um assunto</option>
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
                Mensagem *
              </label>
              <textarea
                v-model="formContato.mensagem"
                rows="4"
                required
                placeholder="Digite sua mensagem..."
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors resize-vertical"
              />
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

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// --- Imports Corrigidos ---
import { useUIStore } from '@/shared/stores/ui' // <-- Corrigido
import { useGaleriaStore } from '@/modules/galeria/stores/galeria' // <-- Corrigido
import { useEventosStore } from '@/modules/eventos/stores/eventos' // <-- Corrigido
import { useNoticiasStore } from '@/modules/noticias/stores/noticias' // <-- Corrigido
import { useClassificadosStore } from '@/modules/classificados/stores/classificados' // <-- Corrigido
import { useColaboradoresStore } from '@/modules/colaboradores/stores/colaboradores' // <-- Corrigido
import DarkModeToggle from '@/shared/components/DarkModeToggle.vue' // <-- Corrigido
import WeatherInfo from '@/shared/components/public/WeatherInfo.vue' // <-- Corrigido

export default {
  name: 'HomeView',
  components: {
    DarkModeToggle,
    WeatherInfo
  },
  setup() {
    // ... (restante do código do setup permanece o mesmo)
    const router = useRouter()
    const uiStore = useUIStore()
    const galeriaStore = useGaleriaStore()
    const eventosStore = useEventosStore()
    const noticiasStore = useNoticiasStore()
    const classificadosStore = useClassificadosStore()
    const colaboradoresStore = useColaboradoresStore()

    // ... (restante das variáveis e funções permanecem as mesmas)
    // Estados reativos
    const horaAtual = ref('')
    const relogioInterval = ref(null)
    
    // Estados para imagens
    const heroLoading = ref(true)
    const heroError = ref(false)
    const aboutImageLoading = ref(true)
    const aboutImageError = ref(false)
    const previewLoading = ref(false)
    const previewError = ref(false)

    // Estados de paginação da galeria
    const paginaAtual = ref(1)
    const itensPorPagina = ref(8)

    // Estados para modais
    const showModalAvaliacao = ref(false)
    const showModalContato = ref(false)
    const servicoSelecionado = ref(null)
    const loadingAvaliacao = ref(false)
    const loadingContato = ref(false)

    // Estados de preview de imagem
    const previewImageData = ref(null)
    const previewImageIndex = ref(0)

    // Formulários
    const formAvaliacao = ref({
      nota: 0,
      avaliador_nome: '',
      comentario: ''
    })

    const formContato = ref({
      nome: '',
      email: '',
      assunto: '',
      mensagem: ''
    })

    // Filtros
    const filtroCategoria = ref(null)

    // Idioma
    const currentLanguage = ref('pt')

    // Dados mock para configurações (substituir pela store real quando disponível)
    const configMock = {
      site: {
        site_nome: 'AMAJAC',
        site_descricao: 'Associação de Moradores e Amigos do Jardim Atlântico Central'
      },
      hero: {
        hero_titulo: 'PORTAL DO MORADOR',
        hero_subtitulo: 'Associação de Moradores e Amigos do Bairro Jardim Atlântico Central',
        hero_local: 'ITAIPUAÇU - MARICÁ',
        hero_descricao: 'Trabalhamos juntos para transformar nosso bairro através de ações coletivas.',
        hero_imagem_url: '/images/banner-default.jpg'
      },
      about: {
        quem_somos_titulo: 'Quem Somos',
        quem_somos_subtitulo: 'Conheça a história da Associação de Moradores e Amigos do Bairro Jardim Atlântico Central',
        quem_somos_historia: 'A AMAJAC foi fundada com o objetivo de unir a comunidade e trabalhar em prol das melhorias necessárias para nosso bairro.',
        quem_somos_missao_titulo: 'Nossa Missão',
        quem_somos_missao: 'Representar e unir os moradores do Jardim Atlântico Central.',
        quem_somos_imagem_url: '/images/about-default.jpg',
        quem_somos_estatisticas_familias: '150',
        quem_somos_estatisticas_ano: '2020'
      },
      sistema: {
        info_relogio_ativado: 'true',
        info_clima_ativado: 'true',
        info_galeria_ativado: 'true',
        info_eventos_ativado: 'true',
        info_noticias_ativado: 'true',
        info_classificados_ativado: 'true',
        info_colaboradores_ativado: 'true'
      },
      contato: {
        endereco: 'Rua Izabel Cristina Ouvina, 112 - Jardim Atlântico Central, Maricá - RJ',
        telefone_contato: '(21) 97897-9840',
        email_contato: 'comunicacao@amajac.org.br'
      }
    }

    // Computed para configurações
    const siteConfig = computed(() => configMock.site)
    const heroConfig = computed(() => configMock.hero)
    const aboutConfig = computed(() => configMock.about)
    const sistemaConfig = computed(() => configMock.sistema)
    const contatoConfig = computed(() => configMock.contato)

    // Computed para URLs de imagens
    const heroImageUrl = computed(() => {
      return heroConfig.value?.hero_imagem_url || '/images/banner-default.jpg'
    })

    const aboutImageUrl = computed(() => {
      return aboutConfig.value?.quem_somos_imagem_url || '/images/about-default.jpg'
    })

    const adminUrl = computed(() => {
      return `${window.location.origin}/admin`
    })

    // Computed para dados com imagens - COM VERIFICAÇÃO DE SEGURANÇA
    const galeriaComImagens = computed(() => {
      return safeArray(galeriaStore.galeria).filter(item => item?.imagem_url)
    })

    const eventosComImagens = computed(() => {
      return safeArray(eventosStore.eventos).filter(evento => evento?.imagem_url)
    })

    const noticiasComImagens = computed(() => {
      return safeArray(noticiasStore.noticias).map(noticia => ({
        ...noticia,
        tituloSeguro: safeString(noticia?.titulo),
        dataFormatada: formatarData(noticia?.data_publicacao)
      })).filter(noticia => noticia?.imagem_url)
    })

    const parceirosComImagens = computed(() => {
      return safeArray(colaboradoresStore.colaboradores).filter(colab => colab?.imagem_url)
    })

    const classificadosFiltrados = computed(() => {
      let classificados = safeArray(classificadosStore.classificados)
      if (filtroCategoria.value) {
        classificados = classificados.filter(c => c?.categoria_id === filtroCategoria.value)
      }
      return classificados
    })

    // Paginação da galeria
    const totalPaginas = computed(() => {
      return Math.ceil(galeriaComImagens.value.length / itensPorPagina.value)
    })

    const imagensPaginadas = computed(() => {
      const start = (paginaAtual.value - 1) * itensPorPagina.value
      const end = start + itensPorPagina.value
      return galeriaComImagens.value.slice(start, end)
    })

    // Navegação do preview
    const temImagemAnterior = computed(() => {
      return previewImageIndex.value > 0
    })

    const temProximaImagem = computed(() => {
      return previewImageIndex.value < galeriaComImagens.value.length - 1
    })

    // Categorias para classificados
    const categoriasPrincipais = computed(() => {
      return [
        { id: 1, nome: 'Construção', icon: 'fas fa-hammer' },
        { id: 2, nome: 'Elétrica', icon: 'fas fa-bolt' },
        { id: 3, nome: 'Encanamento', icon: 'fas fa-faucet' },
        { id: 4, nome: 'Limpeza', icon: 'fas fa-broom' },
        { id: 5, nome: 'Jardim', icon: 'fas fa-leaf' }
      ]
    })

    // Métodos
    const safeString = (str) => {
      if (!str) return ''
      return String(str).replace(/[<>]/g, '')
    }

    const safeArray = (arr) => {
      if (!arr || !Array.isArray(arr)) return []
      return arr.filter(item => item != null)
    }

    const atualizarRelogio = () => {
      const now = new Date()
      horaAtual.value = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const toggleLanguage = () => {
      currentLanguage.value = currentLanguage.value === 'pt' ? 'en' : 'pt'
    }

    // Métodos para tratamento de imagens
    const handleHeroError = () => {
      heroError.value = true
      heroLoading.value = false
    }

    const handleAboutImageError = () => {
      aboutImageError.value = true
      aboutImageLoading.value = false
    }

    const handleImageError = (event) => {
      if (event.target) {
        event.target.style.display = 'none'
        const parent = event.target.parentElement
        if (parent) {
          const errorDiv = document.createElement('div')
          errorDiv.className = 'absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center'
          errorDiv.innerHTML = '<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
          parent.appendChild(errorDiv)
        }
      }
    }

    const scrollToSection = (selector, closeMobile = false) => {
      if (closeMobile) {
        uiStore.closeMobileMenu()
      }
      
      setTimeout(() => {
        const element = document.querySelector(selector)
        if (element) {
          const offset = 120
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }

    const scrollToFooter = () => {
      uiStore.closeMobileMenu()
      setTimeout(() => {
        const footer = document.querySelector('footer')
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }

    // Métodos da galeria
    const abrirPreview = (foto) => {
      if (!foto) return
      previewImageData.value = foto
      previewImageIndex.value = galeriaComImagens.value.findIndex(img => img?.id === foto.id)
      previewLoading.value = true
      previewError.value = false
    }

    const fecharPreview = () => {
      previewImageData.value = null
      previewImageIndex.value = 0
    }

    const proximaImagem = () => {
      if (temProximaImagem.value) {
        previewImageIndex.value++
        previewImageData.value = galeriaComImagens.value[previewImageIndex.value]
        previewLoading.value = true
        previewError.value = false
      }
    }

    const imagemAnterior = () => {
      if (temImagemAnterior.value) {
        previewImageIndex.value--
        previewImageData.value = galeriaComImagens.value[previewImageIndex.value]
        previewLoading.value = true
        previewError.value = false
      }
    }

    const previewLoaded = () => {
      previewLoading.value = false
    }

    const previewErro = () => {
      previewLoading.value = false
      previewError.value = true
    }

    // Paginação
    const proximaPagina = () => {
      if (paginaAtual.value < totalPaginas.value) {
        paginaAtual.value++
      }
    }

    const paginaAnterior = () => {
      if (paginaAtual.value > 1) {
        paginaAtual.value--
      }
    }

    // Métodos de formatação
    const formatarData = (dataString) => {
      if (!dataString) return ''
      try {
        const data = new Date(dataString)
        return data.toLocaleDateString('pt-BR')
      } catch {
        return dataString
      }
    }

    const formatarDataHora = (dataHoraString) => {
      if (!dataHoraString) return ''
      try {
        const data = new Date(dataHoraString)
        return data.toLocaleString('pt-BR')
      } catch {
        return dataHoraString
      }
    }

    const formatarTelefoneDisplay = (telefone) => {
      if (!telefone) return ''
      const nums = telefone.replace(/\D/g, '')
      if (nums.length === 11) {
        return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`
      }
      if (nums.length === 10) {
        return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`
      }
      return telefone
    }

    // Métodos de navegação
    const verEvento = (evento) => {
      if (!evento?.id) return
      router.push(`/eventos/${evento.id}`)
    }

    const verNoticia = (noticia) => {
      if (!noticia?.id) return
      router.push(`/noticias/${noticia.id}`)
    }

    const verParceiro = (parceiro) => {
      console.log('Visualizar parceiro:', parceiro)
    }

    // Métodos dos classificados
    const getCategoriaIcon = (categoriaId) => {
      const categoria = categoriasPrincipais.value.find(c => c.id === categoriaId)
      return categoria ? categoria.icon : 'fas fa-briefcase'
    }

    const getCategoriaNome = (categoriaId) => {
      const categoria = categoriasPrincipais.value.find(c => c.id === categoriaId)
      return categoria ? categoria.nome : 'Outros'
    }

    const filtrarPorCategoria = (categoriaId) => {
      filtroCategoria.value = categoriaId
    }

    const limparFiltro = () => {
      filtroCategoria.value = null
    }

    const contatarServico = (servico) => {
      if (servico?.telefone) {
        const tel = servico.telefone.replace(/\D/g, '')
        window.open(`https://wa.me/55${tel}`, '_blank') // Corrigido: removido espaço extra
      }
    }

    const verMaisClassificados = () => {
      router.push('/classificados')
    }

    // Métodos dos modais
    const abrirModalAvaliacao = (servico) => {
      if (!servico) return
      servicoSelecionado.value = servico
      formAvaliacao.value = {
        nota: 0,
        avaliador_nome: '',
        comentario: ''
      }
      showModalAvaliacao.value = true
    }

    const fecharModalAvaliacao = () => {
      showModalAvaliacao.value = false
      servicoSelecionado.value = null
    }

    const enviarAvaliacao = async () => {
      if (formAvaliacao.value.nota === 0) {
        uiStore.showToast('Por favor, selecione uma nota', 'error')
        return
      }

      if (!formAvaliacao.value.avaliador_nome.trim()) {
        uiStore.showToast('Por favor, informe seu nome', 'error')
        return
      }

      loadingAvaliacao.value = true

      try {
        // Simular envio da avaliação
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        uiStore.showToast('Avaliação enviada com sucesso!', 'success')
        fecharModalAvaliacao()
      } catch (error) {
        uiStore.showToast('Erro ao enviar avaliação', 'error')
      } finally {
        loadingAvaliacao.value = false
      }
    }

    const abrirModalContato = () => {
      formContato.value = {
        nome: '',
        email: '',
        assunto: '',
        mensagem: ''
      }
      showModalContato.value = true
    }

    const fecharModalContato = () => {
      showModalContato.value = false
    }

    const enviarMensagemContato = async () => {
      loadingContato.value = true

      try {
        // Simular envio do contato
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        uiStore.showToast('Mensagem enviada com sucesso!', 'success')
        fecharModalContato()
      } catch (error) {
        uiStore.showToast('Erro ao enviar mensagem', 'error')
      } finally {
        loadingContato.value = false
      }
    }

    const abrirModalAssociado = () => {
      window.open('https://associacoes.softaliza.com.br/amajac', '_blank') // Corrigido: removido espaço extra
    }

    // Lifecycle
    onMounted(async () => {
      // Inicializar relógio
      atualizarRelogio()
      relogioInterval.value = setInterval(atualizarRelogio, 1000)

      // Carregar dados iniciais com tratamento de erro
      try {
        await Promise.all([
          galeriaStore.fetchGaleria?.() || Promise.resolve(),
          eventosStore.fetchEventos?.() || Promise.resolve(),
          noticiasStore.fetchNoticias?.() || Promise.resolve(),
          classificadosStore.fetchClassificados?.() || Promise.resolve(),
          colaboradoresStore.fetchColaboradores?.() || Promise.resolve()
        ])

        // Forçar carregamento das imagens após um tempo
        setTimeout(() => {
          heroLoading.value = false
          aboutImageLoading.value = false
        }, 1000)

      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        uiStore.showToast('Erro ao carregar dados da página', 'error')
        
        // Garantir que o loading seja finalizado mesmo com erro
        heroLoading.value = false
        aboutImageLoading.value = false
      }
    })

    onUnmounted(() => {
      if (relogioInterval.value) {
        clearInterval(relogioInterval.value)
      }
    })

    return {
      // Stores
      galeriaStore,
      eventosStore,
      noticiasStore,
      classificadosStore,
      colaboradoresStore,
      uiStore,

      // Configurações
      siteConfig,
      heroConfig,
      aboutConfig,
      sistemaConfig,
      contatoConfig,

      // Refs
      heroLoading,
      heroError,
      aboutImageLoading,
      aboutImageError,
      previewLoading,
      previewError,
      paginaAtual,
      showModalAvaliacao,
      showModalContato,
      servicoSelecionado,
      loadingAvaliacao,
      loadingContato,
      previewImageData,
      previewImageIndex,
      formAvaliacao,
      formContato,
      filtroCategoria,
      horaAtual,
      currentLanguage,

      // Computed
      heroImageUrl,
      aboutImageUrl,
      galeriaComImagens,
      eventosComImagens,
      noticiasComImagens,
      parceirosComImagens,
      classificadosFiltrados,
      totalPaginas,
      imagensPaginadas,
      temImagemAnterior,
      temProximaImagem,
      categoriasPrincipais,
      adminUrl,

      // Métodos
      safeString,
      safeArray,
      toggleLanguage,
      scrollToSection,
      scrollToFooter,
      handleImageError,
      handleHeroError,
      handleAboutImageError,
      abrirPreview,
      fecharPreview,
      proximaImagem,
      imagemAnterior,
      previewLoaded,
      previewErro,
      proximaPagina,
      paginaAnterior,
      formatarData,
      formatarDataHora,
      formatarTelefoneDisplay,
      verEvento,
      verNoticia,
      verParceiro,
      getCategoriaIcon,
      getCategoriaNome,
      filtrarPorCategoria,
      limparFiltro,
      contatarServico,
      verMaisClassificados,
      abrirModalAvaliacao,
      fecharModalAvaliacao,
      enviarAvaliacao,
      abrirModalContato,
      fecharModalContato,
      enviarMensagemContato,
      abrirModalAssociado
    }
  }
}
</script>

<style scoped>
/* Todos os estilos anteriores mantidos */
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

/* Correções e melhorias adicionadas */
.language-selector-header button {
  border: 1px solid transparent;
}

.language-selector-header button:hover {
  border-color: rgb(21, 128, 61);
}

/* Melhorias de acessibilidade para modo escuro */
@media (prefers-color-scheme: dark) {
  .image-fallback {
    background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
  }
  
  .classificado-card:hover {
    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.05);
  }
}

/* Melhorias de responsividade */
@media (max-width: 768px) {
  .relogio-grande {
    font-size: 1.1rem;
  }
  
  .relogio-mobile {
    font-size: 0.9rem;
  }
  
  .btn-primary {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
}

/* Estados de foco para acessibilidade */
.btn-primary:focus {
  outline: 2px solid rgb(21, 128, 61);
  outline-offset: 2px;
}

.categoria-filtro:focus {
  outline: 2px solid rgb(21, 128, 61);
  outline-offset: 2px;
}

/* Loading states melhorados */
.loading-spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid rgb(21, 128, 61);
  border-radius: 50%;
  width: 20px;
  height: 20px;
}

/* Animações suaves para transições de página */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}

/* Melhorias para imagens com erro */
.image-error-fallback {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  font-size: 0.875rem;
}

@media (prefers-color-scheme: dark) {
  .image-error-fallback {
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    color: #fca5a5;
  }
}

/* Estados hover para cards interativos */
.hover-lift {
  transition: all 0.3s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* Melhorias de performance para animações */
@media (prefers-reduced-motion: reduce) {
  .btn-primary,
  .transition-all,
  .transition-colors,
  .transition-transform,
  .hover-scale,
  .classificado-card,
  .categoria-filtro,
  .hover-lift {
    transition: none !important;
    animation: none !important;
  }
  
  .btn-primary:hover {
    transform: none !important;
  }
}

/* Estados de desabilitado */
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary:disabled:hover {
  background-color: rgb(21, 128, 61);
  box-shadow: none;
  transform: none;
}

/* Foco visível para teclado */
button:focus-visible,
a:focus-visible {
  outline: 2px solid rgb(21, 128, 61);
  outline-offset: 2px;
  border-radius: 0.375rem;
}

/* Melhor contraste para texto */
.text-high-contrast {
  color: #1f2937;
}

@media (prefers-color-scheme: dark) {
  .text-high-contrast {
    color: #f9fafb;
  }
}

/* Estados de loading para botões */
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-right-color: transparent;
  animation: spin 1s linear infinite;
}
</style>