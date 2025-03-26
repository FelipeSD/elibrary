require('dotenv').config();
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const { PDFDocument } = require("pdf-lib");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
  });

  // Em desenvolvimento, carrega o servidor de desenvolvimento
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    // Em produção, carrega o arquivo HTML construído
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }
}

// Manipuladores IPC
ipcMain.handle("dialog:openFile", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "PDF Files", extensions: ["pdf"] }],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("pdf:get-info", async (event, filePath) => {
  try {
    const pdfBytes = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    return {
      title: pdfDoc.getTitle() || path.basename(filePath, ".pdf"),
      author: pdfDoc.getAuthor() || "Unknown",
      totalPages: pdfDoc.getPageCount(),
    };
  } catch (error) {
    console.error("Error reading PDF:", error);
    throw error;
  }
});

ipcMain.handle(
  "pdf:save-progress",
  async (event, { filePath, currentPage }) => {
    try {
      const progressPath = path.join(
        app.getPath("userData"),
        "reading-progress.json"
      );
      let progress = {};

      try {
        const data = await fs.readFile(progressPath, "utf-8");
        progress = JSON.parse(data);
      } catch (error) {
        // Arquivo não existe ou está vazio, começa com objeto vazio
      }

      progress[filePath] = currentPage;
      await fs.writeFile(progressPath, JSON.stringify(progress, null, 2));
    } catch (error) {
      console.error("Error saving progress:", error);
      throw error;
    }
  }
);

ipcMain.handle("pdf:get-progress", async (event, filePath) => {
  try {
    const progressPath = path.join(
      app.getPath("userData"),
      "reading-progress.json"
    );

    try {
      const data = await fs.readFile(progressPath, "utf-8");
      const progress = JSON.parse(data);
      return progress[filePath] || 0;
    } catch (error) {
      return 0;
    }
  } catch (error) {
    console.error("Error reading progress:", error);
    return 0;
  }
});

// Novos handlers para gerenciar os livros
ipcMain.handle("books:get", async () => {
  try {
    const booksPath = path.join(app.getPath("userData"), "books.json");
    try {
      const data = await fs.readFile(booksPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  } catch (error) {
    console.error("Error getting books:", error);
    return [];
  }
});

ipcMain.handle("books:save", async (event, books) => {
  try {
    const booksPath = path.join(app.getPath("userData"), "books.json");
    await fs.writeFile(booksPath, JSON.stringify(books, null, 2));
  } catch (error) {
    console.error("Error saving books:", error);
    throw error;
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
