<template>
  <div>
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="book in sortedBooks"
        :key="book.id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div class="mb-4">
          <img
            v-if="book.thumbnail"
            :src="book.thumbnail"
            :alt="book.title"
            class="w-full h-48 object-contain bg-gray-100 rounded-lg"
          />
          <div
            v-else
            class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-book text-4xl text-gray-400"></i>
          </div>
        </div>
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
</template>

<script setup>
import { useBookStore } from "../stores/bookStore";
import { storeToRefs } from "pinia";

const store = useBookStore();
const { addBook, openBook, removeBook } = store;

const { loading, error, sortedBooks } = storeToRefs(store);
</script>
