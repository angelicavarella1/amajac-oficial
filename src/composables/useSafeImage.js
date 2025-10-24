import { ref, onUnmounted, computed } from 'vue'

// Constantes para fallback e configuração
export const DEFAULT_FALLBACK_IMAGE = '/images/placeholder-image.jpg'
export const IMAGE_LOAD_TIMEOUT = 10000 // 10 segundos
export const LAZY_LOAD_ROOT_MARGIN = '100px'
export const LAZY_LOAD_THRESHOLD = 0.1

export function useSafeImage(initialUrl = null) {
  const imageUrl = ref(DEFAULT_FALLBACK_IMAGE)
  const loading = ref(true)
  const error = ref(false)
  const timeoutId = ref(null)
  const observer = ref(null)

  const getSafeUrl = (url, fallback = DEFAULT_FALLBACK_IMAGE) => {
    try {
      if (!url || typeof url !== 'string' || url.trim() === '') return fallback
      const trimmedUrl = url.trim()
      if (
        trimmedUrl.startsWith('http://') ||
        trimmedUrl.startsWith('https://') ||
        trimmedUrl.startsWith('data:') ||
        trimmedUrl.startsWith('blob:')
      ) return trimmedUrl
      if (trimmedUrl.startsWith('/')) return trimmedUrl

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (supabaseUrl) {
        if (trimmedUrl.includes('/storage/v1/object/public/')) return trimmedUrl
        if (
          trimmedUrl.startsWith('storage/') ||
          trimmedUrl.startsWith('public/') ||
          trimmedUrl.startsWith('images/')
        ) {
          const cleanUrl = trimmedUrl.replace(/^(storage\/|public\/|images\/)/, '')
          return `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${cleanUrl}`
        }
        if (!trimmedUrl.includes('/') && trimmedUrl.includes('.')) {
          return `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/images/${trimmedUrl}`
        }
      }

      try {
        new URL(trimmedUrl)
        return trimmedUrl
      } catch {
        return fallback
      }
    } catch (err) {
      console.error('💥 Erro crítico ao processar URL da imagem:', err)
      return fallback
    }
  }

  const loadImage = (url) => {
    loading.value = true
    error.value = false
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }

    const safeUrl = getSafeUrl(url)
    if (safeUrl === DEFAULT_FALLBACK_IMAGE) {
      imageUrl.value = safeUrl
      loading.value = false
      error.value = true
      return
    }

    const img = new Image()
    timeoutId.value = setTimeout(() => {
      if (loading.value) handleImageError()
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

  const handleImageError = (failedUrl = '') => {
    console.error('❌ Falha ao carregar imagem:', failedUrl)
    imageUrl.value = DEFAULT_FALLBACK_IMAGE
    loading.value = false
    error.value = true
  }

  const lazyLoad = (elementOrContainer, url = null) => {
    if (!elementOrContainer) return

    // Detecta todas as <img> dentro do container ou usa a img passada
    const images = elementOrContainer.tagName === 'IMG'
      ? [elementOrContainer]
      : Array.from(elementOrContainer.querySelectorAll('img'))

    if (!('IntersectionObserver' in window)) {
      images.forEach(img => {
        const imgUrl = url || img.dataset.src || img.src
        loadImage(imgUrl)
      })
      return
    }

    const obs = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            const imgUrl = url || img.dataset.src || img.src
            loadImage(imgUrl)
            observerInstance.unobserve(img)
          }
        })
      },
      {
        rootMargin: LAZY_LOAD_ROOT_MARGIN,
        threshold: LAZY_LOAD_THRESHOLD
      }
    )

    images.forEach(img => obs.observe(img))
    observer.value = obs
  }

  const reload = () => {
    if (imageUrl.value && imageUrl.value !== DEFAULT_FALLBACK_IMAGE) {
      loadImage(imageUrl.value)
    }
  }

  const reset = () => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
    imageUrl.value = DEFAULT_FALLBACK_IMAGE
    loading.value = true
    error.value = false
  }

  const preloadImages = (urls) => {
    return Promise.all(
      urls.map(url => new Promise(resolve => {
        const img = new Image()
        img.src = getSafeUrl(url)
        img.onload = resolve
        img.onerror = resolve
      }))
    )
  }

  if (initialUrl) loadImage(initialUrl)

  const setUrl = (url) => {
    reset()
    loadImage(url)
  }

  onUnmounted(() => reset())

  return {
    imageUrl,
    loading,
    error,
    setUrl,
    reload,
    reset,
    lazyLoad,
    preloadImages,
    getSafeUrl
  }
}

export function useGalleryImages(initialImages = []) {
  const images = ref([])
  const loading = ref(true)
  const errors = ref([])

  const initializeImages = (imageList) => {
    images.value = imageList.map((imageData, index) => {
      const imageState = useSafeImage(imageData.url || imageData.imagem_url)
      return {
        ...imageData,
        id: imageData.id || `img-${index}-${Date.now()}`,
        imageState,
        get imageUrl() { return imageState.imageUrl.value },
        get imageLoading() { return imageState.loading.value },
        get imageError() { return imageState.error.value },
        handleLoad: () => imageState.reload(),
        handleError: () => imageState.reload()
      }
    })
    loading.value = false
  }

  const updateImages = (newImages) => {
    images.value.forEach(img => img.imageState.reset())
    initializeImages(newImages)
  }

  const preloadGallery = async () => {
    const urls = images.value
      .filter(img => !img.imageState.error.value)
      .map(img => img.url || img.imagem_url)
      .filter(Boolean)

    if (urls.length > 0) {
      loading.value = true
      await Promise.all(
        images.value.map(img => new Promise(resolve => {
          const imgElement = new Image()
          imgElement.src = img.imageState.getSafeUrl(img.url || img.imagem_url)
          imgElement.onload = resolve
          imgElement.onerror = resolve
        }))
      )
      loading.value = false
    }
  }

  if (initialImages.length > 0) initializeImages(initialImages)

  return { images, loading, errors, initializeImages, updateImages, preloadGallery }
}

export function usePlaceholderImage(options = {}) {
  const { placeholder = DEFAULT_FALLBACK_IMAGE, loadingMessage = 'Carregando imagem...', errorMessage = 'Falha ao carregar imagem' } = options
  const imageState = useSafeImage()
  const placeholderStyles = computed(() => ({
    backgroundImage: `url(${placeholder})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }))
  return { ...imageState, placeholderStyles, loadingMessage, errorMessage }
}

export default useSafeImage
