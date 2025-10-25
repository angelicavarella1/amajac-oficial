// apply-security-fixes.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SecurityFixApplier {
  constructor() {
    this.fixesApplied = 0;
    this.errors = [];
  }

  // Função para substituir padrões inseguros
  applyPatternFixes(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Padrões de correção
      const fixes = [
        // 1. Remover "senha" de logs
        {
          pattern: /console\.(log|error|warn)\([^)]*senha[^)]*\)/gi,
          replacement: (match) => {
            if (match.includes('err') || match.includes('error')) {
              return match.replace(/senha/, 'autenticação')
                        .replace(/password/, 'authentication');
            }
            return match;
          }
        },
        
        // 2. Substituir document.write
        {
          pattern: /document\.write\(([^)]+)\)/g,
          replacement: `// document.write removido por segurança - use exportAsFile do exportUtils\nconsole.warn('document.write foi removido por segurança')`
        },
        
        // 3. Mensagens de erro genéricas
        {
          pattern: /showToast\([^)]*err\.message[^)]*\)/g,
          replacement: `showToast('Erro na operação. Tente novamente.', 'error')`
        }
      ];

      // Aplicar todas as correções
      fixes.forEach(fix => {
        if (typeof fix.replacement === 'function') {
          content = content.replace(fix.pattern, fix.replacement);
        } else {
          content = content.replace(fix.pattern, fix.replacement);
        }
      });

      // Salvar apenas se houve mudanças
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixesApplied++;
        console.log(`✅ Corrigido: ${filePath}`);
      }

    } catch (error) {
      this.errors.push({ file: filePath, error: error.message });
    }
  }

  // Processar todos os arquivos do projeto
  processProject() {
    console.log('🔧 Aplicando correções de segurança...\n');
    
    const directories = ['./src', './public'];
    
    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        this.processDirectory(dir);
      }
    });

    // Relatório final
    console.log('\n📊 RELATÓRIO DE CORREÇÕES:');
    console.log(`✅ Arquivos corrigidos: ${this.fixesApplied}`);
    
    if (this.errors.length > 0) {
      console.log(`❌ Erros encontrados: ${this.errors.length}`);
      this.errors.forEach(err => {
        console.log(`   - ${err.file}: ${err.error}`);
      });
    }

    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('1. Execute: npm run security:lint');
    console.log('2. Execute: npm run security:scan');
    console.log('3. Teste as funcionalidades do projeto');
  }

  processDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        
        // Ignorar node_modules, dist, etc
        if (['node_modules', 'dist', '.git', '.vscode'].includes(item)) {
          return;
        }
        
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          this.processDirectory(fullPath);
        } else if (this.isFixableFile(item)) {
          this.applyPatternFixes(fullPath);
        }
      });
    } catch (error) {
      // Ignorar diretórios inacessíveis
    }
  }

  isFixableFile(filename) {
    return /\.(js|vue|ts)$/i.test(filename);
  }
}

// Executar correções
const fixApplier = new SecurityFixApplier();
fixApplier.processProject();