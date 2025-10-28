import { supabase } from '../client'

//  Verificar se usuario e admin
export const verificarSeEhAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  try {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('nivel')
      .eq('id', user.id)
      .single()

    if (error) throw error

    return data?.nivel ? true : false
  } catch (err) {
    console.error('Erro ao verificar admin:', err)
    return false
  }
}

//  COLABORADORES (CRUD Admin) - FUNCAO CORRIGIDA
export const criarColaborador = async (colaborador) => {
  console.log(' Salvando colaborador com dados:', colaborador)

  const { data, error } = await supabase
    .from('colaboradores')
    .insert([{
      nome: colaborador.nome || '',
      tipo: colaborador.tipo || 'parceiro',
      logo_url: colaborador.logo_url || '',
      ativo: colaborador.ativo !== undefined ? colaborador.ativo : true,
      imagem_alt: colaborador.imagem_alt || '',
      telefone: colaborador.telefone || '',
      endereco: colaborador.endereco || '',
      cnpj: colaborador.cnpj || '',
      email_contato: colaborador.email_contato || '',
      ramo: colaborador.ramo || '',
      data_inicio: colaborador.data_inicio || null,
      status: colaborador.status || 'ativo',
      descricao_curta: colaborador.descricao_curta || '', // Corrigido: nome do campo no banco
      link_site: colaborador.link_site || '',
      facebook: colaborador.facebook || '', // Corrigido: nome do campo no banco
      instagram: colaborador.instagram || '', // Corrigido: nome do campo no banco
      tags: colaborador.tags || [] // Corrigido: nome do campo no banco
    }])
    .select()
    .single()

  if (error) {
    console.error(' Erro ao criar colaborador:', error)
    throw error
  }

  console.log(' Colaborador criado com sucesso:', data)
  return data
}

export const atualizarColaborador = async (id, updates) => {
  const { data, error } = await supabase
    .from('colaboradores')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const fetchTodosColaboradores = async () => {
  const { data, error } = await supabase
    .from('colaboradores')
    .select('*')
    .order('nome', { ascending: true })
  if (error) throw error
  return data || []
}

export const deletarColaborador = async (id) => {
  const { error } = await supabase
    .from('colaboradores')
    .delete()
    .eq('id', id)
  if (error) throw error
}

//  ADMIN API UNIFICADA - CORRECAO DO ERRO
export const adminApi = {
  colaboradores: {
    getAll: fetchTodosColaboradores,
    create: criarColaborador,
    update: atualizarColaborador,
    delete: deletarColaborador
  }
}