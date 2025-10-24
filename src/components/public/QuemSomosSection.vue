<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Quem Somos
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Conheça a AMAJAC - Associação de Moradores, nossa história e nossa missão
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Nossa História
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            A AMAJAC foi fundada com o objetivo de representar e unir os moradores da nossa comunidade. 
            Através de anos de dedicação e trabalho conjunto, temos conquistado melhorias significativas 
            para o nosso bairro e fortalecido os laços entre os residentes.
          </p>
          
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Nossa Missão
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Promover o desenvolvimento comunitário, defender os interesses dos moradores e criar um 
            ambiente seguro, acolhedor e próspero para todas as famílias do nosso bairro.
          </p>

          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div class="text-2xl font-bold text-primary-600 mb-2">+500</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Famílias</div>
            </div>
            <div class="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div class="text-2xl font-bold text-primary-600 mb-2">+10</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Anos</div>
            </div>
            <div class="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div class="text-2xl font-bold text-primary-600 mb-2">+50</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Projetos</div>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="bg-primary-500 rounded-lg p-8 text-white">
            <h4 class="text-xl font-semibold mb-4">Nossos Valores</h4>
            <ul class="space-y-3">
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Transparência e honestidade
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                União e colaboração
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Respeito à diversidade
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Compromisso com a comunidade
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Componente estático - não precisa de lógica reativa
</script>