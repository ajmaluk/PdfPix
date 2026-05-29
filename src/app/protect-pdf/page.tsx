"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { encryptPDF } from "@/lib/pdf-crypto";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function ProtectPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState("");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const protectPdf = useCallback(async () => {
    if (files.length === 0 || !password) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buffer = await readFileAsArrayBuffer(entry.file);
        const blob = await encryptPDF(buffer, password);
        downloadBlob(blob, `protected_${entry.name.replace(/\.pdf$/i, ".pdfx")}`);
      }
    } catch (err) {
      console.error("Protect failed:", err);
      alert("Failed to protect PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, password]);

  return (
    <ToolLayout toolId="protect"
      title="Protect PDF files"
      subtitle="Add password protection to your PDF files."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={
        <div className="option__panel split-sidebar-panel">
          <div className="split-sidebar-panel__header">
            <div className="option__panel__title split-sidebar-panel__title text-center w-full">Protect PDF</div>
          </div>

          <div className="option__panel__content split-sidebar-panel__content">
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Encryption Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:border-[#3b82f6] focus:outline-none transition-all duration-200"
                placeholder="Enter strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[10px] text-[#8a8a92] mt-1.5 font-medium leading-relaxed">
                Choose a strong password to lock this document. This password will be required to open it.
              </p>
            </div>

            {/* Features */}
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
              <div className="space-y-2">
                {["Strong user password locking", "Restricts editing, copying, and reading", "Saves to secure PDFX format", "100% Secure local processing"].map((feature) => (
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
              onClick={protectPdf} 
              disabled={files.length === 0 || !password || processing} 
              className="btn-sidebar-cta"
              style={{ backgroundColor: "#3b82f6" }}
            >
              <span>{processing ? "Protecting..." : "Protect PDF!"}</span>
              <span className="btn-sidebar-cta__icon">→</span>
            </button>
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onAddFiles={addFiles} accept=".pdf" />
      
      {files.length > 0 && password && (
        <button 
          className="split-mobile-cta show--sm" 
          onClick={protectPdf} 
          disabled={processing || !password}
          style={{ backgroundColor: "#3b82f6" }}
        >
          <span>{processing ? "Protecting..." : "Protect PDF"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Protecting PDF..." />
    </ToolLayout>
  );
}
