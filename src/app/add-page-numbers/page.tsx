"use client";

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

export default function AddPageNumbersPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [startNumber, setStartNumber] = useState(1);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addNumbers = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();
        for (let i = 0; i < pages.length; i++) {
          const { width } = pages[i].getSize();
          pages[i].drawText(String(i + startNumber), { x: width / 2 - 10, y: 30, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `numbered_${entry.name}`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to add page numbers. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, startNumber]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Add Page Numbers</div>
      <div className="option__panel__content">
        <div className="info">Starting number:</div>
        <input type="number" className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm mb-3" value={startNumber} onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)} min={1} />
        {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={addNumbers} disabled={processing}>{processing ? "Adding..." : "Add Page Numbers!"}</button>}
      </div>
    </div>
  );
  return (
    <ToolLayout toolId="page-numbers" title="Add Page Numbers" subtitle="Add page numbers to your PDF files easily." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={addNumbers} disabled={processing}>{processing ? "Adding..." : "Add Page Numbers!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Adding page numbers..." />
    </ToolLayout>
  );
}
