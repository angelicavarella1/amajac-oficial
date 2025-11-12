<!-- 
  Página: Termos de Uso
  Caminho: /termos
-->
<template>
  <main class="pagina-institucional">
    <div class="container">
      <article>
        <header class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">Termos de Uso</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Última atualização: 6 de novembro de 2025
          </p>
        </header>

        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p>
            Bem-vindo ao site oficial da AMAJAC – Associação de Moradores e Amigos de Itaipuaçu.
            Ao acessar e utilizar este site, você concorda com os seguintes termos:
          </p>

          <h2>1. Uso do Site</h2>
          <p>
            O conteúdo deste site é destinado exclusivamente para fins informativos e institucionais.
            É proibida a reprodução total ou parcial sem autorização prévia da AMAJAC.
          </p>

          <h2>2. Classificados e Conteúdo de Terceiros</h2>
          <p>
            Os anúncios na seção de Classificados com Avaliação são de responsabilidade dos anunciantes.
            A AMAJAC atua apenas como intermediária e não se responsabiliza pela veracidade das informações.
          </p>

          <h2>3. Direitos Autorais</h2>
          <p>
            Todo o conteúdo (textos, imagens, logotipos) é de propriedade da AMAJAC ou de seus parceiros,
            protegido por leis de direitos autorais e propriedade intelectual.
          </p>

          <h2>4. Alterações</h2>
          <p>
            A AMAJAC reserva-se o direito de modificar estes termos a qualquer momento.
            As alterações entrarão em vigor imediatamente após sua publicação no site.
          </p>

          <h2>5. Contato</h2>
          <p>
            Para dúvidas sobre estes termos, entre em contato por:
            <a href="mailto:contato@amajac.org.br" class="text-amajac-green">contato@amajac.org.br</a>.
          </p>
        </div>
      </article>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
.pagina-institucional {
  padding: 4rem 1rem;
  background-color: #f9fafb;
}
.dark .pagina-institucional {
  background-color: #111827;
  color: #f9fafb;
}
.container {
  max-width: 800px;
  margin: 0 auto;
}
.text-amajac-green { color: #2E7D32; }
.prose h1,
.prose h2,
.prose h3 {
  color: #1f2937;
}
.dark .prose h1,
.dark .prose h2,
.dark .prose h3 {
  color: #f9fafb;
}
</style>