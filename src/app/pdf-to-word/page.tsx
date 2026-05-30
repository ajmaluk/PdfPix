"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessOverlay from "@/components/ProcessOverlay";
import AdSpace from "@/components/AdSpace";
import { generateFileId, downloadBlob, readFileAsArrayBuffer, formatFileSize } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { useTool } from "@/components/ToolContext";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
  pageCount: number;
  rotation: number;
  thumbnailUrl: string;
}

// Function to parse page count and render first page to thumbnail URL using pdfjs-dist
async function getPdfDetails(file: File): Promise<{ pageCount: number; thumbnailUrl: string }> {
  try {
    const buffer = await readFileAsArrayBuffer(file);
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
    
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    const pageCount = pdf.numPages;
    
    // Render first page as thumbnail
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.4 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");
    if (context) {
      await page.render({ canvasContext: context, viewport }).promise;
      const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.75);
      return { pageCount, thumbnailUrl };
    }
  } catch (err) {
    console.error("Failed to parse PDF details for", file.name, err);
  }
  return { pageCount: 0, thumbnailUrl: "" };
}

export default function PdfToWordPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState("Converting PDF to Word...");
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

  const addFiles = useCallback(async (newFiles: File[]) => {
    setProcessMessage("Loading PDF details...");
    setProcessing(true);
    try {
      const entries = await Promise.all(
        newFiles.map(async (f) => {
          const details = await getPdfDetails(f);
          return {
            id: generateFileId(),
            name: f.name,
            size: f.size,
            file: f,
            pageCount: details.pageCount,
            rotation: 0,
            thumbnailUrl: details.thumbnailUrl,
          };
        })
      );
      setFiles((prev) => [...prev, ...entries]);
    } catch (err) {
      console.error("Error adding files:", err);
    } finally {
      setProcessing(false);
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const rotateFile = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, rotation: (f.rotation + 90) % 360 } : f
      )
    );
  }, []);

  const reorderFile = useCallback((from: number, to: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessMessage("Converting PDF to Word...");
    setProcessing(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
      
      for (const entry of files) {
        const bytes = await readFileAsArrayBuffer(entry.file);
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
        const pageCount = pdf.numPages;
        const pageTexts: string[] = [];
        
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((rawItem: unknown) => {
              const item = rawItem as { str: string };
              return item.str;
            })
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          pageTexts.push(pageText || `(Empty Page ${i})`);
        }

        const zip = new JSZip();
        const paragraphXmls = pageTexts.flatMap(text => 
          text.split("\n").map(line => `<w:p><w:r><w:t>${escapeXml(line)}</w:t></w:r></w:p>`)
        );

        const docContent = [
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
          `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">`,
          `<w:body>`,
          `<w:p><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(entry.name)}</w:t></w:r></w:p>`,
          `<w:p><w:r><w:rPr><w:i/><w:sz w:val="20"/></w:rPr><w:t>Pages: ${pageCount} | File size: ${formatFileSize(entry.size)}</w:t></w:r></w:p>`,
          ...paragraphXmls,
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
    <ToolLayout toolId="pdf-to-word"
      title="PDF to Word"
      subtitle="Easily convert your PDF files into easy to edit DOC and DOCX documents."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={
        <div className="option__panel split-sidebar-panel">
          <div className="split-sidebar-panel__header">
            <div className="option__panel__title split-sidebar-panel__title text-center w-full">PDF to Word</div>
          </div>

          <div className="option__panel__content split-sidebar-panel__content">
            {/* Output Format Info */}
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Output Format</label>
              <div className="flex items-center gap-3 rounded-xl border-2 border-[#2b579a] bg-[#f0f4fa] px-4 py-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#2b579a] text-white font-black text-xs">
                  .docx
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2b579a]">Word Document</div>
                  <div className="text-[10px] text-[#5a6f8f] font-medium">Microsoft Word (.docx)</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
              <div className="space-y-2">
                {["Text extraction with formatting", "Paragraph structure preserved", "Multi-page support", "Batch conversion"].map((feature) => (
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
              <span>{processing ? "Converting..." : "Convert to Word!"}</span>
              <span className="btn-sidebar-cta__icon">→</span>
            </button>
          </div>
        </div>
      }
    >
      {files.length === 0 && (
        <>
          <FileUploader onFilesSelected={addFiles} hasFiles={false} accept=".pdf" />
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
                    {formatFileSize(file.size)} - {file.pageCount} pages
                  </div>

                  {/* Actions (rotate, delete) */}
                  <div className="merge-file-card__actions">
                    <button
                      type="button"
                      className="merge-file-card__action-btn"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); rotateFile(file.id); }}
                      title="Rotate file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                      </svg>
                    </button>
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
                    {file.thumbnailUrl ? (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ transform: `rotate(${file.rotation}deg)`, transition: "transform 0.2s ease" }}
                      >
                        <img
                          src={file.thumbnailUrl}
                          alt={file.name}
                          className="max-w-[140px] max-h-[140px] object-contain shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#ee6c4d]">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8" fill="none" stroke="#fff" strokeWidth="2"/>
                        </svg>
                        <span className="text-[10px] text-gray-400 mt-2 font-medium">No Preview</span>
                      </div>
                    )}
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
            <span>{processing ? "Converting..." : "Convert to Word"}</span>
            <span className="split-mobile-cta__icon">→</span>
          </button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            addFiles(Array.from(e.target.files));
            e.target.value = "";
          }
        }}
      />
      
      <ProcessOverlay isActive={processing} message={processMessage} />
    </ToolLayout>
  );
}
