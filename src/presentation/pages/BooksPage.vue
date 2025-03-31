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
        <BookCard :book="book" @openBook="open" @removeBook="remove" />
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
      v-model="showPDFViewer"
      :book="currentBook"
      @onPageChange="onProgressSaved"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useConfirm, useToast } from "primevue";
import BookCard from "../components/BookCard.vue";
import PDFViewer from "../components/PDFViewer.vue";
import { useBookStore } from "../stores/bookStore";

const store = useBookStore();
const confirm = useConfirm();
const toast = useToast();
const { addBook, openBook, updateReadingProgress, removeBook, getBookById } = store;
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

function remove(bookId) {
  const book = getBookById(bookId)
  confirm.require({
    message: `Do you want to delete ${book.title}?`,
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: async () => {
      await removeBook(bookId);
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "Record deleted",
        life: 3000,
      });
    },
  });
}
</script>
