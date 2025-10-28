<template>
  <div class="relative group">
    <button
      class="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 transition-colors bg-white dark:bg-gray-800"
      @click="isOpen = !isOpen"
      :aria-label="t('geral.alternar_idioma')"
    >
      <span class="text-lg">{{ currentLanguage.flag }}</span>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ currentLanguage.code.toUpperCase() }}
      </span>
      <i class="fas fa-chevron-down text-xs text-gray-500"></i>
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1"
      v-click-outside="closeDropdown"
    >
      <button
        v-for="lang in availableLocales"
        :key="lang.code"
        class="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        :class="{
          'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300': locale === lang.code
        }"
        @click="changeLanguage(lang.code)"
      >
        <span class="text-lg">{{ lang.flag }}</span>
        <span class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ lang.name }}
        </span>
        <i
          v-if="locale === lang.code"
          class="fas fa-check text-green-500 text-xs"
        ></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/shared/composables/useI18n'

const { t, locale, setLocale, availableLocales } = useI18n()
const isOpen = ref(false)

const currentLanguage = computed(() => 
  availableLocales.find(lang => lang.code === locale) || availableLocales[0]
)

const changeLanguage = (newLocale) => {
  setLocale(newLocale)
  isOpen.value = false
}

const closeDropdown = () => {
  isOpen.value = false
}

// Diretiva para fechar ao clicar fora
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>