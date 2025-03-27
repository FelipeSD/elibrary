export class Book {
  constructor({
    id,
    title,
    author,
    totalPages,
    currentPage = 1,
    lastRead = new Date().toISOString(),
    filePath,
    thumbnail = null,
  }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.lastRead = lastRead;
    this.filePath = filePath;
    this.thumbnail = thumbnail;
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
      thumbnail: this.thumbnail,
    };
  }

  static fromJSON(json) {
    return new Book(json);
  }
}
