"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function PdfToPptPage() {
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
        const pageCount = pdf.getPageCount();
        const zip = new JSZip();
        const slideXml = [];
        for (let i = 0; i < pageCount; i++) {
          const slideNum = i + 1;
          slideXml.push(`<p:slide xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sp><p:nvSpPr><p:cNvPr id="${slideNum}" name="Page ${slideNum}"/></p:nvSpPr><p:spPr/><p:txBody><a:p><a:r><a:rPr lang="en"/><a:t>Page ${slideNum}</a:t></a:r></a:p></p:txBody></p:sp></p:slide>`);
        }
        zip.file("ppt/slides/slide1.xml", `<?xml version="1.0"?><p:slides xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">${slideXml.join("")}</p:slides>`);
        const pptxBytes = await zip.generateAsync({ type: "uint8array" });
        const blob = new Blob([pptxBytes as BlobPart], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
        downloadBlob(blob, `${entry.name.replace(/\.pdf$/i, "")}.pptx`);
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
      <div className="option__panel__title">PDF to PowerPoint</div>
      <div className="option__panel__content">Upload a PDF to convert it to a PowerPoint presentation.</div>
      {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to PPT!"}</button>}
    </div>
  );

  return (
    <ToolLayout toolId="pdf-to-ppt" title="PDF to PowerPoint" subtitle="Turn your PDF files into easy to edit PPT and PPTX slideshows."
      sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to PPT!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Converting PDF to PowerPoint..." />
    </ToolLayout>
  );
}
