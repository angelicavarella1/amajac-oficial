<template>
  <!-- O banner usa a URL do seu storage -->
  <div class="w-full">
    <img 
      src="https://uvohhjdhtnweckndgehe.supabase.co/storage/v1/object/public/imagens/hero/1760711674264-6ytdcz.png" 
      alt="Bandeira da AMAJAC"
      class="w-full object-cover block rounded-lg shadow-xl"
      :class="[
        // Altura responsiva usando classes Tailwind
        'h-48', // Padrão para telas muito pequenas
        'sm:h-56', // Altura para sm (640px+)
        'md:h-64', // Altura para md (768px+)
        'lg:h-72', // Altura para lg (1024px+)
        'xl:h-80', // Altura para xl (1280px+)
      ]"
    />
  </div>
</template>

<script setup>
// Usando Composition API, não é necessário o 'name' ou 'export default'
// se o nome do arquivo for descritivo.
</script>

<style scoped>
/* O CSS foi simplificado, pois a responsividade de altura agora é tratada pelas 
classes Tailwind (h-48, sm:h-56, md:h-64, etc.) no template. 
Ajustei a altura máxima para 320px (xl:h-80) para o maior breakpoint. 
*/
</style>