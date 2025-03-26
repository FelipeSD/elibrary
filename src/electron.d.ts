interface Window {
  electronAPI: {
    selectPDF: () => Promise<string | null>;
    getPDFInfo: (
      filePath: string
    ) => Promise<{ title: string; author: string; totalPages: number }>;
    saveProgress: (data: {
      filePath: string;
      currentPage: number;
    }) => Promise<void>;
    getProgress: (filePath: string) => Promise<number>;
  };
}
