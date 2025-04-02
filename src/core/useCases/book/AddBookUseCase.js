import { Book } from "@/core/domain/entities/Book";
import { IBookRepository } from "@/core/domain/repositories/IBookRepository";
import { PDFService } from "@/services/pdfService";
import { StorageService } from "@/services/storageService";
import { PDFToImage } from "@/utils/pdf";

export class AddBookUseCase {
  constructor(bookRepository) {
    if (!(bookRepository instanceof IBookRepository)) {
      throw new Error("bookRepository must implement IBookRepository");
    }
    this.bookRepository = bookRepository;
  }

  async execute(selectedFile) {
    const storageService = new StorageService();
    const filePath = await storageService.uploadFile(selectedFile);
    const fileUrl = await storageService.getFileUrl(filePath);
    const pdfInfo = await PDFService.getPDFInfo(fileUrl);
    const book = new Book({
      author: pdfInfo.author,
      totalPages: pdfInfo.totalPages,
      filePath: fileUrl,
      fileName: pdfInfo.title,
      title: selectedFile.name,
      currentPage: 1,
      lastRead: new Date().toISOString(),
    });

    if (!book.thumbnail) {
      book.thumbnail = await PDFToImage(book.filePath);
    }

    return await this.bookRepository.save(book);
  }
}
