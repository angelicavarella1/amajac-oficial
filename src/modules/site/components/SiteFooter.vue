<!-- src/modules/site/components/SiteFooter.vue -->
<template>
  <footer id="site-footer" class="site-footer">
    <div class="max-w-7xl mx-auto px-4">
      <!-- 5 COLUNAS NO RODAPÉ -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <!-- PRIMEIRA COLUNA - Logo e Missão -->
        <div>
          <div class="flex flex-col items-start mb-4">
            <div class="w-8 h-8 rounded-full overflow-hidden bg-white mb-2">
              <img 
                src="/images/logo-amajac.png"
                alt="Logotipo AMAJAC" 
                class="w-full h-full object-cover"
                @error="handleImageError"
              >
            </div>
            <h3 class="text-lg font-bold">AMAJAC</h3>
            <p class="text-green-100 text-xs mt-2">
              Associação de Moradores e Amigos do Jardim Atlântico Central
            </p>
          </div>
          <p class="text-green-100 text-sm mt-4 leading-relaxed">
            Juntos pelo desenvolvimento urbano e social do nosso bairro.
          </p>
        </div>

        <!-- SEGUNDA COLUNA - Área Restrita -->
        <div>
          <h3 class="text-lg font-bold mb-4">Área Restrita</h3>
          <ul class="space-y-3">
            <li>
              <a
                href="https://sosjacapp.amajac.org.br/login"
                target="_blank"
                rel="noopener noreferrer"
                class="text-green-100 hover:text-green-300 transition-colors duration-200 flex items-center text-sm"
              >
                <span class="mr-2">🚨</span>
                SOSJAC
              </a>
            </li>
            <li>
              <a
                href="https://associacoes.softaliza.com.br/login/amajac"
                target="_blank"
                rel="noopener noreferrer"
                class="text-green-100 hover:text-green-300 transition-colors duration-200 flex items-center text-sm"
              >
                <span class="mr-2">👤</span>
                ASSOCIADO
              </a>
            </li>
            <li>
              <router-link
                to="/admin"
                class="text-green-100 hover:text-green-300 transition-colors duration-200 flex items-center text-sm"
                active-class="font-semibold text-green-300"
              >
                <span class="mr-2">⚙️</span>
                ADMINISTRAÇÃO
              </router-link>
            </li>
          </ul>
        </div>

        <!-- TERCEIRA COLUNA - Acesso Rápido -->
        <div>
          <h3 class="text-lg font-bold mb-3">Acesso Rápido</h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/sobre"
                class="text-green-100 hover:text-green-300 transition-colors duration-200 text-sm"
                active-class="font-semibold text-green-300"
              >
                Quem Somos
              </router-link>
            </li>
            <li>
              <router-link
                to="/noticias"
                class="text-green-100 hover:text-green-300 transition-colors duration-200 text-sm"
                active-class="font-semibold text-green-300"
              >
                Notícias
              </router-link>
            </li>
            <li>
              <router-link
                to="/eventos"
                class="text-green-100 hover:text-green-300 transition-colors duration-200 text-sm"
                active-class="font-semibold text-green-300"
              >
                Eventos
              </router-link>
            </li>
            <li>
              <router-link
                to="/classificados"
                class="text-green-100 hover:text-green-300 transition-colors duration-200 text-sm"
                active-class="font-semibold text-green-300"
              >
                Classificados
              </router-link>
            </li>
            <li>
              <router-link
                to="/galeria"
                class="text-green-100 hover:text-green-300 transition-colors duration-200 text-sm"
                active-class="font-semibold text-green-300"
              >
                Galeria
              </router-link>
            </li>
          </ul>
        </div>

        <!-- QUARTA COLUNA - Contatos -->
        <div>
          <h3 class="text-lg font-bold mb-4">Contato</h3>
          <address class="not-italic text-green-100 space-y-3 text-sm leading-relaxed">
            <p>AMAJAC – Jardim Atlântico Central</p>
            <p>Rua Izabel Cristina Ouvina, 112</p>
            <p>Maricá - RJ, CEP 24934-405</p>
            <p>
              <a
                href="https://wa.me/5521978979840"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center text-green-100 hover:text-green-300 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.172-1.171" />
                </svg>
                (21) 97897-9840
              </a>
            </p>
            <p>
              <a 
                href="mailto:contato@amajac.org.br" 
                class="text-green-100 hover:text-green-300 transition-colors duration-200"
              >
                comunicacao@amajac.org.br
              </a>
            </p>
          </address>
        </div>

        <!-- QUINTA COLUNA - Fale Conosco (MODAL) -->
        <div>
          <h3 class="text-lg font-bold mb-4">Atendimento</h3>
          <button 
            @click="handleOpenModal"
            class="fale-conosco-btn"
          >
            <span class="btn-icon">📧</span>
            <span class="btn-text">Fale Conosco</span>
          </button>
          <p class="text-green-100 text-xs mt-3 leading-relaxed">
            Entre em contato com a AMAJAC. Responderemos o mais breve possível.
          </p>
        </div>
      </div>

      <!-- RODAPÉ INFERIOR -->
      <div class="border-t border-green-700 mt-4 pt-3 text-center text-green-200 text-sm">
        <p>&copy; {{ new Date().getFullYear() }} AMAJAC — Associação de Moradores e Amigos do Bairro Jardim Atlântico Central</p>
        <p class="mt-1">
          <router-link 
            to="/termos" 
            class="hover:text-green-300 transition-colors duration-200"
          >
            Termos de Uso
          </router-link> |
          <router-link 
            to="/privacidade" 
            class="hover:text-green-300 transition-colors duration-200"
          >
            Política de Privacidade
          </router-link>
        </p>
        <p class="mt-2 text-green-300 text-xs">
          Desenvolvido por Angélica Varella
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue' // ✅ ADICIONADO

// Definir emits
const emit = defineEmits(['openModal'])

// função para abrir modal
const handleOpenModal = () => {
  console.log('🎯 BOTÃO CLICADO - Emitindo evento openModal')
  emit('openModal')
}

// ✅ CORREÇÃO: ESCUTAR EVENTO GLOBAL PARA ABRIR MODAL
const handleGlobalModalOpen = () => {
  console.log('📩 Evento global recebido no Footer - Abrindo modal')
  handleOpenModal()
}

// ✅ CORREÇÃO: CONFIGURAR LISTENER DO EVENTO
onMounted(() => {
  window.addEventListener('openContactModal', handleGlobalModalOpen)
  console.log('👂 Listener do evento openContactModal configurado no Footer')
})

onUnmounted(() => {
  window.removeEventListener('openContactModal', handleGlobalModalOpen)
})

const handleImageError = (event) => {
  event.target.onerror = null; 
  const parent = event.target.parentElement;
  if (parent) {
    parent.innerHTML = `<span class="text-sm font-bold text-green-800 flex items-center justify-center h-full">A</span>`;
    parent.classList.add('bg-green-300');
  }
}
</script>

<style scoped>
.site-footer {
  background-color: #1B5E20;
  color: white;
  padding: 1.5rem 0 1rem;
  position: relative;
  z-index: 1;
}

/* Garantir contraste no dark mode */
.dark .site-footer {
  background-color: #1B5E20;
}

.text-green-100 { color: #f0fdf4; }
.text-green-200 { color: #ccfbf1; }
.text-green-300 { color: #a7f3d0; }

/* BOTÃO FALE CONOSCO */
.fale-conosco-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.fale-conosco-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  font-size: 1.125rem;
}

.btn-text {
  white-space: nowrap;
}

/* Melhorar acessibilidade para links */
.site-footer a:focus,
.fale-conosco-btn:focus {
  outline: 2px solid #a7f3d0;
  outline-offset: 2px;
  border-radius: 2px;
}

/* Responsividade adicional */
@media (max-width: 768px) {
  .site-footer {
    padding: 1rem 0 0.75rem;
  }
  
  .grid {
    gap: 1.5rem;
    grid-template-columns: 1fr;
  }

  .fale-conosco-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>