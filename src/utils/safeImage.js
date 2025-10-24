// src/utils/safeImage.js
// Garante URLs seguras para imagens armazenadas no Supabase ou locais.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const FALLBACK_IMAGE = "/fallback.jpg" // 🖼️ imagem padrão local (substitua se quiser)

/**
 * Retorna uma URL de imagem segura e completa.
 * Corrige URLs relativas, caminhos do Supabase e valores nulos.
 *
 * @param {string|null|undefined} url - URL original da imagem
 * @param {string} [fallback=FALLBACK_IMAGE] - URL alternativa se a principal for inválida
 * @returns {string} URL final segura para uso em <img> ou CSS
 */
export function safeImage(url, fallback = FALLBACK_IMAGE) {
  try {
    // Se a URL estiver vazia ou indefinida
    if (!url || typeof url !== "string" || url.trim() === "") {
      console.warn("🖼️ safeImage: URL vazia, usando fallback:", fallback)
      return fallback
    }

    // Se for uma URL completa
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url
    }

    // Se for um caminho de storage do Supabase
    if (
      url.startsWith("storage/") ||
      url.startsWith("public/") ||
      url.includes("/object/public/")
    ) {
      return `${SUPABASE_URL.replace(/\/+$/, "")}/storage/v1/object/public/${url.replace(/^\/+/, "")}`
    }

    // Se for uma URL local (por exemplo: /images/logo.png)
    if (url.startsWith("/")) {
      return url
    }

    // Tenta criar uma URL válida, caso contrário usa fallback
    new URL(url)
    return url
  } catch (err) {
    console.warn("🖼️ safeImage: erro ao processar URL, usando fallback:", fallback)
    return fallback
  }
}
