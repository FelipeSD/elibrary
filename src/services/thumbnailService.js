import { PDFDocument } from "pdf-lib";
import { isElectron } from "../utils/environment";

export class ThumbnailService {
  static async generateThumbnail(pdfBytes, maxWidth = 200) {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const firstPage = pdfDoc.getPage(0);

      // Calculate dimensions maintaining aspect ratio
      const { width, height } = firstPage.getSize();
      const aspectRatio = width / height;
      const maxHeight = maxWidth / aspectRatio;

      // Create a new PDF with just the first page
      const thumbnailDoc = await PDFDocument.create();
      const [copiedPage] = await thumbnailDoc.copyPages(pdfDoc, [0]);
      thumbnailDoc.addPage([maxWidth, maxHeight]);

      // Draw the page scaled to fit
      const thumbnailPage = thumbnailDoc.getPage(0);
      thumbnailPage.drawPage(copiedPage, {
        x: 0,
        y: 0,
        width: maxWidth,
        height: maxHeight,
      });

      // Convert to base64
      const thumbnailBytes = await thumbnailDoc.save();
      const base64 = Buffer.from(thumbnailBytes).toString("base64");
      return `data:application/pdf;base64,${base64}`;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return null;
    }
  }

  static async getThumbnail(filePath) {
    try {
      if (isElectron()) {
        const pdfBytes = await window.electronAPI.readFile(filePath);
        return await this.generateThumbnail(pdfBytes);
      } else {
        // Na web, faça o fetch do arquivo
        const response = await fetch(filePath);
        const pdfBytes = await response.arrayBuffer();
        return await this.generateThumbnail(pdfBytes);
      }
    } catch (error) {
      console.error("Error getting thumbnail:", error);
      return null;
    }
  }
}
