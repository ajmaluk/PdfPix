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

export default function UnlockPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState("");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const unlockPdf = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const isPdfx = entry.name.toLowerCase().endsWith(".pdfx");
        if (isPdfx) {
          if (!password) {
            alert("Password is required to unlock .pdfx encrypted files.");
            setProcessing(false);
            return;
          }
          const { decryptPDF } = await import("@/lib/pdf-crypto");
          const buffer = await readFileAsArrayBuffer(entry.file);
          const decrypted = await decryptPDF(buffer, password);
          const blob = new Blob([decrypted as BlobPart], { type: "application/pdf" });
          downloadBlob(blob, `${entry.name.replace(/\.pdfx$/i, "")}_unlocked.pdf`);
        } else {
          const buffer = await readFileAsArrayBuffer(entry.file);
          const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
          const bytes = await pdf.save();
          const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
          downloadBlob(blob, `unlocked_${entry.name}`);
        }
      }
    } catch (err) {
      console.error("Unlock failed:", err);
      alert("Failed to unlock PDF. The file may not be password protected or the password is incorrect.");
    } finally {
      setProcessing(false);
    }
  }, [files, password]);

  return (
    <ToolLayout toolId="unlock"
      title="Unlock PDF files"
      subtitle="Remove PDF password protection to unlock your PDF files."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={
        <div className="option__panel split-sidebar-panel">
          <div className="split-sidebar-panel__header">
            <div className="option__panel__title split-sidebar-panel__title text-center w-full">Unlock PDF</div>
          </div>

          <div className="option__panel__content split-sidebar-panel__content">
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Decryption Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:border-[#3b82f6] focus:outline-none transition-all duration-200"
                placeholder="Enter password if encrypted"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[10px] text-[#8a8a92] mt-1.5 font-medium leading-relaxed">
                Provide the owner or user password required to unlock and decrypt the file content.
              </p>
            </div>

            {/* Features */}
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
              <div className="space-y-2">
                {["Instantly removes password locks", "Allows editing, copying, and printing", "Supports secure PDFX format decryption", "100% Secure local processing"].map((feature) => (
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
              onClick={unlockPdf} 
              disabled={files.length === 0 || processing} 
              className="btn-sidebar-cta"
              style={{ backgroundColor: "#3b82f6" }}
            >
              <span>{processing ? "Unlocking..." : "Unlock PDF!"}</span>
              <span className="btn-sidebar-cta__icon">→</span>
            </button>
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf,.pdfx" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onAddFiles={addFiles} accept=".pdf,.pdfx" />
      
      {files.length > 0 && (
        <button 
          className="split-mobile-cta show--sm" 
          onClick={unlockPdf} 
          disabled={processing}
          style={{ backgroundColor: "#3b82f6" }}
        >
          <span>{processing ? "Unlocking..." : "Unlock PDF"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Unlocking PDF..." />
    </ToolLayout>
  );
}
