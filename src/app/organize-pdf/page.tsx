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

export default function OrganizePdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const organize = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const newPdf = await PDFDocument.create();
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const indices = pdf.getPageIndices();
        const pages = await newPdf.copyPages(pdf, indices);
        pages.forEach((p) => newPdf.addPage(p));
      }
      const bytes = await newPdf.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      downloadBlob(blob, "organized.pdf");
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to organize PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Organize PDF</div>
      <div className="info">Upload multiple PDFs to combine them into one organized document.</div>
      {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={organize} disabled={processing}>{processing ? "Organizing..." : "Organize!"}</button>}
    </div>
  );

  return (
    <ToolLayout title="Organize PDF" subtitle="Reorder, add, delete pages in your PDF document."
      sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} onReorder={(from, to) => { setFiles((prev) => { const n = [...prev]; const [m] = n.splice(from, 1); n.splice(to, 0, m); return n; }); }} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={organize} disabled={processing}>{processing ? "Organizing..." : "Organize PDF!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Organizing PDF..." />
    </ToolLayout>
  );
}
