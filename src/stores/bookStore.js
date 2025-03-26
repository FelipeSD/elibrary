import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { PDFService } from "../services/pdfService";

export const useBookStore = defineStore("books", () => {
  const books = ref([]);
  const currentBook = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const sortedBooks = computed(() => {
    return [...books.value].sort((a, b) => b.lastRead - a.lastRead);
  });

  async function addBook() {
    try {
      loading.value = true;
      error.value = null;

      const filePath = await PDFService.selectPDF();
      if (!filePath) return;

      const bookInfo = await PDFService.getPDFInfo(filePath);
      const currentPage = await PDFService.getReadingProgress(filePath);

      const newBook = {
        ...bookInfo,
        currentPage,
        lastRead: Date.now(),
        id: Date.now().toString(),
      };

      books.value.push(newBook);
      return newBook;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function openBook(book) {
    try {
      loading.value = true;
      error.value = null;

      currentBook.value = book;
      return book;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateReadingProgress(book, page) {
    try {
      await PDFService.saveReadingProgress(book.filePath, page);
      book.currentPage = page;
      book.lastRead = Date.now();
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  function removeBook(bookId) {
    const index = books.value.findIndex((b) => b.id === bookId);
    if (index !== -1) {
      books.value.splice(index, 1);
    }
  }

  return {
    books,
    currentBook,
    loading,
    error,
    sortedBooks,
    addBook,
    openBook,
    updateReadingProgress,
    removeBook,
  };
});
