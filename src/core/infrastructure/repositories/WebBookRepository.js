import { IBookRepository } from "../../domain/repositories/IBookRepository";
import { Book } from "../../domain/entities/Book";
import { IndexedDBService } from "../database/IndexedDBService";

export class WebBookRepository extends IBookRepository {
  constructor() {
    super();
    this.db = new IndexedDBService();
  }

  async getAll() {
    const db = await this.db.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["books"], "readonly");
      const store = transaction.objectStore("books");
      const index = store.index("lastRead");
      const request = index.openCursor(null, "prev");

      const books = [];
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          books.push(Book.fromJSON(cursor.value));
          cursor.continue();
        } else {
          resolve(books);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getById(id) {
    const db = await this.db.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["books"], "readonly");
      const store = transaction.objectStore("books");
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result ? Book.fromJSON(request.result) : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async save(book) {
    const db = await this.db.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["books"], "readwrite");
      const store = transaction.objectStore("books");
      const request = store.put(book.toJSON());

      request.onsuccess = () => resolve(book);
      request.onerror = () => reject(request.error);
    });
  }

  async update(book) {
    return this.save(book);
  }

  async delete(id) {
    const db = await this.db.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["books"], "readwrite");
      const store = transaction.objectStore("books");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveAll(books) {
    const db = await this.db.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["books"], "readwrite");
      const store = transaction.objectStore("books");
      let completed = 0;

      books.forEach((book) => {
        const request = store.put(book.toJSON());
        request.onsuccess = () => {
          completed++;
          if (completed === books.length) {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      });
    });
  }
}
