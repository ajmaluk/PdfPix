"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer, formatFileSize } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function CompressPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const compressPdf = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const stats: string[] = [];
      for (const entry of files) {
        const buffer = await readFileAsArrayBuffer(entry.file);
        const originalSize = buffer.byteLength;
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const compressedBytes = await pdf.save({ useObjectStreams: true });
        const compressedSize = compressedBytes.length;
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        stats.push(`${entry.name}: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${ratio}% reduction)`);
        const blob = new Blob([compressedBytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `compressed_${entry.name}`);
      }
      const summary = stats.join("\n") + "\n\nCompression complete!";
      const summaryBlob = new Blob([summary], { type: "text/plain" });
      downloadBlob(summaryBlob, "compression_report.txt");
    } catch (err) {
      console.error("Compress failed:", err);
      alert("Failed to compress PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <ToolLayout toolId="compress"
      title="Compress PDF files"
      subtitle="Reduce file size while optimizing for maximal PDF quality."
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">Compress PDF</div>
          <div className="option__panel__content">
            <div className="info">Compress PDF files to reduce their file size while maintaining quality.</div>
            {files.length > 0 && (
              <button className="btn btn--primary w-full mt-4" onClick={compressPdf} disabled={processing}>
                {processing ? "Compressing..." : "Compress PDF!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={compressPdf} disabled={processing}>
            {processing ? "Compressing..." : "Compress PDF!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Compressing PDFs..." />
    </ToolLayout>
  );
}
