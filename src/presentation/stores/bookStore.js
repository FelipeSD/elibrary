import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { AddBookUseCase } from "../../core/useCases/book/AddBookUseCase";
import { SupabaseBookRepository } from "../../core/infrastructure/repositories/SupabaseBookRepository";
import { PDFService } from "../../services/pdfService";

export const useBookStore = defineStore("books", () => {
  const books = ref([]);
  const currentBook = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const showPDFViewer = ref(false);

  const repository = new SupabaseBookRepository();

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
      console.log(book);
      books.value.push(book);
      await repository.save(book);
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
