// src/modules/site/composables/useContato.js
/**
 * Composable reativo para envio de mensagens de contato via seção pública do site.
 * - Tabela: mensagens_contato
 * - Campos: nome, email, telefone, assunto, mensagem, lida (false)
 * - Não duplica lógica do módulo 'mensagens', mas oferece escopo isolado para o site.
 */

import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js' // ✅ Caminho correto

export function useContato() {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  /**
   * Envia uma mensagem de contato para a tabela `mensagens_contato`.
   * @param {Object} dados - { nome, email, telefone, assunto, mensagem }
   */
  const enviar = async (dados) => {
    const { nome, email, telefone, assunto, mensagem } = dados

    // Validações mínimas
    if (!nome?.trim()) throw new Error('O nome é obrigatório.')
    if (!email?.trim()) throw new Error('O e-mail é obrigatório.')
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('E-mail inválido.')
    if (!assunto?.trim()) throw new Error('O assunto é obrigatório.')
    if (!mensagem?.trim()) throw new Error('A mensagem é obrigatória.')

    loading.value = true
    error.value = null
    success.value = false

    try {
      const { error: supabaseError } = await supabase
        .from('mensagens_contato')
        .insert({
          nome: nome.trim(),
          email: email.trim(),
          telefone: telefone?.trim() || null,
          assunto: assunto.trim(),
          mensagem: mensagem.trim(),
          lida: false
        })

      if (supabaseError) throw supabaseError

      success.value = true
    } catch (err) {
      console.error('[useContato] Erro ao enviar mensagem:', err)
      error.value = err.message || 'Falha ao enviar a mensagem. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    enviar
  }
}