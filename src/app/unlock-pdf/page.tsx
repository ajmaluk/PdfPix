"use client";

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
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">Unlock PDF</div>
          <div className="option__panel__content">
            <div className="info">Upload a password-protected PDF to remove its security.</div>
            <input
              type="password"
              className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm mb-3"
              placeholder="Password (for .pdfx encrypted files)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {files.length > 0 && (
              <button className="btn btn--primary w-full mt-2" onClick={unlockPdf} disabled={processing}>
                {processing ? "Unlocking..." : "Unlock PDF!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf,.pdfx" />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={unlockPdf} disabled={processing}>
            {processing ? "Unlocking..." : "Unlock PDF!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Unlocking PDF..." />
    </ToolLayout>
  );
}
