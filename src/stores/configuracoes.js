// src/stores/configuracoes.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase' // Certifique-se que '@/supabase' exporta corretamente o cliente Supabase

export const useConfiguracoesStore = defineStore('configuracoes', {
  state: () => ({
    site: {
      site_nome: '',
      site_descricao: '',
      site_keywords: '',
      site_titulo: '' // Adicionado conforme aviso
    },
    contato: {
      email_contato: '', // Mantido conforme código original
      telefone_contato: '', // Mantido conforme código original
      endereco: '', // Mantido conforme código original
      contato_whatsapp: '', // Mantido conforme código original
      contato_facebook: '', // Mantido conforme código original
      contato_instagram: '', // Mantido conforme código original
      contato_horario_funcionamento: '', // Mantido conforme código original
      contato_email: '', // Adicionado conforme aviso
      contato_subtitulo: '', // Adicionado conforme aviso
      contato_titulo: '', // Adicionado conforme aviso
      contato_telefone: '' // Adicionado conforme aviso
    },
    hero: {
      hero_titulo: '',
      hero_subtitulo: '',
      hero_local: '',
      hero_descricao: '',
      hero_cta1_texto: '',
      hero_cta1_link: '',
      hero_cta2_texto: '',
      hero_cta2_link: '',
      hero_imagem_url: ''
    },
    about: {
      quem_somos_titulo: '',
      quem_somos_subtitulo: '',
      quem_somos_historia: '',
      quem_somos_missao_titulo: '',
      quem_somos_missao: '',
      quem_somos_valores_titulo: '',
      quem_somos_valores: '',
      quem_somos_estatisticas_familias: '',
      quem_somos_estatisticas_ano: '',
      quem_somos_imagem_url: ''
    },
    sistema: {
      info_clima_ativado: 'true',
      info_relogio_ativado: 'true',
      info_galeria_ativado: 'true',
      info_eventos_ativado: 'true',
      info_noticias_ativado: 'true',
      info_classificados_ativado: 'true',
      info_colaboradores_ativado: 'true'
    },
    // Nova seção para armazenar as chaves adicionais que não se encaixam nas anteriores
    extras: {
      configuracoes_gerais: '', // Adicionado conforme aviso
      facebook: '', // Adicionado conforme aviso
      instagram: '' // Adicionado conforme aviso
    }
  }),

  getters: {
    // Getters para 'site'
    siteTitle: (state) => state.site?.site_nome || state.site?.site_titulo || 'AMAJAC',
    siteDescription: (state) => state.site?.site_descricao || 'Associação de Moradores e Amigos do Jardim Atlântico Central',
    siteKeywords: (state) => state.site?.site_keywords || '',

    // Getters para 'contato' - Atualizados para incluir novas chaves
    contatoEmail: (state) => state.contato?.email_contato || state.contato?.contato_email || state.contato?.contato_email,
    contatoTelefone: (state) => state.contato?.telefone_contato || state.contato?.contato_telefone,
    contatoEndereco: (state) => state.contato?.endereco || state.contato?.contato_endereco,
    contatoWhatsapp: (state) => state.contato?.contato_whatsapp,
    contatoFacebook: (state) => state.contato?.contato_facebook || state.contato?.facebook, // Checa ambas as chaves
    contatoInstagram: (state) => state.contato?.contato_instagram || state.contato?.instagram, // Checa ambas as chaves
    contatoHorarioFuncionamento: (state) => state.contato?.contato_horario_funcionamento,
    contatoSubtitulo: (state) => state.contato?.contato_subtitulo, // Getter para nova chave
    contatoTitulo: (state) => state.contato?.contato_titulo, // Getter para nova chave

    // Getters para 'hero' (mantidos conforme original)
    heroTitulo: (state) => state.hero?.hero_titulo || 'PORTAL DO MORADOR',
    heroSubtitulo: (state) => state.hero?.hero_subtitulo || 'AMAJAC',
    heroLocal: (state) => state.hero?.hero_local || 'Associação de Moradores e Amigos do Jardim Atlântico Central',
    heroDescricao: (state) => state.hero?.hero_descricao || 'Unindo a comunidade por um bairro melhor.',
    heroCta1Texto: (state) => state.hero?.hero_cta1_texto,
    heroCta1Link: (state) => state.hero?.hero_cta1_link,
    heroCta2Texto: (state) => state.hero?.hero_cta2_texto,
    heroCta2Link: (state) => state.hero?.hero_cta2_link,
    heroImagemUrl: (state) => state.hero?.hero_imagem_url,

    // Getters para 'about' (mantidos conforme original)
    aboutTitulo: (state) => state.about?.quem_somos_titulo,
    aboutSubtitulo: (state) => state.about?.quem_somos_subtitulo,
    aboutHistoria: (state) => state.about?.quem_somos_historia,
    aboutMissaoTitulo: (state) => state.about?.quem_somos_missao_titulo,
    aboutMissao: (state) => state.about?.quem_somos_missao,
    aboutValoresTitulo: (state) => state.about?.quem_somos_valores_titulo,
    aboutValores: (state) => state.about?.quem_somos_valores,
    aboutEstatisticasFamilias: (state) => state.about?.quem_somos_estatisticas_familias,
    aboutEstatisticasAno: (state) => state.about?.quem_somos_estatisticas_ano,
    aboutImagemUrl: (state) => state.about?.quem_somos_imagem_url,

    // Getters para 'sistema' (mantidos conforme original)
    mostrarClima: (state) => state.sistema?.info_clima_ativado === 'true',
    mostrarRelogio: (state) => state.sistema?.info_relogio_ativado === 'true',
    mostrarGaleria: (state) => state.sistema?.info_galeria_ativado === 'true',
    mostrarEventos: (state) => state.sistema?.info_eventos_ativado === 'true',
    mostrarNoticias: (state) => state.sistema?.info_noticias_ativado === 'true',
    mostrarClassificados: (state) => state.sistema?.info_classificados_ativado === 'true',
    mostrarColaboradores: (state) => state.sistema?.info_colaboradores_ativado === 'true',

    // Getters para 'extras'
    configuracoesGerais: (state) => state.extras?.configuracoes_gerais,
    facebookUrl: (state) => state.extras?.facebook || state.contato?.contato_facebook, // Prioriza extras, fallback para contato
    instagramUrl: (state) => state.extras?.instagram || state.contato?.contato_instagram, // Prioriza extras, fallback para contato

    // Getters combinados (mantidos conforme original, com potencial atualização)
    redesSociais: (state) => ({
      facebook: state.contato?.contato_facebook || state.extras?.facebook,
      instagram: state.contato?.contato_instagram || state.extras?.instagram
    }),

    informacoesContato: (state) => ({
      telefone: state.contato?.telefone_contato || state.contato?.contato_telefone,
      email: state.contato?.email_contato || state.contato?.contato_email,
      endereco: state.contato?.endereco || state.contato?.contato_endereco,
      whatsapp: state.contato?.contato_whatsapp,
      horario_funcionamento: state.contato?.contato_horario_funcionamento
    }),

    rodapeTexto: () => `© ${new Date().getFullYear()} AMAJAC. Todos os direitos reservados.`
  },

  actions: {
    async carregarConfiguracoes() {
      try {
        console.log('🔄 Store: Iniciando carregamento de configurações do banco...')
        const { data, error } = await supabase
          .from('configuracoes')
          .select('*')
          .order('chave') // Ordena para facilitar a leitura, se necessário

        if (error) throw error

        if (data?.length) {
          console.log(`✅ ${data.length} configurações carregadas do banco`)
          this.resetState() // Limpa o estado antes de popular
          data.forEach(cfg => this.mapearConfiguracao(cfg.chave, cfg.valor))
          console.log('✅ Store: Configurações mapeadas com sucesso')
        } else {
          console.log('ℹ️ Nenhuma configuração encontrada no banco.')
        }
      } catch (err) {
        console.error('❌ Erro ao carregar configurações:', err)
        // Opcional: lançar o erro novamente para que chamadores possam lidar
        // throw err;
      }
    },

    mapearConfiguracao(chave, valor) {
      // Mapeamento centralizado para todas as chaves
      const mapeamento = {
        // --- Seção Site ---
        'site_nome': () => { this.site.site_nome = valor; },
        'site_descricao': () => { this.site.site_descricao = valor; },
        'site_keywords': () => { this.site.site_keywords = valor; },
        'site_titulo': () => { this.site.site_titulo = valor; }, // Adicionado

        // --- Seção Contato ---
        'email_contato': () => { this.contato.email_contato = valor; },
        'telefone_contato': () => { this.contato.telefone_contato = valor; },
        'endereco': () => { this.contato.endereco = valor; },
        'contato_whatsapp': () => { this.contato.contato_whatsapp = valor; },
        'contato_facebook': () => { this.contato.contato_facebook = valor; },
        'contato_instagram': () => { this.contato.contato_instagram = valor; },
        'contato_horario_funcionamento': () => { this.contato.contato_horario_funcionamento = valor; },
        'contato_email': () => { this.contato.contato_email = valor; }, // Adicionado
        'contato_subtitulo': () => { this.contato.contato_subtitulo = valor; }, // Adicionado
        'contato_titulo': () => { this.contato.contato_titulo = valor; }, // Adicionado
        'contato_telefone': () => { this.contato.contato_telefone = valor; }, // Adicionado
        'contato_endereco': () => { this.contato.contato_endereco = valor; }, // Adicionado (pode ser alternativa a 'endereco')

        // --- Seção Hero ---
        'hero_titulo': () => { this.hero.hero_titulo = valor; },
        'hero_subtitulo': () => { this.hero.hero_subtitulo = valor; },
        'hero_local': () => { this.hero.hero_local = valor; },
        'hero_descricao': () => { this.hero.hero_descricao = valor; },
        'hero_cta1_texto': () => { this.hero.hero_cta1_texto = valor; },
        'hero_cta1_link': () => { this.hero.hero_cta1_link = valor; },
        'hero_cta2_texto': () => { this.hero.hero_cta2_texto = valor; },
        'hero_cta2_link': () => { this.hero.hero_cta2_link = valor; },
        'hero_imagem_url': () => { this.hero.hero_imagem_url = valor; },

        // --- Seção About ---
        'quem_somos_titulo': () => { this.about.quem_somos_titulo = valor; },
        'quem_somos_subtitulo': () => { this.about.quem_somos_subtitulo = valor; },
        'quem_somos_historia': () => { this.about.quem_somos_historia = valor; },
        'quem_somos_missao_titulo': () => { this.about.quem_somos_missao_titulo = valor; },
        'quem_somos_missao': () => { this.about.quem_somos_missao = valor; },
        'quem_somos_valores_titulo': () => { this.about.quem_somos_valores_titulo = valor; },
        'quem_somos_valores': () => { this.about.quem_somos_valores = valor; },
        'quem_somos_estatisticas_familias': () => { this.about.quem_somos_estatisticas_familias = valor; },
        'quem_somos_estatisticas_ano': () => { this.about.quem_somos_estatisticas_ano = valor; },
        'quem_somos_imagem_url': () => { this.about.quem_somos_imagem_url = valor; },

        // --- Seção Sistema ---
        'info_clima_ativado': () => { this.sistema.info_clima_ativado = valor; },
        'info_relogio_ativado': () => { this.sistema.info_relogio_ativado = valor; },
        'info_galeria_ativado': () => { this.sistema.info_galeria_ativado = valor; },
        'info_eventos_ativado': () => { this.sistema.info_eventos_ativado = valor; },
        'info_noticias_ativado': () => { this.sistema.info_noticias_ativado = valor; },
        'info_classificados_ativado': () => { this.sistema.info_classificados_ativado = valor; },
        'info_colaboradores_ativado': () => { this.sistema.info_colaboradores_ativado = valor; },

        // --- Seção Extras (para chaves não mapeadas anteriormente) ---
        'configuracoes_gerais': () => { this.extras.configuracoes_gerais = valor; }, // Adicionado
        'facebook': () => { this.contato.facebook = valor; this.extras.facebook = valor; }, // Mapeia para ambos, se necessário
        'instagram': () => { this.contato.instagram = valor; this.extras.instagram = valor; }, // Mapeia para ambos, se necessário
        // Adicione outras chaves aqui conforme forem identificadas no banco
      };

      // Executa a função de mapeamento se a chave existir
      if (mapeamento[chave]) {
        mapeamento[chave]();
      } else {
        // Avisa sobre chaves não mapeadas, útil para identificar novas configurações
        console.warn(`⚠️ Chave de configuração não mapeada: ${chave}`);
        // Opcional: adicionar a chave desconhecida a uma propriedade genérica no estado
        // this.extras[chave] = valor;
      }
    },


    resetState() {
      // Limpa todas as seções de configuração
      Object.assign(this.$state, this.$state.constructor()); // Reinicia para valores padrão definidos em state()
      // Alternativamente, você pode redefinir manualmente cada seção como estava anteriormente.
    },

    atualizarConfiguracao(secao, chave, valor) {
      if (this[secao] && chave in this[secao]) {
        this[secao][chave] = valor
        console.log(`⚡ Atualizado: ${secao}.${chave} = ${valor}`)
      } else {
        console.error(`❌ Configuração não encontrada: ${secao}.${chave}`)
      }
    },

    obterConfiguracao(secao, chave) {
      if (this[secao] && chave in this[secao]) return this[secao][chave]
      console.warn(`⚠️ Configuração não encontrada: ${secao}.${chave}`)
      return null
    },

    async testarImagemHero() {
      if (!this.hero.hero_imagem_url) return console.log('❌ Nenhuma imagem do hero definida')
      try {
        const res = await fetch(this.hero.hero_imagem_url, { method: 'HEAD' })
        console.log(res.ok ? '✅ Imagem do hero acessível' : `❌ Imagem não acessível (${res.status})`)
      } catch (e) {
        console.error('❌ Erro ao testar imagem do hero:', e)
      }
    },

    async recarregarConfiguracoes() {
      console.log('🔄 Recarregando configurações...')
      await this.carregarConfiguracoes()
    }
  }
})