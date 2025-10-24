// src/composables/useConfiguracoes.js
import { ref, onMounted } from 'vue'
import supabase from '@/supabase/client' // ✅ default import

const configuracoesPadrao = {
  hero_titulo: 'AMAJAC',
  hero_subtitulo: 'Associação de Moradores e Amigos do Jardim Atlântico Central',
  quem_somos_valores: 'Transparência e ética\nTrabalho coletivo\nCompromisso com a comunidade\nDesenvolvimento sustentável',
  contato_endereco: 'Rua Izabel Cristina Ouvina, 112 - Jardim Atlântico Central, Maricá - RJ, 24934-405',
  contato_telefone: '(21) 97897-9840',
  contato_email: 'amajac2024@gmail.com',
  contato_whatsapp: '21978979840',
  contato_horario_funcionamento: 'Segunda a Sexta: 9h às 17h',
  site_titulo: 'AMAJAC - Associação de Moradores'
}

export function useConfiguracoes() {
  const configuracoes = ref({ ...configuracoesPadrao })
  const carregando = ref(false)
  const erro = ref(null)

  const carregarConfiguracoes = async () => {
    carregando.value = true
    erro.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('configuracoes')
        .select('valor')
        .eq('chave', 'configuracoes_gerais')
        .single()

      if (supabaseError && supabaseError.code !== 'PGRST116') {
        throw supabaseError
      }

      if (data?.valor) {
        configuracoes.value = { ...configuracoesPadrao, ...data.valor }
      } else {
        configuracoes.value = { ...configuracoesPadrao }
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err)
      erro.value = err.message
      configuracoes.value = { ...configuracoesPadrao }
    } finally {
      carregando.value = false
    }
  }

  const salvarConfiguracoes = async (novasConfiguracoes) => {
    carregando.value = true
    erro.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('configuracoes')
        .upsert(
          { chave: 'configuracoes_gerais', valor: novasConfiguracoes },
          { onConflict: 'chave' }
        )
        .select()
        .single()

      if (supabaseError) throw supabaseError

      configuracoes.value = { ...configuracoes.value, ...novasConfiguracoes }
      return { success: true, data }
    } catch (err) {
      console.error('Erro ao salvar configurações:', err)
      erro.value = err.message
      return { success: false, error: err.message }
    } finally {
      carregando.value = false
    }
  }

  onMounted(() => {
    carregarConfiguracoes()
  })

  return {
    configuracoes,
    loading: carregando,
    error: erro,
    carregarConfiguracoes,
    salvarConfiguracoes,
    salvarTodasConfiguracoes: salvarConfiguracoes
  }
}