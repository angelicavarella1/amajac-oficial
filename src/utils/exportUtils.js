// src/utils/exportUtils.js
export const exportUtils = {
  // Exportar para Excel (CSV)
  exportToCSV(data, filename = 'relatorio') {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar')
      return
    }

    try {
      // Cabeçalhos
      const headers = Object.keys(data[0])
      const csvHeaders = headers.join(';')
      
      // Linhas de dados
      const csvRows = data.map(row => {
        return headers.map(header => {
          let value = row[header]
          
          // Tratar diferentes tipos de dados
          if (value === null || value === undefined) {
            return ''
          }
          
          if (typeof value === 'object') {
            value = JSON.stringify(value)
          }
          
          // Escapar caracteres especiais para CSV
          value = String(value).replace(/"/g, '""')
          return `"${value}"`
        }).join(';')
      })
      
      // Combinar cabeçalhos e dados
      const csvContent = [csvHeaders, ...csvRows].join('\n')
      
      // Criar e baixar arquivo
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}_${this.formatDate(new Date())}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('✅ CSV exportado com sucesso')
      
    } catch (error) {
      console.error('❌ Erro ao exportar CSV:', error)
      throw error
    }
  },

  // Exportar para Excel (XLSX) - usando SheetJS
  async exportToExcel(data, filename = 'relatorio', sheetName = 'Relatorio') {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar')
      return
    }

    try {
      // Verificar se SheetJS está disponível
      if (typeof XLSX === 'undefined') {
        console.warn('SheetJS não carregado, usando CSV como fallback')
        return this.exportToCSV(data, filename)
      }

      // Preparar dados para Excel
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
      
      // Gerar arquivo Excel
      XLSX.writeFile(workbook, `${filename}_${this.formatDate(new Date())}.xlsx`)
      
      console.log('✅ Excel exportado com sucesso')
      
    } catch (error) {
      console.error('❌ Erro ao exportar Excel:', error)
      // Fallback para CSV
      this.exportToCSV(data, filename)
    }
  },

  // Exportar para PDF
  async exportToPDF(data, filename = 'relatorio', title = 'Relatório') {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar')
      return
    }

    try {
      // Criar conteúdo HTML para PDF
      const htmlContent = this.generatePDFHTML(data, title)
      
      // Usar html2pdf.js se disponível
      if (typeof html2pdf === 'undefined') {
        console.warn('html2pdf não carregado, usando impressão do navegador')
        this.printHTML(htmlContent)
        return
      }

      // Configurações do PDF
      const options = {
        margin: 10,
        filename: `${filename}_${this.formatDate(new Date())}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      // Gerar PDF
      await html2pdf().set(options).from(htmlContent).save()
      
      console.log('✅ PDF exportado com sucesso')
      
    } catch (error) {
      console.error('❌ Erro ao exportar PDF:', error)
      this.printHTML(this.generatePDFHTML(data, title))
    }
  },

  // Gerar HTML para PDF
  generatePDFHTML(data, title) {
    const headers = Object.keys(data[0])
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .timestamp { color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div class="timestamp">Gerado em: ${new Date().toLocaleString('pt-BR')}</div>
        </div>
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${this.formatHeader(header)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(header => `
                  <td>${this.formatCellValue(row[header])}</td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 20px; font-size: 12px; color: #666;">
          Total de registros: ${data.length}
        </div>
      </body>
      </html>
    `
  },

  // Imprimir HTML (fallback)
  printHTML(htmlContent) {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  },

  // Utilitários
  formatDate(date) {
    return date.toISOString().split('T')[0].replace(/-/g, '')
  },

  formatHeader(header) {
    const headersMap = {
      'created_at': 'Data/Hora',
      'admin_id': 'ID Admin',
      'acao': 'Ação',
      'tabela_afetada': 'Tabela',
      'id_registro': 'ID Registro',
      'id_da_linha': 'ID Linha',
      'dados_antigos': 'Dados Antigos',
      'dados_novos': 'Dados Novos',
      'ip_address': 'Endereço IP',
      'user_agent': 'User Agent'
    }
    return headersMap[header] || header.replace(/_/g, ' ').toUpperCase()
  },

  formatCellValue(value) {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
    return String(value)
  }
}