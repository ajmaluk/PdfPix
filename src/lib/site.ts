import { tools } from "@/lib/tools";

export const SITE_NAME = "PdfPix";
export const SITE_URL = "https://pdfpix.uthakkan.in";
export const SITE_DESCRIPTION =
  "Free browser-based PDF tools to merge, split, compress, convert, edit, and secure PDF files without uploading them to a server.";
export const SITE_OG_IMAGE = `${SITE_URL}/img/pdfpix-icon-transparent.png`;

const staticPagePaths: Record<string, string> = {
  home: "/",
  about: "/about",
  contact: "/contact",
  pricing: "/pricing",
  privacy: "/privacy",
  terms: "/terms",
};

const toolPaths = Object.fromEntries(tools.map((tool) => [tool.id, tool.path]));

export function getPathForSeoId(id: string): string | undefined {
  return staticPagePaths[id] ?? toolPaths[id];
}

export function getCanonicalUrl(path = "/"): string {
  if (path === "/") {
    return `${SITE_URL}/`;
  }

  const normalizedPath = path.replace(/\/$/, "");
  return `${SITE_URL}${normalizedPath}/`;
}
