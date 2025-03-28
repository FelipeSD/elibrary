import { createClient } from "@supabase/supabase-js";

function sanitizeFileName(fileName) {
  return fileName
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Substitui caracteres inválidos por "_"
    .replace(/_+/g, "_") // Evita múltiplos "_"
    .toLowerCase();
}

export class SupabaseStorageService {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadPDF(file) {
    const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const { data, error } = await this.supabase.storage
      .from("pdfs")
      .upload(fileName, file, { contentType: "application/pdf" });

    console.log("Data:", data);
    console.log("Error:", error);

    if (error) {
      console.error("Erro no upload:", error.message);
      return null;
    }

    return data.path;
  }

  async getPDFUrl(filePath) {
    const { data } = this.supabase.storage.from("pdfs").getPublicUrl(filePath);
    console.log(data);
    return data.publicUrl;
  }

  async deletePDF(filePath) {
    const { error } = await this.supabase.storage
      .from("pdfs")
      .remove([filePath]);

    if (error) {
      console.error("Erro ao deletar PDF:", error.message);
      return false;
    }

    return true;
  }
}
