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
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">Protect PDF</div>
          <div className="option__panel__content">
            <div className="info mb-2">Set a password to protect your PDF:</div>
            <input
              type="password"
              className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm mb-3"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {files.length > 0 && password && (
              <button className="btn btn--primary w-full mt-2" onClick={protectPdf} disabled={processing}>
                {processing ? "Protecting..." : "Protect PDF!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={protectPdf} disabled={processing || !password}>
            {processing ? "Protecting..." : "Protect PDF!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Protecting PDF..." />
    </ToolLayout>
  );
}
