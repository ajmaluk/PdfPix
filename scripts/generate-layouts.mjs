import fs from "fs";
import path from "path";

const pathToIdMap = {
  // Tools
  "add-page-numbers": "page-numbers",
  "add-watermark": "watermark",
  "compare-pdf": "compare",
  "compress-pdf": "compress",
  "crop-pdf": "crop",
  "edit-pdf": "edit",
  "excel-to-pdf": "excel-to-pdf",
  "html-to-pdf": "html-to-pdf",
  "jpg-to-pdf": "jpg-to-pdf",
  "merge-pdf": "merge",
  "ocr-pdf": "ocr",
  "organize-pdf": "organize",
  "pdf-forms": "forms",
  "pdf-summarize": "summarize",
  "pdf-to-excel": "pdf-to-excel",
  "pdf-to-jpg": "pdf-to-jpg",
  "pdf-to-pdfa": "pdf-to-pdfa",
  "pdf-to-powerpoint": "pdf-to-ppt",
  "pdf-to-word": "pdf-to-word",
  "powerpoint-to-pdf": "ppt-to-pdf",
  "protect-pdf": "protect",
  "redact-pdf": "redact",
  "remove-pages": "remove-pages",
  "repair-pdf": "repair",
  "rotate-pdf": "rotate",
  "scan-to-pdf": "scan",
  "sign-pdf": "sign",
  "split-pdf": "split",
  "translate-pdf": "translate",
  "unlock-pdf": "unlock",
  "word-to-pdf": "word-to-pdf",

  // General pages
  "about": "about",
  "contact": "contact",
  "pricing": "pricing",
  "privacy": "privacy",
  "terms": "terms"
};

const srcAppDir = path.resolve("src/app");

for (const [folderName, toolId] of Object.entries(pathToIdMap)) {
  const folderPath = path.join(srcAppDir, folderName);
  if (!fs.existsSync(folderPath)) {
    console.warn(`[Warning] Folder not found: ${folderPath}`);
    continue;
  }

  const layoutPath = path.join(folderPath, "layout.tsx");
  
  const layoutContent = `import type { Metadata } from "next";
import { getMetadataForTool } from "@/lib/seo-data";

export const metadata: Metadata = getMetadataForTool("${toolId}");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;

  fs.writeFileSync(layoutPath, layoutContent, "utf-8");
  console.log(`[Created/Updated Layout] ${folderName}/layout.tsx`);
}

console.log("Done generating all layouts!");
