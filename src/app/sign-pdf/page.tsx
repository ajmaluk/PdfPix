"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback, useRef } from "react";
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

export default function SignPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f })));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const getSignatureBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(null);
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  const sign = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const sigBlob = await getSignatureBlob();
      if (!sigBlob) { setProcessing(false); return; }
      const sigBuffer = await sigBlob.arrayBuffer();
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = pdf.getPages();
        if (pages.length > 0) {
          const sigImg = await pdf.embedPng(sigBuffer);
          const { width } = pages[0].getSize();
          pages[0].drawImage(sigImg, { x: width - 200, y: 50, width: 150, height: 50 });
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `signed_${entry.name}`);
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to sign PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    setDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };
  const stopDraw = () => setDrawing(false);
  const clearSig = () => { const ctx = canvasRef.current?.getContext("2d"); if (ctx) ctx.clearRect(0, 0, 300, 100); };

  const sidebarContent = (
    <div className="option__panel">
      <div className="option__panel__title">Sign PDF</div>
      <div className="option__panel__content">
        <div className="info">Draw your signature below:</div>
        <canvas ref={canvasRef} width={300} height={100} className="border border-[#d1d5db] rounded-lg mb-2 cursor-crosshair bg-white" style={{ touchAction: "none" }} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} />
        <button className="btn btn--secondary btn--sm mb-3" onClick={clearSig}>Clear</button>
        {files.length > 0 && <button className="btn btn--primary w-full" onClick={sign} disabled={processing}>{processing ? "Signing..." : "Sign PDF!"}</button>}
      </div>
    </div>
  );

  return (
    <ToolLayout toolId="sign" title="Sign PDF" subtitle="Add your signature to PDF documents easily." sidebar={sidebarContent}>
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} />
      <ProcessOverlay isActive={processing} message="Signing PDF..." />
    </ToolLayout>
  );
}
