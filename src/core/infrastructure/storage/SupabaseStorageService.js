import { createClient } from "@supabase/supabase-js";

function sanitizeFileName(fileName) {
  return fileName
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Substitui caracteres inválidos por "_"
    .replace(/_+/g, "_") // Evita múltiplos "_"
    .toLowerCase();
}

const BUCKET = "pdfs"
export class SupabaseStorageService {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadPDF(file) {
    const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: "application/pdf" });

    if (error) {
      console.error("Erro no upload:", error.message);
      return null;
    }

    return data.path;
  }

  async getPDFUrl(filePath) {
    const { data } = this.supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async deletePDF(fileName) {
    const { error } = await this.supabase.storage
      .from(BUCKET)
      .remove([fileName]);

    if (error) {
      console.error("Erro ao deletar PDF:", error.message);
      return false;
    }

    return true;
  }
}
