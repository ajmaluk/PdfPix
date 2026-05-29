"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { PDFDocument, degrees } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function RotatePdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [rotation, setRotation] = useState(90);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const rotatePdf = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buffer = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pages = pdf.getPages();
        for (const page of pages) {
          const current = page.getRotation().angle;
          page.setRotation(degrees((current + rotation) % 360));
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `rotated_${entry.name}`);
      }
    } catch (err) {
      console.error("Rotate failed:", err);
      alert("Failed to rotate PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, rotation]);

  return (
    <ToolLayout toolId="rotate"
      title="Rotate PDF pages"
      subtitle="Rotate PDF pages by 90 degrees left or right."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={
        <div className="option__panel split-sidebar-panel">
          <div className="split-sidebar-panel__header">
            <div className="option__panel__title split-sidebar-panel__title text-center w-full">Rotate PDF</div>
          </div>

          <div className="option__panel__content split-sidebar-panel__content">
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Select Rotation Angle</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { deg: 90, label: "90° Right" },
                  { deg: 180, label: "180° Flip" },
                  { deg: 270, label: "90° Left" }
                ].map((opt) => (
                  <button 
                    key={opt.deg}
                    type="button"
                    className={`flex flex-col items-center rounded-xl border-2 px-2 py-3 text-xs font-bold transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${rotation === opt.deg ? "border-[#ab6993] bg-[#faf5f8] text-[#863d6b] shadow-[0_4px_12px_rgba(171,105,147,0.12)]" : "border-gray-200 bg-white text-[#555c66] hover:border-gray-300 hover:shadow-sm"}`}
                    onClick={() => setRotation(opt.deg)}
                  >
                    <span className="text-base font-black mb-1">{opt.deg}°</span>
                    <span className="text-[9px] font-medium opacity-65">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Features list */}
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
              <div className="space-y-2">
                {["Rotate all pages at once", "Select 90°, 180° or 270°", "Keeps document formatting", "100% Secure local processing"].map((feature) => (
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
              onClick={rotatePdf} 
              disabled={files.length === 0 || processing} 
              className="btn-sidebar-cta"
              style={{ backgroundColor: "#ab6993" }}
            >
              <span>{processing ? "Rotating..." : "Rotate PDF!"}</span>
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
          onClick={rotatePdf} 
          disabled={processing}
          style={{ backgroundColor: "#ab6993" }}
        >
          <span>{processing ? "Rotating..." : "Rotate PDF!"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}

      <ProcessOverlay isActive={processing} message="Rotating PDF pages..." />
    </ToolLayout>
  );
}
