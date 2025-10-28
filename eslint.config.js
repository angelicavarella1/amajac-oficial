import vueEslintParser from 'vue-eslint-parser';

export default [
  // Configuração para arquivos Vue
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
    },
  },

  // Configuração para arquivos JavaScript/TypeScript
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
    },
  },

  // Ignorar arquivos
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.nuxt/**',
      'functions-serve/**',
    ],
  },
];