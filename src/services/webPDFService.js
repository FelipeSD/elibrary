export class WebPDFService {
  static async selectPDF() {
    console.log("Selecting PDF in Web...");
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf";
      input.onchange = (e) => {
        const file = e.target.files[0];
        console.log("File selected:", file);
        if (file) {
          const fileUrl = URL.createObjectURL(file);
          console.log("Created file URL:", fileUrl);
          resolve(fileUrl);
        } else {
          resolve(null);
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
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

      const info = {
        title:
          pdfDoc.getTitle() || filePath.split("/").pop().replace(".pdf", ""),
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
