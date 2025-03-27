import { isElectron } from "../utils/environment";
import { ElectronPDFService } from "./electronPDFService";
import { WebPDFService } from "./webPDFService";

// Exporta a implementação apropriada baseada no ambiente
export const PDFService = isElectron() ? ElectronPDFService : WebPDFService;
