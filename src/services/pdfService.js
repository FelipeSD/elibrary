import { isElectron } from "../utils/environment";
import { WebPDFService } from "./webPDFService";
import { PDFDocument } from "pdf-lib";

export class ElectronPDFService {
  static async selectPDF() {
    if (isElectron()) {
      return await window.electronAPI.openFile();
    } else {
      // Implementação web usando input file
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            resolve(URL.createObjectURL(file));
          } else {
            resolve(null);
          }
        };
        input.click();
      });
    }
  }

  static async getPDFInfo(filePath) {
    if (isElectron()) {
      return await window.electronAPI.getPDFInfo(filePath);
    } else {
      // Implementação web
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      return {
        title:
          pdfDoc.getTitle() || filePath.split("/").pop().replace(".pdf", ""),
        author: pdfDoc.getAuthor() || "Unknown",
        totalPages: pdfDoc.getPageCount(),
      };
    }
  }

  static async saveProgress(filePath, currentPage) {
    if (isElectron()) {
      await window.electronAPI.saveProgress(filePath, currentPage);
    } else {
      // Implementação web usando localStorage
      const progress = JSON.parse(
        localStorage.getItem("reading-progress") || "{}"
      );
      progress[filePath] = currentPage;
      localStorage.setItem("reading-progress", JSON.stringify(progress));
    }
  }

  static async getProgress(filePath) {
    if (isElectron()) {
      return await window.electronAPI.getProgress(filePath);
    } else {
      // Implementação web usando localStorage
      const progress = JSON.parse(
        localStorage.getItem("reading-progress") || "{}"
      );
      return progress[filePath] || 0;
    }
  }
}

// Exporta a implementação apropriada baseada no ambiente
export const PDFService = isElectron() ? ElectronPDFService : WebPDFService;
