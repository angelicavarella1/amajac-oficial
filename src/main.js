import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Tema AMAJAC - versÃ£o estÃ¡vel
import './assets/css/amajac-theme.css'

// ÃCONES MATERIAL DESIGN
import '@mdi/font/css/materialdesignicons.min.css'

createApp(App).use(router).mount('#app')