"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function ScanToPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f }))]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const entry of files) {
        const imgBytes = await entry.file.arrayBuffer();
        const ext = entry.name.split(".").pop()?.toLowerCase();
        let img;
        if (ext === "png") img = await pdfDoc.embedPng(imgBytes);
        else img = await pdfDoc.embedJpg(imgBytes);
        if (img) {
          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
      }
      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      downloadBlob(blob, "scanned.pdf");
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to create PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">Scan to PDF</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Document Scans</label>
          <p className="text-[12px] text-[#555c66] font-medium leading-relaxed">
            Upload pictures of document pages taken from your camera, then compile them into a print-ready PDF.
          </p>
        </div>

        {/* Features */}
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Arrange pages sequentially", "Supports standard image extensions", "Fits pages to image bounds", "100% In-browser processing"].map((feature) => (
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
          style={{ backgroundColor: "#ee6c4d" }}
        >
          <span>{processing ? "Creating..." : "Create PDF!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="scan" 
      title="Scan to PDF" 
      subtitle="Scan documents and convert them to PDF format." 
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={sidebarContent}
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept="image/*" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onAddFiles={addFiles} accept="image/*" onReorder={(from, to) => { setFiles((prev) => { const n = [...prev]; const [m] = n.splice(from, 1); n.splice(to, 0, m); return n; }); }} />
      
      {files.length > 0 && (
        <button 
          className="split-mobile-cta show--sm" 
          onClick={convert} 
          disabled={processing}
          style={{ backgroundColor: "#ee6c4d" }}
        >
          <span>{processing ? "Creating..." : "Create PDF"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Creating scanned PDF..." />
    </ToolLayout>
  );
}
