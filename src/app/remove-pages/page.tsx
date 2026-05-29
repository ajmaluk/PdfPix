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
    <div className="option__panel">
      <div className="option__panel__title">Remove Pages</div>
      <div className="option__panel__content">
        <div className="info">Enter page numbers to remove (e.g., 1,3,5-7):</div>
        <input type="text" className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm mb-3" placeholder="1,3,5" value={pagesToRemove} onChange={(e) => setPagesToRemove(e.target.value)} />
        {files.length > 0 && pagesToRemove && <button className="btn btn--primary w-full mt-4" onClick={removePages} disabled={processing}>{processing ? "Removing..." : "Remove Pages!"}</button>}
      </div>
    </div>
  );
  return (
    <ToolLayout toolId="remove-pages" title="Remove Pages" subtitle="Remove pages from a PDF document easily." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && pagesToRemove && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={removePages} disabled={processing}>{processing ? "Removing..." : "Remove Pages!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Removing pages..." />
    </ToolLayout>
  );
}
