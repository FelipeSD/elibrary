import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import "./assets/main.css";

// PrimeVue components
import Button from "primevue/button";

const app = createApp(App);
const pinia = createPinia();

// Register PrimeVue components
app.component("Button", Button);

// Use plugins
app.use(pinia);
app.use(PrimeVue);

// Mount the app
app.mount("#app");
