import { ref, onMounted, watch, onUnmounted } from 'vue'

// Constantes para fallback e configuração
export const DEFAULT_FALLBACK_IMAGE = '/images/placeholder-image.jpg'
export const IMAGE_LOAD_TIMEOUT = 10000 // 10 segundos
export const LAZY_LOAD_ROOT_MARGIN = '100px'
export const LAZY_LOAD_THRESHOLD = 0.1

/**
 * Composable avançado para carregar imagens de forma segura, reativa e com lazy-loading.
 * Ideal para galerias, banners, notícias e eventos.
 */
export function useSafeImage(initialUrl = null) {
  const imageUrl = ref(DEFAULT_FALLBACK_IMAGE)
  const loading = ref(true)
  const error = ref(false)
  const timeoutId = ref(null)
  const observer = ref(null)

  /**
   * Normaliza URLs do Supabase Storage e outras fontes
   */
  const getSafeUrl = (url, fallback = DEFAULT_FALLBACK_IMAGE) => {
    try {
      // Casos de URL vazia ou inválida
      if (!url || typeof url !== 'string' || url.trim() === '') {
        console.warn('📛 URL de imagem vazia ou inválida:', url)
        return fallback
      }

      const trimmedUrl = url.trim()

      // URLs absolutas (http, https, data) - usar diretamente
      if (
        trimmedUrl.startsWith('http://') ||
        trimmedUrl.startsWith('https://') ||
        trimmedUrl.startsWith('data:') ||
        trimmedUrl.startsWith('blob:')
      ) {
        return trimmedUrl
      }

      // URLs relativas do projeto
      if (trimmedUrl.startsWith('/')) {
        return trimmedUrl
      }

      // URLs do Supabase Storage
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (supabaseUrl) {
        // Caso 1: URL já contém o caminho completo do storage
        if (trimmedUrl.includes('/storage/v1/object/public/')) {
          return trimmedUrl
        }

        // Caso 2: URL começa com storage/ ou public/
        if (
          trimmedUrl.startsWith('storage/') ||
          trimmedUrl.startsWith('public/') ||
          trimmedUrl.startsWith('images/')
        ) {
          const cleanUrl = trimmedUrl.replace(/^(storage\/|public\/|images\/)/, '')
          return `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${cleanUrl}`
        }

        // Caso 3: URL é apenas um nome de arquivo
        if (!trimmedUrl.includes('/') && trimmedUrl.includes('.')) {
          return `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/images/${trimmedUrl}`
        }
      }

      // Tentar validar como URL absoluta
      try {
        new URL(trimmedUrl)
        return trimmedUrl
      } catch {
        // Não é uma URL válida, retornar fallback
        console.warn('📛 URL de imagem não pôde ser normalizada:', trimmedUrl)
        return fallback
      }
    } catch (err) {
      console.error('💥 Erro crítico ao processar URL da imagem:', err)
      return fallback
    }
  }

  /**
   * Função interna que carrega a imagem real e atualiza o estado reativo
   */
  const loadImage = (url) => {
    // Reset states
    loading.value = true
    error.value = false

    // Clear previous timeout
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }

    const safeUrl = getSafeUrl(url)

    // Se já é a fallback, não precisa carregar
    if (safeUrl === DEFAULT_FALLBACK_IMAGE) {
      imageUrl.value = safeUrl
      loading.value = false
      error.value = true
      return
    }

    const img = new Image()

    // Timeout para imagens que demoram muito
    timeoutId.value = setTimeout(() => {
      if (loading.value) {
        console.warn('⏰ Timeout ao carregar imagem:', safeUrl)
        handleImageError()
      }
    }, IMAGE_LOAD_TIMEOUT)

    img.src = safeUrl

    img.onload = () => {
      clearTimeout(timeoutId.value)
      imageUrl.value = safeUrl
      loading.value = false
      error.value = false
      console.log('✅ Imagem carregada com sucesso:', safeUrl)
    }

    img.onerror = () => {
      clearTimeout(timeoutId.value)
      handleImageError(safeUrl)
    }
  }

  /**
   * Tratamento centralizado de erros
   */
  const handleImageError = (failedUrl = '') => {
    console.error('❌ Falha ao carregar imagem:', failedUrl)
    imageUrl.value = DEFAULT_FALLBACK_IMAGE
    loading.value = false
    error.value = true
  }

  /**
   * Lazy-load: só carrega quando a imagem entra na viewport
   */
  const lazyLoad = (element, url) => {
    if (!element) {
      loadImage(url)
      return
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback para browsers sem IntersectionObserver
      loadImage(url)
      return
    }

    // Se já tem observer, desconectar
    if (observer.value) {
      observer.value.disconnect()
    }

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage(url)
            observer.value.disconnect()
          }
        })
      },
      {
        rootMargin: LAZY_LOAD_ROOT_MARGIN,
        threshold: LAZY_LOAD_THRESHOLD
      }
    )

    observer.value.observe(element)
  }

  /**
   * Forçar recarregamento da imagem
   */
  const reload = () => {
    if (imageUrl.value && imageUrl.value !== DEFAULT_FALLBACK_IMAGE) {
      loadImage(imageUrl.value)
    }
  }

  /**
   * Reset para estado inicial
   */
  const reset = () => {
    // Cleanup
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }

    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }

    // Reset states
    imageUrl.value = DEFAULT_FALLBACK_IMAGE
    loading.value = true
    error.value = false
  }

  /**
   * Preload múltiplas imagens (útil para galerias)
   */
  const preloadImages = (urls) => {
    return Promise.all(
      urls.map(url => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = getSafeUrl(url)
          img.onload = resolve
          img.onerror = resolve
        })
      })
    )
  }

  // Inicial: carrega imediatamente se houver URL inicial
  if (initialUrl) {
    loadImage(initialUrl)
  }

  // Permite atualizar a imagem dinamicamente
  const setUrl = (url) => {
    reset()
    loadImage(url)
  }

  // Cleanup na destruição do componente
  onUnmounted(() => {
    reset()
  })

  return {
    // States reativos
    imageUrl,
    loading,
    error,
    
    // Actions
    setUrl,
    reload,
    reset,
    lazyLoad,
    preloadImages,
    
    // Utils
    getSafeUrl
  }
}

/**
 * Hook especializado para galerias com múltiplas imagens
 */
export function useGalleryImages(initialImages = []) {
  const images = ref([])
  const loading = ref(true)
  const errors = ref([])

  /**
   * Inicializa o estado das imagens
   */
  const initializeImages = (imageList) => {
    images.value = imageList.map((imageData, index) => {
      const imageState = useSafeImage(imageData.url || imageData.imagem_url)
      
      return {
        ...imageData,
        id: imageData.id || `img-${index}-${Date.now()}`,
        imageState,
        // Métodos de conveniência
        get imageUrl() { return imageState.imageUrl.value },
        get imageLoading() { return imageState.loading.value },
        get imageError() { return imageState.error.value },
        handleLoad: () => imageState.reload(),
        handleError: () => imageState.reload()
      }
    })
    
    loading.value = false
  }

  /**
   * Atualiza a lista de imagens
   */
  const updateImages = (newImages) => {
    // Cleanup das imagens antigas
    images.value.forEach(img => img.imageState.reset())
    initializeImages(newImages)
  }

  /**
   * Preload de imagens para melhor performance
   */
  const preloadGallery = async () => {
    const urls = images.value
      .filter(img => !img.imageState.error.value)
      .map(img => img.url || img.imagem_url)
      .filter(Boolean)

    if (urls.length > 0) {
      loading.value = true
      await Promise.all(
        images.value.map(img => 
          new Promise(resolve => {
            const imgElement = new Image()
            imgElement.src = img.imageState.getSafeUrl(img.url || img.imagem_url)
            imgElement.onload = resolve
            imgElement.onerror = resolve
          })
        )
      )
      loading.value = false
    }
  }

  // Inicialização
  if (initialImages.length > 0) {
    initializeImages(initialImages)
  }

  return {
    images,
    loading,
    errors,
    initializeImages,
    updateImages,
    preloadGallery
  }
}

/**
 * Hook para imagem de placeholder com loading states
 */
export function usePlaceholderImage(options = {}) {
  const {
    placeholder = DEFAULT_FALLBACK_IMAGE,
    loadingMessage = 'Carregando imagem...',
    errorMessage = 'Falha ao carregar imagem'
  } = options

  const imageState = useSafeImage()

  const placeholderStyles = computed(() => ({
    backgroundImage: `url(${placeholder})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }))

  return {
    ...imageState,
    placeholderStyles,
    loadingMessage,
    errorMessage
  }
}

// Exportação padrão para uso comum
export default useSafeImage