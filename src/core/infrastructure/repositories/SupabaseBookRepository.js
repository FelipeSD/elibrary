import { IBookRepository } from "../../domain/repositories/IBookRepository";
import { Book } from "../../domain/entities/Book";
import { SupabaseDatabaseService } from "../database/SupabaseDatabaseService";
import { ThumbnailService } from "../../../services/thumbnailService";

export class SupabaseBookRepository extends IBookRepository {
  constructor() {
    super();
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    console.log("Environment variables:", {
      SUPABASE_URL: supabaseUrl,
      SUPABASE_KEY: supabaseKey ? "***" : undefined,
      NODE_ENV: process.env.NODE_ENV,
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Supabase credentials not found in environment variables"
      );
    }

    this.db = new SupabaseDatabaseService(supabaseUrl, supabaseKey);
  }

  async getAll() {
    const books = await this.db.getAll("books");
    return books.map((book) => Book.fromJSON(this.mapDatabaseToEntity(book)));
  }

  async getById(id) {
    const book = await this.db.getById("books", id);
    return book ? Book.fromJSON(this.mapDatabaseToEntity(book)) : null;
  }

  async save(book) {
    const bookData = book.toJSON();

    // Gerar thumbnail se não existir
    if (!bookData.thumbnail) {
      bookData.thumbnail = await ThumbnailService.getThumbnail(
        bookData.filePath
      );
    }

    const mappedData = this.mapEntityToDatabase(bookData);
    const savedBook = await this.db.save("books", mappedData);
    return Book.fromJSON(this.mapDatabaseToEntity(savedBook));
  }

  async update(book) {
    const bookData = book.toJSON();

    // Gerar thumbnail se não existir
    if (!bookData.thumbnail) {
      bookData.thumbnail = await ThumbnailService.getThumbnail(
        bookData.filePath
      );
    }

    const mappedData = this.mapEntityToDatabase(bookData);
    const updatedBook = await this.db.update("books", bookData.id, mappedData);
    return Book.fromJSON(this.mapDatabaseToEntity(updatedBook));
  }

  async delete(id) {
    await this.db.delete("books", id);
  }

  async saveAll(books) {
    for (const book of books) {
      await this.save(book);
    }
  }

  // Mapeia os dados do banco para o formato da entidade
  mapDatabaseToEntity(dbData) {
    return {
      id: dbData.id,
      title: dbData.title,
      author: dbData.author,
      totalPages: dbData.total_pages,
      currentPage: dbData.current_page,
      lastRead: dbData.last_read,
      filePath: dbData.file_path,
      thumbnail: dbData.thumbnail,
    };
  }

  // Mapeia os dados da entidade para o formato do banco
  mapEntityToDatabase(entityData) {
    return {
      id: entityData.id,
      title: entityData.title,
      author: entityData.author,
      total_pages: entityData.totalPages,
      current_page: entityData.currentPage,
      last_read: entityData.lastRead,
      file_path: entityData.filePath,
      thumbnail: entityData.thumbnail,
    };
  }
}
