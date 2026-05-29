"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function AddWatermarkPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addWatermark = useCallback(async () => {
    if (files.length === 0 || !watermarkText) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);
        const pages = pdf.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, { x: width / 2 - 80, y: height / 2, size: 48, font, color: rgb(0.8, 0.8, 0.8), opacity: 0.3 });
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `watermarked_${entry.name}`);
      }
    } catch (err) {
      console.error("Watermark failed:", err);
      alert("Failed to add watermark. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, watermarkText]);

  const sidebarContent = (
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">Add Watermark</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Watermark Text</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:border-[#ab6993] focus:outline-none transition-all duration-200" 
            value={watermarkText} 
            onChange={(e) => setWatermarkText(e.target.value)} 
          />
        </div>

        {/* Features */}
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Custom text branding", "Centering and semi-transparent design", "High quality font rendering", "100% Secure local processing"].map((feature) => (
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
          onClick={addWatermark} 
          disabled={files.length === 0 || !watermarkText || processing} 
          className="btn-sidebar-cta"
          style={{ backgroundColor: "#ab6993" }}
        >
          <span>{processing ? "Adding..." : "Add Watermark!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="watermark" 
      title="Add Watermark" 
      subtitle="Add text or image watermark to your PDF files." 
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={sidebarContent}
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onAddFiles={addFiles} accept=".pdf" />
      
      {files.length > 0 && watermarkText && (
        <button 
          className="split-mobile-cta show--sm" 
          onClick={addWatermark} 
          disabled={processing}
          style={{ backgroundColor: "#ab6993" }}
        >
          <span>{processing ? "Adding..." : "Add Watermark"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Adding watermark..." />
    </ToolLayout>
  );
}
