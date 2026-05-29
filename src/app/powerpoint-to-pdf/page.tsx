"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessOverlay from "@/components/ProcessOverlay";
import AdSpace from "@/components/AdSpace";
import { generateFileId, downloadBlob, formatFileSize } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";
import { useTool } from "@/components/ToolContext";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function PptToPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { setHasFiles, setFileCount } = useTool();

  // Keep tool layout state updated with file list length
  useEffect(() => {
    setHasFiles(files.length > 0);
    if (setFileCount) {
      setFileCount(files.length);
    }
    return () => {
      setHasFiles(false);
      if (setFileCount) setFileCount(0);
    };
  }, [files.length, setHasFiles, setFileCount]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f }))
    ]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const reorderFile = useCallback((from: number, to: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const JSZipImport = await import("jszip");
      // @ts-ignore
      const JSZip = JSZipImport.default || JSZipImport;
      
      for (const entry of files) {
        const pdfDoc = await PDFDocument.create();
        const zip = await JSZip.loadAsync(entry.file);
        const slideFiles: string[] = [];
        zip.forEach((path) => { 
          if (path.startsWith("ppt/slides/slide") && path.endsWith(".xml")) {
            slideFiles.push(path); 
          }
        });
        slideFiles.sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, ""), 10);
          const numB = parseInt(b.replace(/\D/g, ""), 10);
          return numA - numB;
        });
        
        if (slideFiles.length === 0) {
          const page = pdfDoc.addPage([612, 792]);
          page.drawText(`Converted from: ${entry.name}`, { x: 50, y: 700, size: 14 });
          page.drawText("(No slides found in this presentation)", { x: 50, y: 670, size: 11 });
        } else {
          for (let idx = 0; idx < slideFiles.length; idx++) {
            const slidePath = slideFiles[idx];
            const xmlStr = await zip.file(slidePath)!.async("string");
            
            // Extract text strictly inside <a:t> elements
            const matches = xmlStr.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g);
            const texts = matches
              ? matches.map(m => m.replace(/<a:t[^>]*>/, "").replace("</a:t>", "")).join(" ").replace(/\s+/g, " ").trim()
              : "";
              
            const page = pdfDoc.addPage([612, 792]);
            page.drawText(`Slide: ${idx + 1}`, { x: 50, y: 740, size: 12 });
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
      alert("Failed to convert document. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  // Drag and drop handlers
  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderFile(draggedIndex, index);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <ToolLayout toolId="ppt-to-pdf"
      title="PowerPoint to PDF"
      subtitle="Make PPT and PPTX slideshows easy to view by converting them to PDF."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={
        <div className="option__panel split-sidebar-panel">
          <div className="split-sidebar-panel__header">
            <div className="option__panel__title split-sidebar-panel__title text-center w-full">PowerPoint to PDF</div>
          </div>

          <div className="option__panel__content split-sidebar-panel__content">
            {/* Input Format Info */}
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Accepted Formats</label>
              <div className="flex items-center gap-3 rounded-xl border-2 border-[#d24726] bg-[#fef5f3] px-4 py-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#d24726] text-white font-black text-[10px]">
                  PPT
                </div>
                <div>
                  <div className="text-sm font-bold text-[#d24726]">PowerPoint → PDF</div>
                  <div className="text-[10px] text-[#9a6957] font-medium">.ppt, .pptx files supported</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
              <div className="space-y-2">
                {["Slide text extraction", "Multi-slide support", "Clean PDF output", "Batch conversion"].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-[12px] text-[#555c66] font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* File info */}
            {files.length > 0 && (
              <div className="split-section">
                <div className="flex items-center justify-between bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-[#8a8a92]">Files selected</span>
                  <span className="text-sm font-black text-[#33333b]">{files.length}</span>
                </div>
              </div>
            )}
          </div>

          <div className="split-sidebar-panel__footer">
            <button type="button" onClick={convert} disabled={processing} className="btn-sidebar-cta">
              <span>{processing ? "Converting..." : "Convert to PDF!"}</span>
              <span className="btn-sidebar-cta__icon">→</span>
            </button>
          </div>
        </div>
      }
    >
      {files.length === 0 && (
        <>
          <FileUploader onFilesSelected={addFiles} hasFiles={false} accept=".ppt,.pptx" />
          <AdSpace />
        </>
      )}

      {files.length > 0 ? (
        <div 
          className="merge-workarea-container"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              addFiles(Array.from(e.dataTransfer.files));
            }
          }}
        >
          <AdSpace />

          <div className="flex items-start justify-center gap-6 w-full">
            {/* Files Grid */}
            <div className="merge-files-grid flex-1">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className={`merge-file-card group-hover ${draggedIndex === index ? "opacity-30" : ""}`}
                  draggable
                  onDragStart={(e) => handleDragStart(index, e)}
                  onDragOver={(e) => handleDragOver(index, e)}
                  onDrop={(e) => handleDrop(index, e)}
                  onDragEnd={handleDragEnd}
                >
                  {/* Index Badge */}
                  <div className="merge-file-card__index-badge">
                    {index + 1}
                  </div>

                  {/* Tooltip Bubble */}
                  <div className="merge-file-card__tooltip">
                    {formatFileSize(file.size)}
                  </div>

                  {/* Actions (delete) */}
                  <div className="merge-file-card__actions">
                    <button
                      type="button"
                      className="merge-file-card__action-btn merge-file-card__action-btn--delete"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFile(file.id); }}
                      title="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  {/* Canvas Thumbnail */}
                  <div className="merge-file-card__canvas-wrapper">
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#d24726]">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8" fill="none" stroke="#fff" strokeWidth="2"/>
                      </svg>
                      <span className="text-[10px] text-[#d24726] mt-2 font-bold select-none uppercase">PowerPoint</span>
                    </div>
                  </div>

                  {/* Filename */}
                  <div className="merge-file-card__name" title={file.name}>
                    {file.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Actions bar */}
            <div className="merge-grid-actions-container">
              {/* Add more files FAB */}
              <div className="merge-fab-add group relative">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); inputRef.current?.click(); }}
                  className="merge-fab-add__btn"
                  aria-label="Add more files"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                
                {/* File Count Badge */}
                <div className="merge-fab-add__badge">
                  {files.length}
                </div>

                {/* Add more files Tooltip */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-[#212529] text-white text-[10px] font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Add more files
                </div>
              </div>
            </div>
          </div>

          <button 
            className="split-mobile-cta show--sm" 
            onClick={convert} 
            disabled={processing}
          >
            <span>{processing ? "Converting..." : "Convert to PDF"}</span>
            <span className="split-mobile-cta__icon">→</span>
          </button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept=".ppt,.pptx"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            addFiles(Array.from(e.target.files));
            e.target.value = "";
          }
        }}
      />
      
      <ProcessOverlay isActive={processing} message="Converting PowerPoint to PDF..." />
    </ToolLayout>
  );
}
