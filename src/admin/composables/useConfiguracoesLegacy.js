// src/composables/useConfiguracoes.js - VERSÃO CORRIGIDA E AUDITADA (Versão 2.0 - com upsert e padrões)
import { ref } from 'vue'
// Importar como exportação nomeada, assumindo que seu client.js usa 'export const supabase'
import { supabase } from '@/supabase/client.js'

// Definir as configurações padrão
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
  const configuracoes = ref({ ...configuracoesPadrao }) // Inicializa com os padrões
  const carregando = ref(false)
  const erro = ref(null)

  // Carregar todas as configurações do banco e mesclar com os padrões
  const carregarConfiguracoes = async () => {
    carregando.value = true
    erro.value = null
    try {
      console.log('🔄 Iniciando carregamento de configurações do banco...')

      const { data, error: supabaseError } = await supabase
        .from('configuracoes')
        .select('chave, valor') // Seleciona chave e valor de cada linha

      if (supabaseError) {
        console.error('❌ Erro ao carregar configurações do banco:', supabaseError)
        throw supabaseError
      }

      // Transformar o array de objetos [{chave: 'x', valor: 'y'}, ...] em um objeto {x: 'y', ...}
      const configuracoesDoBanco = data.reduce((acc, item) => {
        acc[item.chave] = item.valor
        return acc
      }, {})

      // Mesclar as configurações do banco com os padrões
      configuracoes.value = { ...configuracoesPadrao, ...configuracoesDoBanco }

      console.log('✅ Configurações carregadas e mescladas:', configuracoes.value)

    } catch (err) {
      console.error('❌ Erro ao carregar configurações:', err)
      erro.value = err.message
      // Mantém os valores padrão em caso de erro
      configuracoes.value = { ...configuracoesPadrao }
    } finally {
      carregando.value = false
    }
  }

  // Salvar uma única configuração (upsert)
  const salvarConfiguracao = async (chave, valor) => {
    if (!(chave in configuracoesPadrao)) {
      console.warn(`⚠️ Aviso: A chave '${chave}' não está definida nos padrões.`)
    }

    carregando.value = true
    erro.value = null
    try {
      console.log(`💾 Salvando configuração: ${chave} = ${valor}`)

      const { data, error: supabaseError } = await supabase
        .from('configuracoes')
        .upsert(
          { chave, valor, updated_at: new Date().toISOString() }, // Adiciona updated_at para manter o controle
          { onConflict: 'chave' } // Atualiza se a chave já existir
        )
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualizar o estado local imediatamente após o sucesso
      configuracoes.value = { ...configuracoes.value, [chave]: valor }

      console.log('✅ Configuração salva com sucesso:', data)
      return { success: true, data }

    } catch (err) {
      console.error('❌ Erro ao salvar configuração:', err)
      erro.value = err.message
      return { success: false, error: err.message }
    } finally {
      carregando.value = false
    }
  }

  // Salvar múltiplas configurações de uma vez (opcional, mais eficiente para atualizações em lote)
  const salvarMultiplasConfiguracoes = async (novasConfiguracoes) => {
    carregando.value = true
    erro.value = null
    try {
      console.log('📝 Iniciando salvamento de múltiplas configurações...')

      const timestamp = new Date().toISOString();
      // Preparar array de objetos para upsert, incluindo o timestamp
      const configsParaSalvar = Object.entries(novasConfiguracoes).map(([chave, valor]) => ({
        chave,
        valor,
        updated_at: timestamp
      }))

      const { data, error: supabaseError } = await supabase
        .from('configuracoes')
        .upsert(configsParaSalvar, { onConflict: 'chave' })
        .select()

      if (supabaseError) throw supabaseError

      // Atualizar o estado local com as novas configurações
      configuracoes.value = { ...configuracoes.value, ...novasConfiguracoes }

      console.log('✅ Múltiplas configurações salvas com sucesso:', data)
      return { success: true, data }

    } catch (err) {
      console.error('❌ Erro ao salvar múltiplas configurações:', err)
      erro.value = err.message
      return { success: false, error: err.message }
    } finally {
      carregando.value = false
    }
  }

  // Função para obter uma configuração específica (opcional, útil se não quiser expor o objeto inteiro)
  const getConfiguracao = (chave) => {
    return configuracoes.value[chave]
  }

  return {
    configuracoes, // Objeto reativo com todas as configurações
    loading: carregando, // Estado de carregamento
    error: erro, // Estado de erro
    carregarConfiguracoes, // Função para carregar (deve ser chamada explicitamente)
    salvarConfiguracao, // Função para salvar uma única configuração
    salvarMultiplasConfiguracoes, // Função para salvar múltiplas configurações
    getConfiguracao // Função para obter uma configuração específica
  }
}

// Exportação padrão
export default useConfiguracoes
