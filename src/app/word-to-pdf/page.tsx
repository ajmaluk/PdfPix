"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, formatFileSize } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";
import * as mammoth from "mammoth";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function WordToPdfPage() {
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
      for (const entry of files) {
        const arrayBuffer = await entry.file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const text = result.value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        const pdfDoc = await PDFDocument.create();
        const pageWidth = 612;
        const pageHeight = 792;
        const margin = 50;
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;
        let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        let y = pageHeight - margin;
        const words = text.split(" ").filter(Boolean);
        let line = "";
        for (const word of words) {
          const testLine = line ? line + " " + word : word;
          if (testLine.length * 4.5 > maxWidth) {
            currentPage.drawText(line, { x: margin, y, size: 11 });
            y -= 16;
            line = word;
            if (y < margin) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              y = pageHeight - margin;
            }
          } else {
            line = testLine;
          }
        }
        if (line) currentPage.drawText(line, { x: margin, y, size: 11 });
        const bytes = await pdfDoc.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `${entry.name.replace(/\.[^.]+$/, "")}.pdf`);
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Failed to convert document. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <ToolLayout
      title="Word to PDF"
      subtitle="Make DOC and DOCX files easy to read by converting them to PDF."
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">Word to PDF</div>
          <div className="option__panel__content">
            <div className="info">Upload a Word document to convert it to PDF format.</div>
            {files.length > 0 && (
              <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>
                {processing ? "Converting..." : "Convert to PDF!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".doc,.docx" />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>
            {processing ? "Converting..." : "Convert to PDF!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Converting Word to PDF..." />
    </ToolLayout>
  );
}
