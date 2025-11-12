<template>
  <div class="acesso-rapido">
    <a
      v-for="link in links"
      :key="link.url"
      :href="link.url"
      :target="link.external ? '_blank' : '_self'"
      :rel="link.external ? 'noopener noreferrer' : undefined"
      class="btn-acesso"
      :aria-label="`Acessar ${link.label}`"
    >
      {{ link.label }}
    </a>
  </div>
</template>

<script setup>
// URLs sem espaços e com domínio de produção
const links = [
  { label: 'Associados', url: 'https://associacoes.softaliza.com.br', external: true },
  { label: 'SOSJAC', url: 'https://sosjacapp.amajac.org.br', external: true },
  { label: 'Área Restrita', url: 'https://amajac.org.br/admin/login', external: true } // ✓ Atualizado para domínio real
]
</script>

<style scoped>
.acesso-rapido {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1.5rem 0;
}

.btn-acesso {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  background-color: #2E7D32; /* ✓ Verde AMAJAC oficial */
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.15s;
  min-width: 140px;
  border: 2px solid transparent;
}

.btn-acesso:hover,
.btn-acesso:focus {
  background-color: #1B5E20; /* ✓ Cor de hover consistente */
  transform: translateY(-2px);
  outline: 2px solid #4CAF50;
  outline-offset: 2px;
}
</style>