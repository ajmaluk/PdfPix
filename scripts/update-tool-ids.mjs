import fs from "fs";
import path from "path";

const pathToIdMap = {
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
  "word-to-pdf": "word-to-pdf"
};

const srcAppDir = path.resolve("src/app");

for (const [folderName, toolId] of Object.entries(pathToIdMap)) {
  const pagePath = path.join(srcAppDir, folderName, "page.tsx");
  if (!fs.existsSync(pagePath)) {
    console.error(`File not found: ${pagePath}`);
    continue;
  }

  let content = fs.readFileSync(pagePath, "utf-8");
  
  if (content.includes("toolId=")) {
    console.log(`[Skipped] ${folderName} already has toolId`);
    continue;
  }

  if (content.includes("<ToolLayout")) {
    content = content.replace("<ToolLayout", `<ToolLayout toolId="${toolId}"`);
    fs.writeFileSync(pagePath, content, "utf-8");
    console.log(`[Updated] ${folderName} set toolId to ${toolId}`);
  } else {
    console.warn(`[Warning] No <ToolLayout found in ${folderName}/page.tsx`);
  }
}

console.log("Done updating tool IDs!");
