<template>
  <div class="flex justify-center gap-3">
    <!-- WhatsApp -->
    <a 
      :href="whatsappUrl" 
      target="_blank"
      rel="noopener noreferrer"
      class="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
      :aria-label="`Compartilhar no WhatsApp: ${shareTitle}`"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>

    <!-- Facebook -->
    <a 
      :href="facebookUrl" 
      target="_blank"
      rel="noopener noreferrer"
      class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      :aria-label="`Compartilhar no Facebook: ${shareTitle}`"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/>
      </svg>
    </a>

    <!-- Twitter -->
    <a 
      :href="twitterUrl" 
      target="_blank"
      rel="noopener noreferrer"
      class="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
      :aria-label="`Compartilhar no Twitter: ${shareTitle}`"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    </a>

    <!-- Copiar Link -->
    <button 
      @click="copiarLink"
      class="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
      :aria-label="`Copiar link: ${shareTitle}`"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
    </button>
  </div>

  <!-- Toast de confirmação -->
  <div v-if="showToast" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
    Link copiado com sucesso!
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ShareButtons',
  props: {
    title: {
      type: String,
      default: 'AMAJAC - Associação de Moradores'
    },
    url: {
      type: String,
      default: () => typeof window !== 'undefined' ? window.location.href : ''
    },
    description: {
      type: String,
      default: 'Conheça a AMAJAC - Associação de Moradores e Amigos do Jardim Atlântico Central'
    }
  },
  setup(props) {
    const showToast = ref(false)

    const shareTitle = `AMAJAC - ${props.title}`
    const shareUrl = encodeURIComponent(props.url)
    const shareText = encodeURIComponent(`${props.title} - ${props.description}`)

    const whatsappUrl = `https://wa.me/?text=${shareText}%20${shareUrl}`
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`

    const copiarLink = async () => {
      try {
        await navigator.clipboard.writeText(props.url)
        showToast.value = true
        setTimeout(() => {
          showToast.value = false
        }, 3000)
      } catch (err) {
        console.error('Erro ao copiar link:', err)
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea')
        textArea.value = props.url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        showToast.value = true
        setTimeout(() => {
          showToast.value = false
        }, 3000)
      }
    }

    return {
      whatsappUrl,
      facebookUrl,
      twitterUrl,
      copiarLink,
      showToast,
      shareTitle
    }
  }
}
</script>