import { defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import { SupabaseBookRepository } from "@/core/infrastructure/repositories/SupabaseBookRepository";
import { SupabaseStorageService } from "@/core/infrastructure/storage/SupabaseStorageService";
import { AddBookUseCase } from "@/core/useCases/book/AddBookUseCase";
import { FileSelectorService } from "@/services/fileSelectorService";

export const useBookStore = defineStore("books", () => {
  const books = ref([]);
  const currentBook = ref(null);
  const loading = ref(false);
  const loadingRemove = ref(false);
  const loadingUpdate = ref(false);
  const error = ref(null);
  const showPDFViewer = ref(false);

  const repository = new SupabaseBookRepository();
  const storage = new SupabaseStorageService();

  const addBookUseCase = new AddBookUseCase(repository);

  const sortedBooks = computed(() => {
    console.log("alterar posição")
    return [...books.value].sort(
      (a, b) => {
        console.log(b, a)
        return new Date(b.lastRead) - new Date(a.lastRead)
      }
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
      loading.value = true;
      const selectedFile = await FileSelectorService.selectFile();
      const savedBook = await addBookUseCase.execute(selectedFile);
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

  async function updateReadingProgress(currentBook, currentPage) {
    try {
      loadingUpdate.value = true;
      error.value = null;

      const book = books.value.find(b => b.id === currentBook.id)
      book.currentPage = currentPage;
      book.lastRead = new Date().toISOString();

      await repository.update(book);
    } catch (err) {
      error.value = err.message;
    } finally {
      loadingUpdate.value = false;
    }
  }

  async function removeBook(bookId) {
    try {
      loadingRemove.value = true;
      error.value = null;

      const book = books.value.find((book) => book.id === bookId);
      await storage.deletePDF(book.fileName);
      await repository.delete(bookId);
      books.value = books.value.filter((book) => book.id !== bookId);
    } catch (err) {
      error.value = err.message;
    } finally {
      loadingRemove.value = false;
    }
  }

  onMounted(async () => {
    await loadBooks();
  });

  return {
    books,
    currentBook,
    loading,
    loadingRemove,
    loadingUpdate,
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
