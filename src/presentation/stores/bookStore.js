import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { AddBookUseCase } from "../../core/useCases/book/AddBookUseCase";
import { SupabaseBookRepository } from "../../core/infrastructure/repositories/SupabaseBookRepository";
import { PDFService } from "../../services/pdfService";
import { SupabaseStorageService } from "../../core/infrastructure/storage/SupabaseStorageService";

export const useBookStore = defineStore("books", () => {
  const books = ref([]);
  const currentBook = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const showPDFViewer = ref(false);

  const repository = new SupabaseBookRepository();
  const storage = new SupabaseStorageService();

  const addBookUseCase = new AddBookUseCase(repository);

  const sortedBooks = computed(() => {
    return [...books.value].sort(
      (a, b) => new Date(b.lastRead) - new Date(a.lastRead)
    );
  });

  async function loadBooks() {
    try {
      loading.value = true;
      error.value = null;
      books.value = await repository.getAll();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function addBook() {
    try {
      error.value = null;

      const book = await PDFService.selectPDF();
      console.log(book);
      if (!book) {
        throw new Error("Error adding book");
      }
      loading.value = true;
      const savedBook = await addBookUseCase.execute(book);
      books.value.push(savedBook);
    } catch (err) {
      console.error(err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function openBook(book) {
    try {
      loading.value = true;
      error.value = null;
      currentBook.value = book;
      showPDFViewer.value = true;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function closePDFViewer() {
    showPDFViewer.value = false;
    currentBook.value = null;
  }

  async function updateReadingProgress(book, currentPage) {
    try {
      loading.value = true;
      error.value = null;

      book.currentPage = currentPage;
      book.lastRead = new Date().toISOString();

      await repository.update(book);
      // await repository.saveAll(books.value);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function removeBook(bookId) {
    try {
      loading.value = true;
      error.value = null;

      const book = books.value.find((book) => book.id === bookId);
      await storage.deletePDF(book.fileName);
      await repository.delete(bookId);
      books.value = books.value.filter((book) => book.id !== bookId);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    await loadBooks();
  });

  return {
    books,
    currentBook,
    loading,
    error,
    sortedBooks,
    showPDFViewer,
    loadBooks,
    addBook,
    openBook,
    closePDFViewer,
    updateReadingProgress,
    removeBook,
  };
});
