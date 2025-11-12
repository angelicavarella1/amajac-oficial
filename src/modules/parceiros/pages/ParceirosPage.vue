<!-- 
  Página pública: /parceiros
  Finalidade: Exibir a lista de "Colaboradores - Parceiros Comerciais" para o público.
  - Usa apenas o componente ParceirosSection.vue (reutilização total).
  - Zero lógica duplicada.
  - Zero dados mockados.
  - Alinhado ao branding AMAJAC.
-->

<template>
  <main>
    <ParceirosSection />
  </main>
</template>

<script setup>
// Componente reutilizável que já contém toda a lógica e UI
import ParceirosSection from '../components/ParceirosSection.vue'
</script>

<style scoped>
/* Nenhum estilo necessário — delegado ao componente */
</style>