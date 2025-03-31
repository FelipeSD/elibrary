<template>
  <MainLayout>
    <ConfirmDialog />
    <BooksPage />
  </MainLayout>
</template>

<script setup>
import { ConfirmDialog } from "primevue";
import MainLayout from "./presentation/layouts/MainLayout.vue";
import BooksPage from "./presentation/pages/BooksPage.vue";
</script>
