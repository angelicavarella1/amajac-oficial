// Constantes para imagens e configurações visuais
export const DEFAULT_FALLBACK_IMAGE = '/images/placeholder-image.jpg'

export const IMAGE_PLACEHOLDERS = {
  GALLERY: '/images/placeholders/gallery-placeholder.jpg',
  AVATAR: '/images/placeholders/avatar-placeholder.png',
  BANNER: '/images/placeholders/banner-placeholder.jpg',
  EVENT: '/images/placeholders/event-placeholder.jpg',
  NEWS: '/images/placeholders/news-placeholder.jpg'
}

export const IMAGE_SIZES = {
  THUMBNAIL: { width: 300, height: 200 },
  CARD: { width: 400, height: 300 },
  BANNER: { width: 1200, height: 400 },
  GALLERY: { width: 800, height: 600 },
  FULLSCREEN: { width: 1920, height: 1080 }
}

export const IMAGE_QUALITY = {
  LOW: 0.6,
  MEDIUM: 0.75,
  HIGH: 0.9,
  MAX: 1.0
}

export const LAZY_LOAD_CONFIG = {
  ROOT_MARGIN: '100px',
  THRESHOLD: 0.1,
  TIMEOUT: 10000
}