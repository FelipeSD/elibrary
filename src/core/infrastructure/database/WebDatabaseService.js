import { IDatabaseService } from "./IDatabaseService";

export class WebDatabaseService extends IDatabaseService {
  constructor() {
    super();
    this.storageKeyPrefix = "db_";
  }

  getTableKey(table) {
    return `${this.storageKeyPrefix}${table}`;
  }

  connect() {
    return this;
  }

  getAll(table) {
    return JSON.parse(localStorage.getItem(this.getTableKey(table)) || "[]");
  }

  getById(table, id) {
    const items = this.getAll(table);
    return items.find((item) => item.id === id) || null;
  }

  save(table, item) {
    const items = this.getAll(table);
    const index = items.findIndex((i) => i.id === item.id);

    if (index === -1) {
      items.push(item);
    } else {
      items[index] = item;
    }

    localStorage.setItem(this.getTableKey(table), JSON.stringify(items));
    return item;
  }

  update(table, id, data) {
    return this.save(table, { ...data, id });
  }

  delete(table, id) {
    const items = this.getAll(table).filter((item) => item.id !== id);
    localStorage.setItem(this.getTableKey(table), JSON.stringify(items));
  }

  close() {
    // No-op for web storage
  }
}
