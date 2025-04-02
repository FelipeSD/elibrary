import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

if (typeof window !== "undefined" && window.URL) {
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

export async function PDFToImage(pdfUrl, pageNumber = 1, maxWidth = 200) {
  try {
    const scale = 1;

    const pdf = await getDocument({ url: pdfUrl }, { scale }).promise;
    const page = await pdf.getPage(pageNumber);

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

    return resizedCanvas.toDataURL("image/webp");
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
