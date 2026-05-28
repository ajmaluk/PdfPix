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

export default function SplitPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState<"range" | "extract">("range");
  const [pageRange, setPageRange] = useState("");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const splitPdf = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const buffer = await readFileAsArrayBuffer(files[0].file);
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const totalPages = pdf.getPageCount();

      if (mode === "range" && pageRange) {
        const ranges = pageRange.split(",").map((s) => s.trim());
        for (let i = 0; i < ranges.length; i++) {
          const [startStr, endStr] = ranges[i].split("-");
          const start = parseInt(startStr) - 1;
          const end = endStr ? parseInt(endStr) : start + 1;
          const newPdf = await PDFDocument.create();
          const indices = Array.from({ length: end - start }, (_, j) => start + j).filter((j) => j < totalPages);
          if (indices.length > 0) {
            const pages = await newPdf.copyPages(pdf, indices);
            pages.forEach((p) => newPdf.addPage(p));
            const bytes = await newPdf.save();
            const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
            downloadBlob(blob, `split_${i + 1}.pdf`);
          }
        }
      } else {
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(page);
            const bytes = await newPdf.save();
            const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
            downloadBlob(blob, `page_${i + 1}.pdf`);
        }
      }
    } catch (err) {
      console.error("Split failed:", err);
      alert("Failed to split PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, mode, pageRange]);

  return (
    <ToolLayout
      title="Split PDF files"
      subtitle="Separate one page or a whole set for easy conversion into independent PDF files."
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">Split PDF</div>
          <div className="option__panel__content">
            <div className="flex gap-2 mb-4">
              <button className={`btn ${mode === "range" ? "btn--primary" : "btn--secondary"} btn--sm`} onClick={() => setMode("range")}>Range</button>
              <button className={`btn ${mode === "extract" ? "btn--primary" : "btn--secondary"} btn--sm`} onClick={() => setMode("extract")}>Extract</button>
            </div>
            {mode === "range" && (
              <div>
                <label className="text-sm text-[#6b7280] mb-1 block">Page ranges (e.g., 1-3, 5-7)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm"
                  placeholder="1-3, 5-7"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                />
              </div>
            )}
            {mode === "extract" && (
              <div className="info">Extract all pages as separate PDF files.</div>
            )}
            {files.length > 0 && (
              <button className="btn btn--primary w-full mt-4" onClick={splitPdf} disabled={processing}>
                {processing ? "Splitting..." : "Split PDF!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={splitPdf} disabled={processing}>
            {processing ? "Splitting..." : "Split PDF!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Splitting PDFs..." />
    </ToolLayout>
  );
}
