"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function PptToPdfPage() {
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
      const JSZip = (await import("jszip")).default;
      for (const entry of files) {
        const pdfDoc = await PDFDocument.create();
        const zip = await JSZip.loadAsync(entry.file);
        const slideFiles: string[] = [];
        zip.forEach((path) => { if (path.startsWith("ppt/slides/slide") && path.endsWith(".xml")) slideFiles.push(path); });
        slideFiles.sort();
        if (slideFiles.length === 0) {
          const page = pdfDoc.addPage([612, 792]);
          page.drawText(`Converted from: ${entry.name}`, { x: 50, y: 700, size: 14 });
          page.drawText("(No slides found in this presentation)", { x: 50, y: 670, size: 11 });
        } else {
          for (const slidePath of slideFiles) {
            const xmlStr = await zip.file(slidePath)!.async("string");
            const texts = xmlStr.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
            const page = pdfDoc.addPage([612, 792]);
            page.drawText(`Slide: ${slidePath.replace("ppt/slides/", "")}`, { x: 50, y: 740, size: 12 });
            let y = 700;
            const words = texts.split(" ").filter(Boolean);
            let line = "";
            for (const word of words) {
              if ((line + " " + word).length > 100) {
                page.drawText(line, { x: 50, y, size: 10 });
                y -= 14;
                line = word;
              } else {
                line = line ? line + " " + word : word;
              }
              if (y < 40) break;
            }
            if (line && y >= 40) page.drawText(line, { x: 50, y, size: 10 });
          }
        }
        const bytes = await pdfDoc.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `${entry.name.replace(/\.[^.]+$/, "")}.pdf`);
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
      <div className="option__panel__title">PowerPoint to PDF</div>
      <div className="option__panel__content">Upload a PowerPoint file to convert it to PDF format.</div>
      {files.length > 0 && <button className="btn btn--primary w-full mt-4" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to PDF!"}</button>}
    </div>
  );

  return (
    <ToolLayout toolId="ppt-to-pdf" title="PowerPoint to PDF" subtitle="Make PPT and PPTX slideshows easy to view by converting them to PDF."
      sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".ppt,.pptx" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      {files.length > 0 && <div className="flex justify-center mt-6"><button className="btn btn--primary text-lg px-10 py-3" onClick={convert} disabled={processing}>{processing ? "Converting..." : "Convert to PDF!"}</button></div>}
      <ProcessOverlay isActive={processing} message="Converting PowerPoint to PDF..." />
    </ToolLayout>
  );
}
