export class WebDatabaseService {
  constructor() {
    this.storageKey = "books_db";
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  connect() {
    return this;
  }

  getAll() {
    return JSON.parse(localStorage.getItem(this.storageKey) || "[]");
  }

  getById(id) {
    const items = this.getAll();
    return items.find((item) => item.id === id);
  }

  save(item) {
    const items = this.getAll();
    const index = items.findIndex((i) => i.id === item.id);

    if (index === -1) {
      items.push(item);
    } else {
      items[index] = item;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return item;
  }

  delete(id) {
    const items = this.getAll();
    const filteredItems = items.filter((item) => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
  }

  close() {
    // No-op for web storage
  }
}
