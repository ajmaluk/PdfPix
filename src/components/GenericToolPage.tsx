"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId } from "@/lib/pdf-utils";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function GenericToolPage({ title, subtitle, accept = ".pdf", description, buttonText = "Process", onProcess }: {
  title: string;
  subtitle: string;
  accept?: string;
  description: string;
  buttonText?: string;
  onProcess: (files: FileEntry[]) => Promise<void>;
}) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f }))]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      await onProcess(files);
    } catch (err) {
      console.error("Process failed:", err);
      alert("Failed to process. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files, onProcess]);

  return (
    <ToolLayout
      title={title}
      subtitle={subtitle}
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">{title}</div>
          <div className="option__panel__content">
            <div className="info">{description}</div>
            {files.length > 0 && (
              <button className="btn btn--primary w-full mt-4" onClick={handleProcess} disabled={processing}>
                {processing ? "Processing..." : buttonText}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} accept={accept} />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={handleProcess} disabled={processing}>
            {processing ? "Processing..." : buttonText}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message={`${title}...`} />
    </ToolLayout>
  );
}
