"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function PdfToJpgPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.95));
          if (blob) {
            downloadBlob(blob, `${entry.name.replace(/\.pdf$/i, "")}_page_${i}.jpg`);
          }
        }
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Failed to convert PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <ToolLayout
      title="PDF to JPG"
      subtitle="Convert each PDF page into a JPG or extract all images contained in a PDF."
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">PDF to JPG</div>
          <div className="option__panel__content">
            <div className="info">Upload a PDF to convert its pages to JPG images.</div>
            {files.length > 0 && (
              <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>
                {processing ? "Converting..." : "Convert to JPG!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>
            {processing ? "Converting..." : "Convert to JPG!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Converting PDF to JPG..." />
    </ToolLayout>
  );
}
