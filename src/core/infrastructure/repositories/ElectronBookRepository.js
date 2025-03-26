import { IBookRepository } from "../../domain/repositories/IBookRepository";
import { Book } from "../../domain/entities/Book";
import { SQLiteService } from "../database/SQLiteService";

export class ElectronBookRepository extends IBookRepository {
  constructor() {
    super();
    this.db = new SQLiteService();
  }

  async getAll() {
    const db = await this.db.connect();
    const books = await db.all("SELECT * FROM books ORDER BY lastRead DESC");
    return books.map((book) => Book.fromJSON(book));
  }

  async getById(id) {
    const db = await this.db.connect();
    const book = await db.get("SELECT * FROM books WHERE id = ?", id);
    return book ? Book.fromJSON(book) : null;
  }

  async save(book) {
    const db = await this.db.connect();
    const bookData = book.toJSON();
    await db.run(
      `INSERT INTO books (id, title, author, totalPages, currentPage, lastRead, filePath)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bookData.id,
        bookData.title,
        bookData.author,
        bookData.totalPages,
        bookData.currentPage,
        bookData.lastRead,
        bookData.filePath,
      ]
    );
    return book;
  }

  async update(book) {
    const db = await this.db.connect();
    const bookData = book.toJSON();
    await db.run(
      `UPDATE books 
       SET title = ?, author = ?, totalPages = ?, currentPage = ?, lastRead = ?, filePath = ?
       WHERE id = ?`,
      [
        bookData.title,
        bookData.author,
        bookData.totalPages,
        bookData.currentPage,
        bookData.lastRead,
        bookData.filePath,
        bookData.id,
      ]
    );
    return book;
  }

  async delete(id) {
    const db = await this.db.connect();
    await db.run("DELETE FROM books WHERE id = ?", id);
  }

  async saveAll(books) {
    const db = await this.db.connect();
    await db.run("BEGIN TRANSACTION");

    try {
      for (const book of books) {
        await this.save(book);
      }
      await db.run("COMMIT");
    } catch (error) {
      await db.run("ROLLBACK");
      throw error;
    }
  }
}
