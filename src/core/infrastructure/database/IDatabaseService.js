export class IDatabaseService {
  connect() {
    throw new Error("Method 'connect()' must be implemented");
  }

  getAll(table) {
    throw new Error("Method 'getAll()' must be implemented");
  }

  getById(table, id) {
    throw new Error("Method 'getById()' must be implemented");
  }

  save(table, data) {
    throw new Error("Method 'save()' must be implemented");
  }

  update(table, id, data) {
    throw new Error("Method 'update()' must be implemented");
  }

  delete(table, id) {
    throw new Error("Method 'delete()' must be implemented");
  }

  close() {
    throw new Error("Method 'close()' must be implemented");
  }
}
