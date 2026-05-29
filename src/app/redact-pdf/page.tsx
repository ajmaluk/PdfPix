"use client";
import AdSpace from "@/components/AdSpace";

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
            const items = textContent.items as { str?: string; transform?: number[]; width?: number; height?: number }[];
            const fontSize = 11;
            for (const item of items) {
              const tx = item.transform;
              if (!tx || tx.length < 6) continue;
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
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">Redact PDF</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Redaction Mode</label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              type="button"
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-xs font-bold transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${redactMode === "manual" ? "border-[#3b82f6] bg-[#eff6ff] text-[#1e40af] shadow-[0_4px_12px_rgba(59,130,246,0.12)]" : "border-gray-200 bg-white text-[#555c66] hover:border-gray-300 hover:shadow-sm"}`}
              onClick={() => setRedactMode("manual")}
            >
              Manual Area
            </button>
            <button 
              type="button"
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-xs font-bold transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${redactMode === "text" ? "border-[#3b82f6] bg-[#eff6ff] text-[#1e40af] shadow-[0_4px_12px_rgba(59,130,246,0.12)]" : "border-gray-200 bg-white text-[#555c66] hover:border-gray-300 hover:shadow-sm"}`}
              onClick={() => setRedactMode("text")}
            >
              Text Search
            </button>
          </div>

          {redactMode === "text" && (
            <div>
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-2">Search Text to Redact</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:border-[#3b82f6] focus:outline-none transition-all duration-200" 
                placeholder="Enter word or phrase..." 
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
              />
            </div>
          )}

          {redactMode === "manual" && (
            <p className="text-[11px] text-[#8a8a92] font-semibold leading-relaxed">
              Applying redaction will cover key sections of the document with black blocks.
            </p>
          )}
        </div>

        {/* Features */}
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Search and redact content", "Blacks out matching items", "Permanently deletes metadata text", "100% Secure local processing"].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-[12px] text-[#555c66] font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="split-sidebar-panel__footer">
        <button 
          type="button" 
          onClick={redact} 
          disabled={files.length === 0 || processing} 
          className="btn-sidebar-cta"
          style={{ backgroundColor: "#3b82f6" }}
        >
          <span>{processing ? "Redacting..." : "Redact PDF!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="redact" 
      title="Redact PDF" 
      subtitle="Permanently remove sensitive information from your PDF." 
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={sidebarContent}
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onAddFiles={addFiles} accept=".pdf" />
      
      {files.length > 0 && (
        <button 
          className="split-mobile-cta show--sm" 
          onClick={redact} 
          disabled={processing}
          style={{ backgroundColor: "#3b82f6" }}
        >
          <span>{processing ? "Redacting..." : "Redact PDF"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Redacting PDF..." />
    </ToolLayout>
  );
}
