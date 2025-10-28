// src/composables/useEventos.js - VERSAO CORRIGIDA
import { ref } from 'vue'
import { supabase } from '@/supabase/client.js' // Importar o cliente Supabase diretamente

/**
 * Custom hook para gerenciar o estado e as operações CRUD de eventos.
 * Este composable usa chamadas diretas ao Supabase Client.
 */
export function useEventos() {
    const eventos = ref([]) // Lista de eventos (cache local)
    const evento = ref(null) // Evento selecionado (detalhe)
    const loading = ref(false)
    const error = ref(null)

    // Ação: Carrega todos os eventos
    const fetchEventos = async () => {
        loading.value = true
        error.value = null

        try {
            // Chamada direta ao Supabase Client para obter todos os eventos
            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .select('*')
                .order('data_inicio', { ascending: true }) // ou data_hora_evento, como preferir

            if (supabaseError) throw supabaseError

            eventos.value = data || []
            return data
        } catch (err) {
            error.value = err.message
            console.error('❌ Erro ao carregar eventos:', err)
            throw new Error(`Falha ao carregar eventos: ${err.message}`)
        } finally {
            loading.value = false
        }
    }

    // Ação: Carrega um único evento por ID
    const carregarEvento = async (id) => {
        loading.value = true
        error.value = null

        try {
            // Chamada direta ao Supabase Client para obter um evento por ID
            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .select('*')
                .eq('id', id)
                .single() // Espera um único resultado

            if (supabaseError) throw supabaseError

            if (!data) {
                throw new Error(`Evento com ID ${id} não encontrado.`)
            }

            evento.value = data
            return data

        } catch (err) {
            error.value = err.message
            console.error('❌ Erro ao carregar evento:', err)
            throw err // Propaga o erro para o componente
        } finally {
            loading.value = false
        }
    }

    // Ação: Cria um novo evento
    const criarEvento = async (dados) => {
        loading.value = true
        error.value = null

        try {
            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .insert([dados])
                .select()
                .single()

            if (supabaseError) throw supabaseError

            // Adiciona ao cache local e limpa o cache de erro
            eventos.value.push(data)
            error.value = null
            return { success: true, data }
        } catch (err) {
            error.value = err.message
            console.error('❌ Erro ao criar evento:', err)
            // Garante que o erro do composable também seja atualizado
            throw err
        } finally {
            loading.value = false
        }
    }

    // Ação: Atualiza um evento existente
    const atualizarEvento = async (id, dados) => {
        loading.value = true
        error.value = null

        try {
            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .update(dados)
                .eq('id', id)
                .select()
                .single()

            if (supabaseError) throw supabaseError

            // Atualiza o cache local
            const index = eventos.value.findIndex(e => e.id === id)
            if (index !== -1) {
                eventos.value[index] = data
            }
            // Atualiza o evento selecionado, se for o que estamos editando
            if (evento.value && evento.value.id === id) {
                evento.value = data
            }
            error.value = null
            return { success: true, data }
        } catch (err) {
            error.value = err.message
            console.error('❌ Erro ao atualizar evento:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Ação: Exclui um evento
    const excluirEvento = async (id) => {
        loading.value = true
        error.value = null

        try {
            const { error: supabaseError } = await supabase
                .from('eventos')
                .delete()
                .eq('id', id)

            if (supabaseError) throw supabaseError

            // Remove do cache local
            eventos.value = eventos.value.filter(e => e.id !== id)
            // Limpa o evento selecionado, se for o que excluímos
            if (evento.value && evento.value.id === id) {
                evento.value = null
            }
            error.value = null
            return { success: true }
        } catch (err) {
            error.value = err.message
            console.error('❌ Erro ao excluir evento:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Função utilitária para limpar o estado de erro
    const limparErro = () => {
        error.value = null
    }

    return {
        // Estado
        eventos,
        evento,
        loading,
        error,

        // Ações
        fetchEventos,
        carregarEvento,
        criarEvento,
        atualizarEvento,
        excluirEvento,
        limparErro
    }
}
