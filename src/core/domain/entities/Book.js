export class Book {
  constructor({
    id,
    title,
    author,
    totalPages,
    currentPage = 0,
    lastRead = Date.now(),
    filePath,
  }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.lastRead = lastRead;
    this.filePath = filePath;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      totalPages: this.totalPages,
      currentPage: this.currentPage,
      lastRead: this.lastRead,
      filePath: this.filePath,
    };
  }

  static fromJSON(json) {
    return new Book(json);
  }
}
