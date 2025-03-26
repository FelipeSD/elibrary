import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { PDFService } from "../services/pdfService";
import { isElectron } from "../utils/environment";

const STORAGE_KEY = "books";

export const useBookStore = defineStore("books", () => {
  const books = ref([]);
  const currentBook = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const sortedBooks = computed(() => {
    return [...books.value].sort((a, b) => b.lastRead - a.lastRead);
  });

  // Função para carregar os livros do armazenamento
  async function loadBooks() {
    try {
      if (isElectron()) {
        // No Electron, os livros são carregados do arquivo
        const result = await window.electronAPI.getBooks();
        books.value = result || [];
      } else {
        // Na web, os livros são carregados do localStorage
        const storedBooks = localStorage.getItem(STORAGE_KEY);
        books.value = storedBooks ? JSON.parse(storedBooks) : [];
      }
    } catch (err) {
      console.error("Error loading books:", err);
      error.value = err.message;
    }
  }

  // Função para salvar os livros no armazenamento
  async function saveBooks() {
    try {
      // Garante que apenas dados serializáveis sejam salvos
      const serializableBooks = books.value.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        totalPages: book.totalPages,
        currentPage: book.currentPage,
        lastRead: book.lastRead,
        filePath: book.filePath,
      }));

      if (isElectron()) {
        // No Electron, os livros são salvos no arquivo
        await window.electronAPI.saveBooks(serializableBooks);
      } else {
        // Na web, os livros são salvos no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableBooks));
      }
    } catch (err) {
      console.error("Error saving books:", err);
      error.value = err.message;
    }
  }

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
        filePath, // Garante que o filePath seja salvo
      };

      books.value.push(newBook);
      await saveBooks();
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
      await saveBooks();
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  function removeBook(bookId) {
    const index = books.value.findIndex((b) => b.id === bookId);
    if (index !== -1) {
      books.value.splice(index, 1);
      saveBooks();
    }
  }

  // Carrega os livros quando o store é inicializado
  loadBooks();

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
