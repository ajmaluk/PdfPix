"use client";
import AdSpace from "@/components/AdSpace";

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

export default function PdfToPdfaPage() {
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
        pdf.setTitle(entry.name.replace(/\.pdf$/i, ""));
        pdf.setSubject("PDF/A Archival Document");
        pdf.setKeywords(["pdfa", "archival", "pdf"]);
        pdf.setCreator("PdfPix PDF/A Converter");
        pdf.setProducer("PdfPix");
        const bytes = await pdf.save({ useObjectStreams: false });
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `pdfa_${entry.name}`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to convert. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">PDF to PDF/A</div>
      <div className="info">Upload a PDF to convert it to PDF/A archival format.</div>
      {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to PDF/A!"}</button>}
    </div>
  );

  return (
    <ToolLayout toolId="pdf-to-pdfa" title="PDF to PDF/A" subtitle="Convert your PDF files to PDF/A format for long-term archiving."
      sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to PDF/A!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Converting to PDF/A..." />
    </ToolLayout>
  );
}
