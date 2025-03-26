import { IBookRepository } from "../../domain/repositories/IBookRepository";
import { Book } from "../../domain/entities/Book";
import { WebDatabaseService } from "../database/WebDatabaseService";
import { ThumbnailService } from "../../../services/thumbnailService";

export class WebBookRepository extends IBookRepository {
  constructor() {
    super();
    this.db = new WebDatabaseService();
  }

  async getAll() {
    const books = this.db.getAll();
    return books.map((book) => Book.fromJSON(book));
  }

  async getById(id) {
    const book = this.db.getById(id);
    return book ? Book.fromJSON(book) : null;
  }

  async save(book) {
    const bookData = book.toJSON();

    // Gerar thumbnail se não existir
    if (!bookData.thumbnail) {
      bookData.thumbnail = await ThumbnailService.getThumbnail(
        bookData.filePath
      );
    }

    this.db.save(bookData);
    return book;
  }

  async update(book) {
    const bookData = book.toJSON();

    // Gerar thumbnail se não existir
    if (!bookData.thumbnail) {
      bookData.thumbnail = await ThumbnailService.getThumbnail(
        bookData.filePath
      );
    }

    this.db.save(bookData);
    return book;
  }

  async delete(id) {
    this.db.delete(id);
  }

  async saveAll(books) {
    for (const book of books) {
      await this.save(book);
    }
  }
}
