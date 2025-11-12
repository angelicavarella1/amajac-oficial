<template>
  <div class="site-layout bg-gray-50 dark:bg-gray-900">
    <SiteNavbar />
    <AmajacBanner />
    
    <div class="clima-section">
      <div class="container mx-auto px-4">
        <PrevisaoTempo /> 
      </div>
    </div>

    <div class="site-grid container mx-auto px-4 py-6">
      <main class="main-content">
        <RouterView />
      </main>
      
      <aside v-if="!isMobile" class="parceiros-lateral">
        <ParceirosSection />
      </aside>
    </div>

    <SiteFooter 
      @open-modal="openModal"
    />
    
    <ModalContato 
      :isOpen="isModalOpen" 
      @close="closeModal" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useModal } from '@/composables/useModal'
import SiteNavbar from '@/modules/site/components/SiteNavbar.vue'
import AmajacBanner from '@/components/AmajacBanner.vue'
import PrevisaoTempo from '@/components/ui/PrevisaoTempo.vue'
import SiteFooter from '@/modules/site/components/SiteFooter.vue'
import ModalContato from '@/components/ui/ModalContato.vue'
import ParceirosSection from '@/modules/parceiros/components/ParceirosSection.vue'

const isMobile = ref(window.innerWidth <= 1024)
const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal()

onMounted(() => {
  const handleResize = () => {
    isMobile.value = window.innerWidth <= 1024
  }
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.site-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* SEÇÃO DO CLIMA */
.clima-section {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
}

.dark .clima-section {
  background: #1f2937;
  border-bottom-color: #374151;
}

.site-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
  flex-grow: 1;
}

.main-content {
  min-width: 0;
}

.parceiros-lateral {
  display: flex;
  flex-direction: column;
  position: sticky; 
  top: 2rem; 
  align-self: flex-start;
  height: fit-content;
  z-index: 10;
}

@media (max-width: 1024px) {
  .site-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .parceiros-lateral {
    display: none; 
  }
}
</style>