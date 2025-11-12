// src/core/services/ValidationService.js
/**
 * Validações reutilizáveis para formulários
 */
export class ValidationService {
  static required(value) {
    return value !== null && value !== undefined && value !== ''
  }

  static minLength(value, min) {
    return value?.length >= min
  }

  static url(value) {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  static email(value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(value)
  }

  // Adicione mais conforme necessário
}