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

export default function RepairPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const repair = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResults([]);
    const rep: string[] = [];
    try {
      for (const entry of files) {
        const sizeKB = Math.round(entry.size / 1024);
        const buf = await readFileAsArrayBuffer(entry.file);
        try {
          const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
          const pageCount = pdf.getPageCount();
          const newBytes = await pdf.save({ useObjectStreams: false });
          const savedKB = Math.round(newBytes.length / 1024);
          const blob = new Blob([newBytes as BlobPart], { type: "application/pdf" });
          downloadBlob(blob, `repaired_${entry.name}`);
          rep.push(`${entry.name}: Rebuilt ${pageCount} page(s), ${sizeKB}KB → ${savedKB}KB - Success`);
        } catch {
          rep.push(`${entry.name}: Could not repair - file may be too damaged`);
        }
      }
      setResults(rep);
    } catch (err) {
      console.error("Repair failed:", err);
      alert("Failed to repair PDF. The file may be too damaged.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">Repair PDF</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Rebuild PDF Structure</label>
          <p className="text-[12px] text-[#555c66] font-medium leading-relaxed mb-3">
            Attempt to fix internal PDF tables, cross-reference offsets, and load structural nodes locally.
          </p>
          {results.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 whitespace-pre-wrap max-h-40 overflow-y-auto font-medium">
              {results.join("\n")}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Rebuild corrupted stream offsets", "Extract intact layout structures", "Maintains page data & links", "100% Secure local processing"].map((feature) => (
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
          onClick={repair} 
          disabled={files.length === 0 || processing} 
          className="btn-sidebar-cta"
          style={{ backgroundColor: "#8fbc5d" }}
        >
          <span>{processing ? "Repairing..." : "Repair PDF!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="repair" 
      title="Repair PDF" 
      subtitle="Repair damaged or corrupted PDF files." 
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
          onClick={repair} 
          disabled={processing}
          style={{ backgroundColor: "#8fbc5d" }}
        >
          <span>{processing ? "Repairing..." : "Repair PDF"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Repairing PDF..." />
    </ToolLayout>
  );
}
