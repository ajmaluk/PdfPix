"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function PdfFormsPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState("");

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const fillForm = useCallback(async () => {
    if (files.length === 0 || !formData) return;
    setProcessing(true);
    try {
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const form = pdf.getForm();
        const fields = form.getFields();
        const entries = formData.split("\n").filter(Boolean);
        for (const entry_ of entries) {
          const [fieldName, value] = entry_.split("=").map((s) => s.trim());
          if (fieldName && value) {
            try {
              const field = form.getTextField(fieldName);
              field.setText(value);
            } catch {
              // field not found, skip
            }
          }
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `filled_${entry.name}`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to fill form. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, formData]);

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">PDF Forms</div>
      <div className="option__panel__content">
        <div className="info">Enter form field values (field_name=value per line):</div>
        <textarea className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm mb-3" rows={5} placeholder="name=John Doe&#10;email=john@example.com" value={formData} onChange={(e) => setFormData(e.target.value)} />
        {files.length > 0 && formData && <button className="btn btn--primary w-full mt-4" onClick={fillForm} disabled={processing}>{processing ? "Filling..." : "Fill Form!"}</button>}
      </div>
    </div>
  );
  return (
    <ToolLayout toolId="forms" title="PDF Forms" subtitle="Fill out and edit PDF forms easily." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && formData && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={fillForm} disabled={processing}>{processing ? "Filling..." : "Fill Form!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Filling PDF form..." />
    </ToolLayout>
  );
}
