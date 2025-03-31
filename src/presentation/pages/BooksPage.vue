<template>
  <div>
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-6"
    >
      <template v-for="item in new Array(3)" :key="item">
        <Skeleton class="w-full h-56" v-if="loading" />
      </template>
      <template v-for="book in sortedBooks" :key="book.id">
        <BookCard :book="book" />
      </template>
      <Card
        :pt="{
          body: 'h-full h-56',
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
          />
        </template>
      </Card>
    </div>

    <PDFViewer
      v-if="currentBook"
      @onPageChange="saveProgress"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import BookCard from "../components/BookCard.vue";
import PDFViewer from "../components/PDFViewer.vue";
import { useBookStore } from "../stores/bookStore";

const store = useBookStore();
const { addBook, updateReadingProgress } = store;
const { loading, error, sortedBooks, showPDFViewer, currentBook } =
  storeToRefs(store);

async function saveProgress(currentPage) {
  if (currentBook.value) {
    await updateReadingProgress(currentBook.value, currentPage);
  }
}
</script>
