"use client";

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

export default function ComparePdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const compare = useCallback(async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const results: string[] = [];
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = pdf.getPages();
        let totalWidth = 0;
        let totalHeight = 0;
        for (const p of pages) {
          const { width, height } = p.getSize();
          totalWidth += width;
          totalHeight += height;
        }
        const avgWidth = pages.length > 0 ? (totalWidth / pages.length).toFixed(1) : "0";
        const avgHeight = pages.length > 0 ? (totalHeight / pages.length).toFixed(1) : "0";
        results.push(`File: ${entry.name}`);
        results.push(`  Pages: ${pdf.getPageCount()}`);
        results.push(`  Page size: ${avgWidth} x ${avgHeight} points (avg)`);
        results.push(`  File size: ${formatFileSize(entry.size)}`);
        results.push("");
      }
      results.push("--- DIFF SUMMARY ---");
      if (files.length === 2) {
        const p1 = (await PDFDocument.load(await readFileAsArrayBuffer(files[0].file), { ignoreEncryption: true })).getPageCount();
        const p2 = (await PDFDocument.load(await readFileAsArrayBuffer(files[1].file), { ignoreEncryption: true })).getPageCount();
        results.push(`Page count difference: ${Math.abs(p1 - p2)} page(s)`);
        results.push(p1 > p2 ? `"${files[0].name}" has ${p1 - p2} more pages` : `"${files[1].name}" has ${p2 - p1} more pages`);
      }
      const comparison = results.join("\n");
      const blob = new Blob([comparison], { type: "text/plain" });
      downloadBlob(blob, "comparison.txt");
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to compare PDFs. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Compare PDF</div>
      <div className="info">Upload at least 2 PDFs to compare them.</div>
      {files.length >= 2 && <button className="btn btn--primary w-full mt-4" onClick={compare} disabled={processing}>{processing ? "Comparing..." : "Compare!"}</button>}
    </div>
  );

  return (
    <ToolLayout title="Compare PDF" subtitle="Compare two PDF files side by side to find differences."
      sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length >= 2 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={compare} disabled={processing}>{processing ? "Comparing..." : "Compare PDFs!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Comparing PDFs..." />
    </ToolLayout>
  );
}
