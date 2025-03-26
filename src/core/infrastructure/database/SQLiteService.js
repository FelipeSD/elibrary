import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { app } from "electron";

export class SQLiteService {
  constructor() {
    this.dbPath = path.join(app.getPath("userData"), "books.db");
    this.db = null;
  }

  async connect() {
    if (this.db) return this.db;

    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database,
    });

    await this.createTables();
    return this.db;
  }

  async createTables() {
    const db = await this.connect();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT,
        totalPages INTEGER,
        currentPage INTEGER DEFAULT 0,
        lastRead INTEGER,
        filePath TEXT NOT NULL
      )
    `);
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}
