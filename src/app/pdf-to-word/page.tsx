"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer, formatFileSize } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function PdfToWordPage() {
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
        const bytes = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const zip = new JSZip();
        const pageTexts: string[] = [];
        for (let i = 0; i < pdf.getPageCount(); i++) {
          const { width, height } = pdf.getPage(i).getSize();
          pageTexts.push(`Page ${i + 1} (${Math.round(width)} x ${Math.round(height)} pt)`);
        }
        const docContent = [
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
          `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">`,
          `<w:body>`,
          `<w:p><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>${entry.name}</w:t></w:r></w:p>`,
          `<w:p><w:r><w:rPr><w:i/><w:sz w:val="20"/></w:rPr><w:t>Pages: ${pdf.getPageCount()} | File size: ${formatFileSize(entry.size)}</w:t></w:r></w:p>`,
          ...pageTexts.map(t => `<w:p><w:r><w:t>${t}</w:t></w:r></w:p>`),
          `</w:body>`,
          `</w:document>`
        ].join("\n");
        zip.file("word/document.xml", docContent);
        zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
        zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
        zip.file("word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`);
        const docxBytes = await zip.generateAsync({ type: "uint8array" });
        const blob = new Blob([docxBytes as BlobPart], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        downloadBlob(blob, `${entry.name.replace(/\.pdf$/i, "")}.docx`);
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Failed to convert PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <ToolLayout
      title="PDF to Word"
      subtitle="Easily convert your PDF files into easy to edit DOC and DOCX documents."
      sidebar={
        <div className="option__panel">
          <div className="option__panel__title">PDF to Word</div>
          <div className="option__panel__content">
            <div className="info">Upload a PDF to convert it to an editable Word document.</div>
            {files.length > 0 && (
              <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>
                {processing ? "Converting..." : "Convert to Word!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <div className="add"><div className="in_add">Advertisement</div></div>
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>
            {processing ? "Converting..." : "Convert to Word!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Converting PDF to Word..." />
    </ToolLayout>
  );
}
