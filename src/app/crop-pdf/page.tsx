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

export default function CropPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [margins, setMargins] = useState({ top: 20, bottom: 20, left: 20, right: 20 });

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const crop = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = pdf.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          page.setMediaBox(margins.left, margins.bottom, width - margins.left - margins.right, height - margins.top - margins.bottom);
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `cropped_${entry.name}`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to crop PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, margins]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Crop PDF</div>
      <div className="option__panel__content">
        {["top", "bottom", "left", "right"].map((side) => (
          <div key={side} className="mb-2">
            <label className="text-xs text-[#6b7280] block mb-1 capitalize">{side} margin (points)</label>
            <input type="number" className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm" value={margins[side as keyof typeof margins]} onChange={(e) => setMargins({ ...margins, [side]: parseInt(e.target.value) || 0 })} min={0} max={200} />
          </div>
        ))}
        {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={crop} disabled={processing}>{processing ? "Cropping..." : "Crop PDF!"}</button>}
      </div>
    </div>
  );
  return (
    <ToolLayout title="Crop PDF" subtitle="Crop pages in your PDF to get the perfect margins." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={crop} disabled={processing}>{processing ? "Cropping..." : "Crop PDF!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Cropping PDF..." />
    </ToolLayout>
  );
}
