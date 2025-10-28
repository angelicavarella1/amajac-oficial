// src/composables/usePublicContato.js
import { ref } from 'vue'
import { supabase } from '@/supabase/client'

export function usePublicContato() {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  const enviarMensagem = async (dados) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const { error: err } = await supabase
        .from('mensagens_contato')
        .insert([{
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone || null,
          assunto: dados.assunto || 'Sem assunto',
          mensagem: dados.mensagem,
          status: 'pendente',
          created_at: new Date().toISOString()
        }])
      if (err) throw err
      success.value = true
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { loading, error, success, enviarMensagem }
}