import { createClient } from "@supabase/supabase-js";
import { IDatabaseService } from "./IDatabaseService";

export class SupabaseDatabaseService extends IDatabaseService {
  constructor(supabaseUrl, supabaseKey) {
    super();
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async connect() {
    // Supabase não precisa de conexão explícita
    return this.supabase;
  }

  async createTables() {
    // As tabelas são criadas no painel do Supabase
    // Aqui você pode adicionar lógica de migração se necessário
  }

  async getAll(table) {
    const { data, error } = await this.supabase
      .from(table)
      .select("*")
      .order("last_read", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getById(table, id) {
    const { data, error } = await this.supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async save(table, data) {
    const { data: savedData, error } = await this.supabase
      .from(table)
      .upsert(data, { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;
    return savedData;
  }

  async update(table, id, data) {
    const { data: updatedData, error } = await this.supabase
      .from(table)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updatedData;
  }

  async delete(table, id) {
    const { error } = await this.supabase.from(table).delete().eq("id", id);

    if (error) throw error;
  }

  async close() {
    // Supabase não precisa de fechamento explícito
  }
}
