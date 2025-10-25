export const getImageWithFallback = (url, fallback = '/images/placeholder.jpg') => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = () => resolve(fallback)
    img.src = url
  })
}