// src/modules/sobre/composables/useAdminSobre.js - CORRIGIDO
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

export function useAdminSobre() {
  const loading = ref(false)
  const error = ref(null)

  const salvarConfiguracao = async (chave, valor) => {
    loading.value = true
    error.value = null

    try {
      console.log(`🔍 Tentando salvar: ${chave} =`, valor)
      
      // Garantir que o valor não seja undefined
      const valorTratado = valor === undefined ? '' : String(valor)
      
      // PRIMEIRO: Verificar se a chave já existe para obter o ID
      const { data: existing, error: fetchError } = await supabase
        .from('configuracoes')
        .select('id')
        .eq('chave', chave)
        .maybeSingle()

      if (fetchError) {
        console.error(`❌ Erro ao buscar ${chave}:`, fetchError)
        throw fetchError
      }

      let result
      
      if (existing) {
        // UPDATE do registro existente
        console.log(`📝 Atualizando ${chave} (ID: ${existing.id})`)
        const { data, error: updateError } = await supabase
          .from('configuracoes')
          .update({
            valor: valorTratado,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (updateError) {
          console.error(`❌ Erro ao atualizar ${chave}:`, updateError)
          throw updateError
        }
        result = data
      } else {
        // INSERT de novo registro
        console.log(`🆕 Criando nova configuração: ${chave}`)
        const { data, error: insertError } = await supabase
          .from('configuracoes')
          .insert({
            chave: chave,
            valor: valorTratado,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (insertError) {
          console.error(`❌ Erro ao inserir ${chave}:`, insertError)
          throw insertError
        }
        result = data
      }
      
      console.log(`✅ ${chave} salvo com sucesso:`, result)
      return result

    } catch (err) {
      console.error(`💥 Erro ao salvar configuração ${chave}:`, err)
      error.value = `Erro em ${chave}: ${err.message}`
      return null
    } finally {
      loading.value = false
    }
  }

  const carregarConfiguracoes = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 Carregando configurações...')
      
      const { data, error: supabaseError } = await supabase
        .from('configuracoes')
        .select('chave, valor, id')
        .in('chave', [
          'missao', 'visao', 'valores', 'historia',
          'endereco', 'telefone', 'email_institucional'
        ])

      if (supabaseError) {
        console.error('❌ Erro ao carregar configurações:', supabaseError)
        throw supabaseError
      }

      console.log('✅ Configurações carregadas:', data)
      
      const mapa = {}
      if (data) {
        data.forEach(cfg => {
          mapa[cfg.chave] = { id: cfg.id, valor: cfg.valor }
        })
      }
      return mapa

    } catch (err) {
      console.error('💥 Erro ao carregar configurações:', err)
      error.value = err.message
      return {}
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    salvarConfiguracao,
    carregarConfiguracoes
  }
}