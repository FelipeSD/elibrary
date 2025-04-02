import { SupabaseStorageService } from "../core/infrastructure/storage/SupabaseStorageService";

export class StorageService {
  constructor() {
    this.storageService = new SupabaseStorageService();
  }

  async uploadFile(file) {
    return await this.storageService.uploadPDF(file);
  }

  async getFileUrl(filePath) {
    return this.storageService.getPDFUrl(filePath);
  }
}
