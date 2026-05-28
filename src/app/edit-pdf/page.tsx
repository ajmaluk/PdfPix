"use client";

import { useState, useCallback, useRef } from "react";
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

export default function EditPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [textToAdd, setTextToAdd] = useState("");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addText = useCallback(async () => {
    if (files.length === 0 || !textToAdd) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();
        if (pages.length > 0) {
          pages[0].drawText(textToAdd, { x: 50, y: 50, size: 12, font, color: rgb(0, 0, 0) });
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `edited_${entry.name}`);
      }
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Failed to edit PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, textToAdd]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Edit PDF</div>
      <div className="option__panel__content">
        <div className="info">Add text to your PDF document.</div>
        <textarea className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm mb-3" rows={3} placeholder="Enter text to add..." value={textToAdd} onChange={(e) => setTextToAdd(e.target.value)} />
        {files.length > 0 && textToAdd && <button className="btn btn--primary w-full mt-2" onClick={addText} disabled={processing}>{processing ? "Processing..." : "Add Text"}</button>}
      </div>
    </div>
  );
  return (
    <ToolLayout title="Edit PDF" subtitle="Add text, images, shapes or freehand annotations to a PDF document." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      <ProcessOverlay isActive={processing} message="Editing PDF..." />
    </ToolLayout>
  );
}
