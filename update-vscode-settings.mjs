// update-vscode-settings.mjs
import fs from "fs";
import path from "path";

const vscodeSettingsPath = "./.vscode/settings.json";

function updateVSCodeSettings() {
  try {
    // Ler configurações existentes
    const existingContent = fs.readFileSync(vscodeSettingsPath, "utf8");
    const existingSettings = JSON.parse(existingContent);
    
    console.log(" Arquivo settings.json existente carregado");

    // Configurações de segurança para adicionar
    const securitySettings = {
      "eslint.validate": [
        "javascript",
        "javascriptreact", 
        "vue",
        "typescript",
        "typescriptreact"
      ],
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      },
      "eslint.workingDirectories": [
        "./"
      ],
      "files.associations": {
        "*.security.js": "javascript"
      }
    };

    // Mesclar configurações (sem sobrescrever as existentes)
    const updatedSettings = {
      ...existingSettings,
      ...securitySettings
    };

    // Salvar arquivo atualizado
    fs.writeFileSync(vscodeSettingsPath, JSON.stringify(updatedSettings, null, 2));
    console.log(" Configurações do VS Code atualizadas com sucesso!");
    console.log("\n Configurações de segurança adicionadas:");
    console.log("   - ESLint: validação automática para Vue/JS/TS");
    console.log("   - Auto-fix no save habilitado");
    console.log("   - Working directories configuradas");
    console.log("   - Associação de arquivos .security.js");
    
  } catch (error) {
    console.error(" Erro ao atualizar configurações:", error.message);
  }
}

updateVSCodeSettings();
