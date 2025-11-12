// src/modules/galeria/composables/useGaleria.js
/**
 * Composable reativo para listar imagens da galeria no site público.
 * - Consulta a tabela `galeria` no Supabase.
 * - Formata data de criação para exibição em PT-BR.
 * - Fornece fallback de imagem segura.
 * - Inclui categoria (campo existente na tabela).
 * - Fornece estados reativos: galeria, loading, error.
 */

import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

export function useGaleria() {
  const galeria = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchGaleria = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('galeria')
        .select(`
          id,
          titulo,
          imagem_url,
          imagem_alt,
          descricao,
          created_at,
          categoria
        `)
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw new Error(`Erro ao buscar galeria: ${supabaseError.message}`)
      }

      galeria.value = (data || []).map(row => ({
        id: row.id,
        titulo: row.titulo?.trim() || 'Sem título',
        categoria: row.categoria?.trim() || 'Geral',
        url: row.imagem_url || 'https://placehold.co/400x300/2E7D32/FFFFFF?text=Sem+Imagem',
        alt: row.imagem_alt?.trim() || `Imagem: ${row.titulo || 'sem título'}`,
        descricao: row.descricao?.trim() || null,
        data: row.created_at
          ? new Date(row.created_at).toLocaleDateString('pt-BR')
          : null
      }))
    } catch (err) {
      console.error('[useGaleria] Erro:', err)
      error.value = 'Não foi possível carregar a galeria no momento.'
    } finally {
      loading.value = false
    }
  }

  return {
    galeria,
    loading,
    error,
    fetchGaleria
  }
}