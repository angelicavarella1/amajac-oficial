import { supabase } from '../client'

// 🔐 Verificar se usuário é admin
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

// 📰 NOTÍCIAS (CRUD Admin)
export const fetchTodasNoticias = async () => {
  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .order('data_publicacao', { ascending: false })
  if (error) throw error
  return data || []
}

export const criarNoticia = async (noticia) => {
  const { data, error } = await supabase
    .from('noticias')
    .insert([{
      titulo: noticia.titulo,
      resumo: noticia.resumo,
      conteudo: noticia.conteudo,
      autor: noticia.autor,
      imagem_url: noticia.imagem_url,
      imagem_alt: noticia.imagem_alt,
      data_publicacao: noticia.data_publicacao || new Date().toISOString(),
      ativo: noticia.ativo !== undefined ? noticia.ativo : true
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export const atualizarNoticia = async (id, updates) => {
  const { data, error } = await supabase
    .from('noticias')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deletarNoticia = async (id) => {
  const { error } = await supabase
    .from('noticias')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// 📅 EVENTOS (CRUD Admin)
export const fetchTodosEventos = async () => {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .order('data_hora_evento', { ascending: true })
  if (error) throw error
  return data || []
}

export const criarEvento = async (evento) => {
  const { data, error } = await supabase
    .from('eventos')
    .insert([{
      titulo: evento.titulo,
      descricao: evento.descricao,
      data_hora_evento: evento.data_hora_evento,
      local: evento.local,
      imagem_url: evento.imagem_url,
      imagem_alt: evento.imagem_alt,
      ativo: evento.ativo !== undefined ? evento.ativo : true
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export const atualizarEvento = async (id, updates) => {
  const { data, error } = await supabase
    .from('eventos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deletarEvento = async (id) => {
  const { error } = await supabase
    .from('eventos')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// 👥 COLABORADORES (CRUD Admin)
export const fetchTodosColaboradores = async () => {
  const { data, error } = await supabase
    .from('colaboradores')
    .select('*')
    .order('nome', { ascending: true })
  if (error) throw error
  return data || []
}

export const criarColaborador = async (colaborador) => {
  const { data, error } = await supabase
    .from('colaboradores')
    .insert([{
      nome: colaborador.nome,
      tipo: colaborador.tipo,
      categoria: colaborador.categoria,
      descricao: colaborador.descricao,
      telefone: colaborador.telefone,
      endereco: colaborador.endereco,
      imagem_url: colaborador.imagem_url,
      imagem_alt: colaborador.imagem_alt,
      ativo: colaborador.ativo !== undefined ? colaborador.ativo : true
    }])
    .select()
    .single()
  if (error) throw error
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

export const deletarColaborador = async (id) => {
  const { error } = await supabase
    .from('colaboradores')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// 🖼️ GALERIA (CRUD Admin)
export const fetchTodaGaleria = async () => {
  const { data, error } = await supabase
    .from('galeria')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export const adicionarImagemGaleria = async (imagem) => {
  const { data, error } = await supabase
    .from('galeria')
    .insert([{
      titulo: imagem.titulo,
      descricao: imagem.descricao,
      imagem_url: imagem.imagem_url,
      imagem_alt: imagem.imagem_alt,
      categoria: imagem.categoria,
      ativo: imagem.ativo !== undefined ? imagem.ativo : true
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export const atualizarImagemGaleria = async (id, updates) => {
  const { data, error } = await supabase
    .from('galeria')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deletarImagemGaleria = async (id) => {
  const { error } = await supabase
    .from('galeria')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// 🏷️ CLASSIFICADOS (CRUD Admin)
export const fetchTodosClassificados = async () => {
  const { data, error } = await supabase
    .from('classificados')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export const aprovarClassificado = async (id) => {
  const { data, error } = await supabase
    .from('classificados')
    .update({ aprovado: true })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const rejeitarClassificado = async (id) => {
  const { data, error } = await supabase
    .from('classificados')
    .update({ aprovado: false, ativo: false })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deletarClassificado = async (id) => {
  const { error } = await supabase
    .from('classificados')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ✉️ MENSAGENS (Admin)
export const fetchTodasMensagens = async () => {
  const { data, error } = await supabase
    .from('mensagens_contato')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export const marcarMensagemComoLida = async (id) => {
  const { data, error } = await supabase
    .from('mensagens_contato')
    .update({ lida: true })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deletarMensagem = async (id) => {
  const { error } = await supabase
    .from('mensagens_contato')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// 👥 SOCIOS (Admin)
export const fetchTodosSocios = async () => {
  const { data, error } = await supabase
    .from('socios')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export const atualizarStatusSocio = async (id, status) => {
  const { data, error } = await supabase
    .from('socios')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ⚙️ CONFIGURAÇÕES (Admin)
export const fetchTodasConfiguracoes = async () => {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('*')
    .order('chave', { ascending: true })
  if (error) throw error
  return data || []
}

export const atualizarConfiguracao = async (chave, valor) => {
  const { data, error } = await supabase
    .from('configuracoes')
    .update({ valor, updated_at: new Date().toISOString() })
    .eq('chave', chave)
    .select()
    .single()
  if (error) throw error
  return data
}

// 📊 LOGS (Admin - Somente leitura)
export const fetchLogsAdmin = async (limit = 50) => {
  const { data, error } = await supabase
    .from('admin_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

// 🔥 ADMIN API UNIFICADA - CORREÇÃO DO ERRO
export const adminApi = {
  // 🔐 Autenticação
  verificarSeEhAdmin,
  
  // 📰 Notícias
  noticias: {
    getAll: fetchTodasNoticias,
    create: criarNoticia,
    update: atualizarNoticia,
    delete: deletarNoticia
  },
  
  // 📅 Eventos
  eventos: {
    getAll: fetchTodosEventos,
    create: criarEvento,
    update: atualizarEvento,
    delete: deletarEvento
  },
  
  // 👥 Colaboradores
  colaboradores: {
    getAll: fetchTodosColaboradores,
    create: criarColaborador,
    update: atualizarColaborador,
    delete: deletarColaborador
  },
  
  // 🖼️ Galeria
  galeria: {
    getAll: fetchTodaGaleria,
    create: adicionarImagemGaleria,
    update: atualizarImagemGaleria,
    delete: deletarImagemGaleria
  },
  
  // 🏷️ Classificados
  classificados: {
    getAll: fetchTodosClassificados,
    approve: aprovarClassificado,
    reject: rejeitarClassificado,
    delete: deletarClassificado
  },
  
  // ✉️ Mensagens
  mensagens: {
    getAll: fetchTodasMensagens,
    markAsRead: marcarMensagemComoLida,
    delete: deletarMensagem
  },
  
  // 👥 Sócios
  socios: {
    getAll: fetchTodosSocios,
    updateStatus: atualizarStatusSocio
  },
  
  // ⚙️ Configurações
  configuracoes: {
    getAll: fetchTodasConfiguracoes,
    update: atualizarConfiguracao
  },
  
  // 📊 Logs
  logs: {
    getAll: fetchLogsAdmin
  }
}