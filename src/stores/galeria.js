import { supabase } from '@/supabase';
import { defineStore } from 'pinia';

export const useGaleriaStore = defineStore('galeria', {
  state: () => ({
    imagens: [],
    imagemSelecionada: null,
    loading: false,
    error: null,
    paginaAtual: 1,
    porPagina: 20,
    totalImagens: 0,
    cacheCategorias: new Map()
  }),

  getters: {
    categorias: (state) => {
      return [...new Set(state.imagens.map(img => img.categoria))];
    },
    
    imagensPorCategoria: (state) => (categoria) => {
      if (!categoria) return state.imagens;
      
      // Verifica se já tem no cache
      if (state.cacheCategorias.has(categoria)) {
        return state.cacheCategorias.get(categoria);
      }
      
      const resultado = state.imagens.filter(item => item.categoria === categoria);
      state.cacheCategorias.set(categoria, resultado);
      return resultado;
    },
    
    imagensRecentes: (state) => {
      return state.imagens
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 12);
    },
    
    totalPaginas: (state) => {
      return Math.ceil(state.totalImagens / state.porPagina);
    },
    
    imagensPaginadas: (state) => {
      const inicio = (state.paginaAtual - 1) * state.porPagina;
      const fim = inicio + state.porPagina;
      return state.imagens.slice(inicio, fim);
    }
  },

  actions: {
    async fetchImagens() {
      this.loading = true;
      this.error = null;
      this.cacheCategorias.clear();
      
      try {
        console.log('🔄 Buscando imagens da galeria do Supabase...');
        
        const { data, error } = await supabase
          .from('galeria')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Erro ao buscar imagens da galeria:', error);
          throw error;
        }
        
        console.log(`✅ ${data?.length || 0} imagens carregadas da galeria`);
        this.imagens = data || [];
        this.totalImagens = data?.length || 0;
        return data;
      } catch (error) {
        console.error('❌ Erro ao buscar imagens da galeria:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchImagensPaginada(pagina = 1) {
      this.loading = true;
      this.error = null;
      this.cacheCategorias.clear();
      
      try {
        const inicio = (pagina - 1) * this.porPagina;
        const fim = inicio + this.porPagina - 1;

        const { data, error, count } = await supabase
          .from('galeria')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(inicio, fim);

        if (error) throw error;
        
        this.imagens = data || [];
        this.totalImagens = count || 0;
        this.paginaAtual = pagina;
        
        return data;
      } catch (error) {
        this.error = error.message;
        console.error('❌ Erro ao buscar imagens paginadas:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchImagemById(id) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('galeria')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        this.imagemSelecionada = data;
        return data;
      } catch (error) {
        this.error = error.message;
        console.error('❌ Erro ao buscar imagem:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async buscarImagens(termo, filtros = {}) {
      this.loading = true;
      try {
        let query = supabase
          .from('galeria')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });

        // Busca por texto
        if (termo) {
          query = query.or(`titulo.ilike.%${termo}%,descricao.ilike.%${termo}%`);
        }

        // Filtros adicionais
        if (filtros.categoria) {
          query = query.eq('categoria', filtros.categoria);
        }

        if (filtros.dataInicio && filtros.dataFim) {
          query = query.gte('created_at', filtros.dataInicio)
                      .lte('created_at', filtros.dataFim);
        }

        const { data, error, count } = await query;

        if (error) throw error;
        
        this.imagens = data || [];
        this.totalImagens = count || 0;
        this.cacheCategorias.clear();
        
        return data;
      } catch (error) {
        this.error = error.message;
        console.error('❌ Erro na busca de imagens:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadImagem(imagemData) {
      try {
        const { data, error } = await supabase
          .from('galeria')
          .insert([{
            ...imagemData,
            visualizacoes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        
        this.imagens.unshift(data);
        this.totalImagens += 1;
        this.cacheCategorias.clear();
        
        return data;
      } catch (error) {
        console.error('❌ Erro ao fazer upload da imagem:', error);
        throw error;
      }
    },

    async atualizarImagem(id, imagemData) {
      try {
        const dadosAtualizados = {
          ...imagemData,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('galeria')
          .update(dadosAtualizados)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        
        const index = this.imagens.findIndex(item => item.id === id);
        if (index !== -1) {
          this.imagens.splice(index, 1, data);
        }
        
        this.cacheCategorias.clear();
        
        return data;
      } catch (error) {
        console.error('❌ Erro ao atualizar imagem:', error);
        throw error;
      }
    },

    async deletarImagem(id) {
      try {
        // Encontrar a imagem para deletar também do storage se necessário
        const imagem = this.imagens.find(item => item.id === id);
        
        const { error } = await supabase
          .from('galeria')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        // Deletar também do storage se existir URL
        if (imagem && imagem.imagem_url) {
          try {
            const urlParts = imagem.imagem_url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const bucket = 'galeria';
            
            await supabase.storage
              .from(bucket)
              .remove([`galeria/${fileName}`]);
          } catch (storageErr) {
            console.error('⚠️ Erro ao deletar do storage:', storageErr);
          }
        }
        
        this.imagens = this.imagens.filter(item => item.id !== id);
        this.totalImagens = Math.max(0, this.totalImagens - 1);
        this.cacheCategorias.clear();
        
        return true;
      } catch (error) {
        console.error('❌ Erro ao deletar imagem:', error);
        throw error;
      }
    },

    async incrementarVisualizacoes(id) {
      try {
        const imagem = this.imagens.find(item => item.id === id);
        if (imagem) {
          const visualizacoes = (imagem.visualizacoes || 0) + 1;
          
          const { error } = await supabase
            .from('galeria')
            .update({ 
              visualizacoes,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (error) throw error;
          
          imagem.visualizacoes = visualizacoes;
        }
      } catch (error) {
        console.error('❌ Erro ao incrementar visualizações:', error);
      }
    },

    async getImagensPopulares(limite = 10) {
      try {
        const { data, error } = await supabase
          .from('galeria')
          .select('*')
          .order('visualizacoes', { ascending: false })
          .limit(limite);

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('❌ Erro ao buscar imagens populares:', error);
        throw error;
      }
    },

    clearCache() {
      this.cacheCategorias.clear();
    },

    clearError() {
      this.error = null;
    },

    setPagina(pagina) {
      this.paginaAtual = pagina;
    },

    setItensPorPagina(quantidade) {
      this.porPagina = quantidade;
      this.paginaAtual = 1; // Reset para primeira página
    },

    async refetchImagens() {
      this.clearCache();
      return await this.fetchImagens();
    }
  }
});