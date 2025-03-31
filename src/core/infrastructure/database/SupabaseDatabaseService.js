import supabaseClient from "../supabaseClient";
import { IDatabaseService } from "./IDatabaseService";

export class SupabaseDatabaseService extends IDatabaseService {
  constructor() {
    super();
    this.supabase = supabaseClient;
  }

  async connect() {
    return this.supabase; // Supabase já está conectado
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
    return this.save(table, { ...data, id });
  }

  async delete(table, id) {
    const { error } = await this.supabase.from(table).delete().eq("id", id);

    if (error) throw error;
  }
}
