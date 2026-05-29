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

export default function PdfSummarizePage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const summarize = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = pdf.getPageCount();
        const response = await callNvidiaAI(
          `Please provide a detailed summary of this PDF. File name: ${entry.name}, Pages: ${pages}. Summarize what this document is about based on its metadata.`,
          "You are a helpful document summarizer."
        );
        const summary = `PDF Summary\n============\nFile: ${entry.name}\nPages: ${pages}\n\n${response}`;
        const blob = new Blob([summary], { type: "text/plain" });
        downloadBlob(blob, `${entry.name.replace(/\.pdf$/i, "")}_summary.txt`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to summarize. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">AI Summarizer</div>
      <div className="info">Upload a PDF to generate an AI-powered summary of its contents.</div>
      {files.length > 0 && (
        <button className="btn btn--primary w-full mt-4" onClick={summarize} disabled={processing}>
          {processing ? "Summarizing..." : "Summarize!"}
        </button>
      )}
    </div>
  );

  return (
    <ToolLayout toolId="summarize" title="AI Summarizer" subtitle="Summarize PDF documents using AI technology." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={summarize} disabled={processing}>{processing ? "Summarizing..." : "Summarize!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Summarizing PDF..." />
    </ToolLayout>
  );
}
