// src/core/utils/fix-component-imports.js
export function getCorrectImports() {
  return {
    // Stores
    '@/stores/ui': '@/shared/stores/ui',
    '@/stores/galeria': '@/modules/galeria/stores/galeria',
    '@/stores/eventos': '@/modules/eventos/stores/eventos', 
    '@/stores/noticias': '@/modules/noticias/stores/noticias',
    '@/stores/classificados': '@/modules/classificados/stores/classificados',
    '@/stores/colaboradores': '@/modules/colaboradores/stores/colaboradores',
    '@/stores/auth': '@/modules/auth/stores/auth',
    
    // Composables
    '@/composables/useOpenMeteoWeather': '@/shared/composables/useOpenMeteoWeather',
    '@/composables/': '@/shared/composables/',
    
    // Components
    '@/components/': '@/shared/components/'
  }
}

export function suggestFix(componentName, currentImport) {
  const corrections = getCorrectImports()
  return corrections[currentImport] || null
}