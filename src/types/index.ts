export interface Tool {
  id: string;
  title: string;
  description: string;
  category: "organize" | "optimize" | "convert" | "edit" | "security" | "intelligence" | "workflows";
  path: string;
  color: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  file: File;
}

export interface ProcessResult {
  blob: Blob;
  fileName: string;
}
