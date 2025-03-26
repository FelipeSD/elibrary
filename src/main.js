import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import "./assets/main.css";

// PrimeVue components
import Button from "primevue/button";

const app = createApp(App);

// Register PrimeVue components
app.component("Button", Button);

// Use PrimeVue
app.use(PrimeVue);

// Mount the app
app.mount("#app");
