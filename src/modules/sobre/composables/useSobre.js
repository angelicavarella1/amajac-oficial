// src/modules/sobre/composables/useSobre.js
/**
 * Composable reativo para carregar informações institucionais ("Quem Somos").
 * - Consulta a tabela `configuracoes` no Supabase.
 * - Busca chaves: missao, visao, valores, historia, quem_somos_imagem_url.
 * - Fornece estados reativos: titulo, texto, loading, error.
 */

import { ref } from 'vue'
import { supabase } from '@/core/utils/supabaseClient.js'

export function useSobre() {
  const titulo = ref('Quem Somos')
  const texto = ref('')
  const imagemUrl = ref('')
  const loading = ref(false)
  const error = ref(null)

  /**
   * Carrega as configurações institucionais do Supabase.
   */
  const fetchSobre = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('configuracoes')
        .select('chave, valor')
        .in('chave', ['missao', 'visao', 'valores', 'historia', 'quem_somos_imagem_url'])

      if (supabaseError) {
        throw new Error(`Erro ao buscar configurações: ${supabaseError.message}`)
      }

      // Construir o conteúdo formatado
      let conteudoCompleto = ''

      if (data && data.length > 0) {
        const config = {}
        data.forEach(item => {
          config[item.chave] = item.valor
        })

        // Salvar a URL da imagem
        imagemUrl.value = config.quem_somos_imagem_url || ''

        // Formatar o conteúdo com layout que reserva espaço para imagem
        conteudoCompleto = `
          <div class="sobre-layout-com-imagem">
            <div class="conteudo-textual">
              ${config.historia ? `<div class="historia-section">
                <h3 class="subtitulo">Nossa História</h3>
                <p>${config.historia}</p>
              </div>` : ''}

              ${config.missao ? `<div class="missao-section">
                <h3 class="subtitulo">Missão</h3>
                <p>${config.missao}</p>
              </div>` : ''}

              ${config.visao ? `<div class="visao-section">
                <h3 class="subtitulo">Visão</h3>
                <p>${config.visao}</p>
              </div>` : ''}

              ${config.valores ? `<div class="valores-section">
                <h3 class="subtitulo">Valores</h3>
                <p>${config.valores}</p>
              </div>` : ''}
            </div>

            ${imagemUrl.value ? `
            <div class="espaco-imagem">
              <img src="${imagemUrl.value}" alt="Imagem institucional da AMAJAC" class="imagem-institucional">
            </div>
            ` : `
            <div class="espaco-imagem vazio">
              <div class="placeholder-imagem">
                <i class="mdi mdi-image-area"></i>
                <span>Espaço para imagem institucional</span>
              </div>
            </div>
            `}
          </div>
        `

        // Se não há nenhum conteúdo, mostrar mensagem padrão
        if (!conteudoCompleto.trim()) {
          texto.value = 'Informações institucionais não disponíveis.'
        } else {
          texto.value = conteudoCompleto
        }
      } else {
        texto.value = 'Informações institucionais não disponíveis.'
      }

    } catch (err) {
      console.error('[useSobre] Erro:', err)
      error.value = 'Não foi possível carregar as informações institucionais.'
      texto.value = 'Informações institucionais não disponíveis.'
    } finally {
      loading.value = false
    }
  }

  return {
    titulo,
    texto,
    imagemUrl,
    loading,
    error,
    fetchSobre
  }
}