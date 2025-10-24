// useConfiguracoes.js
import { createClient } from '@supabase/supabase-js'
import { useAuthStore } from '@/stores/auth'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const useConfiguracoes = () => {
  const authStore = useAuthStore()

  const carregarConfiguracoes = async () => {
    try {
      console.log('🔄 Iniciando carregamento de configurações...')

      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .order('chave')

      if (error) {
        console.error('❌ Erro ao carregar configurações:', error)
        throw error
      }

      console.log(`✅ ${data?.length || 0} configurações carregadas do banco`)
      return data || []
    } catch (error) {
      console.error('❌ Erro no carregamento de configurações:', error)
      throw error
    }
  }

  // NOVA FUNÇÃO CORRIGIDA
  const atualizarConfiguracao = async (chave, valor) => {
    try {
      console.log('💾 Tentando atualizar configuração:', chave, '=', valor)

      // 1. Primeiro, tenta atualizar a linha existente
      const { data: updateData, error: updateError, count } = await supabase
        .from('configuracoes')
        .update({ valor: valor, updated_at: new Date().toISOString() })
        .eq('chave', chave) // Filtra pela chave única
        .select() // Retorna os dados da linha atualizada
        .single() // Espera um único resultado (ou null se não encontrado)

      if (updateError) {
        // Se o erro for "0 rows" (não encontrou para atualizar), tenta inserir
        if (updateError.code === 'PGRST116') { // Código específico para "0 rows" no update do Supabase
          console.log(`📝 Chave '${chave}' não encontrada, tentando inserir...`)
        } else {
          // Se for outro erro de update, lança
          console.error('❌ Erro ao atualizar configuração:', updateError)
          throw new Error(`Erro ao atualizar: ${updateError.message}`)
        }
      } else if (updateData) {
        // Se a atualização funcionou (retornou dados), sucesso!
        console.log('✅ Configuração atualizada com sucesso:', updateData)
        return updateData
      }

      // 2. Se a atualização não encontrou a linha (count = 0), tenta inserir
      const { data: insertData, error: insertError } = await supabase
        .from('configuracoes')
        .insert([{ chave: chave, valor: valor, updated_at: new Date().toISOString() }])
        .select()
        .single()

      if (insertError) {
        // Se o insert falhar, provavelmente é por violação de constraint UNIQUE
        // Ou por alguma condição na política RLS
        console.error('❌ Erro ao inserir configuração (ou violação de UNIQUE):', insertError)
        // Pode ser necessário verificar se a chave já existe de fato antes de lançar
        const { data: checkData } = await supabase
          .from('configuracoes')
          .select('id')
          .eq('chave', chave)
          .limit(1)

        if (checkData && checkData.length > 0) {
           console.error(`⚠️ A chave '${chave}' já existe com ID ${checkData[0].id}, mas o update falhou. Verifique RLS ou dados.`)
        }
        throw new Error(`Erro ao inserir: ${insertError.message}`)
      }

      console.log('✅ Configuração inserida com sucesso:', insertData)
      return insertData

    } catch (error) {
      console.error('❌ Erro GERAL ao atualizar configuração:', error)
      throw error
    }
  }


  // ... (restante das funções permanecem iguais)
  const carregarConfiguracoesAgrupadas = async () => {
    try {
      const configuracoes = await carregarConfiguracoes()

      // Agrupar configurações por categoria
      const agrupadas = {
        site: {},
        contato: {},
        hero: {},
        about: {},
        sistema: {}
      }

      configuracoes.forEach(config => {
        const { chave, valor } = config

        // Mapeamento das chaves para categorias
        if (chave.startsWith('site_')) {
          agrupadas.site[chave.replace('site_', '')] = valor
        } else if (chave.startsWith('email_') || chave.startsWith('telefone_') ||
                   chave.startsWith('endereco') || chave.startsWith('contato_')) {
          agrupadas.contato[chave] = valor
        } else if (chave.startsWith('hero_')) {
          agrupadas.hero[chave.replace('hero_', '')] = valor
        } else if (chave.startsWith('quem_somos_')) {
          agrupadas.about[chave.replace('quem_somos_', '')] = valor
        } else if (chave.startsWith('info_')) {
          agrupadas.sistema[chave] = valor
        } else {
          // Configurações gerais vão para sistema
          agrupadas.sistema[chave] = valor
        }
      })

      console.log('✅ Configurações mapeadas:', agrupadas)
      return agrupadas
    } catch (error) {
      console.error('❌ Erro ao agrupar configurações:', error)
      throw error
    }
  }

  const salvarMultiplasConfiguracoes = async (configuracoes) => {
    try {
      console.log('📝 Salvando múltiplas configurações...')

      const resultados = []

      for (const [chave, valor] of Object.entries(configuracoes)) {
        try {
          const resultado = await atualizarConfiguracao(chave, valor)
          resultados.push({ chave, sucesso: true, data: resultado })
        } catch (error) {
          console.error(`❌ Erro ao salvar ${chave}:`, error)
          resultados.push({ chave, sucesso: false, error: error.message })
          // Continua salvando as outras mesmo se uma falhar
        }
      }

      console.log('✅ Processamento de configurações concluído')
      return resultados
    } catch (error) {
      console.error('❌ Erro ao salvar múltiplas configurações:', error)
      throw error
    }
  }

  const uploadImagem = async (file, pasta = 'geral') => {
    try {
      console.log('📤 Iniciando upload de imagem...')

      if (!file) {
        throw new Error('Nenhum arquivo selecionado')
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const extensao = file.name.split('.').pop()
      const nomeArquivo = `${timestamp}-${Math.random().toString(36).substring(2, 8)}.${extensao}`
      const caminho = `${pasta}/${nomeArquivo}`

      console.log('📁 Fazendo upload para:', caminho)

      const { data, error } = await supabase.storage
        .from('imagens')
        .upload(caminho, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Erro no upload:', error)
        throw error
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(caminho)

      console.log('✅ Upload concluído:', urlData.publicUrl)
      return urlData.publicUrl
    } catch (error) {
      console.error('❌ Erro no upload de imagem:', error)
      throw error
    }
  }

  const deletarImagem = async (url) => {
    try {
      console.log('🗑️ Tentando deletar imagem:', url)

      if (!url) return

      // Extrair o caminho do arquivo da URL
      const caminho = url.split('/imagens/').pop()

      if (!caminho) {
        console.warn('⚠️ URL de imagem inválida')
        return
      }

      const { error } = await supabase.storage
        .from('imagens')
        .remove([caminho])

      if (error) {
        console.error('❌ Erro ao deletar imagem:', error)
        throw error
      }

      console.log('✅ Imagem deletada com sucesso')
    } catch (error) {
      console.error('❌ Erro ao deletar imagem:', error)
      throw error
    }
  }

  const testarConexao = async () => {
    try {
      console.log('🧪 Testando conexão com o banco...')

      const { data, error } = await supabase
        .from('configuracoes')
        .select('count')
        .limit(1)

      if (error) {
        console.error('❌ Erro na conexão:', error)
        throw error
      }

      console.log('✅ Conexão com o banco estabelecida com sucesso')
      return true
    } catch (error) {
      console.error('❌ Falha no teste de conexão:', error)
      throw error
    }
  }

  return {
    // Operações básicas
    carregarConfiguracoes,
    atualizarConfiguracao,
    carregarConfiguracoesAgrupadas,
    salvarMultiplasConfiguracoes,

    // Gerenciamento de imagens
    uploadImagem,
    deletarImagem,

    // Utilitários
    testarConexao,

    // Instância do Supabase (para casos específicos)
    supabase
  }
}

export default useConfiguracoes