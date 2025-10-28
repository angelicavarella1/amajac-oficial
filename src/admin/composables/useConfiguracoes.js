// useConfiguracoes.js - VERSÃƒO CORRIGIDA (CodificaÃ§Ã£o UTF-8)
import { ref } from 'vue' // Importe ref se for usar estado reativo
import { supabase } from '@/supabase/client.js' // Importar o cliente Supabase centralizado
// import { useAuthStore } from\ '@/modules/auth/stores/auth' // Descomente se realmente necessÃ¡rio e cuidado com dependÃªncias circulares

export const useConfiguracoes = () => {
  // const authStore = useAuthStore(); // Descomente se realmente necessÃ¡rio

  // Estado reativo (opcional, dependendo da sua necessidade de cache/local)
  const configuracoesCache = ref(null);
  const cacheTimestamp = ref(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  const carregarConfiguracoes = async (forceRefresh = false) => {
    // Verificar cache
    if (!forceRefresh && configuracoesCache.value && cacheTimestamp.value && (Date.now() - cacheTimestamp.value < CACHE_DURATION)) {
      console.log('ðŸ”„ ConfiguraÃ§Ãµes carregadas do CACHE')
      return configuracoesCache.value; // Retorna do cache
    }

    try {
      console.log('ðŸ”„ Iniciando carregamento de configuraÃ§Ãµes...')

      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .order('chave')

      if (error) {
        console.error('âŒ Erro ao carregar configuraÃ§Ãµes:', error)
        throw error
      }

      console.log(`âœ… ${data?.length || 0} configuraÃ§Ãµes carregadas do banco`)
      // Atualizar cache
      configuracoesCache.value = data || [];
      cacheTimestamp.value = Date.now();
      return data || []
    } catch (error) {
      console.error('âŒ Erro no carregamento de configuraÃ§Ãµes:', error)
      throw error
    }
  }

  // FUNÃ‡ÃƒO CORRIGIDA - Atualiza ou Insere
  const atualizarConfiguracao = async (chave, valor) => {
    try {
      console.log('ðŸ’¾ Tentando atualizar configuraÃ§Ã£o:', chave, '=', valor)

      // Tenta atualizar primeiro
      const { data: updateData, error: updateError } = await supabase
        .from('configuracoes')
        .update({ valor: valor, updated_at: new Date().toISOString() })
        .eq('chave', chave)
        .select()
        .single()

      // PGRST116 Ã© o cÃ³digo para "no rows updated" no PostgREST/Supabase
      if (updateError && updateError.code === 'PGRST116') {
        // Se nÃ£o encontrou para atualizar, tenta inserir
        console.log(`ðŸ“ Chave '${chave}' nÃ£o encontrada, tentando inserir...`)
        const { data: insertData, error: insertError } = await supabase
          .from('configuracoes')
          .insert([{ chave: chave, valor: valor, updated_at: new Date().toISOString() }])
          .select()
          .single()

        if (insertError) {
          console.error('âŒ Erro ao inserir configuraÃ§Ã£o:', insertError)
          throw insertError
        }
        // Atualizar cache apÃ³s inserÃ§Ã£o
        if (configuracoesCache.value) {
            const index = configuracoesCache.value.findIndex(c => c.chave === chave);
            if (index !== -1) {
                configuracoesCache.value[index] = insertData;
            } else {
                configuracoesCache.value.push(insertData);
            }
            cacheTimestamp.value = Date.now(); // Atualiza timestamp do cache
        }
        return insertData
      } else if (updateError) {
        // Trata outros erros de atualizaÃ§Ã£o que nÃ£o sejam 'nenhuma linha afetada'
        console.error('âŒ Erro ao atualizar configuraÃ§Ã£o:', updateError)
        throw updateError;
      } else if (updateData) {
        // AtualizaÃ§Ã£o bem-sucedida
        // Atualizar cache apÃ³s atualizaÃ§Ã£o
        if (configuracoesCache.value) {
            const index = configuracoesCache.value.findIndex(c => c.chave === chave);
            if (index !== -1) {
                configuracoesCache.value[index] = updateData;
            }
            cacheTimestamp.value = Date.now(); // Atualiza timestamp do cache
        }
        console.log('âœ… ConfiguraÃ§Ã£o atualizada com sucesso:', updateData)
        return updateData
      } else {
        // Este caso nÃ£o deveria ocorrer se o update funcionou, mas por garantia
        console.error('âŒ Erro inesperado na atualizaÃ§Ã£o/consulta da configuraÃ§Ã£o.')
        throw new Error('Erro inesperado na atualizaÃ§Ã£o da configuraÃ§Ã£o.')
      }

    } catch (error) {
      console.error('âŒ Erro GERAL ao atualizar configuraÃ§Ã£o:', error)
      throw error
    }
  }

  const carregarConfiguracoesAgrupadas = async (forceRefresh = false) => {
    try {
      const configuracoes = await carregarConfiguracoes(forceRefresh) // Passar forceRefresh para a funÃ§Ã£o base

      // Agrupar configuraÃ§Ãµes por categoria
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
          // ConfiguraÃ§Ãµes gerais vÃ£o para sistema
          agrupadas.sistema[chave] = valor
        }
      })

      console.log('âœ… ConfiguraÃ§Ãµes mapeadas:', agrupadas)
      return agrupadas
    } catch (error) {
      console.error('âŒ Erro ao agrupar configuraÃ§Ãµes:', error)
      throw error
    }
  }

  const salvarMultiplasConfiguracoes = async (configuracoes) => {
    try {
      console.log('ðŸ“ Salvando mÃºltiplas configuraÃ§Ãµes...')

      const resultados = []

      for (const [chave, valor] of Object.entries(configuracoes)) {
        try {
          const resultado = await atualizarConfiguracao(chave, valor)
          resultados.push({ chave, sucesso: true, data: resultado })
        } catch (error) {
          console.error(`âŒ Erro ao salvar ${chave}:`, error)
          resultados.push({ chave, sucesso: false, error: error.message })
          // Continua salvando as outras mesmo se uma falhar
        }
      }

      console.log('âœ… Processamento de configuraÃ§Ãµes concluÃ­do')
      
      // âœ… CORREÃ‡ÃƒO: Teste de conexÃ£o com variÃ¡vel 'data' nÃ£o utilizada REMOVIDA
      const { error: connectionError } = await supabase
        .from('configuracoes')
        .select('count')
        .limit(1)

      if (connectionError) {
        console.error('âŒ Erro de conexÃ£o apÃ³s salvar configuraÃ§Ãµes:', connectionError)
      }

      return resultados
    } catch (error) {
      console.error('âŒ Erro ao salvar mÃºltiplas configuraÃ§Ãµes:', error)
      throw error
    }
  }

  const uploadImagem = async (file, pasta = 'geral') => {
    try {
      console.log('ðŸ“¤ Iniciando upload de imagem...')

      if (!file) {
        throw new Error('Nenhum arquivo selecionado')
      }

      // Gerar nome Ãºnico para o arquivo
      const timestamp = Date.now()
      const extensao = file.name.split('.').pop()
      const nomeArquivo = `${timestamp}-${Math.random().toString(36).substring(2, 8)}.${extensao}`
      const caminho = `${pasta}/${nomeArquivo}`

      console.log('ðŸ“ Fazendo upload para:', caminho)

      // âœ… CORREÃ‡ÃƒO: Removida variÃ¡vel 'data' nÃ£o utilizada
      const { error } = await supabase.storage
        .from('imagens')
        .upload(caminho, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('âŒ Erro no upload:', error)
        throw error
      }

      // Obter URL pÃºblica
      const { data: urlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(caminho)

      console.log('âœ… Upload concluÃ­do:', urlData.publicUrl)
      return urlData.publicUrl
    } catch (error) {
      console.error('âŒ Erro no upload de imagem:', error)
      throw error
    }
  }

  const deletarImagem = async (url) => {
    try {
      console.log('ðŸ—‘ï¸ Tentando deletar imagem:', url)

      if (!url) return

      // Extrair o caminho do arquivo da URL
      const caminho = url.split('/imagens/').pop()

      if (!caminho) {
        console.warn('âš ï¸ URL de imagem invÃ¡lida')
        return
      }

      const { error } = await supabase.storage
        .from('imagens')
        .remove([caminho])

      if (error) {
        console.error('âŒ Erro ao deletar imagem:', error)
        throw error
      }

      console.log('âœ… Imagem deletada com sucesso')
    } catch (error) {
      console.error('âŒ Erro ao deletar imagem:', error)
      throw error
    }
  }

  const testarConexao = async () => {
    try {
      console.log('ðŸ§ª Testando conexÃ£o com o banco...')

      const { error: connectionError } = await supabase // âœ… Corrigido: removido 'data' nÃ£o utilizado
        .from('configuracoes')
        .select('count', { head: true, count: 'exact' }) // Otimizado para contar

      if (connectionError) {
        console.error('âŒ Erro na conexÃ£o:', connectionError)
        throw connectionError
      }

      console.log('âœ… ConexÃ£o com o banco estabelecida com sucesso')
      return true
    } catch (error) {
      console.error('âŒ Falha no teste de conexÃ£o:', error)
      throw error
    }
  }

  return {
    // OperaÃ§Ãµes bÃ¡sicas
    configuracoesCache,
    carregarConfiguracoes,
    atualizarConfiguracao,
    carregarConfiguracoesAgrupadas,
    salvarMultiplasConfiguracoes,

    // Gerenciamento de imagens
    uploadImagem,
    deletarImagem,

    // UtilitÃ¡rios
    testarConexao,

    // Instancia do Supabase (para casos especÃ­ficos, embora nÃ£o recomendado exportar diretamente)
    // NÃƒO exporte 'supabase' aqui a menos que estritamente necessÃ¡rio. Use import em cada arquivo que precisa.
  }
}

// ExportaÃ§Ã£o padrÃ£o
export default useConfiguracoes
