<template>
  <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
    {{ error }}
  </div>

  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-6"
  >
    <template v-for="book in sortedBooks" :key="book.id">
      <BookCard :book="book" />
    </template>
    <BookCardSkeleton v-if="loading" />
    <Card
      :pt="{
        body: 'h-56',
        content: 'flex h-full items-center justify-center',
      }"
    >
      <template #content>
        <Button
          icon="pi pi-plus"
          rounded
          variant="text"
          aria-label="Add New Book"
          v-tooltip="'Add New Book'"
          severity="contrast"
          @click="addBook"
          :loading="loading"
        />
      </template>
    </Card>
  </div>

  <PDFViewer v-if="currentBook" @onPageChange="saveProgress" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import BookCard from "../components/BookCard.vue";
import BookCardSkeleton from "../components/BookCardSkeleton.vue";
import PDFViewer from "../components/PDFViewer.vue";
import { useBookStore } from "../stores/bookStore";

const store = useBookStore();
const { addBook, updateReadingProgress } = store;
const { loading, error, sortedBooks, currentBook } = storeToRefs(store);

async function saveProgress(currentPage) {
  if (currentBook.value) {
    await updateReadingProgress(currentBook.value, currentPage);
  }
}
</script>
