<template>
  <section class="py-12 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Galeria</h2>
        <p class="text-lg text-gray-600">Veja fotos dos nossos eventos e conquistas</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"/>
      </div>

      <!-- Galeria Vazia -->
      <div v-else-if="imagens.length === 0" class="text-center py-8">
        <div class="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
          <i class="fas fa-images text-3xl text-gray-400 mb-3"/>
          <h3 class="text-lg font-semibold text-gray-700 mb-1">Galeria vazia</h3>
          <p class="text-gray-500 text-sm">Em breve teremos fotos dos nossos eventos!</p>
        </div>
      </div>

      <!-- Galeria com Imagens -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="imagem in imagens.slice(0, 8)"
          :key="imagem.id"
          class="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <img
            :src="getImageUrl(imagem)"
            :alt="imagem.titulo"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            @error="handleImageError(imagem, $event)"
          />
        </div>
      </div>

      <div v-if="imagens.length > 0" class="text-center mt-8">
        <router-link
          to="/galeria"
          class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300"
        >
          Ver galeria completa
          <i class="fas fa-arrow-right ml-2"/>
        </router-link>
      </div>

      <!-- Debug -->
      <div v-if="imagens.length > 0" class="mt-4 p-3 bg-green-50 rounded text-center">
        <p class="text-sm text-green-700">{{ imagens.length }} imagens carregadas</p>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

export default {
  name: 'GaleriaSection',
  setup() {
    const imagens = ref([])
    const loading = ref(true)

    const getImageUrl = (imagem) => {
      if (!imagem.imagem_url) {
        console.error('❌ IMAGEM SEM URL NA HOME:', imagem)
        return '/placeholder-news.jpg'
      }

      // URL completa do Supabase
      if (imagem.imagem_url.includes('supabase.co')) {
        return imagem.imagem_url
      }

      // Apenas nome do arquivo
      return `https://uvohhjdhtnweckndgehe.supabase.co/storage/v1/object/public/galeria/${imagem.imagem_url}`
    }

    const handleImageError = (imagem, event) => {
      console.error('💥 ERRO IMAGEM HOME:', imagem.imagem_url)
      event.target.src = '/placeholder-news.jpg'
    }

    const loadGallery = async () => {
      loading.value = true
      
      try {
        console.log('🏠 CARREGANDO GALERIA PARA HOME...')
        
        const { data, error } = await supabase
          .from('galeria')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8)

        if (error) throw error

        console.log('✅ GALERIA HOME:', data)
        imagens.value = data || []
        
      } catch (error) {
        console.error('❌ ERRO GALERIA HOME:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadGallery()
    })

    return {
      imagens,
      loading,
      getImageUrl,
      handleImageError
    }
  }
}
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>