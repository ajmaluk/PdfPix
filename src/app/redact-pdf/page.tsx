"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { PDFDocument, rgb } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

interface TextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function RedactPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [redactMode, setRedactMode] = useState<"manual" | "text">("manual");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const redact = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = pdf.getPages();
        if (redactMode === "manual") {
          for (const page of pages) {
            const { width, height } = page.getSize();
            page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0, 0, 0), opacity: 0.001 });
            page.drawRectangle({ x: 0, y: height / 2 - 15, width, height: 30, color: rgb(0, 0, 0) });
          }
        } else if (redactMode === "text" && searchText.trim()) {
          const keyword = searchText.trim().toLowerCase();
          const { getDocument } = await import("pdfjs-dist");
          const pdfData = await readFileAsArrayBuffer(entry.file);
          const doc = await getDocument({ data: pdfData.slice(0) }).promise;
          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            const viewport = page.getViewport({ scale: 1 });
            const pdfPage = pdf.getPage(i - 1);
            const items = textContent.items as any[];
            const fontSize = 11;
            for (const item of items) {
              const tx = item.transform;
              const itemText = (item.str || "").toLowerCase();
              if (itemText.includes(keyword)) {
                const x = tx[4];
                const y = viewport.height - tx[5] - (item.height || fontSize);
                const w = item.width || itemText.length * fontSize * 0.5;
                const h = item.height || fontSize;
                pdfPage.drawRectangle({ x, y, width: w + 4, height: h + 2, color: rgb(0, 0, 0) });
              }
            }
          }
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `redacted_${entry.name}`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to redact PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, searchText, redactMode]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Redact PDF</div>
      <div className="option__panel__content">
        <div className="info">Permanently remove sensitive information.</div>
        <div className="flex gap-2 mb-3">
          <button className={`btn btn--sm flex-1 ${redactMode === "manual" ? "btn--primary" : "btn--secondary"}`} onClick={() => setRedactMode("manual")}>Manual</button>
          <button className={`btn btn--sm flex-1 ${redactMode === "text" ? "btn--primary" : "btn--secondary"}`} onClick={() => setRedactMode("text")}>Search</button>
        </div>
        {redactMode === "text" && (
          <input type="text" className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm mb-2" placeholder="Enter text to redact..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        )}
        {files.length > 0 && <button className="btn btn--primary w-full mt-2" onClick={redact} disabled={processing}>{processing ? "Redacting..." : "Redact PDF!"}</button>}
      </div>
    </div>
  );

  return (
    <ToolLayout title="Redact PDF" subtitle="Permanently remove sensitive information from your PDF." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={redact} disabled={processing}>{processing ? "Redacting..." : "Redact PDF!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Redacting PDF..." />
    </ToolLayout>
  );
}
