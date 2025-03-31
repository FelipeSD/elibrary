import { createApp } from "vue";
import { createPinia } from "pinia";
import Aura from '@primeuix/themes/aura'
import PrimeVue from "primevue/config";
import App from "./App.vue";

// PrimeVue styles
import "primeicons/primeicons.css";
// import "primeflex/primeflex.css";
import "./assets/main.css";

// PrimeVue components
import Button from "primevue/button";
import Tooltip from 'primevue/tooltip';
import Card from "primevue/card";
import Menu from "primevue/menu";

const app = createApp(App);
const pinia = createPinia();

// Register PrimeVue components
app.component("Button", Button);
app.component("Card", Card);
app.component("Menu", Menu);

// Register PrimeVue directives
app.directive('tooltip', Tooltip);

// Use plugins
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.use(pinia);

// Mount the app
app.mount("#app");
