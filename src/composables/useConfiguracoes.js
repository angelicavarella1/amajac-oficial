// composables/useConfiguracoes.js - VERSÃO CORRIGIDA
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client'
import { useUIStore } from '@/stores/ui'

export function useConfiguracoes() {
  const configuracoes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // ⚙️ CARREGAR CONFIGURAÇÕES
  const fetchConfiguracoes = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 Iniciando carregamento de configurações...')
      
      const { data, error: supabaseError } = await supabase
        .from('configuracoes')
        .select('*')
        .order('chave')

      if (supabaseError) {
        console.error('❌ Erro Supabase:', supabaseError)
        throw new Error(`Erro ao carregar configurações: ${supabaseError.message}`)
      }

      configuracoes.value = data || []
      
      console.log(`✅ ${data?.length || 0} configurações carregadas do banco`)
      return data
    } catch (err) {
      console.error('❌ Erro ao carregar configurações:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar configurações', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ⚙️ ATUALIZAR CONFIGURAÇÃO
  const atualizarConfiguracao = async (chave, valor) => {
    const originalLoading = loading.value
    loading.value = true
    error.value = null

    try {
      console.log(`💾 Tentando salvar: ${chave} = ${valor}`)
      
      // Verificar se a configuração já existe
      const { data: existingConfig, error: fetchError } = await supabase
        .from('configuracoes')
        .select('id, chave, valor')
        .eq('chave', chave)
        .maybeSingle()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar configuração:', fetchError)
        throw fetchError
      }

      let result
      
      if (existingConfig) {
        // ATUALIZAR registro existente
        console.log(`📝 Atualizando configuração existente (ID: ${existingConfig.id})`)
        const { data, error: updateError } = await supabase
          .from('configuracoes')
          .update({ 
            valor: valor || '',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id)
          .select()
          .single()

        if (updateError) {
          console.error('❌ Erro ao atualizar:', updateError)
          throw updateError
        }
        result = data
      } else {
        // CRIAR novo registro
        console.log('🆕 Criando nova configuração')
        const { data, error: insertError } = await supabase
          .from('configuracoes')
          .insert({ 
            chave: chave,
            valor: valor || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (insertError) {
          console.error('❌ Erro ao inserir:', insertError)
          throw insertError
        }
        result = data
      }

      console.log('✅ Configuração salva com sucesso:', result)
      
      // Atualiza cache local
      const index = configuracoes.value.findIndex(c => c.chave === chave)
      if (index !== -1) {
        configuracoes.value[index] = result
      } else {
        configuracoes.value.push(result)
      }

      uiStore.showToast('Configuração atualizada com sucesso!', 'success')
      return result
    } catch (err) {
      console.error('❌ Erro ao atualizar configuração:', err)
      error.value = err.message
      uiStore.showToast('Erro ao atualizar configuração', 'error')
      throw err
    } finally {
      loading.value = originalLoading
    }
  }

  // ⚙️ SALVAR MÚLTIPLAS CONFIGURAÇÕES
  const salvarMultiplasConfiguracoes = async (configuracoesObj) => {
    loading.value = true
    error.value = null

    try {
      console.log('📝 Salvando múltiplas configurações...')
      
      const resultados = []
      
      for (const [chave, valor] of Object.entries(configuracoesObj)) {
        try {
          const resultado = await atualizarConfiguracao(chave, valor)
          resultados.push({ chave, sucesso: true, data: resultado })
        } catch (err) {
          console.error(`❌ Erro ao salvar ${chave}:`, err)
          resultados.push({ chave, sucesso: false, error: err.message })
        }
      }
      
      console.log('✅ Processamento de configurações concluído')
      return resultados
    } catch (err) {
      console.error('❌ Erro ao salvar múltiplas configurações:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ⚙️ OBTER VALOR DA CONFIGURAÇÃO
  const obterConfiguracao = (chave, valorPadrao = '') => {
    const config = configuracoes.value.find(c => c.chave === chave)
    return config ? config.valor : valorPadrao
  }

  // ⚙️ CONFIGURAÇÕES COMO OBJETO
  const configs = computed(() => {
    const obj = {}
    configuracoes.value.forEach(config => {
      obj[config.chave] = config.valor
    })
    return obj
  })

  // ⚙️ VERIFICAR SE CONFIGURAÇÃO EXISTE
  const configuracaoExiste = (chave) => {
    return configuracoes.value.some(c => c.chave === chave)
  }

  // ⚙️ CARREGAR CONFIGURAÇÕES AGRUPADAS
  const carregarConfiguracoesAgrupadas = async () => {
    try {
      const configuracoesData = await fetchConfiguracoes()
      
      // Agrupar configurações por categoria
      const agrupadas = {
        site: {},
        contato: {},
        hero: {},
        about: {},
        sistema: {}
      }

      configuracoesData.forEach(config => {
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
    } catch (err) {
      console.error('❌ Erro ao agrupar configurações:', err)
      throw err
    }
  }

  // ⚙️ UPLOAD DE IMAGEM
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

      const { data, error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(caminho, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError)
        throw uploadError
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(caminho)

      console.log('✅ Upload concluído:', urlData.publicUrl)
      return urlData.publicUrl
    } catch (err) {
      console.error('❌ Erro no upload de imagem:', err)
      throw err
    }
  }

  // ⚙️ DELETAR IMAGEM
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

      const { error: deleteError } = await supabase.storage
        .from('imagens')
        .remove([caminho])

      if (deleteError) {
        console.error('❌ Erro ao deletar imagem:', deleteError)
        throw deleteError
      }

      console.log('✅ Imagem deletada com sucesso')
    } catch (err) {
      console.error('❌ Erro ao deletar imagem:', err)
      throw err
    }
  }

  // ⚙️ TESTAR CONEXÃO
  const testarConexao = async () => {
    try {
      console.log('🧪 Testando conexão com o banco...')
      
      const { data, error: connectionError } = await supabase
        .from('configuracoes')
        .select('count')
        .limit(1)

      if (connectionError) {
        console.error('❌ Erro na conexão:', connectionError)
        throw connectionError
      }

      console.log('✅ Conexão com o banco estabelecida com sucesso')
      return true
    } catch (err) {
      console.error('❌ Falha no teste de conexão:', err)
      throw err
    }
  }

  return {
    // Estado
    configuracoes: computed(() => configuracoes.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Computed
    configs,
    
    // Métodos principais
    fetchConfiguracoes,
    atualizarConfiguracao,
    salvarMultiplasConfiguracoes,
    obterConfiguracao,
    configuracaoExiste,
    carregarConfiguracoesAgrupadas,
    
    // Gerenciamento de imagens
    uploadImagem,
    deletarImagem,
    
    // Utilitários
    testarConexao
  }
}