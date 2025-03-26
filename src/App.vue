<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Book Reader</h1>

      <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="book in sortedBooks"
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
            <div class="flex gap-2">
              <Button
                @click="openBook(book)"
                label="Open"
                icon="pi pi-book"
                :loading="loading"
              />
              <Button
                @click="removeBook(book.id)"
                label="Remove"
                icon="pi pi-trash"
                severity="danger"
                text
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <Button
          @click="addBook"
          label="Add New Book"
          icon="pi pi-plus"
          class="p-button-primary"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBookStore } from './stores/bookStore'
import { storeToRefs } from 'pinia'

const store = useBookStore()
const { addBook, openBook, removeBook } = store

// Usar storeToRefs para propriedades reativas
const { books, loading, error, sortedBooks } = storeToRefs(store)
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
.p-button {
  @apply !important;
}
</style>
