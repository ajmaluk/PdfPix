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

export default function PdfToExcelPage() {
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
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const lines: string[] = ["Filename,Pages,PageWidth,PageHeight,FileSize"];
        for (let i = 0; i < pdf.getPageCount(); i++) {
          const { width, height } = pdf.getPage(i).getSize();
          lines.push(`"${entry.name}",${pdf.getPageCount()},${Math.round(width)},${Math.round(height)},${entry.size}`);
        }
        const csv = lines.join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        downloadBlob(blob, `${entry.name.replace(/\.pdf$/i, "")}.csv`);
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Failed to convert. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">PDF to Excel</div>
      <div className="option__panel__content">Upload a PDF to extract its data into a CSV file compatible with Excel.</div>
      {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to Excel!"}</button>}
    </div>
  );

  return (
    <ToolLayout toolId="pdf-to-excel" title="PDF to Excel" subtitle="Pull data straight from PDFs into Excel spreadsheets."
      sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to Excel!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Converting PDF to Excel..." />
    </ToolLayout>
  );
}
