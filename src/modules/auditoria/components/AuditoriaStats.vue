<template>
  <div class="auditoria-stats mb-6">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <!-- Total de Logs -->
      <div class="stat-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Logs</p>
            <p v-if="loading" class="text-2xl font-bold text-gray-400 dark:text-gray-500 animate-pulse">...</p>
            <p v-else class="text-2xl font-bold text-amajac-green dark:text-amajac-green-light">{{ stats.totalLogs.toLocaleString() }}</p>
          </div>
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Logs Hoje -->
      <div class="stat-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Logs Hoje</p>
            <p v-if="loading" class="text-2xl font-bold text-gray-400 dark:text-gray-500 animate-pulse">...</p>
            <p v-else class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.logsHoje.toLocaleString() }}</p>
          </div>
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Inserções -->
      <div class="stat-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Inserções</p>
            <p v-if="loading" class="text-2xl font-bold text-gray-400 dark:text-gray-500 animate-pulse">...</p>
            <p v-else class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.inserts.toLocaleString() }}</p>
          </div>
          <div class="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
            <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Atualizações -->
      <div class="stat-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Atualizações</p>
            <p v-if="loading" class="text-2xl font-bold text-gray-400 dark:text-gray-500 animate-pulse">...</p>
            <p v-else class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ stats.updates.toLocaleString() }}</p>
          </div>
          <div class="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
            <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Exclusões -->
      <div class="stat-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Exclusões</p>
            <p v-if="loading" class="text-2xl font-bold text-gray-400 dark:text-gray-500 animate-pulse">...</p>
            <p v-else class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.deletes.toLocaleString() }}</p>
          </div>
          <div class="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalLogs: 0,
      logsHoje: 0,
      inserts: 0,
      updates: 0,
      deletes: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}
</style>