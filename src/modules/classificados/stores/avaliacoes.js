// src/stores/avaliacoes.js (ATUALIZADO)
import { defineStore } from 'pinia';
import { supabase } from '@/supabase/client';
import { useAuthStore } from './auth';

export const useAvaliacoesStore = defineStore('avaliacoes', {
    state: () => ({
        avaliacoesPorClassificado: {},
        loading: false,
        error: null,
    }),

    getters: {
        getAvaliacoes: (state) => (classificadoId) => {
            return state.avaliacoesPorClassificado[classificadoId] || [];
        },

        getMediaEstrelas: (state) => (classificadoId) => {
            const avaliacoes = state.avaliacoesPorClassificado[classificadoId];
            if (!avaliacoes || avaliacoes.length === 0) return 0;
            
            const soma = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
            const media = soma / avaliacoes.length;
            return Number(media.toFixed(1));
        },

        getTotalAvaliacoes: (state) => (classificadoId) => {
            return state.avaliacoesPorClassificado[classificadoId]?.length || 0;
        },

        hasUserEvaluated: (state) => (classificadoId) => {
            const authStore = useAuthStore();
            if (!authStore.isAuthenticated) return false;
            
            const avaliacoes = state.avaliacoesPorClassificado[classificadoId];
            return avaliacoes?.some(a => a.usuario_id === authStore.user.id);
        },
    },

    actions: {
        async fetchAvaliacoes(classificadoId) {
            this.loading = true;
            this.error = null;
            
            try {
                const { data, error } = await supabase
                    .from('avaliacoes_classificados')
                    .select(`
                        id,
                        nota,
                        comentario,
                        created_at,
                        usuario:usuario_id (
                            id,
                            name,
                            avatar_url
                        )
                    `)
                    .eq('classificado_id', classificadoId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                
                this.avaliacoesPorClassificado = {
                    ...this.avaliacoesPorClassificado,
                    [classificadoId]: data || [],
                };
            } catch (err) {
                console.error('Erro ao buscar avaliações:', err.message);
                this.error = 'Não foi possível carregar as avaliações.';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async insertAvaliacao(classificadoId, nota, comentario) {
            const authStore = useAuthStore();
            this.error = null;

            if (!authStore.isAuthenticated) {
                throw new Error('Você precisa estar logado para avaliar.');
            }

            if (this.hasUserEvaluated(classificadoId)) {
                throw new Error('Você já avaliou este serviço.');
            }

            if (nota < 1 || nota > 5) {
                throw new Error('A nota deve ser entre 1 e 5 estrelas.');
            }
            
            this.loading = true;
            try {
                const newAvaliacao = {
                    classificado_id: classificadoId,
                    usuario_id: authStore.user.id,
                    nota,
                    comentario: comentario?.trim() || null,
                };

                const { data, error } = await supabase
                    .from('avaliacoes_classificados')
                    .insert(newAvaliacao)
                    .select()
                    .single();

                if (error) throw error;

                // Atualiza o cache local
                if (this.avaliacoesPorClassificado[classificadoId]) {
                    this.avaliacoesPorClassificado[classificadoId].unshift({
                        ...data,
                        usuario: {
                            id: authStore.user.id,
                            name: authStore.user.name,
                            avatar_url: authStore.user.avatar_url
                        }
                    });
                }

                return true;

            } catch (err) {
                console.error('Erro ao inserir avaliação:', err.message);
                
                if (err.message.includes('duplicate key')) {
                    this.error = 'Você já avaliou este serviço.';
                } else if (err.message.includes('row-level security')) {
                    this.error = 'Você não tem permissão para realizar esta ação.';
                } else {
                    this.error = 'Erro ao salvar sua avaliação. Tente novamente.';
                }
                
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async deleteAvaliacao(avaliacaoId, classificadoId) {
            this.loading = true;
            this.error = null;
            
            try {
                const { error } = await supabase
                    .from('avaliacoes_classificados')
                    .delete()
                    .eq('id', avaliacaoId);

                if (error) throw error;

                // Remove do cache local
                if (this.avaliacoesPorClassificado[classificadoId]) {
                    this.avaliacoesPorClassificado[classificadoId] = 
                        this.avaliacoesPorClassificado[classificadoId].filter(a => a.id !== avaliacaoId);
                }

            } catch (err) {
                console.error('Erro ao deletar avaliação:', err.message);
                this.error = 'Erro ao excluir a avaliação. Tente novamente.';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // Adiciona ou atualiza uma avaliação existente (upsert)
        async upsertAvaliacao(classificadoId, nota, comentario) {
            const authStore = useAuthStore();
            this.error = null;

            if (!authStore.isAuthenticated) {
                throw new Error('Você precisa estar logado para avaliar.');
            }

            if (nota < 1 || nota > 5) {
                throw new Error('A nota deve ser entre 1 e 5 estrelas.');
            }

            this.loading = true;
            try {
                const avaliacaoExistente = this.avaliacoesPorClassificado[classificadoId]?.find(a => a.usuario_id === authStore.user.id);

                if (avaliacaoExistente) {
                    // Atualiza a avaliação existente
                    const { error } = await supabase
                        .from('avaliacoes_classificados')
                        .update({ nota, comentario: comentario?.trim() || null })
                        .eq('id', avaliacaoExistente.id);

                    if (error) throw error;

                    // Atualiza o cache local
                    const index = this.avaliacoesPorClassificado[classificadoId].findIndex(a => a.id === avaliacaoExistente.id);
                    if (index !== -1) {
                        this.avaliacoesPorClassificado[classificadoId][index] = {
                            ...this.avaliacoesPorClassificado[classificadoId][index],
                            nota,
                            comentario: comentario?.trim() || null
                        };
                    }
                } else {
                    // Insere uma nova avaliação
                    const newAvaliacao = {
                        classificado_id: classificadoId,
                        usuario_id: authStore.user.id,
                        nota,
                        comentario: comentario?.trim() || null,
                    };

                    const { data, error } = await supabase
                        .from('avaliacoes_classificados')
                        .insert(newAvaliacao)
                        .select()
                        .single();

                    if (error) throw error;

                    // Atualiza o cache local
                    if (this.avaliacoesPorClassificado[classificadoId]) {
                        this.avaliacoesPorClassificado[classificadoId].unshift({
                            ...data,
                            usuario: {
                                id: authStore.user.id,
                                name: authStore.user.name,
                                avatar_url: authStore.user.avatar_url
                            }
                        });
                    } else {
                        // Caso o array ainda não exista para esse classificado
                        this.avaliacoesPorClassificado[classificadoId] = [{
                            ...data,
                            usuario: {
                                id: authStore.user.id,
                                name: authStore.user.name,
                                avatar_url: authStore.user.avatar_url
                            }
                        }];
                    }
                }

                return true;

            } catch (err) {
                console.error('Erro ao salvar avaliação (upsert):', err.message);
                this.error = 'Erro ao salvar sua avaliação. Tente novamente.';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // Método para carregar todas as avaliações de um usuário
        async fetchAvaliacoesDoUsuario(usuarioId) {
            this.loading = true;
            this.error = null;

            try {
                const { data, error } = await supabase
                    .from('avaliacoes_classificados')
                    .select(`
                        id,
                        classificado_id,
                        nota,
                        comentario,
                        created_at,
                        classificado:tabela_classificados!classificado_id (
                            id,
                            titulo,
                            descricao,
                            imagem_url
                        )
                    `)
                    .eq('usuario_id', usuarioId)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                return data || [];

            } catch (err) {
                console.error('Erro ao buscar avaliações do usuário:', err.message);
                this.error = 'Não foi possível carregar suas avaliações.';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    },
});
