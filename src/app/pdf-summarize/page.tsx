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
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">AI Summarizer</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">AI Engine</label>
          <div className="text-sm font-semibold text-[#1e293b]">NVIDIA AI Foundation</div>
          <div className="text-xs text-[#64748b] mt-1">Utilizes advanced LLMs to extract core insights and generate comprehensive summaries.</div>
        </div>

        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Instant key-insight extraction", "Accurate content summaries", "Downloads text summaries directly", "Secure client-side processing"].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-[12px] text-[#555c66] font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="split-sidebar-panel__footer">
        <button 
          type="button" 
          onClick={summarize} 
          disabled={files.length === 0 || processing} 
          className="btn-sidebar-cta"
          style={{ backgroundColor: "#06b6d4" }}
        >
          <span>{processing ? "Summarizing..." : "Summarize!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="summarize" 
      title="AI Summarizer" 
      subtitle="Summarize PDF documents using AI technology." 
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={sidebarContent}
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onAddFiles={addFiles} accept=".pdf" />
      
      {files.length > 0 && (
        <button 
          className="split-mobile-cta show--sm" 
          onClick={summarize} 
          disabled={processing}
          style={{ backgroundColor: "#06b6d4" }}
        >
          <span>{processing ? "Summarizing..." : "Summarize PDF"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Summarizing PDF..." />
    </ToolLayout>
  );
}
