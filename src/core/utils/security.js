// src/utils/security.js

// Sanitizar strings para prevenir XSS
export function safeString(str) {
  if (str === null || str === undefined) return ''
  
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Sanitizar arrays
export function safeArray(arr) {
  if (!Array.isArray(arr)) return []
  return arr.map(item => {
    if (typeof item === 'string') return safeString(item)
    return item
  })
}

// Sanitizar objetos
export function safeObject(obj) {
  if (typeof obj !== 'object' || obj === null) return {}
  
  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = safeString(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

// Validar email
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validar telefone brasileiro
export function validarTelefone(telefone) {
  const regex = /^(\d{10,11})$/
  return regex.test(telefone.replace(/\D/g, ''))
}

// Sanitizar HTML (para conteúdo rico)
export function sanitizeHTML(html) {
  if (!html) return ''
  
  // Remove scripts e eventos perigosos
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '')
}

export default {
  safeString,
  safeArray,
  safeObject,
  validarEmail,
  validarTelefone,
  sanitizeHTML
}