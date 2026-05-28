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

export default function AddWatermarkPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addWatermark = useCallback(async () => {
    if (files.length === 0 || !watermarkText) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);
        const pages = pdf.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, { x: width / 2 - 80, y: height / 2, size: 48, font, color: rgb(0.8, 0.8, 0.8), opacity: 0.3 });
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `watermarked_${entry.name}`);
      }
    } catch (err) {
      console.error("Watermark failed:", err);
      alert("Failed to add watermark. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, watermarkText]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Add Watermark</div>
      <div className="option__panel__content">
        <div className="info">Enter the watermark text:</div>
        <input type="text" className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm mb-3" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
        {files.length > 0 && watermarkText && <button className="btn btn--primary w-full mt-4" onClick={addWatermark} disabled={processing}>{processing ? "Adding..." : "Add Watermark!"}</button>}
      </div>
    </div>
  );
  return (
    <ToolLayout toolId="watermark" title="Add Watermark" subtitle="Add text or image watermark to your PDF files." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={addWatermark} disabled={processing}>{processing ? "Adding..." : "Add Watermark!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Adding watermark..." />
    </ToolLayout>
  );
}
