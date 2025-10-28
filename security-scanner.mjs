import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SecurityScanner {
  constructor() {
    this.issues = [];
  }

  scanForSuspiciousPatterns(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const patterns = {
        // CRÍTICO: Segredos expostos
        apiKeys: /(api[_-]?key|secret[_-]?key)\s*[:=]\s*['"][^'"]{10,}['"]/gi,
        supabaseKeys: /(supabase\.co|supabase\.in).*['"][a-zA-Z0-9_-]{20,}['"]/g,
        passwords: /(password|senha)\s*[:=]\s*['"][^'"]+['"]/gi,
        tokens: /(token|access[_-]token)\s*[:=]\s*['"][^'"]+['"]/gi,
        
        // ALTO: Vulnerabilidades de segurança
        evalUsage: /eval\s*\(/g,
        sqlInjection: /(SELECT|INSERT|UPDATE|DELETE).*\$\{/g,
        xssPatterns: /\.innerHTML\s*=|\.outerHTML\s*=|document\.write/g,
        
        // MÉDIO: Más práticas
        innerHTML: /innerHTML\s*=/g,
        outerHTML: /outerHTML\s*=/g, 
        documentWrite: /document\.write/g,
        insecureRegex: /new RegExp\s*\([^)]*\)/g,
        debuggerStatements: /debugger/g,
        
        // BAIXO: Logs e alerts
        consoleLog: /console\.log/g,
        alertUsage: /alert\s*\(/g
      };

      Object.entries(patterns).forEach(([patternName, regex]) => {
        const matches = content.match(regex);
        if (matches) {
          this.issues.push({
            file: filePath,
            issue: patternName,
            matches: matches.length,
            severity: this.getSeverity(patternName),
            lines: this.getLineNumbers(content, regex),
            sample: matches.slice(0, 2)
          });
        }
      });
    } catch (error) {
      // Ignorar arquivos que não podem ser lidos
    }
  }

  getSeverity(issueType) {
    const severityMap = {
      apiKeys: 'CRITICAL',
      supabaseKeys: 'CRITICAL', 
      passwords: 'CRITICAL',
      tokens: 'CRITICAL',
      evalUsage: 'HIGH',
      sqlInjection: 'HIGH',
      xssPatterns: 'HIGH',
      innerHTML: 'MEDIUM',
      outerHTML: 'MEDIUM',
      documentWrite: 'MEDIUM', 
      insecureRegex: 'MEDIUM',
      debuggerStatements: 'MEDIUM',
      consoleLog: 'LOW',
      alertUsage: 'LOW'
    };
    return severityMap[issueType] || 'LOW';
  }

  getLineNumbers(content, regex) {
    const lines = content.split('\n');
    const lineNumbers = [];
    regex.lastIndex = 0;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      let lineNum = 1;
      let charCount = 0;
      for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1;
        if (charCount >= match.index) {
          lineNum = i + 1;
          break;
        }
      }
      lineNumbers.push(lineNum);
    }
    
    return lineNumbers.slice(0, 3);
  }

  scanDirectory(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        
        // Ignorar diretórios não relevantes
        if (file.includes('node_modules') || file.includes('dist') || file.includes('.git') || file.includes('.vscode')) {
          return;
        }
        
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          this.scanDirectory(fullPath);
        } else if (stat.isFile() && this.isScanableFile(file)) {
          this.scanForSuspiciousPatterns(fullPath);
        }
      });
    } catch (error) {
      // Ignorar diretórios inacessíveis
    }
  }

  isScanableFile(filename) {
    return /\.(js|vue|ts|json|env|config|txt)$/i.test(filename);
  }

  generateReport() {
    console.log('\n RELATÓRIO DE SEGURANÇA - PROJETO AMAJAC\n');
    console.log('='.repeat(60));
    
    // Estatísticas
    const total = this.issues.length;
    const critical = this.issues.filter(i => i.severity === 'CRITICAL').length;
    const high = this.issues.filter(i => i.severity === 'HIGH').length;
    const medium = this.issues.filter(i => i.severity === 'MEDIUM').length;
    const low = this.issues.filter(i => i.severity === 'LOW').length;

    console.log(' TOTAL DE PROBLEMAS: ' + total);
    console.log('\n DISTRIBUIÇÃO POR SEVERIDADE:');
    console.log('    CRÍTICOS: ' + critical + ' - AÇÃO IMEDIATA REQUERIDA!');
    console.log('    ALTOS: ' + high + ' - Prioridade máxima');
    console.log('    MÉDIOS: ' + medium);
    console.log('    BAIXOS: ' + low);

    // Agrupar por arquivo
    const byFile = {};
    this.issues.forEach(issue => {
      if (!byFile[issue.file]) byFile[issue.file] = [];
      byFile[issue.file].push(issue);
    });

    // Mostrar apenas problemas CRÍTICOS e HIGH primeiro
    console.log('\n PROBLEMAS CRÍTICOS E DE ALTA PRIORIDADE:');
    let hasCriticalOrHigh = false;
    
    Object.entries(byFile).forEach(([file, issues]) => {
      const criticalHighIssues = issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');
      if (criticalHighIssues.length > 0) {
        hasCriticalOrHigh = true;
        console.log('\n 📄 ' + file);
        criticalHighIssues.forEach(issue => {
          const icon = issue.severity === 'CRITICAL' ? '🔴' : '🟡';
          console.log('   ' + icon + ' [' + issue.severity + '] ' + issue.issue);
          console.log('      Ocorrências: ' + issue.matches + ' | Linhas: ' + issue.lines.join(', '));
          if (issue.sample && issue.sample.length > 0) {
            console.log('      Exemplo: ' + issue.sample[0].substring(0, 50) + '...');
          }
        });
      }
    });

    if (!hasCriticalOrHigh) {
      console.log('    Nenhum problema crítico ou de alta prioridade encontrado!');
    }

    // Problemas médios e baixos (resumido)
    const mediumLowIssues = this.issues.filter(i => i.severity === 'MEDIUM' || i.severity === 'LOW');
    if (mediumLowIssues.length > 0) {
      console.log('\n PROBLEMAS MÉDIOS E BAIXOS (Resumido):');
      const byType = {};
      mediumLowIssues.forEach(issue => {
        byType[issue.issue] = (byType[issue.issue] || 0) + issue.matches;
      });
      
      Object.entries(byType).forEach(([issueType, count]) => {
        console.log('   ' + issueType + ': ' + count + ' ocorrências');
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log(' Relatório completo salvo em: security-report.json');

    return this.issues;
  }
}

// Executar scanner
console.log(' Iniciando varredura de segurança no projeto AMAJAC...');
console.log(' Escaneando: src/, public/, e arquivos de configuração...');

const scanner = new SecurityScanner();
scanner.scanDirectory('./src');
scanner.scanDirectory('./public');
scanner.scanDirectory('.');

const report = scanner.generateReport();

// Salvar relatório completo
fs.writeFileSync('security-report.json', JSON.stringify(report, null, 2));

// Verificar se há problemas críticos
const criticalIssues = report.filter(issue => issue.severity === 'CRITICAL');
if (criticalIssues.length > 0) {
  console.log('\n ATENÇÃO: PROBLEMAS CRÍTICOS ENCONTRADOS! ');
  console.log('   Ação imediata necessária para proteger o projeto!');
  process.exit(1);
} else {
  console.log('\n Nenhum problema crítico encontrado!');
  console.log(' O projeto está em bom estado de segurança!');
}