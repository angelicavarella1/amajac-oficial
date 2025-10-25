<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Solicitações de Sócios</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Gerencie as solicitações de novos sócios</p>
      </div>
      <div class="flex space-x-2">
        <div class="relative">
          <button 
            @click="openExportMenu = !openExportMenu"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center"
          >
            <i class="fas fa-download mr-2"></i>
            Exportar
            <i class="fas fa-chevron-down ml-2 text-xs"></i>
          </button>
          
          <div 
            v-show="openExportMenu"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div class="py-1">
              <button 
                @click="exportarCSV"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <i class="fas fa-file-csv text-green-600 mr-3"></i>
                Exportar como CSV
              </button>
              <button 
                @click="exportarExcel"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <i class="fas fa-file-excel text-green-600 mr-3"></i>
                Exportar como Excel
              </button>
              <button 
                @click="exportarPDF"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <i class="fas fa-file-pdf text-red-600 mr-3"></i>
                Exportar como PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resto do template permanece igual -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
            <i class="fas fa-clock text-blue-600 dark:text-blue-300"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.pendentes }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-3">
            <i class="fas fa-check text-green-600 dark:text-green-300"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Aprovadas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.aprovadas }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-red-100 dark:bg-red-900 mr-3">
            <i class="fas fa-times text-red-600 dark:text-red-300"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Rejeitadas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.rejeitadas }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
            <i class="fas fa-users text-gray-600 dark:text-gray-300"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estatisticas.total }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Resto do template permanece igual -->
    <!-- ... (filtros, tabela, paginação, modais) ... -->
  </div>

  <!-- Modais permanecem iguais -->
  <!-- ... -->
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'

// CONSTANTE ADICIONADA: Para simplificar o binding de classes de status
const STATUS_BASE_CLASSES = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

// Estados
const carregando = ref(false)
const solicitacaoSelecionada = ref(null)
const mostrarModalConfirmacao = ref(false)
const acaoPendente = ref(null)
const openExportMenu = ref(false)
const exportando = ref(false)

// Dados de exemplo (permanecem iguais)
const solicitacoes = ref([
  {
    id: 1,
    nome: 'João Silva Santos',
    cpf: '123.456.789-00',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    data_nascimento: '1985-05-15',
    profissao: 'Engenheiro de Software',
    empresa: 'Tech Solutions Ltda',
    observacoes: 'Interessado em participar dos eventos técnicos da associação.',
    status: 'pendente',
    data_solicitacao: new Date().toISOString()
  },
  {
    id: 2,
    nome: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    email: 'maria.oliveira@email.com',
    telefone: '(11) 88888-8888',
    data_nascimento: '1990-08-22',
    profissao: 'Arquiteta',
    empresa: 'Studio Arquitetura',
    observacoes: null,
    status: 'aprovado',
    data_solicitacao: new Date(Date.now() - 86400000).toISOString()
  }
])

// Filtros (permanecem iguais)
const filtros = reactive({
  busca: '',
  status: '',
  ordenacao: 'recente'
})

// Paginação (permanece igual)
const paginacao = reactive({
  paginaAtual: 1,
  itensPorPagina: 10,
  totalPaginas: computed(() => Math.ceil(solicitacoesFiltradas.value.length / paginacao.itensPorPagina)),
  paginasVisiveis: computed(() => {
    const total = paginacao.totalPaginas
    const atual = paginacao.paginaAtual
    const paginas = []
    
    for (let i = Math.max(1, atual - 2); i <= Math.min(total, atual + 2); i++) {
      paginas.push(i)
    }
    
    return paginas
  })
})

// Modal de confirmação (permanece igual)
const modalConfirmacao = reactive({
  titulo: '',
  mensagem: ''
})

// Estatísticas (permanece igual)
const estatisticas = computed(() => {
  const pendentes = solicitacoes.value.filter(s => s.status === 'pendente').length
  const aprovadas = solicitacoes.value.filter(s => s.status === 'aprovado').length
  const rejeitadas = solicitacoes.value.filter(s => s.status === 'rejeitado').length
  
  return {
    pendentes,
    aprovadas,
    rejeitadas,
    total: solicitacoes.value.length
  }
})

// Solicitações filtradas (permanece igual)
const solicitacoesFiltradas = computed(() => {
  let filtradas = solicitacoes.value.filter(solicitacao => {
    const correspondeBusca = 
      !filtros.busca ||
      solicitacao.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      solicitacao.email.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      solicitacao.cpf.includes(filtros.busca)
    
    const correspondeStatus = !filtros.status || solicitacao.status === filtros.status
    
    return correspondeBusca && correspondeStatus
  })
  
  if (filtros.ordenacao === 'recente') {
    filtradas.sort((a, b) => new Date(b.data_solicitacao) - new Date(a.data_solicitacao))
  } else {
    filtradas.sort((a, b) => new Date(a.data_solicitacao) - new Date(b.data_solicitacao))
  }
  
  const inicio = (paginacao.paginaAtual - 1) * paginacao.itensPorPagina
  const fim = inicio + paginacao.itensPorPagina
  
  return filtradas.slice(inicio, fim)
})

// MÉTODOS DE EXPORTAÇÃO - ATUALIZADOS
const exportarCSV = async () => {
  try {
    exportando.value = true
    openExportMenu.value = false

    const dados = solicitacoesFiltradas.value.map(solicitacao => ({
      'Nome': solicitacao.nome,
      'CPF': solicitacao.cpf,
      'Email': solicitacao.email,
      'Telefone': solicitacao.telefone,
      'Data Nascimento': formatarData(solicitacao.data_nascimento),
      'Profissão': solicitacao.profissao || 'Não informado',
      'Empresa': solicitacao.empresa || 'Não informado',
      'Status': formatarStatus(solicitacao.status),
      'Data Solicitação': formatarDataCompleta(solicitacao.data_solicitacao),
      'Observações': solicitacao.observacoes || 'Nenhuma'
    }))

    // Converter para CSV
    const headers = Object.keys(dados[0] || {})
    const csvRows = []
    
    // Adicionar cabeçalhos
    csvRows.push(headers.join(','))
    
    // Adicionar dados
    dados.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || ''
        // Escapar vírgulas e aspas
        const escaped = String(value).replace(/"/g, '""')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    })
    
    const csvOutput = csvRows.join('\n')
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' })
    
    // Usar file-saver para download
    saveAs(blob, `solicitacoes_socios_${new Date().toISOString().split('T')[0]}.csv`)
    
    mostrarNotificacao('CSV exportado com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao exportar CSV:', error)
    mostrarNotificacao('Erro ao exportar CSV', 'error')
  } finally {
    exportando.value = false
  }
}

const exportarExcel = async () => {
  try {
    exportando.value = true
    openExportMenu.value = false

    const dados = solicitacoesFiltradas.value.map(solicitacao => ({
      'Nome': solicitacao.nome,
      'CPF': solicitacao.cpf,
      'Email': solicitacao.email,
      'Telefone': solicitacao.telefone,
      'Data Nascimento': formatarData(solicitacao.data_nascimento),
      'Profissão': solicitacao.profissao || 'Não informado',
      'Empresa': solicitacao.empresa || 'Não informado',
      'Status': formatarStatus(solicitacao.status),
      'Data Solicitação': formatarDataCompleta(solicitacao.data_solicitacao),
      'Observações': solicitacao.observacoes || 'Nenhuma'
    }))

    // CÓDIGO NOVO USANDO EXCELJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Solicitações');

    // Adiciona cabeçalhos
    if (dados.length > 0) {
      const headers = Object.keys(dados[0])
      worksheet.addRow(headers);
      
      // Estilizar cabeçalhos
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' } // Lavender
      };
    }

    // Adiciona linhas de dados
    dados.forEach(row => {
      worksheet.addRow(Object.values(row));
    });

    // Ajustar largura das colunas automaticamente
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 50);
    });

    // Gera o buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Cria o blob e salva usando file-saver
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, `solicitacoes_socios_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    mostrarNotificacao('Excel exportado com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao exportar Excel:', error)
    mostrarNotificacao('Erro ao exportar Excel', 'error')
  } finally {
    exportando.value = false
  }
}

const exportarPDF = async () => {
  try {
    exportando.value = true
    openExportMenu.value = false

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    let yPosition = 20

    // Cabeçalho
    pdf.setFontSize(20)
    pdf.setTextColor(40, 40, 40)
    pdf.text('Solicitações de Sócios', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 5
    pdf.text(`Total de registros: ${solicitacoesFiltradas.value.length}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Cabeçalho da tabela
    const colunas = ['Nome', 'CPF', 'Email', 'Status']
    const larguras = [50, 40, 60, 30]
    let xPosition = 10

    pdf.setFillColor(240, 240, 240)
    pdf.rect(xPosition, yPosition, pageWidth - 20, 10, 'F')
    pdf.setFontSize(8)
    pdf.setTextColor(0, 0, 0)

    colunas.forEach((coluna, index) => {
      pdf.text(coluna, xPosition + 2, yPosition + 7)
      xPosition += larguras[index]
    })

    yPosition += 10

    // Dados
    pdf.setFontSize(7)
    solicitacoesFiltradas.value.forEach((solicitacao, index) => {
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }

      xPosition = 10
      const valores = [
        solicitacao.nome.substring(0, 30),
        solicitacao.cpf,
        solicitacao.email.substring(0, 35),
        formatarStatus(solicitacao.status)
      ]

      valores.forEach((valor, colIndex) => {
        pdf.text(valor, xPosition + 2, yPosition + 4)
        xPosition += larguras[colIndex]
      })

      yPosition += 8
    })

    // Usar file-saver para PDF também
    const pdfBlob = pdf.output('blob')
    saveAs(pdfBlob, `solicitacoes_socios_${new Date().toISOString().split('T')[0]}.pdf`)
    
    mostrarNotificacao('PDF exportado com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao exportar PDF:', error)
    mostrarNotificacao('Erro ao exportar PDF', 'error')
  } finally {
    exportando.value = false
  }
}

// Métodos auxiliares (permanecem iguais)
function formatarData(dataString) {
  if (!dataString) return 'Não informado'
  return new Date(dataString).toLocaleDateString('pt-BR')
}

function formatarDataCompleta(dataString) {
  if (!dataString) return 'Não informado'
  return new Date(dataString).toLocaleString('pt-BR')
}

function formatarStatus(status) {
  const statusMap = {
    'pendente': 'Pendente',
    'aprovado': 'Aprovado',
    'rejeitado': 'Rejeitado'
  }
  return statusMap[status] || status
}

function getClasseStatus(status) {
  const classes = {
    'pendente': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'aprovado': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'rejeitado': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

// Resto dos métodos permanecem iguais
function visualizarDetalhes(solicitacao) {
  solicitacaoSelecionada.value = solicitacao
}

function fecharModal() {
  solicitacaoSelecionada.value = null
}

function aprovarSolicitacao(solicitacao) {
  modalConfirmacao.titulo = 'Aprovar Solicitação'
  modalConfirmacao.mensagem = `Deseja aprovar a solicitação de ${solicitacao.nome}?`
  acaoPendente.value = { tipo: 'aprovar', solicitacao }
  mostrarModalConfirmacao.value = true
}

function rejeitarSolicitacao(solicitacao) {
  modalConfirmacao.titulo = 'Rejeitar Solicitação'
  modalConfirmacao.mensagem = `Deseja rejeitar a solicitação de ${solicitacao.nome}?`
  acaoPendente.value = { tipo: 'rejeitar', solicitacao }
  mostrarModalConfirmacao.value = true
}

function confirmarAcao() {
  if (acaoPendente.value) {
    const { tipo, solicitacao } = acaoPendente.value
    
    if (tipo === 'aprovar') {
      solicitacao.status = 'aprovado'
    } else if (tipo === 'rejeitar') {
      solicitacao.status = 'rejeitado'
    }
    
    console.log(`Solicitação ${tipo === 'aprovar' ? 'aprovada' : 'rejeitada'}:`, solicitacao)
  }
  
  mostrarModalConfirmacao.value = false
  acaoPendente.value = null
  
  if (solicitacaoSelecionada.value) {
    fecharModal()
  }
}

function cancelarAcao() {
  mostrarModalConfirmacao.value = false
  acaoPendente.value = null
}

function mostrarNotificacao(mensagem, tipo = 'info') {
  // Simulação de notificação
  alert(`${tipo === 'success' ? '✅' : '❌'} ${mensagem}`)
}

function paginaAnterior() {
  if (paginacao.paginaAtual > 1) {
    paginacao.paginaAtual--
  }
}

function paginaProxima() {
  if (paginacao.paginaAtual < paginacao.totalPaginas) {
    paginacao.paginaAtual++
  }
}

function irParaPagina(pagina) {
  paginacao.paginaAtual = pagina
}

const handleDocumentClick = (e) => {
  if (!e.target.closest('.relative')) {
    openExportMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  console.log('SolicitacoesSociosView carregada')
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>