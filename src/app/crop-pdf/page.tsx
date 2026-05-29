"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function CropPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [margins, setMargins] = useState({ top: 20, bottom: 20, left: 20, right: 20 });

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const crop = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = pdf.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          page.setMediaBox(margins.left, margins.bottom, width - margins.left - margins.right, height - margins.top - margins.bottom);
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `cropped_${entry.name}`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to crop PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, margins]);

  const sidebarContent = (
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">Crop PDF</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Crop Margins (points)</label>
          <div className="grid grid-cols-2 gap-3">
            {["top", "bottom", "left", "right"].map((side) => (
              <div key={side} className="flex flex-col">
                <label className="text-[10px] font-bold text-[#8a8a92] mb-1 capitalize">{side}</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ab6993] focus:outline-none transition-all duration-200" 
                  value={margins[side as keyof typeof margins]} 
                  onChange={(e) => setMargins({ ...margins, [side]: parseInt(e.target.value) || 0 })} 
                  min={0} 
                  max={200} 
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#8a8a92] mt-2 font-medium leading-relaxed">
            Adjust the points to crop inward from each edge of the page boundaries.
          </p>
        </div>

        {/* Features */}
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Custom page margins", "Applies to all pages", "Maintains original graphics", "100% Secure local processing"].map((feature) => (
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
          onClick={crop} 
          disabled={files.length === 0 || processing} 
          className="btn-sidebar-cta"
          style={{ backgroundColor: "#ab6993" }}
        >
          <span>{processing ? "Cropping..." : "Crop PDF!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="crop" 
      title="Crop PDF" 
      subtitle="Crop pages in your PDF to get the perfect margins." 
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
          onClick={crop} 
          disabled={processing}
          style={{ backgroundColor: "#ab6993" }}
        >
          <span>{processing ? "Cropping..." : "Crop PDF"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Cropping PDF..." />
    </ToolLayout>
  );
}
