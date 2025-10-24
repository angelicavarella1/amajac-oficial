// src/composables/useEventos.js
import { ref } from 'vue'
import { adminApi } from '@/supabase/admin' // Importação correta: adminApi

/**
 * Custom hook para gerenciar o estado e as operações CRUD de eventos.
 * Este composable é ideal para o painel de administração, onde as chamadas
 * de API (via adminApi) são necessárias.
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
            // Chamada à API para obter todos os eventos
            const dados = await adminApi.eventos.getAll()
            eventos.value = dados
            return dados 
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
            // 🔥 CORREÇÃO/MELHORIA: Tenta buscar o evento diretamente por ID.
            // Isso é mais eficiente do que carregar todos os eventos primeiro.
            const eventoEncontrado = await adminApi.eventos.getById(id) 
            
            if (!eventoEncontrado) {
                 throw new Error(`Evento com ID ${id} não encontrado.`)
            }

            evento.value = eventoEncontrado
            return eventoEncontrado
            
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
            const novoEvento = await adminApi.eventos.create(dados)
            // Adiciona ao cache local e limpa o cache de erro
            eventos.value.push(novoEvento)
            error.value = null 
            return { success: true, data: novoEvento }
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
            const eventoAtualizado = await adminApi.eventos.update(id, dados)
            // Atualiza o cache local
            const index = eventos.value.findIndex(e => e.id === id)
            if (index !== -1) {
                eventos.value[index] = eventoAtualizado
            }
            // Atualiza o evento selecionado, se for o que estamos editando
            if (evento.value && evento.value.id === id) {
                evento.value = eventoAtualizado
            }
            error.value = null
            return { success: true, data: eventoAtualizado }
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
            await adminApi.eventos.delete(id)
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