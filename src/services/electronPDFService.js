import { IPDFService } from "./IPDFService";

export class ElectronPDFService extends IPDFService {
  static async selectPDF() {
    return await window.electronAPI.openFile();
  }

  static async getPDFInfo(filePath) {
    return await window.electronAPI.getPDFInfo(filePath);
  }

  static async saveProgress(filePath, currentPage) {
    await window.electronAPI.saveProgress(filePath, currentPage);
  }

  static async getProgress(filePath) {
    return await window.electronAPI.getProgress(filePath);
  }
}
