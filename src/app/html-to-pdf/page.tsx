"use client";

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

export default function HtmlToPdfPage() {
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
        const html = await entry.file.text();
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([612, 792]);
        const text = html.replace(/<[^>]*>/g, "").substring(0, 4000);
        let y = 740;
        for (const line of text.split("\n")) {
          if (y < 40) break;
          page.drawText(line.substring(0, 100), { x: 50, y, size: 10 });
          y -= 14;
        }
        const bytes = await pdfDoc.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `${entry.name.replace(/\.[^.]+$/, "")}.pdf`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to convert HTML. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">HTML to PDF</div>
      <div className="option__panel__content">
        <div className="info">Upload an HTML file to convert it to PDF.</div>
        {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to PDF!"}</button>}
      </div>
    </div>
  );

  return (
    <ToolLayout title="HTML to PDF" subtitle="Convert HTML web pages to PDF files."
      sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".html,.htm" />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to PDF!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Converting HTML to PDF..." />
    </ToolLayout>
  );
}
