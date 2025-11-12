<template>
  <aside
    id="parceiros-sidebar"
    aria-labelledby="parceiros-sidebar-title"
    class="parceiros-sidebar py-6 px-4 transition-colors duration-300 h-full flex flex-col"
  >
    <header class="mb-6 text-center">
      <h2
        id="parceiros-sidebar-title"
        class="text-lg md:text-xl font-bold"
      >
        Nossos Colaboradores
      </h2>
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
        Parceiros Comerciais da AMAJAC
      </p>
    </header>
    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-8">
      <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-amajac-green border-t-transparent"></div>
      <p class="mt-3 text-sm">Carregando...</p>
    </div>
    <!-- Erro -->
    <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center py-8 text-center">
      <p class="text-sm mb-2">{{ error }}</p>
      <button
        @click="fetchParceiros"
        class="text-xs px-3 py-1.5 rounded bg-amajac-green text-white hover:bg-amajac-green-hover focus:outline-none"
        aria-label="Tentar carregar novamente os parceiros comerciais"
      >
        Tentar novamente
      </button>
    </div>
    <!-- Lista -->
    <div
      v-else-if="parceiros.length > 0"
      role="list"
      class="space-y-4 overflow-y-auto flex-1"
    >
      <article
        v-for="p in parceiros"
        :key="p.id"
        role="listitem"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
      >
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <img
              v-if="p.logo_url"
              :src="p.logo_url"
              :alt="p.imagem_alt"
              class="w-full h-full object-contain"
              loading="lazy"
              @error="p.logo_url = null"
            />
            <div v-else class="text-lg font-bold text-amajac-green">
              {{ p.nome.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white truncate">
              {{ p.nome }}
            </h3>
            <p v-if="p.ramo" class="text-xs text-gray-600 dark:text-gray-400 truncate">
              {{ p.ramo }}
            </p>
            <div class="mt-2 flex flex-wrap gap-1">
              <a
                v-if="p.link_site"
                :href="p.link_site"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[10px] text-amajac-green hover:underline"
                :aria-label="`Site de ${p.nome}`"
              >
                Site
              </a>
              <!-- ✅ CORREÇÃO: removido espaço após domínio -->
              <a
                v-if="p.instagram"
                :href="`https://instagram.com/${p.instagram}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[10px] text-pink-600 hover:underline dark:text-pink-400"
                :aria-label="`Instagram de ${p.nome}`"
              >
                IG
              </a>
              <!-- ✅ CORREÇÃO: removido espaço após domínio -->
              <a
                v-if="p.facebook"
                :href="`https://facebook.com/${p.facebook}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[10px] text-blue-600 hover:underline dark:text-blue-400"
                :aria-label="`Facebook de ${p.nome}`"
              >
                FB
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
    <!-- Vazio -->
    <div v-else class="flex-1 flex items-center justify-center py-8 text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">Nenhum parceiro ativo.</p>
    </div>
  </aside>
</template>
<script setup>
import { onMounted } from 'vue'
import { useParceiros } from '../composables/useParceiros'
const { parceiros, loading, error, fetchParceiros } = useParceiros()
onMounted(() => {
  fetchParceiros()
})
</script>
<style scoped>
.parceiros-sidebar {
  --amajac-green: #2E7D32;
  --amajac-green-hover: #256a2a;
  background-color: #f9fafb;
  color: #4b5563;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.parceiros-sidebar h2,
.parceiros-sidebar h3 {
  color: #1f2937;
}
.dark .parceiros-sidebar {
  background-color: #111827;
  color: #d1d5db;
}
.dark .parceiros-sidebar h2,
.dark .parceiros-sidebar h3 {
  color: #f9fafb;
}
.text-amajac-green { color: var(--amajac-green); }
.bg-amajac-green { background-color: var(--amajac-green); }
.bg-amajac-green-hover:hover { background-color: var(--amajac-green-hover); }
</style>