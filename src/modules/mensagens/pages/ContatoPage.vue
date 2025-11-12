<!-- src/modules/mensagens/pages/ContatoPage.vue -->
<template>
  <div class="contato-page py-12 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 max-w-4xl">
      <header class="text-center mb-12">
        <h1 class="text-3xl font-bold text-amajac-green dark:text-amajac-green-light mb-4">Fale Conosco</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Entre em contato com a AMAJAC. Estamos à disposição para atendê-lo!
        </p>
      </header>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 class="text-xl font-semibold mb-4">Informações de Contato</h2>
          <div class="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong>E-mail:</strong><br>
              <a href="mailto:comunicacao@amajac.org.br" class="text-amajac-green hover:underline">comunicacao@amajac.org.br</a>
            </p>
            <p>
              <strong>Telefone/WhatsApp:</strong><br>
              <a href="https://wa.me/5521978979840" target="_blank" class="text-amajac-green hover:underline">(21) 97897-9840</a>
            </p>
            <p>
              <strong>Endereço:</strong><br>
              Rua Izabel Cristina Ouvina, 112 – Jardim Atlântico Central,<br>
              Maricá, Rio de Janeiro – CEP 24.946-320
            </p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 class="text-xl font-semibold mb-4">Envie uma Mensagem</h2>
          <FormularioContato />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FormularioContato from '@/modules/mensagens/components/FormularioContato.vue'
</script>