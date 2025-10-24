import { supabase } from '../client'

// 📰 NOTÍCIAS
export const fetchNoticiasPublicas = async (limit = 10, page = 1) => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('noticias')
    .select('*', { count: 'exact' })
    .eq('ativo', true)
    .order('data_publicacao', { ascending: false })
    .range(from, to)

  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export const fetchNoticiaPublicaPorId = async (id) => {
  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .eq('ativo', true)
    .single()

  if (error) throw error
  return data
}

// 📅 EVENTOS
export const fetchEventosPublicos = async (limit = 10) => {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('ativo', true)
    // Se 'data_fim' não existe na sua tabela, mude para 'data_hora_evento'
    .gte('data_fim', new Date().toISOString().split('T')[0]) 
    .order('data_inicio', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

export const fetchEventoPublicoPorId = async (id) => {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('id', id)
    .eq('ativo', true)
    .single()

  if (error) throw error
  return data
}

export const fetchEventosFuturos = async () => {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('ativo', true)
    .gte('data_hora_evento', new Date().toISOString())
    .order('data_hora_evento', { ascending: true })

  if (error) throw error
  return data || []
}

// 👥 COLABORADORES
export const fetchColaboradoresPublicos = async () => {
  const { data, error } = await supabase
    .from('colaboradores')
    .select('*')
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (error) throw error
  return data || []
}

export const fetchColaboradorPublicoPorId = async (id) => {
  const { data, error } = await supabase
    .from('colaboradores')
    .select('*')
    .eq('id', id)
    .eq('ativo', true)
    .single()

  if (error) throw error
  return data
}

// 🖼️ GALERIA
export const fetchGaleriaPublica = async () => {
  const { data, error } = await supabase
    .from('galeria')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const fetchImagemPublicaPorId = async (id) => {
  const { data, error } = await supabase
    .from('galeria')
    .select('*')
    .eq('id', id)
    .eq('ativo', true)
    .single()

  if (error) throw error
  return data
}

// 🏷️ CLASSIFICADOS
export const fetchClassificadosPublicos = async (limit = 20) => {
  const { data, error } = await supabase
    .from('classificados')
    .select('*')
    .eq('ativo', true)
    .eq('aprovado', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export const fetchClassificadoPublicoPorId = async (id) => {
  const { data, error } = await supabase
    .from('classificados')
    .select('*')
    .eq('id', id)
    .eq('ativo', true)
    .eq('aprovado', true)
    .single()

  if (error) throw error
  return data
}

// ⚠️ Linha removida para evitar redundância e conflito com publicApi.classificados
// export const publicClassificados = fetchClassificadosPublicos 

// ⚙️ CONFIGURAÇÕES
export const fetchConfiguracoesPublicas = async () => {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('*')
    .eq('publico', true)

  if (error) throw error
  return data || []
}

// ✉️ MENSAGENS DE CONTATO (INSERT apenas)
export const enviarMensagemContato = async (mensagem) => {
  const { data, error } = await supabase
    .from('mensagens_contato')
    .insert([{
      nome: mensagem.nome,
      email: mensagem.email,
      assunto: mensagem.assunto,
      mensagem: mensagem.mensagem,
      telefone: mensagem.telefone,
      status: 'pendente',
      lida: false
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// 👥 SOCIOS (INSERT apenas)
export const enviarInscricaoSocio = async (dadosSocio) => {
  const { data, error } = await supabase
    .from('socios')
    .insert([{
      nome: dadosSocio.nome,
      email: dadosSocio.email,
      telefone: dadosSocio.telefone,
      endereco: dadosSocio.endereco,
      profissao: dadosSocio.profissao,
      observacoes: dadosSocio.observacoes,
      status: 'pendente'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// -------------------------------------------------------------
// 🔥 CORREÇÃO PRINCIPAL: DEFINIR E EXPORTAR publicApi
// -------------------------------------------------------------
export const publicApi = {
  // 📰 Notícias
  noticias: {
    getAll: fetchNoticiasPublicas,
    getById: fetchNoticiaPublicaPorId,
  },

  // 📅 Eventos
  eventos: {
    getAll: fetchEventosPublicos,
    getById: fetchEventoPublicoPorId,
    getFuturos: fetchEventosFuturos,
  },

  // 👥 Colaboradores
  colaboradores: {
    getAll: fetchColaboradoresPublicos,
    getById: fetchColaboradorPublicoPorId,
  },

  // 🖼️ Galeria
  galeria: {
    getAll: fetchGaleriaPublica,
    getById: fetchImagemPublicaPorId,
  },

  // 🏷️ Classificados
  classificados: {
    getAll: fetchClassificadosPublicos,
    getById: fetchClassificadoPublicoPorId,
  },

  // ⚙️ Configurações
  configuracoes: {
    getAll: fetchConfiguracoesPublicas,
  },

  // ✉️ Mensagens de Contato
  mensagens: {
    send: enviarMensagemContato, // Mapeado para 'send' ou 'enviarMensagemContato' (melhor usar 'send' para manter o padrão CRUD)
  },

  // 👥 Sócios
  socios: {
    register: enviarInscricaoSocio, // Mapeado para 'register'
  },
}