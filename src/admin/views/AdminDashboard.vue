<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Visão geral do sistema</p>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
        <i class="fas fa-calendar mr-2"></i>
        {{ dataAtual }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-green-600 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-2xl text-red-500 mb-4"></i>
        <h3 class="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Erro ao carregar dashboard</h3>
        <p class="text-red-700 dark:text-red-400 mb-4">{{ error }}</p>
        <button
          @click="carregarDashboard"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <i class="fas fa-redo mr-2"></i>Tentar Novamente
        </button>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div v-else>
      <!-- Estatísticas Principais -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Notícias</h3>
            <div class="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <i class="fas fa-newspaper text-blue-600 dark:text-blue-400 text-sm"></i>
            </div>
          </div>
          <div class="flex items-baseline justify-between">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.noticias }}</p>
            <div class="flex items-center text-xs text-green-600">
              <i class="fas fa-arrow-up mr-1"></i>
              {{ estatisticas.noticiasTrendValue }}
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Desde o último mês</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Eventos</h3>
            <div class="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
              <i class="fas fa-calendar-alt text-green-600 dark:text-green-400 text-sm"></i>
            </div>
          </div>
          <div class="flex items-baseline justify-between">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.eventos }}</p>
            <div class="flex items-center text-xs text-red-600">
              <i class="fas fa-arrow-down mr-1"></i>
              {{ estatisticas.eventosTrendValue }}
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Desde o último mês</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Mensagens</h3>
            <div class="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <i class="fas fa-envelope text-purple-600 dark:text-purple-400 text-sm"></i>
            </div>
          </div>
          <div class="flex items-baseline justify-between">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.mensagens }}</p>
            <div class="flex items-center text-xs text-green-600">
              <i class="fas fa-arrow-up mr-1"></i>
              {{ estatisticas.mensagensTrendValue }}
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Desde o último mês</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Associados</h3>
            <div class="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <i class="fas fa-users text-yellow-600 dark:text-yellow-400 text-sm"></i>
            </div>
          </div>
          <div class="flex items-baseline justify-between">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.associados }}</p>
            <div class="flex items-center text-xs text-green-600">
              <i class="fas fa-arrow-up mr-1"></i>
              {{ estatisticas.associadosTrendValue }}
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Desde o último mês</p>
        </div>
      </div>

      <!-- Ações Rápidas -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <i class="fas fa-bolt text-yellow-500 mr-2"></i>
          Ações Rápidas
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <router-link
            to="/admin/noticias/nova"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors mb-2">
              <i class="fas fa-plus text-green-600 dark:text-green-400 text-lg"></i>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Nova Notícia
            </span>
          </router-link>
          
          <router-link
            to="/admin/eventos/novo"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors mb-2">
              <i class="fas fa-calendar-plus text-blue-600 dark:text-blue-400 text-lg"></i>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Novo Evento
            </span>
          </router-link>
          
          <router-link
            to="/admin/solicitacoes-socio"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div class="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/20 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/30 transition-colors mb-2">
              <i class="fas fa-user-friends text-indigo-600 dark:text-indigo-400 text-lg"></i>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Gerenciar Associados
            </span>
          </router-link>
          
          <router-link
            to="/admin/mensagens"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors mb-2">
              <i class="fas fa-envelope text-purple-600 dark:text-purple-400 text-lg"></i>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Ver Mensagens
            </span>
          </router-link>

          <router-link
            to="/admin/galeria/nova"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div class="p-3 rounded-full bg-pink-100 dark:bg-pink-900/20 group-hover:bg-pink-200 dark:group-hover:bg-pink-800/30 transition-colors mb-2">
              <i class="fas fa-image text-pink-600 dark:text-pink-400 text-lg"></i>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Nova Imagem
            </span>
          </router-link>

          <router-link
            to="/admin/parceiros/novo"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div class="p-3 rounded-full bg-teal-100 dark:bg-teal-900/20 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/30 transition-colors mb-2">
              <i class="fas fa-handshake text-teal-600 dark:text-teal-400 text-lg"></i>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Novo Parceiro
            </span>
          </router-link>
        </div>
      </div>

      <!-- Ferramentas do Sistema -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Monitor Supabase -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
              Monitor Supabase
            </h3>
            <router-link 
              to="/admin/monitor"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center"
            >
              Ver completo <i class="fas fa-arrow-right ml-1 text-xs"></i>
            </router-link>
          </div>
          
          <!-- Status Compacto -->
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="text-lg font-bold text-blue-600">82%</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Linhas</div>
            </div>
            <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-lg font-bold text-green-600">47%</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Disco</div>
            </div>
            <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div class="text-lg font-bold text-purple-600">11%</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Banda</div>
            </div>
            <div class="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div class="text-lg font-bold text-orange-600">95%</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">CPU</div>
            </div>
          </div>
        </div>

        <!-- Backup & Limpeza -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <i class="fas fa-database text-green-500 mr-2"></i>
              Backup & Limpeza
            </h3>
            <router-link 
              to="/admin/backup"
              class="text-sm text-green-600 dark:text-green-400 hover:text-green-700 flex items-center"
            >
              Gerenciar <i class="fas fa-arrow-right ml-1 text-xs"></i>
            </router-link>
          </div>
          
          <!-- Status Backup -->
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <p class="text-sm font-medium">Último Backup</p>
                <p class="text-xs text-gray-500">15 Nov 2024, 02:00</p>
              </div>
              <span class="text-green-600 text-sm">
                <i class="fas fa-check-circle"></i>
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition">
                Backup Agora
              </button>
              <button class="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm transition">
                Limpar Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Atividade Recente e Notícias em Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- Atividade Recente -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <i class="fas fa-history text-blue-500 mr-2"></i>
            Atividade Recente
          </h3>
          <div class="space-y-4">
            <div 
              v-for="atividade in atividadesRecentes" 
              :key="atividade.id" 
              class="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex-shrink-0">
                <div :class="`w-10 h-10 rounded-full flex items-center justify-center ${atividade.cor} shadow-sm`">
                  <i :class="`${atividade.icone} text-sm text-white`"></i>
                </div>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ atividade.descricao }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <i class="fas fa-clock mr-1"></i>{{ atividade.tempo }}
                </p>
              </div>
            </div>
            
            <div v-if="atividadesRecentes.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
              <i class="fas fa-inbox text-2xl mb-2 opacity-50"></i>
              <p class="text-sm">Nenhuma atividade recente</p>
            </div>
          </div>
        </div>

        <!-- Notícias Recentes -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <i class="fas fa-newspaper text-green-500 mr-2"></i>
              Notícias Recentes
            </h3>
            <router-link
              to="/admin/noticias"
              class="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
            >
              Ver todas <i class="fas fa-arrow-right ml-1 text-xs"></i>
            </router-link>
          </div>
          
          <div v-if="noticiasRecentes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <i class="fas fa-newspaper text-4xl mb-4 opacity-50"></i>
            <p class="mb-2">Nenhuma notícia encontrada</p>
            <router-link
              to="/admin/noticias/nova"
              class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
            >
              <i class="fas fa-plus mr-1"></i> Criar primeira notícia
            </router-link>
          </div>
          
          <div v-else class="space-y-3">
            <div v-for="noticia in noticiasRecentes.slice(0, 3)" :key="noticia.id" 
                 class="flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div class="flex-shrink-0">
                <div :class="`w-8 h-8 rounded-full flex items-center justify-center ${noticia.ativo ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`">
                  <i :class="noticia.ativo ? 'fas fa-check text-xs' : 'fas fa-times text-xs'"></i>
                </div>
              </div>
              <div class="ml-3 flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate" :title="noticia.titulo">
                  {{ noticia.titulo }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate" :title="noticia.resumo">
                  {{ noticia.resumo || 'Sem resumo' }}
                </p>
                <div class="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <i class="fas fa-calendar mr-1"></i>
                  {{ formatDate(noticia.data_publicacao) }}
                </div>
              </div>
              <div class="flex space-x-1">
                <router-link
                  :to="`/admin/noticias/editar/${noticia.id}`"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Editar notícia"
                >
                  <i class="fas fa-edit text-xs"></i>
                </router-link>
                <button
                  @click="visualizarNoticia(noticia)"
                  class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  title="Visualizar notícia"
                >
                  <i class="fas fa-eye text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Solicitações de Associados Pendentes -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <i class="fas fa-user-clock text-indigo-500 mr-2"></i>
            Solicitações de Associados Pendentes
          </h3>
          <router-link
            to="/admin/solicitacoes-socio"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          >
            Gerenciar todos <i class="fas fa-arrow-right ml-1 text-xs"></i>
          </router-link>
        </div>
        
        <div v-if="solicitacoesPendentes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          <i class="fas fa-users text-4xl mb-4 opacity-50"></i>
          <p class="mb-2">Nenhuma solicitação pendente</p>
          <p class="text-sm">Todas as solicitações foram processadas</p>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contato
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="solicitacao in solicitacoesPendentes.slice(0, 3)" :key="solicitacao.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-6 py-4">
                  <div class="max-w-xs">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate" :title="solicitacao.nome">
                      {{ solicitacao.nome }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate" :title="solicitacao.cpf">
                      CPF: {{ solicitacao.cpf }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white truncate max-w-xs">
                    {{ solicitacao.email }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ solicitacao.telefone }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <i class="fas fa-calendar mr-2 text-xs opacity-70"></i>
                    {{ formatDate(solicitacao.data_solicitacao) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="aprovarSolicitacao(solicitacao)"
                    class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 mr-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
                    title="Aprovar solicitação"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    @click="rejeitarSolicitacao(solicitacao)"
                    class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mr-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    title="Rejeitar solicitação"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                  <router-link
                    :to="`/admin/solicitacoes-socio`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    title="Ver detalhes"
                  >
                    <i class="fas fa-eye"></i>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'

// Stores
const uiStore = useUIStore()

// Estados
const loading = ref(true)
const error = ref(null)

const estatisticas = ref({
  noticias: 24,
  eventos: 8,
  mensagens: 15,
  associados: 42,
  noticiasTrend: 'up',
  noticiasTrendValue: '+12%',
  eventosTrend: 'down',
  eventosTrendValue: '-5%',
  mensagensTrend: 'up',
  mensagensTrendValue: '+23%',
  associadosTrend: 'up',
  associadosTrendValue: '+8%'
})

// Dados estáticos (atividades recentes)
const atividadesRecentes = ref([
  {
    id: 1,
    descricao: 'Nova notícia publicada',
    tempo: 'Há 2 minutos',
    icone: 'fas fa-newspaper',
    cor: 'bg-blue-500'
  },
  {
    id: 2,
    descricao: 'Evento atualizado',
    tempo: 'Há 15 minutos',
    icone: 'fas fa-calendar',
    cor: 'bg-green-500'
  },
  {
    id: 3,
    descricao: 'Nova solicitação de associado',
    tempo: 'Há 1 hora',
    icone: 'fas fa-user-plus',
    cor: 'bg-indigo-500'
  }
])

// Dados mock para notícias e solicitações
const noticiasRecentes = ref([
  {
    id: 1,
    titulo: 'AMAJAC promove evento beneficente para comunidade',
    resumo: 'Evento arrecadou mais de 5 toneladas de alimentos',
    data_publicacao: new Date().toISOString(),
    ativo: true
  },
  {
    id: 2,
    titulo: 'Novos parceiros comerciais anunciados',
    resumo: 'Expansão da rede de parceiros da associação',
    data_publicacao: new Date(Date.now() - 86400000).toISOString(),
    ativo: true
  }
])

const solicitacoesPendentes = ref([
  {
    id: 1,
    nome: 'João Silva Santos',
    cpf: '123.456.789-00',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    status: 'pendente',
    data_solicitacao: new Date().toISOString()
  },
  {
    id: 2,
    nome: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    email: 'maria.oliveira@email.com',
    telefone: '(11) 88888-8888',
    status: 'pendente',
    data_solicitacao: new Date(Date.now() - 86400000).toISOString()
  }
])

// Computed
const dataAtual = computed(() => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Métodos
function formatDate(dateString) {
  if (!dateString) return 'Data não informada'
  try {
    return new Date(dateString).toLocaleDateString('pt-BR')
  } catch (e) {
    return 'Data inválida'
  }
}

function visualizarNoticia(noticia) {
  uiStore.showToast(`Visualizando: ${noticia.titulo}`, 'info')
}

function aprovarSolicitacao(solicitacao) {
  uiStore.showToast(`Solicitação de ${solicitacao.nome} aprovada!`, 'success')
  // Remove a solicitação da lista
  solicitacoesPendentes.value = solicitacoesPendentes.value.filter(s => s.id !== solicitacao.id)
}

function rejeitarSolicitacao(solicitacao) {
  uiStore.showToast(`Solicitação de ${solicitacao.nome} rejeitada.`, 'warning')
  // Remove a solicitação da lista
  solicitacoesPendentes.value = solicitacoesPendentes.value.filter(s => s.id !== solicitacao.id)
}

async function carregarDashboard() {
  try {
    loading.value = true
    error.value = null
    
    console.log('📊 Carregando dashboard...')
    
    // Simula carregamento de dados
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ Dashboard carregado com sucesso')
    
  } catch (err) {
    console.error('❌ Erro ao carregar dashboard:', err)
    error.value = err.message
    uiStore.showToast('Erro ao carregar dados do dashboard', 'error')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  carregarDashboard()
})
</script>