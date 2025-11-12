<template>
  <div class="parceiros-fixo" v-if="parceiros.length > 0">
    <div class="parceiros-header">
      <h3 class="parceiros-title"> Parceiros Comerciais</h3>
      <div class="parceiros-separator"></div>
    </div>
    <div class="parceiros-lista">
      <div 
        v-for="parceiro in parceiros" 
        :key="parceiro.id"
        class="parceiro-item"
      >
        <img 
          v-if="parceiro.logo" 
          :src="parceiro.logo" 
          :alt="parceiro.alt"
          class="parceiro-logo"
          @error="handleImageError"
        >
        <div v-else class="parceiro-logo-fallback">
          <span class="text-2xl"></span>
        </div>
        <h4 class="parceiro-nome">{{ parceiro.nome }}</h4>
        <p v-if="parceiro.descricao" class="parceiro-desc">{{ parceiro.descricao }}</p>
        <a 
          v-if="parceiro.url && parceiro.url !== '#'" 
          :href="parceiro.url" 
          target="_blank"
          rel="noopener noreferrer"
          class="parceiro-link"
        >
          Visitar
        </a>
      </div>
    </div>
    <div class="parceiros-footer">
      <router-link to="/parceiros" class="ver-todos">
        Ver todos os parceiros 
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getParceirosAtivos } from '@/modules/parceiros/composables/useParceiros.js'

const parceiros = ref([])

const handleImageError = (event) => {
  event.target.style.display = 'none'
  const fallback = event.target.nextElementSibling
  if (fallback) fallback.style.display = 'flex'
}

onMounted(async () => {
  try {
    //  Busca da tabela CORRETA: parceiros_comerciais
    const dados = await getParceirosAtivos({ limit: 5 })
    parceiros.value = dados
  } catch (error) {
    console.warn('Erro ao carregar parceiros do Supabase:', error)
    // Fallback mínimo
    parceiros.value = []
  }
})
</script>

<style scoped>
.parceiros-fixo {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 280px;
  max-height: calc(100vh - 40px);
  background: white;
  border: 2px solid #10b981;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  z-index: 40;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dark .parceiros-fixo {
  background: #1f2937;
  border-color: #10b981;
}

.parceiros-header {
  padding: 16px;
  text-align: center;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.parceiros-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.parceiros-separator {
  height: 2px;
  background: rgba(255,255,255,0.3);
  margin-top: 8px;
}

.parceiros-lista {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.parceiro-item {
  background: rgba(16, 185, 129, 0.05);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: transform 0.2s ease;
}

.parceiro-item:hover {
  transform: translateY(-2px);
  background: rgba(16, 185, 129, 0.1);
}

.parceiro-logo {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin: 0 auto 10px;
  display: block;
}

.parceiro-logo-fallback {
  width: 60px;
  height: 60px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  color: #10b981;
}

.parceiro-nome {
  font-weight: 700;
  font-size: 0.95rem;
  margin: 0 0 6px;
  color: #1f2937;
}

.dark .parceiro-nome {
  color: #f9fafb;
}

.parceiro-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0 0 8px;
  line-height: 1.3;
}

.dark .parceiro-desc {
  color: #d1d5db;
}

.parceiro-link {
  display: inline-block;
  padding: 4px 12px;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background 0.2s ease;
}

.parceiro-link:hover {
  background: #059669;
  text-decoration: none;
}

.parceiros-footer {
  padding: 12px;
  text-align: center;
  border-top: 1px solid rgba(16, 185, 129, 0.2);
}

.ver-todos {
  color: #10b981;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.ver-todos:hover {
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 1024px) {
  .parceiros-fixo {
    display: none;
  }
}
</style>