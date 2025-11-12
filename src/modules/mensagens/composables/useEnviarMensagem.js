// src/modules/mensagens/composables/useEnviarMensagem.js
/**
 * Composable para enviar mensagens de contato ao Supabase.
 * - Valida campos obrigatórios.
 * - Envia dados para a tabela `mensagens_contato`.
 * - Não envia e-mail diretamente (feito no backend Deno).
 * - Retorna status de sucesso/erro.
 */

import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

export function useEnviarMensagem() {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const mensagemId = ref(null)

  /**
   * Valida os dados da mensagem
   * @param {Object} dados - { nome, email, telefone, assunto, mensagem }
   */
  const validarDados = (dados) => {
    const { nome, email, telefone, assunto, mensagem } = dados
    const erros = []

    // Validações básicas
    if (!nome?.trim()) erros.push('O nome é obrigatório.')
    if (!email?.trim()) erros.push('O e-mail é obrigatório.')
    if (!assunto?.trim()) erros.push('O assunto é obrigatório.')
    if (!mensagem?.trim()) erros.push('A mensagem é obrigatória.')

    // Validação de e-mail
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      erros.push('E-mail inválido.')
    }

    // Validação de telefone (opcional, mas se fornecido deve ser válido)
    if (telefone && !/^[\d\s\(\)\-\+]+$/.test(telefone)) {
      erros.push('Telefone inválido.')
    }

    // Validação de comprimento
    if (nome?.trim().length < 2) erros.push('Nome deve ter pelo menos 2 caracteres.')
    if (assunto?.trim().length < 5) erros.push('Assunto deve ter pelo menos 5 caracteres.')
    if (mensagem?.trim().length < 10) erros.push('Mensagem deve ter pelo menos 10 caracteres.')
    if (mensagem?.trim().length > 2000) erros.push('Mensagem muito longa (máximo 2000 caracteres).')

    return erros
  }

  /**
   * Limpa o estado do composable
   */
  const reset = () => {
    loading.value = false
    error.value = null
    success.value = false
    mensagemId.value = null
  }

  /**
   * Envia uma mensagem de contato.
   * @param {Object} dados - { nome, email, telefone, assunto, mensagem }
   * @returns {Promise<Object>} - { success: boolean, data: any, error: string|null }
   */
  const enviar = async (dados) => {
    reset()
    
    const { nome, email, telefone, assunto, mensagem } = dados

    // Validações
    const errosValidacao = validarDados(dados)
    if (errosValidacao.length > 0) {
      error.value = errosValidacao.join(' ')
      return { success: false, error: error.value }
    }

    loading.value = true

    try {
      const dadosParaEnviar = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone?.trim() || null,
        assunto: assunto.trim(),
        mensagem: mensagem.trim(),
        lida: false,
        created_at: new Date().toISOString()
      }

      const { data, error: supabaseError } = await supabase
        .from('mensagens_contato')
        .insert([dadosParaEnviar])
        .select('id') // Retorna o ID da mensagem inserida
        .single()

      if (supabaseError) throw supabaseError

      mensagemId.value = data.id
      success.value = true
      
      console.log('[useEnviarMensagem] Mensagem enviada com sucesso. ID:', data.id)
      
      return { 
        success: true, 
        data: data,
        mensagemId: data.id 
      }
    } catch (err) {
      console.error('[useEnviarMensagem] Erro ao enviar mensagem:', err)
      
      // Tratamento de erros específicos do Supabase
      let mensagemErro = 'Falha ao enviar mensagem. Tente novamente.'
      
      if (err.code === '23505') {
        mensagemErro = 'Esta mensagem já foi enviada anteriormente.'
      } else if (err.code === '42501') {
        mensagemErro = 'Permissão negada. Verifique as configurações do banco.'
      } else if (err.message) {
        mensagemErro = err.message
      }
      
      error.value = mensagemErro
      return { success: false, error: mensagemErro }
    } finally {
      loading.value = false
    }
  }

  /**
   * Envia mensagem com confirmação do usuário
   */
  const enviarComConfirmacao = async (dados, confirmacao = window.confirm) => {
    if (confirmacao('Tem certeza que deseja enviar esta mensagem?')) {
      return await enviar(dados)
    }
    return { success: false, error: 'Envio cancelado pelo usuário' }
  }

  return {
    loading,
    error,
    success,
    mensagemId,
    enviar,
    enviarComConfirmacao,
    reset,
    validarDados
  }
}