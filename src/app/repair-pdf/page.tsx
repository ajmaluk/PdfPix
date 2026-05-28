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

export default function RepairPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const repair = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResults([]);
    const rep: string[] = [];
    try {
      for (const entry of files) {
        const sizeKB = Math.round(entry.size / 1024);
        const buf = await readFileAsArrayBuffer(entry.file);
        try {
          const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
          const pageCount = pdf.getPageCount();
          const newBytes = await pdf.save({ useObjectStreams: false });
          const savedKB = Math.round(newBytes.length / 1024);
          const blob = new Blob([newBytes as BlobPart], { type: "application/pdf" });
          downloadBlob(blob, `repaired_${entry.name}`);
          rep.push(`${entry.name}: Rebuilt ${pageCount} page(s), ${sizeKB}KB → ${savedKB}KB - Success`);
        } catch {
          rep.push(`${entry.name}: Could not repair - file may be too damaged`);
        }
      }
      setResults(rep);
    } catch (err) {
      console.error("Repair failed:", err);
      alert("Failed to repair PDF. The file may be too damaged.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Repair PDF</div>
      <div className="option__panel__content">
        <div className="info">Upload a damaged or corrupted PDF to attempt repair.</div>
        {results.length > 0 && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {results.join("\n")}
          </div>
        )}
        {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={repair} disabled={processing}>{processing ? "Repairing..." : "Repair PDF!"}</button>}
      </div>
    </div>
  );

  return (
    <ToolLayout title="Repair PDF" subtitle="Repair damaged or corrupted PDF files." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={repair} disabled={processing}>{processing ? "Repairing..." : "Repair PDF!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Repairing PDF..." />
    </ToolLayout>
  );
}
