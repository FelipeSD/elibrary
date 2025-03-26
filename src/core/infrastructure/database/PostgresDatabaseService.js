import { Pool } from "pg";
import { IDatabaseService } from "./IDatabaseService";

export class PostgresDatabaseService extends IDatabaseService {
  constructor(connectionUri) {
    super();
    this.pool = new Pool({
      connectionString: connectionUri,
    });
    this.client = null;
  }

  async connect() {
    if (this.client) return this.client;

    this.client = await this.pool.connect();
    await this.createTables();
    return this.client;
  }

  async createTables() {
    const client = await this.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT,
        total_pages INTEGER,
        current_page INTEGER DEFAULT 0,
        last_read TIMESTAMP,
        file_path TEXT NOT NULL,
        thumbnail TEXT
      )
    `);
  }

  async getAll(table) {
    const client = await this.connect();
    const result = await client.query(
      `SELECT * FROM ${table} ORDER BY last_read DESC`
    );
    return result.rows;
  }

  async getById(table, id) {
    const client = await this.connect();
    const result = await client.query(`SELECT * FROM ${table} WHERE id = $1`, [
      id,
    ]);
    return result.rows[0] || null;
  }

  async save(table, data) {
    const client = await this.connect();
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${placeholders})
      ON CONFLICT (id) DO UPDATE SET
      ${columns.map((col) => `${col} = EXCLUDED.${col}`).join(", ")}
      RETURNING *
    `;

    const result = await client.query(query, values);
    return result.rows[0];
  }

  async update(table, id, data) {
    const client = await this.connect();
    const columns = Object.keys(data);
    const values = [...Object.values(data), id];
    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");

    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await client.query(query, values);
    return result.rows[0];
  }

  async delete(table, id) {
    const client = await this.connect();
    await client.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  }

  async close() {
    if (this.client) {
      await this.client.release();
      this.client = null;
    }
    await this.pool.end();
  }
}
