// composables/useConfiguracoes.js - VERSÃO CORRIGIDA
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client'
import { useUIStore } from '@/shared/stores/ui' // ✅ CORREÇÃO: Removida a barra invertida

// Constantes para evitar magic strings
const CATEGORIAS = {
  SITE: 'site',
  CONTATO: 'contato',
  HERO: 'hero',
  ABOUT: 'about',
  SISTEMA: 'sistema'
}

const PREFIXOS_CATEGORIAS = {
  [CATEGORIAS.SITE]: 'site_',
  [CATEGORIAS.CONTATO]: ['email_', 'telefone_', 'endereco', 'contato_'],
  [CATEGORIAS.HERO]: 'hero_',
  [CATEGORIAS.ABOUT]: 'quem_somos_',
  [CATEGORIAS.SISTEMA]: 'info_'
}

export function useConfiguracoes() {
  const configuracoes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // 🔧 UTILITÁRIOS
  const getCategoriaPorChave = (chave) => {
    for (const [categoria, prefixos] of Object.entries(PREFIXOS_CATEGORIAS)) {
      if (Array.isArray(prefixos)) {
        if (prefixos.some(prefixo => chave.startsWith(prefixo))) {
          return categoria
        }
      } else if (chave.startsWith(prefixos)) {
        return categoria
      }
    }
    return CATEGORIAS.SISTEMA
  }

  const getChaveSemPrefixo = (chave, categoria) => {
    const prefixo = PREFIXOS_CATEGORIAS[categoria]
    if (!prefixo || Array.isArray(prefixo)) return chave
    
    return chave.replace(prefixo, '')
  }

  // 📥 CARREGAR CONFIGURAÇÕES
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

  // ✏️ ATUALIZAR CONFIGURAÇÃO
  const atualizarConfiguracao = async (chave, valor) => {
    const originalLoading = loading.value
    loading.value = true
    error.value = null

    try {
      console.log(`💾 Tentando salvar: ${chave} = ${valor}`)

      // Buscar configuração existente
      const { data: existingConfig, error: fetchError } = await supabase
        .from('configuracoes')
        .select('id, chave, valor')
        .eq('chave', chave)
        .maybeSingle()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar configuração:', fetchError)
        throw fetchError
      }

      const now = new Date().toISOString()
      let result

      if (existingConfig) {
        // Atualizar registro existente
        console.log(`📝 Atualizando configuração existente (ID: ${existingConfig.id})`)
        const { data, error: updateError } = await supabase
          .from('configuracoes')
          .update({
            valor: valor?.toString() || '',
            updated_at: now
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
        // Criar novo registro
        console.log('🆕 Criando nova configuração')
        const { data, error: insertError } = await supabase
          .from('configuracoes')
          .insert({
            chave: chave,
            valor: valor?.toString() || '',
            created_at: now,
            updated_at: now
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

      // Atualizar cache local
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

  // 💾 SALVAR MÚLTIPLAS CONFIGURAÇÕES
  const salvarMultiplasConfiguracoes = async (configuracoesObj) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 Salvando múltiplas configurações...')

      const resultados = []
      const promises = []

      for (const [chave, valor] of Object.entries(configuracoesObj)) {
        promises.push(
          atualizarConfiguracao(chave, valor)
            .then(resultado => ({ chave, sucesso: true, resultado }))
            .catch(err => {
              console.error(`❌ Erro ao salvar ${chave}:`, err)
              return { chave, sucesso: false, error: err.message }
            })
        )
      }

      const resultadosArray = await Promise.all(promises)
      resultados.push(...resultadosArray)

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

  // 🔍 OBTER VALOR DA CONFIGURAÇÃO
  const obterConfiguracao = (chave, valorPadrao = '') => {
    const config = configuracoes.value.find(c => c.chave === chave)
    return config ? config.valor : valorPadrao
  }

  // 📊 CONFIGURAÇÕES COMO OBJETO
  const configs = computed(() => {
    const obj = {}
    configuracoes.value.forEach(config => {
      obj[config.chave] = config.valor
    })
    return obj
  })

  // ✅ VERIFICAR SE CONFIGURAÇÃO EXISTE
  const configuracaoExiste = (chave) => {
    return configuracoes.value.some(c => c.chave === chave)
  }

  // 🗂️ CARREGAR CONFIGURAÇÕES AGRUPADAS
  const carregarConfiguracoesAgrupadas = async () => {
    try {
      const configuracoesData = await fetchConfiguracoes()

      // Inicializar estrutura agrupada
      const agrupadas = Object.keys(CATEGORIAS).reduce((acc, key) => {
        acc[CATEGORIAS[key]] = {}
        return acc
      }, {})

      // Agrupar configurações
      configuracoesData.forEach(config => {
        const { chave, valor } = config
        const categoria = getCategoriaPorChave(chave)
        const chaveSemPrefixo = getChaveSemPrefixo(chave, categoria)
        
        agrupadas[categoria][chaveSemPrefixo] = valor
      })

      console.log('📊 Configurações mapeadas:', agrupadas)
      return agrupadas
    } catch (err) {
      console.error('❌ Erro ao agrupar configurações:', err)
      throw err
    }
  }

  // 🖼️ UPLOAD DE IMAGEM
  const uploadImagem = async (file, pasta = 'geral') => {
    try {
      console.log('🖼️ Iniciando upload de imagem...')

      if (!file) {
        throw new Error('Nenhum arquivo selecionado')
      }

      // Validar tipo de arquivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!tiposPermitidos.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido')
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const extensao = file.name.split('.').pop()
      const nomeArquivo = `${timestamp}-${Math.random().toString(36).substring(2, 8)}.${extensao}`
      const caminho = `${pasta}/${nomeArquivo}`

      console.log('📤 Fazendo upload para:', caminho)

      const { error: uploadError } = await supabase.storage
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

  // 🗑️ DELETAR IMAGEM
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

  // 🔌 TESTAR CONEXÃO
  const testarConexao = async () => {
    try {
      console.log('🔌 Testando conexão com o banco...')

      const { error: connectionError } = await supabase
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