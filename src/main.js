import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Error handling global
const handleGlobalError = (error) => {
  console.error("Erro global capturado:", error);
  
  if (window.__VUE_ERROR_HANDLED__) return;
  window.__VUE_ERROR_HANDLED__ = true;

  const message =
    (error && error.message) ||
    (typeof error === "string" ? error : null) ||
    "Ocorreu um erro inesperado. Tente novamente mais tarde.";

  console.error("Erro:", message);

  setTimeout(() => {
    window.__VUE_ERROR_HANDLED__ = false;
  }, 2000);
};

window.addEventListener("error", (event) => {
  handleGlobalError(event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  handleGlobalError(event.reason);
  event.preventDefault();
});

app.config.errorHandler = (err, instance, info) => {
  handleGlobalError(err);
  console.error("Erro no Vue:", err, "Info:", info);
};

router.onError((error) => {
  handleGlobalError(error);
});

app.mount("#app");