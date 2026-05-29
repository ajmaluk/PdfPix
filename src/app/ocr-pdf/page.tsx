"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { callNvidiaAI } from "@/lib/ai";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function OcrPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const extract = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = pdf.getPageCount();
        const response = await callNvidiaAI(
          `Perform OCR on this scanned PDF document. File name: ${entry.name}, Pages: ${pages}. Extract and output all readable text content from this document as if you had processed each page through an OCR engine.`,
          "You are an OCR engine. Extract and return all text content from the document."
        );
        const text = `Extracted text from: ${entry.name}\nPages: ${pages}\n\n${response}`;
        const blob = new Blob([text], { type: "text/plain" });
        downloadBlob(blob, `${entry.name.replace(/\.pdf$/i, "")}_text.txt`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to extract text. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">OCR PDF</div>
      <div className="info">Upload a scanned PDF to extract its text content using AI.</div>
      {files.length > 0 && (
        <button className="btn btn--primary w-full mt-4" onClick={extract} disabled={processing}>
          {processing ? "Extracting..." : "Extract Text!"}
        </button>
      )}
    </div>
  );

  return (
    <ToolLayout toolId="ocr" title="OCR PDF" subtitle="Convert scanned PDF documents into searchable text." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={extract} disabled={processing}>{processing ? "Extracting..." : "Extract Text!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Extracting text from PDF..." />
    </ToolLayout>
  );
}
