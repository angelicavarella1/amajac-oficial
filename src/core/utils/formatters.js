// src/utils/formatters.js

// Formatar data no padrão brasileiro
export function formatarData(dataString) {
  if (!dataString) return ''
  
  const data = new Date(dataString)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Formatar data e hora
export function formatarDataHora(dataString) {
  if (!dataString) return ''
  
  const data = new Date(dataString)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatar telefone para exibição
export function formatarTelefoneDisplay(telefone) {
  if (!telefone) return ''
  
  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '')
  
  // Formata baseado no tamanho
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
  } else if (numeros.length === 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
  } else {
    return telefone
  }
}

// Formatar CPF/CNPJ
export function formatarDocumento(documento) {
  if (!documento) return ''
  
  const numeros = documento.replace(/\D/g, '')
  
  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (numeros.length === 14) {
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  } else {
    return documento
  }
}

// Formatar CEP
export function formatarCEP(cep) {
  if (!cep) return ''
  
  const numeros = cep.replace(/\D/g, '')
  if (numeros.length === 8) {
    return numeros.replace(/(\d{5})(\d{3})/, '$1-$2')
  }
  return cep
}

// Formatar moeda (BRL)
export function formatarMoeda(valor) {
  if (!valor && valor !== 0) return ''
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

// Formatar número com separadores
export function formatarNumero(numero) {
  if (!numero && numero !== 0) return ''
  
  return new Intl.NumberFormat('pt-BR').format(numero)
}

// Capitalizar primeira letra
export function capitalizar(texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

// Truncar texto com ellipsis
export function truncarTexto(texto, maxLength = 100) {
  if (!texto) return ''
  if (texto.length <= maxLength) return texto
  return texto.substring(0, maxLength) + '...'
}

// Formatar bytes para tamanho legível
export function formatarBytes(bytes, decimals = 2) {
  if (!bytes) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default {
  formatarData,
  formatarDataHora,
  formatarTelefoneDisplay,
  formatarDocumento,
  formatarCEP,
  formatarMoeda,
  formatarNumero,
  capitalizar,
  truncarTexto,
  formatarBytes
}