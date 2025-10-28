import { supabase } from '@/supabase';
import { defineStore } from 'pinia';

export const useClassificadosStore = defineStore('classificados', {
  state: () => ({
    classificados: [],
    classificadoSelecionado: null,
    loading: false,
    error: null
  }),

  getters: {
    classificadosPorCategoria: (state) => (categoria) => {
      if (!categoria) return state.classificados;
      return state.classificados.filter(item => item.categoria === categoria);
    },
    
    classificadosAtivos: (state) => {
      return state.classificados.filter(item => 
        item.ativo !== false && 
        (!item.data_expiracao || new Date(item.data_expiracao) > new Date())
      );
    },

    // NOVO: Classificados aprovados para a home
    classificadosHome: (state) => {
      return state.classificados.filter(item => 
        item.status === 'aprovado' && 
        item.ativo !== false &&
        (!item.validade || new Date(item.validade) > new Date())
      );
    }
  },

  actions: {
    async fetchClassificados() {
      this.loading = true;
      this.error = null;
      
      try {
        const { data, error } = await supabase
          .from('classificados')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Se não há dados no Supabase, usar mock data
        if (!data || data.length === 0) {
          console.log('📋 Nenhum classificado no Supabase, usando dados mockados...');
          this.classificados = this.getMockClassificados();
        } else {
          this.classificados = data || [];
        }
        
        return this.classificados;
      } catch (error) {
        console.log('❌ Erro ao buscar classificados, usando dados mockados:', error.message);
        // Em caso de erro, usar dados mockados
        this.classificados = this.getMockClassificados();
        return this.classificados;
      } finally {
        this.loading = false;
      }
    },

    // NOVO: Método para obter dados mockados
    getMockClassificados() {
      return [
        {
          id: 1,
          titulo: 'Cuidador de Idosos - Experiência com Alzheimer',
          descricao: 'Cuidador profissional com 5 anos de experiência, especializado em pacientes com Alzheimer e demência. Atendimento humanizado e dedicado.',
          categoria_id: 2,
          categoria: 'Cuidador de Pessoas',
          associado_nome: 'Maria Santos Silva',
          associado_id: 101,
          telefone: '(21) 99999-9999',
          email: 'maria.cuidadora@email.com',
          avaliacao_media: 4.9,
          total_avaliacoes: 8,
          servicos_realizados: 12,
          status: 'aprovado',
          ativo: true,
          validade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          visualizacoes: 45
        },
        {
          id: 2,
          titulo: 'Eletricista Residencial - Instalações e Reparos',
          descricao: 'Serviços elétricos residenciais, instalação de tomadas, disjuntores, luminárias e quadros de energia. Atendimento urgente.',
          categoria_id: 6,
          categoria: 'Manutenção Elétrica',
          associado_nome: 'Carlos Eduardo Lima',
          associado_id: 102,
          telefone: '(21) 88888-8888',
          email: 'carlos.eletricista@email.com',
          avaliacao_media: 4.7,
          total_avaliacoes: 15,
          servicos_realizados: 25,
          status: 'aprovado',
          ativo: true,
          validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString(),
          visualizacoes: 67
        },
        {
          id: 3,
          titulo: 'Faxina Completa - Limpeza Residencial',
          descricao: 'Serviço completo de limpeza residencial, incluindo cozinha, banheiros, quartos e áreas comuns. Produtos de qualidade.',
          categoria_id: 10,
          categoria: 'Faxina Completa',
          associado_nome: 'Ana Paula Rodrigues',
          associado_id: 103,
          telefone: '(21) 77777-7777',
          email: 'ana.faxina@email.com',
          avaliacao_media: 4.8,
          total_avaliacoes: 20,
          servicos_realizados: 35,
          status: 'aprovado',
          ativo: true,
          validade: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
          visualizacoes: 89
        },
        {
          id: 4,
          titulo: 'Encanador - Desentupimentos e Reparos',
          descricao: 'Desentupimento de pias, vasos sanitários, ralos e instalações hidráulicas em geral. Garantia no serviço.',
          categoria_id: 7,
          categoria: 'Manutenção Hidráulica',
          associado_nome: 'Pedro Oliveira',
          associado_id: 104,
          telefone: '(21) 66666-6666',
          email: 'pedro.encanador@email.com',
          avaliacao_media: 4.6,
          total_avaliacoes: 12,
          servicos_realizados: 18,
          status: 'aprovado',
          ativo: true,
          validade: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
          visualizacoes: 34
        },
        {
          id: 5,
          titulo: 'Jardinagem - Paisagismo e Manutenção',
          descricao: 'Cuidados com jardins, podas, plantio, adubação e manutenção de áreas verdes. Trabalho com plantas nativas.',
          categoria_id: 9,
          categoria: 'Jardinagem',
          associado_nome: 'Roberto Costa',
          associado_id: 105,
          telefone: '(21) 55555-5555',
          email: 'roberto.jardineiro@email.com',
          avaliacao_media: 4.9,
          total_avaliacoes: 7,
          servicos_realizados: 10,
          status: 'aprovado',
          ativo: true,
          validade: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
          visualizacoes: 23
        },
        {
          id: 6,
          titulo: 'Beleza e Estética - Cabeleireira em Domicílio',
          descricao: 'Serviços de beleza em domicílio: cortes, coloração, tratamentos capilares e penteados para ocasiões especiais.',
          categoria_id: 4,
          categoria: 'Beleza e Estética',
          associado_nome: 'Fernanda Almeida',
          associado_id: 106,
          telefone: '(21) 44444-4444',
          email: 'fernanda.beleza@email.com',
          avaliacao_media: 4.8,
          total_avaliacoes: 14,
          servicos_realizados: 22,
          status: 'aprovado',
          ativo: true,
          validade: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
          visualizacoes: 56
        }
      ];
    },

    async fetchClassificadoById(id) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('classificados')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        this.classificadoSelecionado = data;
        return data;
      } catch (error) {
        this.error = error.message;
        console.error('Erro ao buscar classificado:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async criarClassificado(classificadoData) {
      try {
        const { data, error } = await supabase
          .from('classificados')
          .insert([{
            ...classificadoData,
            created_at: new Date().toISOString(),
            ativo: true
          }])
          .select()
          .single();

        if (error) throw error;
        
        this.classificados.unshift(data);
        return data;
      } catch (error) {
        console.error('Erro ao criar classificado:', error);
        throw error;
      }
    },

    async atualizarClassificado(id, classificadoData) {
      try {
        const { data, error } = await supabase
          .from('classificados')
          .update(classificadoData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        
        const index = this.classificados.findIndex(item => item.id === id);
        if (index !== -1) {
          this.classificados.splice(index, 1, data);
        }
        return data;
      } catch (error) {
        console.error('Erro ao atualizar classificado:', error);
        throw error;
      }
    },

    async deletarClassificado(id) {
      try {
        const { error } = await supabase
          .from('classificados')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        this.classificados = this.classificados.filter(item => item.id !== id);
        return true;
      } catch (error) {
        console.error('Erro ao deletar classificado:', error);
        throw error;
      }
    },

    async incrementarVisualizacoes(id) {
      try {
        const classificado = this.classificados.find(item => item.id === id);
        if (classificado) {
          const visualizacoes = (classificado.visualizacoes || 0) + 1;
          
          const { error } = await supabase
            .from('classificados')
            .update({ visualizacoes })
            .eq('id', id);

          if (error) throw error;
          
          classificado.visualizacoes = visualizacoes;
        }
      } catch (error) {
        console.error('Erro ao incrementar visualizações:', error);
      }
    },

    // NOVO: Método específico para carregar classificados da home
    async fetchClassificadosHome() {
      this.loading = true;
      try {
        // Primeiro tenta buscar do Supabase
        const { data, error } = await supabase
          .from('classificados')
          .select('*')
          .eq('status', 'aprovado')
          .eq('ativo', true)
          .gte('validade', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        
        // Se não há dados, usa mock
        if (!data || data.length === 0) {
          console.log('🏠 Usando classificados mockados para home');
          this.classificados = this.getMockClassificados();
        } else {
          this.classificados = data;
        }
        
        return this.classificados;
      } catch (error) {
        console.log('🏠 Erro ao buscar classificados para home, usando mock:', error.message);
        this.classificados = this.getMockClassificados();
        return this.classificados;
      } finally {
        this.loading = false;
      }
    }
  }
});