<!-- src/modules/eventos/components/AdminEventosTable.vue -->
<template>
  <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
    <table class="min-w-full border-collapse">
      <thead class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
        <tr>
          <th class="px-4 py-2 text-left">Título</th>
          <th class="px-4 py-2 text-left">Data</th>
          <th class="px-4 py-2 text-left">Local</th>
          <th class="px-4 py-2 text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="evento in eventos"
          :key="evento.id"
          class="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td class="px-4 py-2">{{ evento.titulo }}</td>
          <td class="px-4 py-2">{{ formatarData(evento.data_evento) }}</td>
          <td class="px-4 py-2">{{ evento.local }}</td>
          <td class="px-4 py-2 text-center">
            <button
              class="text-blue-600 hover:underline mr-2"
              @click="$emit('edit', evento)"
            >
              Editar
            </button>
            <button
              class="text-red-600 hover:underline"
              @click="$emit('delete', evento.id)"
            >
              Excluir
            </button>
          </td>
        </tr>
        <tr v-if="!eventos.length">
          <td colspan="4" class="text-center py-4 text-gray-500">
            Nenhum evento encontrado.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  eventos: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: Boolean,
  error: String
})

const emit = defineEmits(['edit', 'delete'])

function formatarData(data) {
  if (!data) return '-'
  return new Date(data).toLocaleDateString('pt-BR')
}
</script>

<style scoped>
table {
  width: 100%;
  border-spacing: 0;
}
</style>