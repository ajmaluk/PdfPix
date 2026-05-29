"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function ScanToPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f }))]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const entry of files) {
        const imgBytes = await entry.file.arrayBuffer();
        const ext = entry.name.split(".").pop()?.toLowerCase();
        let img;
        if (ext === "png") img = await pdfDoc.embedPng(imgBytes);
        else img = await pdfDoc.embedJpg(imgBytes);
        if (img) {
          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
      }
      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      downloadBlob(blob, "scanned.pdf");
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to create PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Scan to PDF</div>
      <div className="option__panel__content">
        <div className="info">Upload images to combine them into a PDF.</div>
        {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>{processing ? "Creating..." : "Create PDF!"}</button>}
      </div>
    </div>
  );
  return (
    <ToolLayout toolId="scan" title="Scan to PDF" subtitle="Scan documents and convert them to PDF format." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept="image/*" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onReorder={(from, to) => { setFiles((prev) => { const n = [...prev]; const [m] = n.splice(from, 1); n.splice(to, 0, m); return n; }); }} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>{processing ? "Creating..." : "Create PDF!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Creating scanned PDF..." />
    </ToolLayout>
  );
}
