import { PDFDocument } from "pdf-lib";

export class PDFService {
  static async getPDFInfo(fileUrl) {
    try {
      console.log("Getting PDF info for:", fileUrl);
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const info = {
        title: fileUrl.split("/").pop(),
        author: pdfDoc.getAuthor() || "Unknown",
        totalPages: pdfDoc.getPageCount(),
      };
      console.log("PDF info received:", info);
      return info;
    } catch (error) {
      console.error("Error reading PDF:", error);
      throw error;
    }
  }
}
