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

interface ZipEntry {
  async(type: "base64"): Promise<string>;
}

interface ZipLike {
  file(path: string): ZipEntry | null;
}

function sanitizeWinAnsiText(str: string): string {
  if (!str) return "";
  return str
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/[\u2013\u2014]/g, "-") // em/en dashes
    .replace(/[\u2022\uf0b4\uf0b7]/g, "*") // bullet points
    .replace(/\u00A0/g, " ")         // non-breaking space
    .replace(/[^\x00-\x7F\u00A0-\u00FF]/g, ""); // strip anything outside standard WinAnsi / Latin-1 range
}

async function drawSlideToCanvas(
  slideXml: string, 
  relsXml: string | null, 
  zip: ZipLike, 
  canvas: HTMLCanvasElement
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas (default to white slide background)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Standard slide dimensions (usually 12192000 x 6858000 EMUs, matching 16:9 widescreen layout)
  const slideWidthEmu = 12192000;
  const slideHeightEmu = 6858000;
  
  const scaleX = canvas.width / slideWidthEmu;
  const scaleY = canvas.height / slideHeightEmu;

  // Parse relationships to locate media resources
  const relMap: Record<string, string> = {};
  if (relsXml) {
    const relMatches = relsXml.match(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g) || [];
    for (const m of relMatches) {
      const idMatch = m.match(/Id="([^"]+)"/);
      const targetMatch = m.match(/Target="([^"]+)"/);
      if (idMatch && targetMatch) {
        // Maps Target to relative path inside the zip
        relMap[idMatch[1]] = targetMatch[1].replace("../", "ppt/");
      }
    }
  }

  // Parse shape and picture tags in order to preserve visual z-index overlapping
  const elements = slideXml.match(/<(p:sp|p:pic)[^>]*>([\s\S]*?)<\/p:(sp|pic)>/g) || [];

  for (const element of elements) {
    const isPic = element.startsWith("<p:pic");
    
    // Parse coordinates and bounding boxes
    const offMatch = element.match(/<a:off[^>]*x="(-?\d+)"[^>]*y="(-?\d+)"/);
    const extMatch = element.match(/<a:ext[^>]*cx="(\d+)"[^>]*cy="(\d+)"/);
    if (!offMatch || !extMatch) continue;

    const x = parseInt(offMatch[1], 10) * scaleX;
    const y = parseInt(offMatch[2], 10) * scaleY;
    const w = parseInt(extMatch[1], 10) * scaleX;
    const h = parseInt(extMatch[2], 10) * scaleY;

    if (isPic) {
      // Decode and render slide image
      const blipMatch = element.match(/<a:blip[^>]*r:embed="([^"]+)"/);
      const rId = blipMatch ? blipMatch[1] : null;
      if (rId && relMap[rId]) {
        const imagePath = relMap[rId];
        const imageFile = zip.file(imagePath);
        if (imageFile) {
          const imgBase64 = await imageFile.async("base64");
          const imgType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";
          const img = new Image();
          await new Promise<void>((resolve) => {
            img.onload = () => {
              ctx.drawImage(img, x, y, w, h);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = `data:${imgType};base64,${imgBase64}`;
          });
        }
      }
    } else {
      // Parse shape properties only to prevent text run colors (inside txBody) from overriding background fills
      const spPrMatch = element.match(/<p:spPr[^>]*>([\s\S]*?)<\/p:spPr>/);
      const spPr = spPrMatch ? spPrMatch[1] : "";

      // Draw standard shape background if a solid fill exists inside spPr
      const fillMatch = spPr.match(/<a:solidFill[^>]*>[\s\S]*?<a:srgbClr[^>]*val="([0-9A-Fa-f]{6})"/);
      if (fillMatch) {
        ctx.fillStyle = `#${fillMatch[1]}`;
        ctx.fillRect(x, y, w, h);
      }

      // Draw outlines if present inside spPr
      const lnMatch = spPr.match(/<a:ln[^>]*>[\s\S]*?<a:solidFill[^>]*>[\s\S]*?<a:srgbClr[^>]*val="([0-9A-Fa-f]{6})"/);
      if (lnMatch) {
        ctx.strokeStyle = `#${lnMatch[1]}`;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(x, y, w, h);
      }

      // Draw structured text body runs inside textframes
      const txBodyMatch = element.match(/<p:txBody[^>]*>([\s\S]*?)<\/p:txBody>/);
      if (txBodyMatch) {
        const paragraphs = txBodyMatch[1].match(/<a:p[^>]*>([\s\S]*?)<\/a:p>/g) || [];
        let currY = y + 16;

        for (const p of paragraphs) {
          const runs = p.match(/<a:r[^>]*>([\s\S]*?)<\/a:r>/g) || [];
          let paragraphText = "";
          let isBold = false;
          let fontSize = 14;
          let fontColor = "#000000";

          for (const r of runs) {
            const tMatch = r.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/);
            if (tMatch) {
              paragraphText += sanitizeWinAnsiText(tMatch[1]);
            }
            if (r.includes('b="1"')) isBold = true;
            const szMatch = r.match(/sz="(\d+)"/);
            if (szMatch) fontSize = Math.max(10, parseInt(szMatch[1], 10) / 100);
            const colorMatch = r.match(/<a:solidFill[^>]*>[\s\S]*?<a:srgbClr[^>]*val="([0-9A-Fa-f]{6})"/);
            if (colorMatch) fontColor = `#${colorMatch[1]}`;
          }

          // Fallback if formatting structure is plain
          if (!paragraphText) {
            const fallbackMatch = p.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g) || [];
            paragraphText = fallbackMatch
              .map((m) => sanitizeWinAnsiText(m.replace(/<a:t[^>]*>/, "").replace("</a:t>", "")))
              .join("");
          }

          if (paragraphText.trim()) {
            ctx.fillStyle = fontColor;
            ctx.font = `${isBold ? "bold " : ""}${fontSize}px Arial, sans-serif`;
            
            const words = paragraphText.split(" ");
            let line = "";
            for (const word of words) {
              const testLine = line ? line + " " + word : word;
              const metrics = ctx.measureText(testLine);
              if (metrics.width > w - 10) {
                ctx.fillText(line, x + 5, currY);
                currY += fontSize * 1.25;
                line = word;
              } else {
                line = testLine;
              }
            }
            if (line) {
              ctx.fillText(line, x + 5, currY);
              currY += fontSize * 1.5;
            }
          }
        }
      }
    }
  }
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
          // Offscreen slide canvas renderer
          const canvas = document.createElement("canvas");
          canvas.width = 960;
          canvas.height = 540;

          for (let idx = 0; idx < slideFiles.length; idx++) {
            const slidePath = slideFiles[idx];
            const slideXmlStr = await zip.file(slidePath)!.async("string");
            
            // Map relationships to query media (images)
            const relsPath = slidePath.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels";
            const relsFile = zip.file(relsPath);
            const relsXmlStr = relsFile ? await relsFile.async("string") : null;

            await drawSlideToCanvas(slideXmlStr, relsXmlStr, zip, canvas);

            const imgData = canvas.toDataURL("image/jpeg", 0.95);
            const slideImage = await pdfDoc.embedJpg(imgData);

            // Add landscape slide page layout
            const page = pdfDoc.addPage([720, 405]);
            page.drawImage(slideImage, {
              x: 0,
              y: 0,
              width: 720,
              height: 405,
            });
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
