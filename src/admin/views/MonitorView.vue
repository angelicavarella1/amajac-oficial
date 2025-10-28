<template>
  <div class="space-y-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Monitor Supabase</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">Monitoramento completo do banco de dados</p>
    </div>
    
    <MonitorSupabase />
  </div>
</template>

<script setup>
// CORREÇÃO: Importação atualizada para o caminho correto
import MonitorSupabase from '@/admin/modules/auth/MonitorSupabase.vue'
</script>