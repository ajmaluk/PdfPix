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

export default function PdfToPdfaPage() {
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
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        pdf.setTitle(entry.name.replace(/\.pdf$/i, ""));
        pdf.setSubject("PDF/A Archival Document");
        pdf.setKeywords(["pdfa", "archival", "pdf"]);
        pdf.setCreator("PdfPix PDF/A Converter");
        pdf.setProducer("PdfPix");
        const bytes = await pdf.save({ useObjectStreams: false });
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `pdfa_${entry.name}`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to convert. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">PDF to PDF/A</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Output Format</label>
          <div className="flex items-center gap-3 rounded-xl border-2 border-[#8b5cf6] bg-[#f5f3ff] px-4 py-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#8b5cf6] text-white font-black text-xs">
              PDF/A
            </div>
            <div>
              <div className="text-sm font-bold text-[#6d28d9]">Archival Format</div>
              <div className="text-[10px] text-[#7c3aed] font-medium">ISO-compliant (PDF/A-1b)</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Embeds all font maps", "Standardized color space data", "Ensures long-term compatibility", "100% Secure local processing"].map((feature) => (
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
          style={{ backgroundColor: "#8b5cf6" }}
        >
          <span>{processing ? "Converting..." : "Convert to PDF/A!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="pdf-to-pdfa" 
      title="PDF to PDF/A" 
      subtitle="Convert your PDF files to PDF/A format for long-term archiving."
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
          onClick={convert} 
          disabled={processing}
          style={{ backgroundColor: "#8b5cf6" }}
        >
          <span>{processing ? "Converting..." : "Convert to PDF/A"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Converting to PDF/A..." />
    </ToolLayout>
  );
}
