<template>
  <div>
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-6"
    >
      <template v-for="book in sortedBooks" :key="book.id">
        <BookCard :book="book" @openBook="open" />
      </template>
    </div>

    <div class="mt-8">
      <Button
        @click="addBook"
        label="Add New Book"
        icon="pi pi-plus"
        severity="success"
        :loading="loading"
      />
    </div>

    <PDFViewer
      v-if="currentBook"
      v-model="showPDFViewer"
      :book="currentBook"
      @onPageChange="onProgressSaved"
    />
  </div>
</template>

<script setup>
import { useBookStore } from "../stores/bookStore";
import { storeToRefs } from "pinia";
import PDFViewer from "../components/PDFViewer.vue";
import BookCard from "../components/BookCard.vue";

const store = useBookStore();
const { addBook, openBook, removeBook, updateReadingProgress } = store;

const { loading, error, sortedBooks, showPDFViewer, currentBook } =
  storeToRefs(store);

async function onProgressSaved(currentPage) {
  if (currentBook.value) {
    await updateReadingProgress(currentBook.value, currentPage);
  }
}

function open(book) {
  openBook(book);
}
</script>
