// src/modules/associados/composables/useInscricaoSocio.js
/**
 * Composable para submissão pública de inscrição como sócio da AMAJAC.
 * Alinhado ao Estatuto Social (Art. 3º e Art. 4º).
 * - Só moradores do Jardim Atlântico Central podem se associar.
 * - Categorias: 'benemerito' (padrão) ou 'remido' (com avaliação).
 * - Sócio Fundador não está aberto a novos candidatos.
 */

import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

/**
 * Validação básica de CPF (11 dígitos, não sequencial)
 */
const isValidCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleaned)) return false
  return true
}

export function useInscricaoSocio() {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  /**
   * Submete a inscrição de um novo sócio
   * @param {Object} data
   * @param {string} data.nome
   * @param {string} data.cpf
   * @param {string} data.email
   * @param {string} [data.telefone]
   * @param {string} data.endereco (obrigatório)
   * @param {boolean} data.moradorLocal (deve ser true)
   * @param {'benemerito'|'remido'} data.categoria
   * @param {string} [data.observacoesRemido]
   * @returns {Promise<boolean>}
   */
  const submitInscricao = async (data) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      // Validações obrigatórias
      if (!data.nome?.trim()) throw new Error('Nome é obrigatório.')
      if (!data.email?.trim()) throw new Error('E-mail é obrigatório.')
      if (!data.cpf) throw new Error('CPF é obrigatório.')
      if (!data.endereco?.trim()) throw new Error('Endereço completo é obrigatório.')
      if (!data.moradorLocal) throw new Error('Você deve confirmar residência no Jardim Atlântico Central.')
      if (!['benemerito', 'remido'].includes(data.categoria)) {
        throw new Error('Categoria inválida.')
      }

      const cpfClean = data.cpf.replace(/\D/g, '')
      if (!isValidCPF(cpfClean)) {
        throw new Error('CPF inválido. Informe um CPF com 11 dígitos.')
      }

      // Verifica duplicidade (e-mail ou CPF)
      const { data: existing, error: checkError } = await supabase
        .from('associados')
        .select('id')
        .or(`email.eq.${data.email.trim().toLowerCase()},cpf.eq.${cpfClean}`)
        .limit(1)

      if (checkError) {
        console.error('Erro ao verificar duplicidade:', checkError)
        throw new Error('Erro ao verificar seus dados. Tente novamente.')
      }

      if (existing && existing.length > 0) {
        throw new Error('Já existe uma inscrição com este e-mail ou CPF.')
      }

      // Insere novo sócio com status 'pendente'
      const { error: insertError } = await supabase
        .from('associados')
        .insert({
          nome: data.nome.trim(),
          cpf: cpfClean,
          email: data.email.trim().toLowerCase(),
          telefone: data.telefone?.trim() || null,
          endereco: data.endereco.trim(),
          categoria: data.categoria,
          observacoes_remido: data.observacoesRemido?.trim() || null,
          status: 'pendente' // sempre inicia como pendente
        })

      if (insertError) {
        console.error('Erro ao inserir sócio:', insertError)
        if (insertError.message && insertError.message.includes('violates check constraint')) {
          throw new Error('Categoria inválida. Escolha Benemérito ou Remido.')
        }
        throw new Error('Não foi possível enviar sua inscrição. Tente novamente.')
      }

      success.value = true
      return true
    } catch (err) {
      console.error('[useInscricaoSocio] Erro:', err)
      error.value = err.message || 'Ocorreu um erro inesperado.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    submitInscricao
  }
}