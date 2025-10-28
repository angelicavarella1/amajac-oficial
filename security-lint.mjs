// security-lint.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SecurityLinter {
  constructor() {
    this.issues = [];
    this.rules = {
      critical: [
        {
          name: "PASSWORD_IN_LOG",
          pattern: /(senha|password).*[`'"]|console\.(log|error|warn).*senha/gi,
          message: "Nunca inclua 'senha' em mensagens de log ou erro",
          severity: "CRITICAL"
        },
        {
          name: "HARDCODED_SECRETS", 
          pattern: /(api[_-]?key|secret|token)\s*[=:].*['"][^'"]{8,}['"]/gi,
          message: "Credenciais hardcoded detectadas",
          severity: "CRITICAL"
        }
      ],
      high: [
        {
          name: "DOCUMENT_WRITE",
          pattern: /document\.write\(/g,
          message: "document.write() é vulnerável a XSS - use manipulação DOM segura",
          severity: "HIGH"
        },
        {
          name: "INNER_HTML_UNSAFE",
          pattern: /\.innerHTML\s*=\s*[^`]*(?:\$\{|\+)/g,
          message: "innerHTML com concatenação pode causar XSS",
          severity: "HIGH"
        },
        {
          name: "EVAL_USAGE",
          pattern: /eval\s*\(/g,
          message: "eval() é extremamente perigoso",
          severity: "HIGH"
        }
      ],
      medium: [
        {
          name: "CONSOLE_IN_PRODUCTION",
          pattern: /console\.(log|debug|info)/g,
          message: "Remover console.log antes do deploy em produção",
          severity: "MEDIUM"
        },
        {
          name: "ALERT_USAGE",
          pattern: /alert\s*\(/g,
          message: "Evite alert() - use toasts ou modais customizados",
          severity: "MEDIUM"
        }
      ]
    };
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");
      
      Object.keys(this.rules).forEach(severityLevel => {
        this.rules[severityLevel].forEach(rule => {
          const regex = new RegExp(rule.pattern);
          let match;
          
          while ((match = regex.exec(content)) !== null) {
            const lineNumber = this.getLineNumber(lines, match.index);
            this.issues.push({
              file: filePath,
              line: lineNumber,
              rule: rule.name,
              message: rule.message,
              severity: rule.severity,
              code: lines[lineNumber - 1]?.trim().substring(0, 100)
            });
          }
        });
      });
    } catch (error) {
      console.warn(`  Não foi possível ler: ${filePath}`);
    }
  }

  getLineNumber(lines, position) {
    let currentPos = 0;
    for (let i = 0; i < lines.length; i++) {
      currentPos += lines[i].length + 1;
      if (currentPos >= position) {
        return i + 1;
      }
    }
    return 1;
  }

  scanDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        
        // Ignorar node_modules, dist, etc
        if (["node_modules", "dist", ".git", ".vscode"].includes(item)) {
          continue;
        }
        
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          this.scanDirectory(fullPath);
        } else if (this.isScannableFile(item)) {
          this.scanFile(fullPath);
        }
      }
    } catch (error) {
      // Ignorar diretórios inacessíveis
    }
  }

  isScannableFile(filename) {
    return /\.(js|vue|ts|jsx|tsx)$/i.test(filename);
  }

  generateReport() {
    console.log("\n RELATÓRIO DO SECURITY LINTER");
    console.log("=".repeat(60));
    
    // Agrupar por severidade
    const bySeverity = {
      CRITICAL: this.issues.filter(i => i.severity === "CRITICAL"),
      HIGH: this.issues.filter(i => i.severity === "HIGH"),
      MEDIUM: this.issues.filter(i => i.severity === "MEDIUM")
    };

    // Estatísticas
    console.log(`\n ESTATÍSTICAS:`);
    console.log(`   CRÍTICOS: ${bySeverity.CRITICAL.length}`);
    console.log(`   ALTOS: ${bySeverity.HIGH.length}`);
    console.log(`   MÉDIOS: ${bySeverity.MEDIUM.length}`);
    console.log(`   TOTAL: ${this.issues.length}`);

    // Mostrar problemas críticos
    if (bySeverity.CRITICAL.length > 0) {
      console.log("\n PROBLEMAS CRÍTICOS:");
      bySeverity.CRITICAL.forEach(issue => {
        console.log(`\n    ${path.relative(process.cwd(), issue.file)}:${issue.line}`);
        console.log(`      ${issue.message}`);
        console.log(`       ${issue.code}...`);
      });
    }

    // Mostrar problemas altos
    if (bySeverity.HIGH.length > 0) {
      console.log("\n  PROBLEMAS DE ALTA PRIORIDADE:");
      bySeverity.HIGH.forEach(issue => {
        console.log(`\n    ${path.relative(process.cwd(), issue.file)}:${issue.line}`);
        console.log(`      ${issue.message}`);
        console.log(`       ${issue.code}...`);
      });
    }

    // Resumo de problemas médios
    if (bySeverity.MEDIUM.length > 0) {
      console.log(`\nℹ  PROBLEMAS MÉDIOS: ${bySeverity.MEDIUM.length} (executar 'npm run build' remove automaticamente)`);
    }

    // Recomendações
    console.log("\n RECOMENDAÇÕES:");
    if (bySeverity.CRITICAL.length > 0) {
      console.log("   1. Corrija os problemas CRÍTICOS imediatamente");
    }
    if (bySeverity.HIGH.length > 0) {
      console.log("   2. Elimine document.write() e eval()");
    }
    if (bySeverity.MEDIUM.length > 0) {
      console.log("   3. Execute build de produção para limpar console.log");
    }
    
    console.log("\n Use este linter no pre-commit para prevenir regressões");

    return this.issues;
  }
}

// Executar linter
console.log(" Iniciando análise de segurança...");
console.log(" Escaneando arquivos JavaScript e Vue...");

const linter = new SecurityLinter();
linter.scanDirectory("./src");
linter.scanDirectory("./public");

const report = linter.generateReport();

// Salvar relatório
fs.writeFileSync("security-lint-report.json", JSON.stringify(report, null, 2));

// Finalizar com código de erro se houver problemas críticos
const hasCritical = report.some(issue => issue.severity === "CRITICAL");
process.exit(hasCritical ? 1 : 0);
