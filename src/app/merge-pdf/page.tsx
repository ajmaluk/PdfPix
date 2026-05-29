"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer, formatFileSize } from "@/lib/pdf-utils";
import { useTool } from "@/components/ToolContext";
import { PDFDocument, degrees } from "pdf-lib";
import AdSpace from "@/components/AdSpace";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
  pageCount: number;
  rotation: number; // 0, 90, 180, 270 degrees
  thumbnailUrl: string; // page 1 preview data URL
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

export default function MergePdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState("Merging PDFs...");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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
    setProcessMessage("Loading PDF files...");
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

  const sortFiles = useCallback(() => {
    setFiles((prev) => {
      const sorted = [...prev].sort((a, b) => {
        if (sortOrder === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
      return sorted;
    });
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, [sortOrder]);

  const mergePdfs = useCallback(async () => {
    if (files.length < 2) return;
    setProcessMessage("Merging PDFs...");
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const entry of files) {
        const buffer = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const indices = pdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(pdf, indices);
        copiedPages.forEach((page) => {
          if (entry.rotation) {
            page.setRotation(degrees(entry.rotation));
          }
          mergedPdf.addPage(page);
        });
      }
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as BlobPart], { type: "application/pdf" });
      downloadBlob(blob, "merged.pdf");
    } catch (err) {
      console.error("Merge failed:", err);
      alert("Failed to merge PDFs. Please try again.");
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
    <ToolLayout toolId="merge"
      title="Merge PDF files"
      subtitle="Combine PDFs in the order you want with the easiest PDF merger available."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={
        <div className="option__panel option__panel--active">
          <div className="option__panel__title text-2xl font-bold tracking-tight text-[#33333b] border-b border-gray-100 pb-3 mb-4">
            Merge PDF
          </div>
          <div className="option__panel__content flex-1 flex flex-col justify-between h-full">
            {files.length === 1 ? (
              <div className="flex items-start gap-3 bg-[#e8f4fd] border border-[#d2ebfc] rounded-lg p-4 text-left shadow-sm">
                <div className="shrink-0 text-[#2196f3] mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <p className="text-xs text-[#0d47a1] leading-relaxed font-semibold">
                  Please, select more PDF files by clicking again on &apos;Select PDF files&apos;.
                  <br />Select multiple files by maintaining pressed &apos;Ctrl&apos;
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-[#e8f4fd] border border-[#d2ebfc] rounded-lg p-4 text-left shadow-sm">
                <div className="shrink-0 text-[#2196f3] mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <p className="text-xs text-[#0d47a1] leading-relaxed font-semibold">
                  To change the order of your PDFs, drag and drop the files as you want.
                </p>
              </div>
            )}

            <button 
              className="merge-submit-btn mt-auto" 
              onClick={mergePdfs} 
              disabled={files.length < 2 || processing}
            >
              <span>Merge PDF</span>
              <span className="merge-submit-btn__arrow">→</span>
            </button>
          </div>
        </div>
      }
    >
      {files.length === 0 && (
        <>
          <FileUploader onFilesSelected={addFiles} hasFiles={false} />
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

              {/* Sort Button */}
              {files.length >= 1 && (
                <button
                  onClick={sortFiles}
                  title="Order files alphabetically"
                  className="merge-sort-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="#383E45" fillRule="evenodd">
                    <path d="M2.947 15.297V.23c0-.067.026-.123.077-.166S3.14 0 3.22 0h1.635c.08 0 .145.022.196.065s.077.1.077.166v15.066h2.5a.39.39 0 0 1 .261.087.28.28 0 0 1 .102.222c0 .077-.038.154-.114.23l-3.62 3.076a.42.42 0 0 1-.261.087c-.09 0-.178-.03-.26-.087L.11 15.828c-.113-.103-.14-.215-.08-.338.06-.13.174-.193.34-.193h2.575z" fillRule="nonzero"/>
                    <path d="M11.222 20.2l2.94-7.52c.194-.496.555-.67 1.1-.67h.54c.513 0 .97.12 1.22.804l2.746 7.386c.083.214.222.603.222.845 0 .536-.485.965-1.068.965-.5 0-.86-.174-1.026-.603l-.582-1.6h-3.66l-.596 1.6c-.153.43-.47.603-1.012.603-.624 0-1.054-.375-1.054-.965 0-.24.14-.63.222-.845zm5.602-1.93l-1.3-3.874h-.028L14.15 18.27h2.663zM11.346 8l4.75-6.083h-3.66c-.602 0-1.088-.333-1.088-.958S11.832 0 12.434 0h5.53c.538 0 .973.25.973 1.042 0 .278-.102.583-.294.82l-4.826 6.222h4.096c.602 0 1.088.333 1.088.958s-.486.958-1.088.958h-5.696C11.448 10 11 9.722 11 8.875c0-.36.154-.625.346-.875z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <button 
            className="split-mobile-cta show--sm" 
            onClick={mergePdfs} 
            disabled={files.length < 2 || processing}
          >
            <span>{processing ? "Merging..." : "Merge PDF"}</span>
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
