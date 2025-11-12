<!-- 
  Componente: QuemSomosSection.vue
  Finalidade: Exibir conteúdo institucional "Quem Somos" do Supabase.
  - Scroll suave para posicionar a seção abaixo do navbar.
  - Layout com imagem acima dos textos (entre título e conteúdo).
-->

<template>
  <section
    id="quem-somos-section"
    ref="sectionRef"
    class="quem-somos-section"
    aria-labelledby="quem-somos-titulo"
  >
    <div class="container">
      <h2 id="quem-somos-titulo" class="titulo">
        {{ titulo }}
      </h2>

      <!-- IMAGEM EM CIMA DOS TEXTOS -->
      <div class="imagem-container" v-if="imagemUrl">
        <img 
          :src="imagemUrl" 
          alt="Imagem institucional da AMAJAC"
          class="imagem-institucional"
          @error="handleImageError"
        />
      </div>

      <div v-if="loading" class="estado-texto">
        Carregando informações institucionais...
      </div>

      <div v-else-if="error" class="estado-texto erro">
        {{ error }}
        <button
          @click="fetchSobre"
          class="btn-tentar-novamente"
          aria-label="Tentar carregar novamente"
        >
          Tentar novamente
        </button>
      </div>

      <!-- ✅ CORREÇÃO: Removido o aviso do v-html -->
      <div
        v-else
        class="conteudo"
        v-html="textoLimpo"
      ></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useSobre } from '@/modules/sobre/composables/useSobre.js'

const { titulo, texto, loading, error, fetchSobre } = useSobre()
const sectionRef = ref(null)
const imagemCarregada = ref(true)

// ✅ CORREÇÃO: Extrair URL da imagem do conteúdo HTML
const imagemUrl = computed(() => {
  if (!texto.value) return null
  
  // Procura por tags img no conteúdo
  const parser = new DOMParser()
  const doc = parser.parseFromString(texto.value, 'text/html')
  const img = doc.querySelector('img')
  
  if (img && img.src) {
    return img.src
  }
  
  return null
})

// ✅ CORREÇÃO: Texto SEM a imagem (para evitar duplicação)
const textoLimpo = computed(() => {
  if (!texto.value) return ''
  
  // Remove tags img do conteúdo
  const parser = new DOMParser()
  const doc = parser.parseFromString(texto.value, 'text/html')
  const imgs = doc.querySelectorAll('img')
  imgs.forEach(img => img.remove())
  
  return doc.body.innerHTML
})

const handleImageError = () => {
  imagemCarregada.value = false
  console.log('❌ Erro ao carregar imagem institucional')
}

// função para rolar até a seção
const scrollToSection = () => {
  if (sectionRef.value) {
    nextTick(() => {
      const navbarHeight = 128 // Altura do navbar (2 linhas)
      const sectionPosition = sectionRef.value.offsetTop - navbarHeight
      
      window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
      })
    })
  }
}

// Expor a função para uso externo
defineExpose({
  scrollToSection
})

onMounted(() => {
  fetchSobre()
  
  // Verificar se deve rolar para a seção (quando vem de navegação)
  const url = new URL(window.location.href)
  if (url.hash === '#quem-somos' || url.pathname.includes('sobre')) {
    setTimeout(scrollToSection, 100)
  }
})
</script>

<style scoped>
.quem-somos-section {
  --amajac-green: #2E7D32;
  padding: 3rem 1rem;
  background-color: #f9fafb;
  color: #1e293b;
  transition: background-color 0.3s, color 0.3s;
  width: 100%;
  scroll-margin-top: 128px; /* Espaço para o navbar fixo (2 linhas) */
}

.dark .quem-somos-section {
  background-color: #111827;
  color: #f1f5f9;
}

/* Container principal */
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.titulo {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--amajac-green);
  margin-bottom: 2rem;
  text-align: center;
}

/* ✅ CONTAINER DA IMAGEM EM CIMA DOS TEXTOS */
.imagem-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 3rem auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.imagem-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.imagem-institucional {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.conteudo {
  font-size: 1.125rem;
  line-height: 1.75;
  color: #334155;
  max-width: 800px;
  margin: 0 auto;
}

.dark .conteudo {
  color: #e2e8f0;
}

/* Estilos para os subtítulos */
.conteudo :deep(.subtitulo) {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--amajac-green);
  margin: 2rem 0 1rem 0;
  border-bottom: 2px solid var(--amajac-green);
  padding-bottom: 0.5rem;
  text-align: left;
}

.conteudo :deep(.historia-section),
.conteudo :deep(.missao-section),
.conteudo :deep(.visao-section),
.conteudo :deep(.valores-section) {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--amajac-green);
  margin-bottom: 2rem;
}

.dark .conteudo :deep(.historia-section),
.dark .conteudo :deep(.missao-section),
.dark .conteudo :deep(.visao-section),
.dark .conteudo :deep(.valores-section) {
  background: #1f2937;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.conteudo :deep(p) {
  margin-bottom: 1.5rem;
  line-height: 1.7;
  text-align: justify;
}

.conteudo :deep(ul),
.conteudo :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.conteudo :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

/* Estados */
.estado-texto {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-style: italic;
  font-size: 1.1rem;
}

.erro {
  color: #ef4444;
}

.btn-tentar-novamente {
  display: block;
  margin: 1rem auto 0;
  padding: 0.75rem 2rem;
  background-color: var(--amajac-green);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-tentar-novamente:hover {
  background-color: #256a2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

/* Responsivo */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .titulo {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .imagem-container {
    margin-bottom: 2rem;
    border-radius: 8px;
  }
  
  .conteudo {
    font-size: 1rem;
  }
  
  .conteudo :deep(.subtitulo) {
    font-size: 1.25rem;
  }
  
  .conteudo :deep(.historia-section),
  .conteudo :deep(.missao-section),
  .conteudo :deep(.visao-section),
  .conteudo :deep(.valores-section) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .quem-somos-section {
    padding: 2rem 0.5rem;
    scroll-margin-top: 112px;
  }
  
  .titulo {
    font-size: 1.75rem;
  }
  
  .imagem-container {
    margin-bottom: 1.5rem;
  }
}
</style>