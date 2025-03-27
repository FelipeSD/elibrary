interface Window {
  electronAPI: {
    readFile: (filePath: string) => Promise<ArrayBuffer>;
    openFile: () => Promise<string | null>;
    getPDFInfo: (filePath: string) => Promise<{
      title: string;
      author: string;
      totalPages: number;
    }>;
    saveProgress: (filePath: string, currentPage: number) => Promise<void>;
    getProgress: (filePath: string) => Promise<number>;
    getBooks: () => Promise<any[]>;
    saveBooks: (books: any[]) => Promise<void>;
  };
}
