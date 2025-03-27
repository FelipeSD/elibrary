import { Book } from "../../domain/entities/Book";
import { IBookRepository } from "../../domain/repositories/IBookRepository";

export class AddBookUseCase {
  constructor(bookRepository) {
    if (!(bookRepository instanceof IBookRepository)) {
      throw new Error("bookRepository must implement IBookRepository");
    }
    this.bookRepository = bookRepository;
  }

  async execute(pdfInfo) {
    const book = new Book({
      // id: crypto.randomUUID(),
      title: pdfInfo.title,
      author: pdfInfo.author,
      totalPages: pdfInfo.totalPages,
      currentPage: 1,
      lastRead: new Date().toISOString(),
      filePath: pdfInfo.filePath,
    });

    return await this.bookRepository.save(book);
  }
}
