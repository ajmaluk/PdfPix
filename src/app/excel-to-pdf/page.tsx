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

export default function ExcelToPdfPage() {
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
      for (const entry of files) {
        const pdfDoc = await PDFDocument.create();
        let rows: string[][] = [];

        if (entry.name.toLowerCase().endsWith(".csv")) {
          const text = await entry.file.text();
          rows = text.split("\n")
            .map(line => line.split(",").map(cell => cell.trim().replace(/^"|"$/g, "")))
            .filter(row => row.length > 0 && row.some(cell => cell !== ""));
        } else {
          // Parse .xlsx zip structure natively
          const JSZipImport = await import("jszip");
          // @ts-ignore
          const JSZip = JSZipImport.default || JSZipImport;
          const zip = await JSZip.loadAsync(entry.file);
          
          // 1. Load sharedStrings.xml
          const sharedStrings: string[] = [];
          try {
            const ssXml = await zip.file("xl/sharedStrings.xml")?.async("string");
            if (ssXml) {
              const matches = ssXml.match(/<t[^>]*>([\s\S]*?)<\/t>/g);
              if (matches) {
                sharedStrings.push(...matches.map(m => m.replace(/<t[^>]*>/, "").replace("</t>", "")));
              }
            }
          } catch (e) {
            console.error("No shared strings found in Excel zip:", e);
          }
          
          // 2. Load worksheets/sheet1.xml
          const sheetXml = await zip.file("xl/worksheets/sheet1.xml")?.async("string");
          if (sheetXml) {
            const rowMatches = sheetXml.match(/<row[^>]*>([\s\S]*?)<\/row>/g);
            if (rowMatches) {
              rowMatches.forEach(rowXml => {
                const cellMatches = rowXml.match(/<c[^>]*>([\s\S]*?)<\/c>/g);
                const rowCells: string[] = [];
                if (cellMatches) {
                  cellMatches.forEach(cellXml => {
                    const typeMatch = cellXml.match(/t="([^"]*)"/);
                    const isShared = typeMatch && typeMatch[1] === "s";
                    const valMatch = cellXml.match(/<v>([^<]*)<\/v>/);
                    let value = "";
                    if (valMatch) {
                      const rawVal = valMatch[1];
                      if (isShared) {
                        const idx = parseInt(rawVal, 10);
                        value = sharedStrings[idx] || rawVal;
                      } else {
                        value = rawVal;
                      }
                    }
                    rowCells.push(value);
                  });
                }
                if (rowCells.length > 0 && rowCells.some(c => c !== "")) {
                  rows.push(rowCells);
                }
              });
            }
          }
        }

        // Render rows as a table on the PDF with pagination
        let page = pdfDoc.addPage([612, 792]);
        let y = 720;
        page.drawText(`Sheet: ${entry.name}`, { x: 50, y, size: 14 });
        y -= 40;
        
        for (const row of rows) {
          if (y < 50) {
            page = pdfDoc.addPage([612, 792]);
            y = 720;
          }
          
          let xOffset = 50;
          const maxCols = Math.min(row.length, 6);
          for (let colIdx = 0; colIdx < maxCols; colIdx++) {
            const cellValue = row[colIdx] || "";
            const cellText = cellValue.substring(0, 15);
            page.drawText(cellText, { x: xOffset, y, size: 9 });
            xOffset += 90; // column width spacing
          }
          y -= 18;
        }
        
        const bytes = await pdfDoc.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        downloadBlob(blob, `${entry.name.replace(/\.[^.]+$/, "")}.pdf`);
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Failed to convert Excel to PDF. Please try again.");
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
    <ToolLayout toolId="excel-to-pdf"
      title="Excel to PDF"
      subtitle="Make EXCEL spreadsheets easy to read by converting them to PDF."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={
        <div className="option__panel split-sidebar-panel">
          <div className="split-sidebar-panel__header">
            <div className="option__panel__title split-sidebar-panel__title text-center w-full">Excel to PDF</div>
          </div>

          <div className="option__panel__content split-sidebar-panel__content">
            {/* Input Format Info */}
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Accepted Formats</label>
              <div className="flex items-center gap-3 rounded-xl border-2 border-[#217346] bg-[#f0faf4] px-4 py-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#217346] text-white font-black text-[10px]">
                  XLS
                </div>
                <div>
                  <div className="text-sm font-bold text-[#217346]">Excel → PDF</div>
                  <div className="text-[10px] text-[#5a8f6e] font-medium">.xlsx, .xls, .csv supported</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="split-section">
              <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
              <div className="space-y-2">
                {["Native XLSX parsing", "CSV & Excel support", "Table layout in PDF", "Batch conversion"].map((feature) => (
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
          <FileUploader onFilesSelected={addFiles} hasFiles={false} accept=".csv,.xls,.xlsx" />
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
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#217346]">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8" fill="none" stroke="#fff" strokeWidth="2"/>
                      </svg>
                      <span className="text-[10px] text-[#217346] mt-2 font-bold select-none uppercase">Excel Sheet</span>
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
        accept=".csv,.xls,.xlsx"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            addFiles(Array.from(e.target.files));
            e.target.value = "";
          }
        }}
      />
      
      <ProcessOverlay isActive={processing} message="Converting Excel to PDF..." />
    </ToolLayout>
  );
}
