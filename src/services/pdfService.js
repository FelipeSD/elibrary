export class PDFService {
  static async selectPDF() {
    return window.electronAPI.selectPDF();
  }

  static async getPDFInfo(filePath) {
    try {
      const pdf = await window.electronAPI.getPDFInfo(filePath);
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
      await window.electronAPI.saveProgress({ filePath, currentPage });
    } catch (error) {
      console.error("Error saving reading progress:", error);
      throw error;
    }
  }

  static async getReadingProgress(filePath) {
    try {
      return await window.electronAPI.getProgress(filePath);
    } catch (error) {
      console.error("Error getting reading progress:", error);
      return 0;
    }
  }
}
