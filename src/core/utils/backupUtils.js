// src/admin/utils/backupUtils.js
export const gerarBackupJSON = (dados) => {
  const backup = {
    metadata: {
      data: new Date().toISOString(),
      versao: '1.0',
      totalTabelas: Object.keys(dados).length
    },
    dados
  }
  
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json'
  })
  
  return blob
}

export const downloadBackup = (blob, nomeArquivo) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}