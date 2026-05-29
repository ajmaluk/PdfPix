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
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">Sign PDF</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Draw your signature</label>
          <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white mb-2 shadow-inner">
            <canvas 
              ref={canvasRef} 
              width={300} 
              height={100} 
              className="w-full cursor-crosshair" 
              style={{ touchAction: "none" }} 
              onMouseDown={startDraw} 
              onMouseMove={draw} 
              onMouseUp={stopDraw} 
              onMouseLeave={stopDraw} 
            />
          </div>
          <button 
            type="button" 
            className="flex items-center gap-1.5 text-xs font-bold text-[#e5322d] bg-[#fef2f2] px-3 py-1.5 rounded-lg border border-red-150 hover:bg-red-100 transition-all duration-200" 
            onClick={clearSig}
          >
            Clear canvas
          </button>
        </div>

        {/* Features */}
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Draw custom signatures", "Embedded as raw PNG signature overlay", "Placed at the bottom-right corner", "100% Secure local processing"].map((feature) => (
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
          onClick={sign} 
          disabled={files.length === 0 || processing} 
          className="btn-sidebar-cta"
          style={{ backgroundColor: "#3b82f6" }}
        >
          <span>{processing ? "Signing..." : "Sign PDF!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="sign" 
      title="Sign PDF" 
      subtitle="Add your signature to PDF documents easily." 
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
          onClick={sign} 
          disabled={processing}
          style={{ backgroundColor: "#3b82f6" }}
        >
          <span>{processing ? "Signing..." : "Sign PDF"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Signing PDF..." />
    </ToolLayout>
  );
}
