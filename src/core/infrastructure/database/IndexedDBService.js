export class IndexedDBService {
  constructor() {
    this.dbName = "book-reader";
    this.dbVersion = 1;
    this.db = null;
  }

  async connect() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("books")) {
          const store = db.createObjectStore("books", { keyPath: "id" });
          store.createIndex("lastRead", "lastRead", { unique: false });
        }
      };
    });
  }

  async close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
