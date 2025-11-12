<!-- 
  Página pública: /sobre
  Finalidade: Exibir a seção "Quem Somos" em uma página dedicada.
  - Usa apenas o componente QuemSomosSection.vue (reutilização total).
  - Zero lógica duplicada.
  - Alinhado ao branding AMAJAC.
-->

<template>
  <main>
    <QuemSomosSection />
  </main>
</template>

<script setup>
// Componente reutilizável que já contém toda a lógica e UI
import QuemSomosSection from '../components/QuemSomosSection.vue'
</script>

<style scoped>
/* Nenhum estilo necessário — delegado ao componente */
</style>