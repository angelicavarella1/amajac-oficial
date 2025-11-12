// src/core/utils/crypto.js

// AVISO DE SEGURANÇA: Mude para algo mais longo e aleatório. 
// O ideal é que esta lógica de criptografia de dados sensíveis seja movida para o servidor (backend).
const SECRET_KEY = 'AMAJAC-SECRET-2025-MUITO-LONGO-E-ALEATORIO-1234567890ABCDEF' 

/**
 * Deriva a chave criptográfica a partir da SECRET_KEY e um salt estático.
 * @returns {Promise<CryptoKey>}
 */
async function getKey() {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('AMAJAC-SALT-2025'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Criptografa o valor (CPF ou CNPJ) usando AES-GCM.
 * O valor retornado é IV + Ciphertext codificado em Base64.
 * @param {string} value O valor a ser criptografado (ex: '11122233344').
 * @returns {Promise<string|null>} O valor criptografado em Base64 ou null.
 */
export async function encryptCPF_CNPJ(value) {
  if (!value) return null
  // Remove caracteres não numéricos
  const cleanValue = value.replace(/\D/g, '')
  
  const key = await getKey()
  // Initialization Vector (IV): Deve ser único para cada criptografia
  const iv = crypto.getRandomValues(new Uint8Array(12)) 
  const enc = new TextEncoder()
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(cleanValue)
  )
  
  // Concatena IV (12 bytes) + Ciphertext
  const result = new Uint8Array(iv.length + encrypted.byteLength)
  result.set(iv, 0)
  result.set(new Uint8Array(encrypted), iv.length)
  
  // Converte o Uint8Array resultante para string Base64
  return btoa(String.fromCharCode(...result))
}

/**
 * Descriptografa o valor criptografado.
 * @param {string} encryptedValue O valor criptografado em Base64.
 * @returns {Promise<string|null>} O valor descriptografado ou fallback.
 */
export async function decryptCPF_CNPJ(encryptedValue) {
  if (!encryptedValue) return null
  try {
    const key = await getKey()
    
    // 1. Decodifica Base64 para string binária
    const binaryString = atob(encryptedValue)
    
    // 2. CORREÇÃO: Converte a string binária inteira para Uint8Array corretamente
    const combined = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i)
    }

    // 3. Fatia o IV (primeiros 12 bytes) e o Ciphertext (o restante)
    const iv = combined.slice(0, 12)
    const ciphertext = combined.slice(12)
    
    // 4. Descriptografa
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    )
    
    const dec = new TextDecoder()
    return dec.decode(decrypted)
  } catch (e) {
    // Se houver erro (chave errada, dado corrompido, etc.), retorna um fallback
    console.warn('Falha ao descriptografar CPF/CNPJ:', e)
    return '***.***.***-**' 
  }
}