// src/modules/parceiros/composables/useParceiros.js
import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient'

export function useParceiros() {
  const parceiros = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getParceirosAtivos = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('parceiros_comerciais')
        .select('id, nome, logo_url, link_site, instagram, facebook, ramo, imagem_alt')
        .eq('ativo', true)
        .order('nome', { ascending: true })

      if (err) throw err

      parceiros.value = (data || []).map(p => ({
        ...p,
        link_site: p.link_site?.trim() || null,
        instagram: p.instagram?.trim() || null,
        facebook: p.facebook?.trim() || null,
        imagem_alt: p.imagem_alt || p.nome || 'Logo do parceiro'
      }))
    } catch (e) {
      console.error('Erro ao buscar parceiros:', e)
      error.value = 'Não foi possível carregar os parceiros.'
      parceiros.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchParceiros = async () => {
    return getParceirosAtivos()
  }

  return {
    parceiros,
    loading,
    error,
    getParceirosAtivos,
    fetchParceiros
  }
}