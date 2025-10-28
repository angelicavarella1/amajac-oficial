// src/composables/usePublicNoticias.js
import { ref } from 'vue'
import { supabase } from '@/supabase/client.js' // ✅ CORREÇÃO: Importação correta

export function usePublicNoticias() {
  const noticias = ref([])
  const noticiaIndividual = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const carregarNoticias = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('📰 [PUBLICO] Buscando notícias públicas...')
      
      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .select('*')
        .eq('ativo', true) // ✅ CORREÇÃO: Usando 'ativo' em vez de 'status'
        .order('data_publicacao', { ascending: false }) // ✅ CORREÇÃO: Campo correto

      if (supabaseError) {
        console.error('❌ Erro Supabase:', supabaseError)
        throw supabaseError
      }
      
      noticias.value = data || []
      console.log(`✅ [PUBLICO] ${noticias.value.length} notícias públicas carregadas`)
      return noticias.value
    } catch (err) {
      console.error('❌ Erro ao carregar notícias públicas:', err)
      error.value = err.message
      noticias.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const buscarNoticiaPorId = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log(`📰 [PUBLICO] Buscando notícia ID: ${id}`)
      
      const { data, error: supabaseError } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .eq('ativo', true) // ✅ CORREÇÃO: Usando 'ativo' em vez de 'status'
        .single()

      if (supabaseError) {
        console.error('❌ Erro Supabase:', supabaseError)
        throw supabaseError
      }
      
      noticiaIndividual.value = data
      console.log('✅ [PUBLICO] Notícia carregada:', data?.titulo)
      return data
    } catch (err) {
      console.error('❌ Erro ao buscar notícia:', err)
      error.value = 'Notícia não encontrada ou não está publicada'
      noticiaIndividual.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    noticias,
    noticiaIndividual,
    loading,
    error,
    carregarNoticias,
    buscarNoticiaPorId
  }
}