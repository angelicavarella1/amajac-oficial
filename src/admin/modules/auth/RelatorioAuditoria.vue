<!-- src/admin/modules/auth/RelatorioAuditoria.vue -->
<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">Auditoria do Sistema</h2>
    <RelatorioAuditoriaCompleto />
  </div>
</template>

<script setup>
// CORREÇÃO: Importação atualizada para o caminho correto
import RelatorioAuditoriaCompleto from '@/admin/modules/auth/RelatorioAuditoriaCompleto.vue'
</script>