// src/composables/useImageLoader.js
import { ref, watch } from 'vue'

export function useImageLoader(imageUrl) {
  const imageState = ref({
    loading: false,
    error: false,
    imageUrl: null,
    lazyLoad: () => {} // Função placeholder para compatibilidade
  })

  const loadImage = async (url) => {
    if (!url) {
      imageState.value = {
        loading: false,
        error: true,
        imageUrl: null,
        lazyLoad: () => {}
      }
      return
    }

    imageState.value = {
      loading: true,
      error: false,
      imageUrl: null,
      lazyLoad: () => {}
    }

    try {
      // Simular loading para melhor UX
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const img = new Image()
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          imageState.value = {
            loading: false,
            error: false,
            imageUrl: url,
            lazyLoad: () => {}
          }
          resolve()
        }
        
        img.onerror = () => {
          imageState.value = {
            loading: false,
            error: true,
            imageUrl: null,
            lazyLoad: () => {}
          }
          reject(new Error('Falha ao carregar imagem'))
        }
        
        img.src = url
      })
    } catch (error) {
      console.error('Erro ao carregar imagem:', error)
      imageState.value = {
        loading: false,
        error: true,
        imageUrl: null,
        lazyLoad: () => {}
      }
    }
  }

  // Observar mudanças na URL
  if (typeof imageUrl === 'function') {
    watch(imageUrl, (newUrl) => {
      loadImage(newUrl)
    }, { immediate: true })
  } else {
    loadImage(imageUrl)
  }

  // Função de lazy load para observer (simplificada)
  const setupLazyLoad = (element, url) => {
    if (!element || !url) return
    
    // Simular lazy load básico
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(url)
          observer.unobserve(entry.target)
        }
      })
    }, {
      rootMargin: '50px'
    })

    observer.observe(element)
    
    // Retornar função para parar de observar
    return () => observer.unobserve(element)
  }

  return {
    imageState,
    setupLazyLoad
  }
}

// Versão simplificada para uso direto
export function useSimpleImageLoader(url) {
  const { imageState } = useImageLoader(url)
  return { imageState }
}

export default useImageLoader