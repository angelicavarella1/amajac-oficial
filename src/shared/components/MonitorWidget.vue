<!-- src/shared/components/MonitorWidget.vue -->
<template>
  <div class="p-6">
    <MonitorSupabase />
  </div>
</template>

<script setup>
// CORREÇÃO: Importação atualizada para o caminho correto
import MonitorSupabase from '@/admin/modules/auth/MonitorSupabase.vue'
</script>