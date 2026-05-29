"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function PdfToJpgPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.95));
          if (blob) {
            downloadBlob(blob, `${entry.name.replace(/\.pdf$/i, "")}_page_${i}.jpg`);
          }
        }
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Failed to convert PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <ToolLayout toolId="pdf-to-jpg"
      title="PDF to JPG"
      subtitle="Convert each PDF page into a JPG or extract all images contained in a PDF."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={
        <div className="option__panel split-sidebar-panel">
          <div className="split-sidebar-panel__header">
            <div className="option__panel__title split-sidebar-panel__title text-center w-full">PDF to JPG</div>
          </div>

          <div className="option__panel__content split-sidebar-panel__content">
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Conversion settings</label>
              <div className="text-xs text-[#555c66] font-medium leading-relaxed">
                Every page of the PDF will be converted to a high-quality JPEG image.
              </div>
            </div>

            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
              <div className="space-y-2">
                {["High fidelity rendering", "Downloads ZIP or separate JPEGs", "Optimized file sizes", "Completely client-side conversion"].map((feature) => (
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
              onClick={convert} 
              disabled={files.length === 0 || processing} 
              className="btn-sidebar-cta"
              style={{ backgroundColor: "#d6bf2d" }}
            >
              <span>{processing ? "Converting..." : "Convert to JPG!"}</span>
              <span className="btn-sidebar-cta__icon">→</span>
            </button>
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onAddFiles={addFiles} accept=".pdf" />
      
      {files.length > 0 && (
        <button 
          className="split-mobile-cta show--sm" 
          onClick={convert} 
          disabled={processing}
          style={{ backgroundColor: "#d6bf2d" }}
        >
          <span>{processing ? "Converting..." : "Convert to JPG"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Converting PDF to JPG..." />
    </ToolLayout>
  );
}
