"use client";
import AdSpace from "@/components/AdSpace";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import ProcessOverlay from "@/components/ProcessOverlay";
import { generateFileId, downloadBlob, readFileAsArrayBuffer, formatFileSize } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";

interface PageDetail {
  number: number;
  width: number;
  height: number;
  rotation: number;
  aspectRatio: string;
}

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

interface ComparisonData {
  files: {
    name: string;
    size: string;
    sizeBytes: number;
    pages: number;
    dimensions: string;
    width: number;
    height: number;
    pageDetails: PageDetail[];
  }[];
  diffs: {
    pageCountDiff: string;
    sizeDiff: string;
    identical: boolean;
    pageLevelDifferences: string[];
  };
}

export default function ComparePdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonData | null>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles.map((f) => ({ id: generateFileId(), name: f.name, size: f.size, file: f }))]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const getPageSizeLabel = (width: number, height: number) => {
    const w = Math.round(width);
    const h = Math.round(height);
    // Common sizes in points (72 points = 1 inch)
    if ((w === 595 && h === 842) || (w === 842 && h === 595)) return "A4";
    if ((w === 612 && h === 792) || (w === 792 && h === 612)) return "Letter";
    if ((w === 612 && h === 1008) || (w === 1008 && h === 612)) return "Legal";
    if ((w === 842 && h === 1191) || (w === 1191 && h === 842)) return "A3";
    return `${w} × ${h} pt`;
  };

  const compare = useCallback(async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const parsedFilesData: any[] = [];
      for (const entry of files) {
        const buf = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = pdf.getPages();
        let totalWidth = 0;
        let totalHeight = 0;
        const pageDetails: PageDetail[] = [];

        pages.forEach((p, idx) => {
          const { width, height } = p.getSize();
          const rotation = p.getRotation().angle;
          totalWidth += width;
          totalHeight += height;
          pageDetails.push({
            number: idx + 1,
            width: parseFloat(width.toFixed(1)),
            height: parseFloat(height.toFixed(1)),
            rotation,
            aspectRatio: width > height ? "Landscape" : "Portrait"
          });
        });

        const avgWidth = pages.length > 0 ? (totalWidth / pages.length).toFixed(1) : "0";
        const avgHeight = pages.length > 0 ? (totalHeight / pages.length).toFixed(1) : "0";
        
        parsedFilesData.push({
          name: entry.name,
          size: formatFileSize(entry.size),
          sizeBytes: entry.size,
          pages: pdf.getPageCount(),
          dimensions: `${avgWidth} x ${avgHeight} pt`,
          width: parseFloat(avgWidth),
          height: parseFloat(avgHeight),
          pageDetails,
        });
      }

      let pageCountDiff = "Page counts match";
      let sizeDiff = "Dimensions match";
      let identical = true;
      const pageLevelDifferences: string[] = [];

      if (parsedFilesData.length >= 2) {
        const f1 = parsedFilesData[0];
        const f2 = parsedFilesData[1];
        
        if (f1.pages !== f2.pages) {
          identical = false;
          pageCountDiff = `Page count mismatch: "${f1.name}" has ${f1.pages} page(s) while "${f2.name}" has ${f2.pages} page(s).`;
        }

        const sizeDelta = Math.abs(f1.width - f2.width) + Math.abs(f1.height - f2.height);
        if (sizeDelta > 1) { 
          identical = false;
          sizeDiff = `Average dimensions mismatch: ${f1.dimensions} vs ${f2.dimensions}`;
        }

        if (f1.sizeBytes !== f2.sizeBytes) {
          identical = false;
        }

        // Page by page comparison
        const maxPages = Math.max(f1.pages, f2.pages);
        for (let i = 0; i < maxPages; i++) {
          const p1 = f1.pageDetails[i];
          const p2 = f2.pageDetails[i];

          if (!p1) {
            pageLevelDifferences.push(`Page ${i + 1}: Missing in "${f1.name}" (only present in "${f2.name}")`);
            identical = false;
          } else if (!p2) {
            pageLevelDifferences.push(`Page ${i + 1}: Missing in "${f2.name}" (only present in "${f1.name}")`);
            identical = false;
          } else {
            const wDiff = Math.abs(p1.width - p2.width) > 1;
            const hDiff = Math.abs(p1.height - p2.height) > 1;
            const rotDiff = p1.rotation !== p2.rotation;

            if (wDiff || hDiff || rotDiff) {
              identical = false;
              let detail = `Page ${i + 1}: Mismatch - `;
              if (wDiff || hDiff) {
                detail += `Dimensions (${p1.width}×${p1.height} pt vs ${p2.width}×${p2.height} pt) `;
              }
              if (rotDiff) {
                detail += `Rotation (${p1.rotation}° vs ${p2.rotation}°) `;
              }
              pageLevelDifferences.push(detail);
            }
          }
        }
      }

      setComparisonResult({
        files: parsedFilesData,
        diffs: {
          pageCountDiff,
          sizeDiff,
          identical,
          pageLevelDifferences,
        }
      });
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed to compare PDFs. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const sidebarContent = (
    <div className="option__panel split-sidebar-panel">
      <div className="split-sidebar-panel__header">
        <div className="option__panel__title split-sidebar-panel__title text-center w-full">Compare PDF</div>
      </div>

      <div className="option__panel__content split-sidebar-panel__content">
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Compare Documents</label>
          <p className="text-[12px] text-[#555c66] font-medium leading-relaxed">
            Upload at least 2 PDF files to compare structure, metadata, page sizes, and dimensions.
          </p>
        </div>

        {/* Features */}
        <div className="split-section">
          <label className="text-xs font-bold text-[#8a8a92] uppercase tracking-wider block mb-3">Features</label>
          <div className="space-y-2">
            {["Compare page sizes & dimensions", "Analyze differences side-by-side", "Download comprehensive comparison reports", "100% In-browser processing"].map((feature) => (
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
          onClick={compare} 
          disabled={files.length < 2 || processing} 
          className="btn-sidebar-cta"
          style={{ backgroundColor: "#3b82f6" }}
        >
          <span>{processing ? "Comparing..." : "Compare PDFs!"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout 
      toolId="compare" 
      title="Compare PDF" 
      subtitle="Compare two PDF files side by side to find differences."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={sidebarContent}
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} accept=".pdf" />
      <AdSpace />
      <FileList files={files} onRemove={removeFile} onAddFiles={addFiles} accept=".pdf" />
      
      {files.length >= 2 && (
        <button 
          className="split-mobile-cta show--sm" 
          onClick={compare} 
          disabled={processing}
          style={{ backgroundColor: "#3b82f6" }}
        >
          <span>{processing ? "Comparing..." : "Compare PDFs"}</span>
          <span className="split-mobile-cta__icon">→</span>
        </button>
      )}
      
      <ProcessOverlay isActive={processing} message="Comparing PDFs..." />

      {comparisonResult && (
        <div className="fixed inset-0 z-[2030] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0c111d]/60 backdrop-blur-md transition-opacity" onClick={() => setComparisonResult(null)}></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[85vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 shrink-0">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  </svg>
                </div>
                <span>Comparison Report</span>
              </h3>
              <button 
                type="button" 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-50"
                onClick={() => setComparisonResult(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-thin">
              {/* Overall status badge */}
              <div className={`p-4 rounded-xl flex items-center gap-3.5 border ${
                comparisonResult.diffs.identical 
                  ? "bg-emerald-50/40 border-emerald-100/80 text-emerald-950" 
                  : "bg-amber-50/40 border-amber-100/80 text-amber-950"
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  comparisonResult.diffs.identical ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                }`}>
                  {comparisonResult.diffs.identical ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {comparisonResult.diffs.identical ? "Documents are identical" : "Differences detected"}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 font-medium">
                    {comparisonResult.diffs.identical 
                      ? "Both documents have identical layout, rotation, and dimensions page-by-page."
                      : "Layout, page sizes, rotation or dimensions vary between the two documents."}
                  </div>
                </div>
              </div>

              {/* Side-by-side files info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparisonResult.files.map((file, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-[#f9fafb] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                          Document {idx + 1}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{file.size}</span>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm break-all mb-3" title={file.name}>
                        {file.name}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">Total Pages</span>
                        <span className="font-semibold text-gray-800 bg-white border border-gray-150 px-1.5 py-0.5 rounded">{file.pages}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">Avg Dimensions</span>
                        <span className="font-semibold text-gray-800">{file.dimensions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">Format</span>
                        <span className="font-semibold text-gray-800">
                          {getPageSizeLabel(file.width, file.height)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Page-by-page details overview */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Side-by-Side Page Analysis</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#f9fafb] text-gray-400 font-medium border-b border-gray-100">
                          <th className="p-3 w-16 text-center">Page</th>
                          <th className="p-3 border-l border-gray-100">Document 1 Details</th>
                          <th className="p-3 border-l border-gray-100">Document 2 Details</th>
                          <th className="p-3 border-l border-gray-100 text-center w-24">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {Array.from({ length: Math.max(comparisonResult.files[0].pages, comparisonResult.files[1].pages) }).map((_, i) => {
                          const p1 = comparisonResult.files[0].pageDetails[i];
                          const p2 = comparisonResult.files[1].pageDetails[i];
                          
                          const isMatch = p1 && p2 && 
                            Math.abs(p1.width - p2.width) <= 1 && 
                            Math.abs(p1.height - p2.height) <= 1 && 
                            p1.rotation === p2.rotation;

                          return (
                            <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${!isMatch ? "bg-red-50/10" : ""}`}>
                              <td className="p-3 font-semibold text-gray-800 text-center">{i + 1}</td>
                              
                              <td className="p-3 border-l border-gray-100 text-gray-700">
                                {p1 ? (
                                  <div className="space-y-0.5">
                                    <div className="font-semibold text-gray-800">{getPageSizeLabel(p1.width, p1.height)} ({p1.aspectRatio})</div>
                                    <div className="text-[10px] text-gray-400">{p1.width} × {p1.height} pt · {p1.rotation}°</div>
                                  </div>
                                ) : (
                                  <span className="text-red-500 font-medium italic">Page not present</span>
                                )}
                              </td>

                              <td className="p-3 border-l border-gray-100 text-gray-700">
                                {p2 ? (
                                  <div className="space-y-0.5">
                                    <div className="font-semibold text-gray-800">{getPageSizeLabel(p2.width, p2.height)} ({p2.aspectRatio})</div>
                                    <div className="text-[10px] text-gray-400">{p2.width} × {p2.height} pt · {p2.rotation}°</div>
                                  </div>
                                ) : (
                                  <span className="text-red-500 font-medium italic">Page not present</span>
                                )}
                              </td>

                              <td className="p-3 border-l border-gray-100 text-center">
                                {isMatch ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    Match
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                                    Mismatch
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Page-level difference log if any */}
              {comparisonResult.diffs.pageLevelDifferences.length > 0 && (
                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">Specific Layout Divergences</h4>
                  <ul className="space-y-1.5 text-xs text-rose-950 font-medium">
                    {comparisonResult.diffs.pageLevelDifferences.map((diff, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer / Action buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6 shrink-0">
              <button 
                type="button" 
                onClick={() => setComparisonResult(null)}
                className="px-4 py-2 rounded-lg border border-gray-250 text-xs font-semibold text-gray-650 hover:bg-gray-50 hover:text-gray-800 transition-colors"
              >
                Close View
              </button>
              <button 
                type="button" 
                onClick={() => {
                  let results = `PDF COMPARE REPORT\n==================\n\n`;
                  results += `File 1: ${comparisonResult.files[0].name} (${comparisonResult.files[0].size}, ${comparisonResult.files[0].pages} pages)\n`;
                  results += `File 2: ${comparisonResult.files[1].name} (${comparisonResult.files[1].size}, ${comparisonResult.files[1].pages} pages)\n\n`;
                  results += `STATUS: ${comparisonResult.diffs.identical ? "IDENTICAL LAYOUTS" : "DIFFERENCES DETECTED"}\n\n`;
                  results += `--- SIDE BY SIDE PAGE ANALYSIS ---\n`;
                  
                  const maxPages = Math.max(comparisonResult.files[0].pages, comparisonResult.files[1].pages);
                  for (let i = 0; i < maxPages; i++) {
                    const p1 = comparisonResult.files[0].pageDetails[i];
                    const p2 = comparisonResult.files[1].pageDetails[i];
                    results += `Page ${i + 1}:\n`;
                    results += `  Doc 1: ${p1 ? `${p1.width} x ${p1.height} pt, ${p1.rotation} deg (${p1.aspectRatio})` : "N/A"}\n`;
                    results += `  Doc 2: ${p2 ? `${p2.width} x ${p2.height} pt, ${p2.rotation} deg (${p2.aspectRatio})` : "N/A"}\n`;
                    const match = p1 && p2 && p1.width === p2.width && p1.height === p2.height && p1.rotation === p2.rotation;
                    results += `  Status: ${match ? "Match" : "Mismatch"}\n\n`;
                  }
                  
                  if (comparisonResult.diffs.pageLevelDifferences.length > 0) {
                    results += `--- SPECIFIC DIVERGENCES ---\n`;
                    comparisonResult.diffs.pageLevelDifferences.forEach(d => {
                      results += `- ${d}\n`;
                    });
                  }
                  
                  const blob = new Blob([results], { type: "text/plain" });
                  downloadBlob(blob, "pdf-comparison-report.txt");
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
                style={{ backgroundColor: "#3b82f6" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
