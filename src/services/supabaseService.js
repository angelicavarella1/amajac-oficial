import { createClient } from '@supabase/supabase-js'

// Inicializar cliente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const SupabaseService = {
  // Notícias
  async getNoticias() {
    try {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .order('data_publicacao', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error)
      return { data: null, error }
    }
  },

  // Eventos
  async getEventos() {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('data_evento', { ascending: true })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
      return { data: null, error }
    }
  },

  // Galeria de Fotos
  async getFotos() {
    try {
      const { data, error } = await supabase
        .from('galeria')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error)
      return { data: null, error }
    }
  },

  // Colaboradores
  async getColaboradores() {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('*')
        .order('nome', { ascending: true })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error)
      return { data: null, error }
    }
  },

  // Enviar Mensagem de Contato
  async enviarMensagem(mensagem) {
    try {
      const { data, error } = await supabase
        .from('mensagens_contato')
        .insert([
          {
            nome: mensagem.nome,
            email: mensagem.email,
            telefone: mensagem.telefone,
            assunto: mensagem.assunto,
            mensagem: mensagem.mensagem,
            status: 'pendente',
            created_at: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return { data: null, error }
    }
  },

  // Buscar configurações do site
  async getConfiguracoes() {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      return { data: null, error }
    }
  },

  // Upload de arquivos (para futuras funcionalidades)
  async uploadArquivo(file, bucket = 'geral') {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      return { data: null, error }
    }
  },

  // Buscar URL pública do arquivo
  getUrlPublica(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}

// Helper para formatação de datas
export const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Helper para formatação de telefone
export const formatarTelefone = (telefone) => {
  if (!telefone) return ''
  const numeros = telefone.replace(/\D/g, '')
  return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}