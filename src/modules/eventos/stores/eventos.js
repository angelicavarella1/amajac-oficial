// src/stores/eventos.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client'

export const useEventosStore = defineStore('eventos', () => {
    // --- STATE ---
    const todos = ref([])
    const eventoSelecionado = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const cacheTimestamp = ref(null)
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

    // --- GETTERS ---
    const getEventoDate = (evento) => {
        const dateString = evento.data_hora_evento; 
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };

    const eventosFuturos = computed(() => {
        if (!Array.isArray(todos.value)) return [];
        const agora = new Date()
        return todos.value.filter(evento => {
            const dataEvento = getEventoDate(evento);
            return dataEvento && evento.ativo && dataEvento >= agora;
        }).sort((a, b) => getEventoDate(a).getTime() - getEventoDate(b).getTime());
    })

    const eventosPassados = computed(() => {
        if (!Array.isArray(todos.value)) return [];
        const agora = new Date()
        const passados = todos.value.filter(evento => {
            const dataEvento = getEventoDate(evento);
            if (!dataEvento) return evento.ativo === false; 
            return dataEvento < agora || evento.ativo === false;
        });
        return passados.sort((a, b) => {
            const dateA = getEventoDate(a);
            const dateB = getEventoDate(b);
            if (!dateA || !dateB) return 0;
            return dateB.getTime() - dateA.getTime();
        });
    })

    const eventosAtivos = computed(() => {
        return Array.isArray(todos.value) ? todos.value.filter(evento => evento.ativo) : []
    })

    const eventosDestaque = computed(() => {
        return Array.isArray(todos.value) ? 
            todos.value.filter(evento => evento.destaque && evento.ativo && eventosFuturos.value.includes(evento)) : []
    })

    // CORRIGIDO: Removido o alias featured:destaque para evitar confusão no CRUD.
    const selectFields = 'id, titulo, descricao, data_evento, horario, local, imagem_url, imagem_alt, data_hora_evento, ativo, destaque, created_at, updated_at';

    // --- ACTIONS ---

    // ------------------------------------
    // Lógica de Carregamento
    // ------------------------------------
    const carregarEventos = async (forceRefresh = false) => {
        if (!forceRefresh && cacheTimestamp.value && (Date.now() - cacheTimestamp.value < CACHE_DURATION)) {
            console.log('📅 Eventos em cache, não recarregando.')
            return
        }

        loading.value = true
        error.value = null

        try {
            console.log('📅 Carregando eventos do banco...')

            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .select(selectFields)
                .order('data_hora_evento', { ascending: true }) 

            if (supabaseError) {
                console.error('❌ Erro do Supabase ao carregar eventos:', supabaseError);
                throw new Error(`Erro ao carregar eventos: ${supabaseError.message}`)
            }

            todos.value = Array.isArray(data) ? data : []
            cacheTimestamp.value = Date.now()
            console.log(`✅ ${todos.value.length} eventos carregados com sucesso`)
        } catch (err) {
            console.error('❌ Erro ao carregar eventos:', err)
            error.value = err.message
            todos.value = []
            throw err
        } finally {
            loading.value = false
        }
    }

    const carregarEventoPorId = async (id) => {
        loading.value = true
        error.value = null

        try {
            console.log(`📅 Carregando evento ID: ${id}`)

            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .select(selectFields)
                .eq('id', id)
                .single()

            if (supabaseError) {
                console.error('❌ Erro do Supabase:', supabaseError)
                if (supabaseError.code === 'PGRST116') {
                    throw new Error('Evento não encontrado')
                }
                throw new Error(`Erro ao carregar evento: ${supabaseError.message}`)
            }

            eventoSelecionado.value = data
            console.log('✅ Evento carregado:', data)
            return data

        } catch (err) {
            console.error('❌ Erro ao carregar evento:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const fetchEventoById = async (id) => {
        return await carregarEventoPorId(id)
    }

    // ------------------------------------
    // Lógica de Criação
    // ------------------------------------
    const criarEvento = async (dadosEvento) => {
        loading.value = true
        error.value = null

        try {
            console.log('📝 Criando novo evento...', dadosEvento)
            // ... (suas validações existentes) ...
            
            const dataEventoJS = new Date(dadosEvento.data_hora_evento)
            if (isNaN(dataEventoJS.getTime())) {
                throw new Error('Data e hora do evento são inválidas')
            }

            const dataApenasISO = dataEventoJS.toISOString().split('T')[0];
            const horaApenasISO = dataEventoJS.toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
            }); 

            const dadosParaInserir = {
                titulo: dadosEvento.titulo.trim(),
                descricao: dadosEvento.descricao?.trim() || null,
                data_evento: dadosEvento.data_evento || dataApenasISO, 
                horario: dadosEvento.horario || horaApenasISO, 
                data_hora_evento: dadosEvento.data_hora_evento,
                local: dadosEvento.local?.trim() || null,
                imagem_url: dadosEvento.imagem_url || null,
                imagem_alt: dadosEvento.imagem_alt || null,
                ativo: dadosEvento.ativo !== undefined ? dadosEvento.ativo : true,
                destaque: dadosEvento.destaque !== undefined ? dadosEvento.destaque : false
            }

            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .insert([dadosParaInserir])
                .select(selectFields)

            if (supabaseError) {
                console.error('❌ Erro na criação:', supabaseError)
                throw new Error(`Erro ao criar evento: ${supabaseError.message}`)
            }

            const novoEvento = data[0]
            todos.value = [novoEvento, ...todos.value]
            cacheTimestamp.value = null
            console.log('✅ Evento criado:', novoEvento)
            return novoEvento

        } catch (err) {
            console.error('❌ Erro ao criar evento:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // ------------------------------------
    // Lógica de Atualização
    // ------------------------------------
    const atualizarEvento = async (id, dadosAtualizados) => {
        loading.value = true
        error.value = null

        try {
            console.log('✏️ Atualizando evento ID:', id)

            const dataEventoJS = dadosAtualizados.data_hora_evento ? new Date(dadosAtualizados.data_hora_evento) : null
            // ... (suas validações existentes) ...

            let dadosParaAtualizar = { ...dadosAtualizados }
            
            if (dataEventoJS) {
                const dataApenasISO = dataEventoJS.toISOString().split('T')[0];
                const horaApenasISO = dataEventoJS.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit', 
                    hour12: false 
                });
                dadosParaAtualizar = {
                    ...dadosParaAtualizar,
                    data_evento: dataApenasISO,
                    horario: horaApenasISO
                }
            }
            
            // Garante que o campo destaque seja passado se existir nos dados
            if (dadosAtualizados.destaque !== undefined) {
                dadosParaAtualizar.destaque = dadosAtualizados.destaque;
            }

            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .update(dadosParaAtualizar)
                .eq('id', id)
                .select(selectFields)

            if (supabaseError) {
                console.error('❌ Erro na atualização:', supabaseError)
                throw new Error(`Erro ao atualizar evento: ${supabaseError.message}`)
            }

            const eventoAtualizado = data[0]
            const index = todos.value.findIndex(e => e.id === id)
            if (index !== -1) {
                todos.value[index] = eventoAtualizado
            }
            if (eventoSelecionado.value && eventoSelecionado.value.id === id) {
                eventoSelecionado.value = eventoAtualizado
            }
            cacheTimestamp.value = null
            console.log('✅ Evento atualizado:', eventoAtualizado)
            return eventoAtualizado

        } catch (err) {
            console.error('❌ Erro ao atualizar evento:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // ------------------------------------
    // Lógica de Exclusão
    // ------------------------------------
    const excluirEvento = async (id) => {
        loading.value = true
        error.value = null

        try {
            console.log(`🗑️ Excluindo evento ID: ${id}`)

            const { error: supabaseError } = await supabase
                .from('eventos')
                .delete()
                .eq('id', id)

            if (supabaseError) {
                console.error('❌ Erro na exclusão:', supabaseError)
                throw new Error(`Erro ao excluir evento: ${supabaseError.message}`)
            }

            todos.value = todos.value.filter(evento => evento.id !== id)
            if (eventoSelecionado.value && eventoSelecionado.value.id === id) {
                eventoSelecionado.value = null
            }
            cacheTimestamp.value = null
            console.log('✅ Evento excluído com sucesso')
            return { success: true }

        } catch (err) {
            console.error('❌ Erro ao excluir evento:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // ------------------------------------
    // Lógica de Toggle (Status e Destaque)
    // ------------------------------------
    const toggleDestaque = async (id) => {
        loading.value = true
        error.value = null

        try {
            const evento = todos.value.find(e => e.id === id)
            if (!evento) throw new Error('Evento não encontrado')

            // Usamos a chave do banco (destaque) para toggle
            const novoDestaque = !evento.destaque 

            console.log(`⭐ Alternando destaque do evento ID ${id} para: ${novoDestaque}`)

            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .update({ destaque: novoDestaque }) 
                .eq('id', id)
                .select(selectFields)

            if (supabaseError) throw new Error(`Erro ao atualizar destaque: ${supabaseError.message}`)

            const eventoAtualizado = data[0]
            const index = todos.value.findIndex(e => e.id === id)
            if (index !== -1) {
                todos.value[index] = eventoAtualizado
            }
            cacheTimestamp.value = null
            console.log('✅ Destaque alterado com sucesso:', eventoAtualizado.destaque)
            return eventoAtualizado

        } catch (err) {
            console.error('❌ Erro ao alternar destaque:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const toggleAtivo = async (id) => {
        loading.value = true
        error.value = null

        try {
            const evento = todos.value.find(e => e.id === id)
            if (!evento) throw new Error('Evento não encontrado')

            const novoAtivo = !evento.ativo

            console.log(`🔄 Alternando status do evento ID ${id} para: ${novoAtivo}`)

            const { data, error: supabaseError } = await supabase
                .from('eventos')
                .update({ ativo: novoAtivo }) 
                .eq('id', id)
                .select(selectFields)

            if (supabaseError) throw new Error(`Erro ao atualizar status: ${supabaseError.message}`)

            const eventoAtualizado = data[0]
            const index = todos.value.findIndex(e => e.id === id)
            if (index !== -1) {
                todos.value[index] = eventoAtualizado
            }
            cacheTimestamp.value = null
            console.log('✅ Status alterado com sucesso:', eventoAtualizado.ativo)
            return eventoAtualizado

        } catch (err) {
            console.error('❌ Erro ao alternar status:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }


    // --- RETURN ---
    return {
        todos,
        eventoSelecionado,
        loading,
        error,
        eventosFuturos,
        eventosPassados,
        eventosAtivos,
        eventosDestaque,
        carregarEventos,
        carregarEventoPorId,
        fetchEventoById,
        criarEvento,
        atualizarEvento,
        excluirEvento,
        toggleDestaque,
        toggleAtivo,
        limparCache: () => { cacheTimestamp.value = null },
        limparErro: () => { error.value = null }
    }
})