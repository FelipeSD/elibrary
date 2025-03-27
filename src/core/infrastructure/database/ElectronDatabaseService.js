import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

export class ElectronDatabaseService {
  constructor() {
    this.dbPath = path.join(app.getPath("userData"), "books.db");
    this.db = null;
  }

  connect() {
    if (this.db) return this.db;

    this.db = new Database(this.dbPath);
    this.createTables();
    return this.db;
  }

  createTables() {
    const db = this.connect();
    db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT,
        totalPages INTEGER,
        currentPage INTEGER DEFAULT 1,
        lastRead INTEGER,
        filePath TEXT NOT NULL,
        thumbnail TEXT
      )
    `);
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
