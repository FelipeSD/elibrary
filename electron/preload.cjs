const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectPDF: () => ipcRenderer.invoke("dialog:openFile"),
  getPDFInfo: (filePath) => ipcRenderer.invoke("pdf:get-info", filePath),
  saveProgress: (data) => ipcRenderer.invoke("pdf:save-progress", data),
  getProgress: (filePath) => ipcRenderer.invoke("pdf:get-progress", filePath),
  getBooks: () => ipcRenderer.invoke("books:get"),
  saveBooks: (books) => ipcRenderer.invoke("books:save", books),
});
