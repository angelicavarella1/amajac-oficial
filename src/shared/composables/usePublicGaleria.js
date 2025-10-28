// src/composables/usePublicGaleria.js
import { useGaleriaStore } from '@/modules/galeria/stores/galeria';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onUnmounted, computed } from 'vue';

export function usePublicGaleria() {
  const store = useGaleriaStore();
  const { imagens, loading, error } = storeToRefs(store); // ✅ Removidas variáveis não usadas

  // Computed properties adicionais
  const imagensRecentes = computed(() => {
    return [...imagens.value]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);
  });

  const categoriasDisponiveis = computed(() => {
    const categorias = new Set();
    imagens.value.forEach(imagem => {
      if (imagem.categoria) {
        categorias.add(imagem.categoria);
      }
    });
    return Array.from(categorias);
  });

  const totalImagens = computed(() => imagens.value.length);

  // Métodos
  const carregarGaleria = async () => {
    try {
      await store.fetchImagens();
      return { success: true, count: imagens.value.length };
    } catch (err) {
      console.error('Erro ao carregar galeria:', err);
      return { success: false, error: err.message };
    }
  };

  const fetchImagemById = async (id) => {
    try {
      await store.fetchImagemById(id);
      return { success: true, imagem: store.imagemSelecionada };
    } catch (err) {
      console.error('Erro ao buscar imagem:', err);
      return { success: false, error: err.message };
    }
  };

  const incrementarVisualizacoes = async (id) => {
    try {
      await store.incrementarVisualizacoes(id);
      return { success: true };
    } catch (err) {
      console.error('Erro ao incrementar visualizações:', err);
      return { success: false, error: err.message };
    }
  };

  const imagensPorCategoria = (categoria) => {
    if (!categoria || categoria === 'all') {
      return imagens.value;
    }
    return imagens.value.filter(imagem => 
      imagem.categoria?.toLowerCase() === categoria.toLowerCase()
    );
  };

  const buscarImagens = (termo) => {
    if (!termo) return imagens.value;
    
    const termoLower = termo.toLowerCase();
    return imagens.value.filter(imagem => 
      imagem.titulo?.toLowerCase().includes(termoLower) ||
      imagem.descricao?.toLowerCase().includes(termoLower) ||
      imagem.categoria?.toLowerCase().includes(termoLower)
    );
  };

  const imagensPorPeriodo = (dataInicio, dataFim) => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    return imagens.value.filter(imagem => {
      const dataImagem = new Date(imagem.created_at);
      return dataImagem >= inicio && dataImagem <= fim;
    });
  };

  const limparSelecao = () => {
    store.limparSelecao();
  };

  const recarregarGaleria = async () => {
    store.resetState();
    return await carregarGaleria();
  };

  return {
    // State
    imagens,
    loading,
    error,
    
    // Computed
    imagensRecentes,
    categoriasDisponiveis,
    totalImagens,
    
    // Getters
    imagensPorCategoria,
    buscarImagens,
    imagensPorPeriodo,
    
    // Actions
    carregarGaleria,
    fetchImagemById,
    incrementarVisualizacoes,
    limparSelecao,
    recarregarGaleria
  };
}

// Hook alternativo para uso específico em componentes
export function useGaleriaPaginada(itensPorPagina = 12) {
  const {
    imagens,
    loading,
    error,
    imagensRecentes,
    categoriasDisponiveis,
    carregarGaleria,
    imagensPorCategoria,
    buscarImagens
  } = usePublicGaleria();

  const paginaAtual = ref(1);
  
  const imagensPaginadas = computed(() => {
    const startIndex = (paginaAtual.value - 1) * itensPorPagina;
    const endIndex = startIndex + itensPorPagina;
    return imagens.value.slice(startIndex, endIndex);
  });

  const totalPaginas = computed(() => {
    return Math.ceil(imagens.value.length / itensPorPagina);
  });

  const temProximaPagina = computed(() => {
    return paginaAtual.value < totalPaginas.value;
  });

  const temPaginaAnterior = computed(() => {
    return paginaAtual.value > 1;
  });

  const proximaPagina = () => {
    if (temProximaPagina.value) {
      paginaAtual.value++;
    }
  };

  const paginaAnterior = () => {
    if (temPaginaAnterior.value) {
      paginaAtual.value--;
    }
  };

  const irParaPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas.value) {
      paginaAtual.value = pagina;
    }
  };

  const resetarPaginacao = () => {
    paginaAtual.value = 1;
  };

  return {
    // State base
    imagens,
    loading,
    error,
    
    // Computed base
    imagensRecentes,
    categoriasDisponiveis,
    
    // Paginação
    paginaAtual,
    imagensPaginadas,
    totalPaginas,
    temProximaPagina,
    temPaginaAnterior,
    
    // Ações base
    carregarGaleria,
    imagensPorCategoria,
    buscarImagens,
    
    // Ações de paginação
    proximaPagina,
    paginaAnterior,
    irParaPagina,
    resetarPaginacao
  };
}

// Hook para lightbox
export function useGaleriaLightbox() {
  const {
    imagens,
    incrementarVisualizacoes
  } = usePublicGaleria(); // ✅ Removida variável não usada

  const lightboxAberto = ref(false);
  const indiceAtual = ref(0);
  const loadingImagem = ref(false);

  const imagemAtual = computed(() => {
    return imagens.value[indiceAtual.value];
  });

  const temProxima = computed(() => {
    return indiceAtual.value < imagens.value.length - 1;
  });

  const temAnterior = computed(() => {
    return indiceAtual.value > 0;
  });

  const totalImagens = computed(() => {
    return imagens.value.length;
  });

  const abrirLightbox = async (imagemId) => {
    const index = imagens.value.findIndex(img => img.id === imagemId);
    if (index !== -1) {
      indiceAtual.value = index;
      lightboxAberto.value = true;
      
      // Incrementar visualizações
      await incrementarVisualizacoes(imagemId);
    }
  };

  const fecharLightbox = () => {
    lightboxAberto.value = false;
    indiceAtual.value = 0;
  };

  const proximaImagem = () => {
    if (temProxima.value) {
      indiceAtual.value++;
      const imagemId = imagemAtual.value.id;
      incrementarVisualizacoes(imagemId);
    }
  };

  const imagemAnterior = () => {
    if (temAnterior.value) {
      indiceAtual.value--;
      const imagemId = imagemAtual.value.id;
      incrementarVisualizacoes(imagemId);
    }
  };

  const navegarParaImagem = (index) => {
    if (index >= 0 && index < imagens.value.length) {
      indiceAtual.value = index;
      const imagemId = imagemAtual.value.id;
      incrementarVisualizacoes(imagemId);
    }
  };

  // Navegação por teclado
  const configurarNavegacaoTeclado = () => {
    const handleKeydown = (event) => {
      if (!lightboxAberto.value) return;
      
      switch (event.key) {
        case 'Escape':
          fecharLightbox();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          imagemAnterior();
          break;
        case 'ArrowRight':
          event.preventDefault();
          proximaImagem();
          break;
      }
    };

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown);
    });
  };

  return {
    // State
    lightboxAberto,
    imagemAtual,
    loadingImagem,
    indiceAtual,
    
    // Computed
    temProxima,
    temAnterior,
    totalImagens,
    
    // Actions
    abrirLightbox,
    fecharLightbox,
    proximaImagem,
    imagemAnterior,
    navegarParaImagem,
    configurarNavegacaoTeclado
  };
}

// Exportação padrão para compatibilidade
export default usePublicGaleria;