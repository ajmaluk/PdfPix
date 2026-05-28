"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob } from "@/lib/pdf-utils";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })),
    ]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      for (const entry of files) {
        const imgBytes = await entry.file.arrayBuffer();
        const ext = entry.name.split(".").pop()?.toLowerCase();
        let image;
        if (ext === "png") {
          image = await pdfDoc.embedPng(imgBytes);
        } else if (ext === "jpg" || ext === "jpeg") {
          image = await pdfDoc.embedJpg(imgBytes);
        } else {
          continue;
        }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      downloadBlob(blob, "converted.pdf");
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Failed to convert images. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <ToolLayout toolId="jpg-to-pdf"
      title="JPG to PDF"
      subtitle="Convert JPG images to PDF in seconds. Easily adjust orientation and margins."
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">JPG to PDF</div>
          <div className="option__panel__content">
            <div className="info mb-2">Orientation:</div>
            <div className="flex gap-2 mb-4">
              <button className={`btn ${orientation === "portrait" ? "btn--primary" : "btn--secondary"} btn--sm`} onClick={() => setOrientation("portrait")}>Portrait</button>
              <button className={`btn ${orientation === "landscape" ? "btn--primary" : "btn--secondary"} btn--sm`} onClick={() => setOrientation("landscape")}>Landscape</button>
            </div>
            {files.length > 0 && (
              <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>
                {processing ? "Converting..." : "Convert to PDF!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept="image/*" />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} onReorder={(from, to) => {
        setFiles((prev) => {
          const next = [...prev];
          const [m] = next.splice(from, 1);
          next.splice(to, 0, m);
          return next;
        });
      }} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>
            {processing ? "Converting..." : "Convert to PDF!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Converting images to PDF..." />
    </ToolLayout>
  );
}
