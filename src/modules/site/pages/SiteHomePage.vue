<template>
  <div class="site-home">
    <main class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
      <QuemSomosSection />
      <NoticiasSection />
      <EventosSection />
      <ClassificadosSection />
      <GaleriaSection />
    </main>
  </div>
</template>

<script setup>
import QuemSomosSection from '@/modules/sobre/components/QuemSomosSection.vue'
import NoticiasSection from '@/modules/noticias/components/NoticiasSection.vue'
import EventosSection from '@/modules/eventos/components/EventosSection.vue'
import ClassificadosSection from '@/modules/classificados/components/ClassificadosSection.vue'
// ✅ ParceirosSection REMOVIDA
// import ParceirosSection from '@/modules/parceiros/components/ParceirosSection.vue' 
import GaleriaSection from '@/modules/galeria/components/GaleriaSection.vue'
</script>

<style scoped>
.site-home {
  background-color: #f9fafb;
}
.dark .site-home {
  background-color: #111827;
}
</style>