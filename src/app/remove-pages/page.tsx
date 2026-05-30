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

export default function RemovePagesPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pagesToRemove, setPagesToRemove] = useState("");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const removePages = useCallback(async () => {
    if (files.length === 0 || !pagesToRemove) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const totalPages = pdf.getPageCount();
        const toRemove = new Set(pagesToRemove.split(",").map((s) => parseInt(s.trim()) - 1).filter((n) => n >= 0 && n < totalPages));
        const newPdf = await PDFDocument.create();
        const indices = Array.from({ length: totalPages }, (_, i) => i).filter((i) => !toRemove.has(i));
        if (indices.length > 0) {
          const pages = await newPdf.copyPages(pdf, indices);
          pages.forEach((p) => newPdf.addPage(p));
        }
        const bytes = await newPdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `trimmed_${entry.name}`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to remove pages. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, pagesToRemove]);

  const sidebarContent = (
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">Remove Pages</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Page Numbers to Remove</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:border-[#ee6c4d] focus:outline-none transition-all duration-200" 
            placeholder="e.g. 1, 3, 5" 
            value={pagesToRemove} 
            onChange={(e) => setPagesToRemove(e.target.value)} 
          />
          <p className="text-[10px] text-[#8a8a92] mt-1.5 font-medium leading-relaxed">
            Separate pages by commas. E.g., &quot;1,3,5&quot; will delete pages 1, 3, and 5.
          </p>
        </div>

        {/* Features */}
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Delete arbitrary page lists", "Completely deletes page content", "Preserves other links & structure", "100% In-browser processing"].map((feature) => (
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
          onClick={removePages} 
          disabled={files.length === 0 || !pagesToRemove || processing} 
          className="btn-sidebar-cta"
          style={{ backgroundColor: "#ee6c4d" }}
        >
          <span>{processing ? "Removing..." : "Remove Pages!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="remove-pages" 
      title="Remove Pages" 
      subtitle="Remove pages from a PDF document easily." 
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={sidebarContent}
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onAddFiles={addFiles} accept=".pdf" />
      
      {files.length > 0 && pagesToRemove && (
        <button 
          className="split-mobile-cta show--sm" 
          onClick={removePages} 
          disabled={processing}
          style={{ backgroundColor: "#ee6c4d" }}
        >
          <span>{processing ? "Removing..." : "Remove Pages"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Removing pages..." />
    </ToolLayout>
  );
}
