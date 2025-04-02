export class FileSelectorService {
  static selectFile(accept = ".pdf") {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          resolve(file);
        } else {
          reject(new Error("No file selected"));
        }
      };
      input.oncancel = (e) => {
        reject(new Error("No file selected"));
      };
      input.click();
    });
  }
}
