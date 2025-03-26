<template>
  <MainLayout>
    <BooksPage />
  </MainLayout>
</template>

<script setup>
import MainLayout from "./presentation/layouts/MainLayout.vue";
import BooksPage from "./presentation/pages/BooksPage.vue";
</script>

<style>
/* PrimeVue styles */
@import "primevue/resources/themes/lara-light-blue/theme.css";
@import "primevue/resources/primevue.min.css";
@import "primeicons/primeicons.css";
@import "primeflex/primeflex.css";

/* Tailwind styles */
@import "./assets/main.css";
</style>
