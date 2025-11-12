<!-- 
  Página pública: /galeria
  Finalidade: Exibir a galeria de fotos para o público.
  - Usa apenas o componente GaleriaSection.vue (reutilização total).
  - Zero lógica duplicada.
  - Zero dados mockados.
  - Alinhado ao branding AMAJAC.
-->

<template>
  <main>
    <GaleriaSection />
  </main>
</template>

<script setup>
// Componente reutilizável que já contém toda a lógica e UI
import GaleriaSection from '../components/GaleriaSection.vue'
</script>

<style scoped>
/* Nenhum estilo necessário — delegado ao componente */
</style>