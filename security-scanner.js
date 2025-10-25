const fs = require('fs');
const path = require('path');

class SecurityScanner {
  constructor() {
    this.issues = [];
  }

  scanForSuspiciousPatterns(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const patterns = {
        evalUsage: /eval\s*\(/g,
        innerHTML: /innerHTML\s*=/g,
        outerHTML: /outerHTML\s*=/g,
        documentWrite: /document\.write/g,
        insecureRegex: /new RegExp\s*\([^)]*\)/g,
        consoleLog: /console\.log/g,
        alertUsage: /alert\s*\(/g,
        debuggerStatements: /debugger/g,
        apiKeys: /(api[_-]?key|secret[_-]?key|password|token)\s*[:=]\s*['"][^'"]{10,}['"]/gi,
        supabaseKeys: /(supabase\.co|supabase\.in).*['"][a-zA-Z0-9_-]{20,}['"]/g,
        hardcodedCredentials: /(username|password|email)\s*[:=]\s*['"][^'"]+['"]/gi
      };

      Object.entries(patterns).forEach(([patternName, regex]) => {
        const matches = content.match(regex);
        if (matches) {
          this.issues.push({
            file: filePath,
            issue: patternName,
            matches: matches.length,
            severity: this.getSeverity(patternName),
            lines: this.getLineNumbers(content, regex)
          });
        }
      });
    } catch (error) {
      console.warn(`⚠️ Não foi possível ler o arquivo: ${filePath}`);
    }
  }

  getSeverity(issueType) {
    const severityMap = {
      evalUsage: 'HIGH',
      innerHTML: 'MEDIUM',
      outerHTML: 'MEDIUM',
      documentWrite: 'MEDIUM',
      insecureRegex: 'MEDIUM',
      consoleLog: 'LOW',
      alertUsage: 'LOW',
      debuggerStatements: 'MEDIUM',
      apiKeys: 'CRITICAL',
      supabaseKeys: 'CRITICAL',
      hardcodedCredentials: 'HIGH'
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
    
    return lineNumbers.slice(0, 3); // Retorna apenas as primeiras 3 ocorrências
  }

  scanDirectory(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        
        // Ignorar node_modules, dist e outros diretórios não relevantes
        if (file.includes('node_modules') || file.includes('dist') || file.includes('.git')) {
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
      console.warn(`⚠️ Não foi possível escanear diretório: ${dirPath}`);
    }
  }

  isScanableFile(filename) {
    return /\.(js|vue|ts|json|env)$/.test(filename);
  }

  generateReport() {
    console.log('\n🔒 RELATÓRIO DE SEGURANÇA - PROJETO AMAJAC\n');
    console.log(`📊 Total de problemas encontrados: ${this.issues.length}`);
    
    const bySeverity = this.issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📈 DISTRIBUIÇÃO POR SEVERIDADE:');
    Object.entries(bySeverity).forEach(([severity, count]) => {
      const icon = severity === 'CRITICAL' ? '🚨' : severity === 'HIGH' ? '❗' : '⚠️';
      console.log(`   ${icon} ${severity}: ${count}`);
    });

    // Agrupar por arquivo para melhor visualização
    const byFile = {};
    this.issues.forEach(issue => {
      if (!byFile[issue.file]) {
        byFile[issue.file] = [];
      }
      byFile[issue.file].push(issue);
    });

    console.log('\n🚨 PROBLEMAS ENCONTRADOS POR ARQUIVO:');
    Object.entries(byFile).forEach(([file, issues]) => {
      console.log(`\n📁 ${file}`);
      issues.forEach(issue => {
        const icon = issue.severity === 'CRITICAL' ? '🚨' : issue.severity === 'HIGH' ? '❗' : '⚠️';
        console.log(`   ${icon} [${issue.severity}] ${issue.issue}`);
        console.log(`      Ocorrências: ${issue.matches} | Linhas: ${issue.lines.join(', ')}`);
      });
    });

    // Estatísticas finais
    const criticalCount = this.issues.filter(i => i.severity === 'CRITICAL').length;
    const highCount = this.issues.filter(i => i.severity === 'HIGH').length;
    
    console.log('\n🎯 RESUMO EXECUTIVO:');
    console.log(`   🚨 CRÍTICOS: ${criticalCount} - Requer ação imediata!`);
    console.log(`   ❗ ALTOS: ${highCount} - Prioridade alta`);
    console.log(`   ⚠️  MÉDIOS: ${bySeverity['MEDIUM'] || 0}`);
    console.log(`   ℹ️  BAIXOS: ${bySeverity['LOW'] || 0}`);

    return this.issues;
  }
}

// Executar scanner
console.log('🔍 Iniciando varredura de segurança no projeto AMAJAC...');
const scanner = new SecurityScanner();

// Escanear diretórios importantes
scanner.scanDirectory('./src');
scanner.scanDirectory('./public');
scanner.scanDirectory('.'); // Para pegar arquivos .env na raiz

const report = scanner.generateReport();

// Salvar relatório detalhado
fs.writeFileSync('security-report.json', JSON.stringify(report, null, 2));
console.log('\n💾 Relatório detalhado salvo em: security-report.json');

// Verificar se há problemas críticos
const criticalIssues = report.filter(issue => issue.severity === 'CRITICAL');
if (criticalIssues.length > 0) {
  console.log('\n🚨🚨🚨 ATENÇÃO: PROBLEMAS CRÍTICOS ENCONTRADOS! 🚨🚨🚨');
  console.log('   Ação imediata necessária para proteger o projeto!');
  process.exit(1);
}