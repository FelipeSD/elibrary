import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

if (typeof window !== "undefined" && window.URL) {
  // Patch para o método problemático
  if (!window.URL.parse) {
    window.URL.parse = function (url, base) {
      try {
        return new URL(url, base);
      } catch (e) {
        console.warn("URL parse error:", e);
        return null;
      }
    };
  }
}

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export class ThumbnailService {
  static async getThumbnail(pdfUrl, maxWidth = 200) {
    try {
      // Carregar o PDF com o worker configurado
      const scale = 3;

      const pdf = await getDocument({ url: pdfUrl }, { scale }).promise;
      const page = await pdf.getPage(1);

      // Criar um canvas para renderizar a página
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Renderizar a página no canvas
      await page.render({ canvasContext: context, viewport }).promise;

      // Redimensionar mantendo proporção
      const aspectRatio = canvas.width / canvas.height;
      const targetHeight = maxWidth / aspectRatio;

      // Criar um segundo canvas para redimensionamento
      const resizedCanvas = document.createElement("canvas");
      resizedCanvas.width = maxWidth;
      resizedCanvas.height = targetHeight;
      const resizedContext = resizedCanvas.getContext("2d");

      resizedContext.drawImage(canvas, 0, 0, maxWidth, targetHeight);

      // Converter o canvas para base64 (PNG)
      return resizedCanvas.toDataURL("image/webp");
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return null;
    }
  }
}
