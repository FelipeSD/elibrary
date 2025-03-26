import { isElectron } from "../utils/environment";
import { WebPDFService } from "./webPDFService";

class ElectronPDFService {
  static async selectPDF() {
    console.log("Selecting PDF in Electron...");
    const result = await window.electronAPI.selectPDF();
    console.log("PDF selected:", result);
    return result;
  }

  static async getPDFInfo(filePath) {
    try {
      console.log("Getting PDF info for:", filePath);
      const pdf = await window.electronAPI.getPDFInfo(filePath);
      console.log("PDF info received:", pdf);
      return {
        title: pdf.title || filePath.split("/").pop().replace(".pdf", ""),
        author: pdf.author || "Unknown",
        totalPages: pdf.totalPages,
        filePath,
      };
    } catch (error) {
      console.error("Error getting PDF info:", error);
      throw error;
    }
  }

  static async saveReadingProgress(filePath, currentPage) {
    try {
      console.log("Saving reading progress:", { filePath, currentPage });
      await window.electronAPI.saveProgress({ filePath, currentPage });
    } catch (error) {
      console.error("Error saving reading progress:", error);
      throw error;
    }
  }

  static async getReadingProgress(filePath) {
    try {
      console.log("Getting reading progress for:", filePath);
      const progress = await window.electronAPI.getProgress(filePath);
      console.log("Reading progress:", progress);
      return progress;
    } catch (error) {
      console.error("Error getting reading progress:", error);
      return 0;
    }
  }
}

// Exporta a implementação apropriada baseada no ambiente
export const PDFService = isElectron() ? ElectronPDFService : WebPDFService;
