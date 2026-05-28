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

export default function RotatePdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [rotation, setRotation] = useState(90);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const rotatePdf = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buffer = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pages = pdf.getPages();
        for (const page of pages) {
          const current = page.getRotation().angle;
          page.setRotation({ type: "degrees", angle: (current + rotation) % 360 } as any);
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `rotated_${entry.name}`);
      }
    } catch (err) {
      console.error("Rotate failed:", err);
      alert("Failed to rotate PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, rotation]);

  return (
    <ToolLayout
      title="Rotate PDF pages"
      subtitle="Rotate PDF pages by 90 degrees left or right."
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">Rotate PDF</div>
          <div className="option__panel__content">
            <div className="info">Select rotation angle for all pages:</div>
            <div className="flex gap-2 mb-4">
              {[90, 180, 270].map((deg) => (
                <button key={deg} className={`btn ${rotation === deg ? "btn--primary" : "btn--secondary"} btn--sm`} onClick={() => setRotation(deg)}>
                  {deg}°
                </button>
              ))}
            </div>
            {files.length > 0 && (
              <button className="btn btn--primary w-full mt-4" onClick={rotatePdf} disabled={processing}>
                {processing ? "Rotating..." : "Rotate PDF!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={rotatePdf} disabled={processing}>
            {processing ? "Rotating..." : "Rotate PDF!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Rotating PDF pages..." />
    </ToolLayout>
  );
}
