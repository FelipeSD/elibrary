const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs/promises");

contextBridge.exposeInMainWorld("electronAPI", {
  readFile: async (filePath) => {
    return await fs.readFile(filePath);
  },
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  getPDFInfo: (filePath) => ipcRenderer.invoke("pdf:get-info", filePath),
  saveProgress: (filePath, currentPage) =>
    ipcRenderer.invoke("pdf:save-progress", { filePath, currentPage }),
  getProgress: (filePath) => ipcRenderer.invoke("pdf:get-progress", filePath),
  getBooks: () => ipcRenderer.invoke("books:get"),
  saveBooks: (books) => ipcRenderer.invoke("books:save", books),
  servePDF: (filePath) => ipcRenderer.invoke("pdf:serve", filePath),
});
