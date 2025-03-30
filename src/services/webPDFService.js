import { PDFDocument } from "pdf-lib";
import { Book } from "../core/domain/entities/Book";
import { SupabaseStorageService } from "../core/infrastructure/storage/SupabaseStorageService";
import { IPDFService } from "./IPDFService";

export class WebPDFService extends IPDFService {
  static async selectPDF() {
    console.log("Selecting PDF in Web...");
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf";
      input.onchange = async (e) => {
        console.log("File selected:", e.target.files[0]);
        try {
          const file = e.target.files[0];
          const storageService = new SupabaseStorageService();
          const filePath = await storageService.uploadPDF(file);
          const fileUrl = await storageService.getPDFUrl(filePath);
          const pdfInfo = await this.getPDFInfo(fileUrl);
          resolve(
            new Book({
              author: pdfInfo.author,
              totalPages: pdfInfo.totalPages,
              filePath: fileUrl,
              fileName: pdfInfo.title,
              title: file.name,
              currentPage: 1,
            })
          );
        } catch (error) {
          console.error("Error getting PDF info: ")
          resolve(null)
        }
      };
      input.click();
    });
  }

  static async getPDFInfo(filePath) {
    try {
      console.log("Getting PDF info for:", filePath);
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const info = {
        title: filePath.split("/").pop(),
        author: pdfDoc.getAuthor() || "Unknown",
        totalPages: pdfDoc.getPageCount(),
        filePath,
      };
      console.log("PDF info received:", info);
      return info;
    } catch (error) {
      console.error("Error reading PDF:", error);
      throw error;
    }
  }

  static async saveReadingProgress(filePath, currentPage) {
    try {
      console.log("Saving reading progress:", { filePath, currentPage });
      const progress = JSON.parse(
        localStorage.getItem("reading-progress") || "{}"
      );
      progress[filePath] = currentPage;
      localStorage.setItem("reading-progress", JSON.stringify(progress));
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
      throw error;
    }
  }

  static async getReadingProgress(filePath) {
    try {
      console.log("Getting reading progress for:", filePath);
      const progress = JSON.parse(
        localStorage.getItem("reading-progress") || "{}"
      );
      const result = progress[filePath] || 0;
      console.log("Reading progress:", result);
      return result;
    } catch (error) {
      console.error("Error reading progress:", error);
      return 0;
    }
  }
}
