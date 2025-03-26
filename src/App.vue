<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Book Reader</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="book in books"
          :key="book.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            {{ book.title }}
          </h2>
          <p class="text-gray-600 mb-4">{{ book.author }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500"
              >Page {{ book.currentPage }} of {{ book.totalPages }}</span
            >
            <Button @click="openBook(book)" label="Open" icon="pi pi-book" />
          </div>
        </div>
      </div>

      <div class="mt-8">
        <Button
          @click="addBook"
          label="Add New Book"
          icon="pi pi-plus"
          class="p-button-primary"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";

const books = ref([]);

const addBook = () => {
  // TODO: Implement book addition
};

const openBook = (book) => {
  // TODO: Implement book opening
};
</script>

<style>
/* PrimeVue styles */
@import "primevue/resources/themes/lara-light-blue/theme.css";
@import "primevue/resources/primevue.min.css";
@import "primeicons/primeicons.css";
@import "primeflex/primeflex.css";

/* Tailwind styles */
@import "./assets/main.css";

/* Custom styles */

</style>
