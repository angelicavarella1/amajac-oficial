// src/modules/associados/composables/useAssociados.js
/**
 * Composable reativo para listar "Associados" (pessoas físicas) no site público.
 * - Consulta a tabela `associados` no Supabase.
 * - Filtra apenas registros com status = 'ativo'.
 * - Oculta dados sensíveis (CPF, e-mail completo) por LGPD.
 * - Formata dados para exibição segura.
 */

import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

export function useAssociados() {
  const associados = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchAssociados = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('associados')
        .select(`
          id,
          nome,
          profissao,
          telefone
        `)
        .eq('status', 'ativo')
        .order('nome', { ascending: true })

      if (supabaseError) {
        throw new Error(`Erro ao buscar associados: ${supabaseError.message}`)
      }

      // Formatação segura para exibição pública
      associados.value = (data || []).map(row => ({
        id: row.id,
        nome: row.nome?.trim() || 'Sem nome',
        profissao: row.profissao?.trim() || 'Profissão não informada',
        // Telefone parcial (opcional, mas não completo por LGPD)
        contato: row.telefone
          ? row.telefone.replace(/(\d{2})(\d{5})\d+/, '($1) $2-XXXX')
          : 'Contato não disponível'
      }))
    } catch (err) {
      console.error('[useAssociados] Erro:', err)
      error.value = 'Não foi possível carregar os associados no momento.'
    } finally {
      loading.value = false
    }
  }

  return {
    associados,
    loading,
    error,
    fetchAssociados
  }
}