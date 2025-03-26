import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { AddBookUseCase } from "../../core/useCases/book/AddBookUseCase";
import { WebBookRepository } from "../../core/infrastructure/repositories/WebBookRepository";
import { PDFService } from "../../services/pdfService";
import { isElectron } from "../../utils/environment";
import { ElectronBookRepository } from "../../core/infrastructure/repositories/ElectronBookRepository";

export const useBookStore = defineStore("books", () => {
  const books = ref([]);
  const currentBook = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const repository = isElectron()
    ? new ElectronBookRepository()
    : new WebBookRepository();
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
      loading.value = true;
      error.value = null;

      const filePath = await PDFService.selectPDF();
      if (!filePath) return;

      const pdfInfo = await PDFService.getPDFInfo(filePath);
      const book = await addBookUseCase.execute(pdfInfo);

      books.value.push(book);
      await repository.saveAll(books.value);
    } catch (err) {
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
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function updateReadingProgress(book, currentPage) {
    try {
      loading.value = true;
      error.value = null;

      book.currentPage = currentPage;
      book.lastRead = new Date().toISOString();

      await repository.update(book);
      await repository.saveAll(books.value);
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

      books.value = books.value.filter((book) => book.id !== bookId);
      await repository.delete(bookId);
      await repository.saveAll(books.value);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    books,
    currentBook,
    loading,
    error,
    sortedBooks,
    loadBooks,
    addBook,
    openBook,
    updateReadingProgress,
    removeBook,
  };
});
