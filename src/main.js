import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import App from "./App.vue";

// PrimeVue styles
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
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
