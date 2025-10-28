import { ref, readonly } from 'vue'
import { supabase } from '@/supabase/client.js'
import { useUIStore } from '@/shared/stores/ui'

export function useColaboradores() {
  const colaboradores = ref([])
  const colaborador = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const uiStore = useUIStore()

  // 🔧 FUNÇÃO AUXILIAR PARA MAPEAR DADOS - CORRIGIDA
  const mapearDadosParaBanco = (dados) => {
    return {
      nome: dados.nome || '',
      tipo: dados.tipo || 'parceiro',
      logo_url: dados.logo_url || '',
      ativo: dados.ativo !== undefined ? dados.ativo : true,
      imagem_alt: dados.imagem_alt || '',
      telefone: dados.telefone || '',
      endereco: dados.endereco || '',
      cnpj: dados.cnpj || '',
      email_contato: dados.email_contato || '',
      ramo: dados.ramo || '',
      data_inicio: dados.data_inicio || null,
      status: dados.status || 'ativo',
      descricao_curta: dados.descricao_curta || '',
      link_site: dados.link_site || '',
      facebook: dados.facebook || '',
      instagram: dados.instagram || '',
      tags: dados.tags || dados.etiquetas || [] // Mapeia etiquetas para tags
    }
  }

  // 📝 CRIAR COLABORADOR - CORRIGIDO
  const criarColaborador = async (dadosColaborador) => {
    loading.value = true
    error.value = null

    try {
      console.log('💾 Salvando parceiro...', dadosColaborador)

      const dadosMapeados = mapearDadosParaBanco(dadosColaborador)

      const { data, error: supabaseError } = await supabase
        .from('colaboradores')
        .insert([{
          ...dadosMapeados,
          created_at: new Date().toISOString()
          // REMOVIDO: updated_at não existe na tabela
        }])
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ Erro do Supabase:', supabaseError)
        throw supabaseError
      }

      colaboradores.value.push(data)
      uiStore.showToast('Parceiro criado com sucesso!', 'success')
      console.log('✅ Parceiro criado:', data)
      return data
    } catch (err) {
      console.error('❌ Erro ao salvar parceiro:', err)
      error.value = err.message
      uiStore.showToast('Erro ao salvar parceiro: ' + err.message, 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✏️ ATUALIZAR COLABORADOR - CORRIGIDO
  const atualizarColaborador = async (id, dadosAtualizados) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 Atualizando parceiro:', id, dadosAtualizados)

      const dadosMapeados = mapearDadosParaBanco(dadosAtualizados)

      const { data, error: supabaseError } = await supabase
        .from('colaboradores')
        .update({
          ...dadosMapeados
          // REMOVIDO: updated_at não existe na tabela
        })
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualiza a lista local
      const index = colaboradores.value.findIndex(c => c.id === id)
      if (index !== -1) {
        colaboradores.value[index] = data
      }

      // Atualiza o colaborador atual se for o mesmo
      if (colaborador.value?.id === id) {
        colaborador.value = data
      }

      uiStore.showToast('Parceiro atualizado com sucesso!', 'success')
      return data
    } catch (err) {
      console.error('❌ Erro ao atualizar parceiro:', err)
      error.value = err.message
      uiStore.showToast('Erro ao atualizar parceiro', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 📥 CARREGAR COLABORADORES
  const fetchColaboradores = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 Carregando parceiros...')

      const { data, error: supabaseError } = await supabase
        .from('colaboradores')
        .select('*')
        .order('nome', { ascending: true })

      if (supabaseError) throw supabaseError

      colaboradores.value = data || []
      console.log(`✅ ${data?.length || 0} parceiros carregados`)
      return data
    } catch (err) {
      console.error('❌ Erro ao carregar parceiros:', err)
      error.value = err.message
      uiStore.showToast('Erro ao carregar parceiros', 'error')
      return []
    } finally {
      loading.value = false
    }
  }

  // 🔍 CARREGAR COLABORADOR POR ID
  const carregarColaboradorPorId = async (id) => {
    loading.value = true
    error.value = null

    try {
      console.log(`🔍 Carregando parceiro ID: ${id}`)

      const { data, error: supabaseError } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('id', id)
        .single()

      if (supabaseError) throw supabaseError

      colaborador.value = data
      console.log('✅ Parceiro carregado:', data)
      return data
    } catch (err) {
      console.error('❌ Erro ao carregar parceiro:', err)
      error.value = err.message
      uiStore.showToast('Parceiro não encontrado', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🗑️ EXCLUIR COLABORADOR
  const excluirColaborador = async (id) => {
    loading.value = true
    error.value = null

    try {
      console.log(`🗑️ Excluindo parceiro ID: ${id}`)

      const { error: supabaseError } = await supabase
        .from('colaboradores')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      // Remove da lista local
      colaboradores.value = colaboradores.value.filter(c => c.id !== id)
      
      // Limpa o colaborador atual se for o mesmo
      if (colaborador.value?.id === id) {
        colaborador.value = null
      }

      uiStore.showToast('Parceiro excluído com sucesso!', 'success')
      console.log('✅ Parceiro excluído')
      return true
    } catch (err) {
      console.error('❌ Erro ao excluir parceiro:', err)
      error.value = err.message
      uiStore.showToast('Erro ao excluir parceiro', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔄 TOGGLE STATUS - CORRIGIDO
  const toggleStatusColaborador = async (id, statusAtual) => {
    try {
      console.log(`🔄 Alterando status do parceiro ${id} para: ${!statusAtual}`)

      const { error: supabaseError } = await supabase
        .from('colaboradores')
        .update({
          ativo: !statusAtual
          // REMOVIDO: updated_at não existe na tabela
        })
        .eq('id', id)

      if (supabaseError) throw supabaseError

      // Atualiza localmente
      const index = colaboradores.value.findIndex(c => c.id === id)
      if (index !== -1) {
        colaboradores.value[index].ativo = !statusAtual
      }

      if (colaborador.value?.id === id) {
        colaborador.value.ativo = !statusAtual
      }

      uiStore.showToast(`Parceiro ${!statusAtual ? 'ativado' : 'desativado'} com sucesso!`, 'success')
      return !statusAtual
    } catch (err) {
      console.error('❌ Erro ao alterar status:', err)
      uiStore.showToast('Erro ao alterar status do parceiro', 'error')
      throw err
    }
  }

  // 🖼️ UPLOAD DE LOGO
  const uploadLogo = async (file, idColaborador) => {
    try {
      console.log('🖼️ Iniciando upload de logo...')

      if (!file || !idColaborador) {
        throw new Error('Arquivo ou ID do colaborador não informado')
      }

      // Validar tipo de arquivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
      if (!tiposPermitidos.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.')
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 5MB.')
      }

      const timestamp = Date.now()
      const extensao = file.name.split('.').pop()
      const nomeArquivo = `colaborador-${idColaborador}-${timestamp}.${extensao}`
      const caminho = `colaboradores/${nomeArquivo}`

      console.log('📤 Fazendo upload para:', caminho)

      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(caminho, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(caminho)

      console.log('✅ Upload concluído:', urlData.publicUrl)
      return urlData.publicUrl
    } catch (err) {
      console.error('❌ Erro no upload de logo:', err)
      throw err
    }
  }

  return {
    // Estado
    colaboradores,
    colaborador,
    loading: readonly(loading),
    error: readonly(error),

    // Métodos
    fetchColaboradores,
    carregarColaboradorPorId,
    criarColaborador,
    atualizarColaborador,
    excluirColaborador,
    toggleStatusColaborador,
    uploadLogo
  }
}