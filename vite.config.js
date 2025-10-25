import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  // 🔧 CONFIGURAÇÕES DE BUILD OTIMIZADAS
  build: {
    // Aumentar limite de warning de tamanho
    chunkSizeWarningLimit: 1500,
    // Otimizações de performance - CORRIGIDO: target atualizado
    minify: 'esbuild',
    target: 'es2018' // ✅ CORREÇÃO: Alterado de 'es2015' para 'es2018'
  },
  // 📦 CONFIGURAÇÕES DE SERVER PARA DESENVOLVIMENTO
  server: {
    port: 5173,
    host: true,
    // Hot reload mais rápido
    hmr: {
      overlay: true
    }
  },
  // 🎯 CONFIGURAÇÕES DE PREVIEW (TESTE DE BUILD)
  preview: {
    port: 4173,
    host: true
  },
  // 🔍 OTIMIZAÇÕES ESPECÍFICAS
  optimizeDeps: {
    include: [
      'vue',
      'vue-router', 
      'pinia',
      '@supabase/supabase-js',
      'date-fns',
      'exceljs', // ✅ ADICIONADO: Para otimizar o exceljs
      'file-saver' // ✅ ADICIONADO: Para otimizar o file-saver
    ],
    // Forçar pré-empacotamento de dependências comuns
    exclude: ['@supabase/realtime-js']
  },
  // 📱 CONFIGURAÇÕES PARA PWA (OPCIONAL)
  define: {
    // Garantir compatibilidade com process.env
    'process.env': {}
  }
})