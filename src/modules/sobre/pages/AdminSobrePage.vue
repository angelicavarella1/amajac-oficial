<!-- src/modules/admin/pages/AdminSobrePage.vue -->
<template>
  <div class="admin-sobre-page p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-amajac-green mb-6 dark:text-amajac-green-light">
        Editar Conteúdo Institucional
      </h1>
      
      <AdminSobreForm />
    </div>
  </div>
</template>

<script setup>
import AdminSobreForm from '@/modules/sobre/components/AdminSobreForm.vue'
</script>

<style scoped>
/* Estilos já alinhados com AMAJAC */
</style>