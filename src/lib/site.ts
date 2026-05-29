import { tools } from "@/lib/tools";
import type { Tool } from "@/types";

export const SITE_NAME = "PdfPix";
export const SITE_URL = "https://pdfpix.uthakkan.in";
export const SITE_DESCRIPTION =
  "Free browser-based PDF tools to merge, split, compress, convert, edit, and secure PDF files without uploading them to a server.";
export const SITE_OG_IMAGE = `${SITE_URL}/img/pdfpix-icon-transparent.png`;
export const SUPPORT_EMAIL = "support@pdfpix.com";

const staticPagePaths: Record<string, string> = {
  home: "/",
  about: "/about",
  contact: "/contact",
  pricing: "/pricing",
  privacy: "/privacy",
  terms: "/terms",
};

const toolPaths = Object.fromEntries(tools.map((tool) => [tool.id, tool.path]));
const pathToTool = Object.fromEntries(tools.map((tool) => [tool.path, tool]));
const seoIdToPath: Record<string, string> = {
  merge: "/merge-pdf",
  split: "/split-pdf",
  compress: "/compress-pdf",
  "pdf-to-word": "/pdf-to-word",
  "pdf-to-ppt": "/pdf-to-powerpoint",
  "pdf-to-excel": "/pdf-to-excel",
  "word-to-pdf": "/word-to-pdf",
  "ppt-to-pdf": "/powerpoint-to-pdf",
  "excel-to-pdf": "/excel-to-pdf",
  "pdf-to-jpg": "/pdf-to-jpg",
  "jpg-to-pdf": "/jpg-to-pdf",
  "png-to-pdf": "/png-to-pdf",
  "image-to-pdf": "/image-to-pdf",
  rotate: "/rotate-pdf",
  edit: "/edit-pdf",
  "remove-pages": "/remove-pages",
  watermark: "/add-watermark",
  "page-numbers": "/add-page-numbers",
  unlock: "/unlock-pdf",
  protect: "/protect-pdf",
  organize: "/organize-pdf",
  crop: "/crop-pdf",
  sign: "/sign-pdf",
  repair: "/repair-pdf",
  "html-to-pdf": "/html-to-pdf",
  "pdf-to-pdfa": "/pdf-to-pdfa",
  redact: "/redact-pdf",
  compare: "/compare-pdf",
  scan: "/scan-to-pdf",
  ocr: "/ocr-pdf",
  summarize: "/pdf-summarize",
  translate: "/translate-pdf",
  forms: "/pdf-forms",
};
const categoryLabels: Record<Tool["category"], string> = {
  organize: "Organize PDF",
  optimize: "Optimize PDF",
  convert: "Convert PDF",
  edit: "Edit PDF",
  security: "PDF Security",
  intelligence: "PDF Intelligence",
  workflows: "PDF Workflows",
};

export function getPathForSeoId(id: string): string | undefined {
  return staticPagePaths[id] ?? seoIdToPath[id] ?? toolPaths[id];
}

export function getCanonicalUrl(path = "/"): string {
  if (path === "/") {
    return `${SITE_URL}/`;
  }

  const normalizedPath = path.replace(/\/$/, "");
  return `${SITE_URL}${normalizedPath}/`;
}

export function getToolForSeoId(id: string): Tool | undefined {
  const path = getPathForSeoId(id);
  return path ? pathToTool[path] : undefined;
}

export function getCategoryLabel(category: Tool["category"]): string {
  return categoryLabels[category];
}

export function getRelatedTools(id: string, limit = 4): Tool[] {
  const currentTool = getToolForSeoId(id);
  if (!currentTool) return [];

  const sameCategory = tools.filter(
    (tool) => tool.id !== currentTool.id && tool.category === currentTool.category
  );
  const fallback = tools.filter(
    (tool) => tool.id !== currentTool.id && tool.category !== currentTool.category
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}
