<!-- 
  Página pública: /eventos
  Finalidade: Exibir a lista completa de eventos para o público.
  - Usa apenas o componente EventosSection.vue (reutilização total).
  - Zero lógica duplicada.
  - Zero dados mockados.
  - Alinhado ao branding AMAJAC.
-->

<template>
  <main>
    <EventosSection />
  </main>
</template>

<script setup>
// Componente reutilizável que já contém toda a lógica e UI
import EventosSection from '../components/EventosSection.vue'
</script>

<style scoped>
/* Nenhum estilo necessário — delegado ao componente */
</style>