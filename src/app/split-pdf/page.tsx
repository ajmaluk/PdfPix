"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessOverlay from "@/components/ProcessOverlay";
import { downloadBlob, generateFileId, readFileAsArrayBuffer, formatFileSize } from "@/lib/pdf-utils";
import { PDFDocument } from "pdf-lib";
import type { PDFDocumentProxy } from "pdfjs-dist";
import JSZip from "jszip";
import AdSpace from "@/components/AdSpace";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

interface CustomRange {
  id: string;
  from: number;
  to: number;
}

function RangeTabIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="6" y="12" width="11" height="24" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <rect x="31" y="12" width="11" height="24" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <path d="M18 24h12" stroke="currentColor" strokeWidth="2.8" strokeDasharray="4 4" strokeLinecap="round" />
      <rect x="2.75" y="8.75" width="42.5" height="30.5" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    </svg>
  );
}

function PagesTabIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="7" y="12" width="12" height="24" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <path d="M24 14v20M24 24h8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <rect x="30" y="9" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <rect x="30" y="19" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <rect x="30" y="29" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.8" />
    </svg>
  );
}

function SizeTabIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="7" y="12" width="12" height="24" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <path d="M24 14v20M24 24h9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <rect x="32" y="8" width="12" height="12" rx="1.8" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <rect x="32" y="28" width="8" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.8" />
    </svg>
  );
}

function PageThumbnail({
  pageNumber,
  thumbnails,
  getPageThumbnail,
}: {
  pageNumber: number;
  thumbnails: Record<number, string>;
  getPageThumbnail: (n: number) => void;
}) {
  useEffect(() => {
    getPageThumbnail(pageNumber);
  }, [pageNumber, getPageThumbnail]);

  const src = thumbnails[pageNumber];

  if (!src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#f3f4f6] animate-pulse rounded">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ee6c4d" opacity="0.4">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" fill="none" stroke="#fff" strokeWidth="2" />
        </svg>
        <span className="text-[10px] text-[#9ca3af] mt-1 select-none">Loading page {pageNumber}...</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`Page ${pageNumber}`}
      width={240}
      height={320}
      unoptimized
      className="w-full h-full object-contain pointer-events-none select-none"
    />
  );
}

export default function SplitPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<"range" | "pages" | "size">("range");
  const [rangeMode, setRangeMode] = useState<"custom" | "fixed" | "smart">("custom");
  const [ranges, setRanges] = useState<CustomRange[]>([{ id: "1", from: 1, to: 1 }]);
  const [fixedPages, setFixedPages] = useState(1);
  const [pagesMode, setPagesMode] = useState<"all" | "select">("all");
  const [selectedPages, setSelectedPages] = useState<Record<number, boolean>>({});
  const [sizeLimit, setSizeLimit] = useState(10);
  const [mergeAllRanges, setMergeAllRanges] = useState(false);

  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const changeInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((file) => ({
      id: generateFileId(),
      name: file.name,
      size: file.size,
      file,
    })));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setTotalPages(0);
    setThumbnails({});
    setSelectedPages({});
    setRanges([{ id: generateFileId(), from: 1, to: 1 }]);
    pdfDocRef.current = null;
  }, []);

  useEffect(() => {
    if (files.length === 0) {
      setTotalPages(0);
      setThumbnails({});
      pdfDocRef.current = null;
      return;
    }

    const loadPdfDetails = async () => {
      setProcessing(true);
      try {
        const buffer = await readFileAsArrayBuffer(files[0].file);
        const data = new Uint8Array(buffer);
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
        const doc = await pdfjsLib.getDocument({ data: data.slice(0) }).promise;

        pdfDocRef.current = doc;

        const count = doc.numPages;
        const initialSelected: Record<number, boolean> = {};
        for (let page = 1; page <= count; page++) {
          initialSelected[page] = true;
        }

        setTotalPages(count);
        setSelectedPages(initialSelected);
        setRanges([{ id: generateFileId(), from: 1, to: count }]);
        setThumbnails({});
      } catch (error) {
        console.error("Error loading PDF details:", error);
        alert("Failed to load PDF. It might be corrupted or encrypted.");
        clearFiles();
      } finally {
        setProcessing(false);
      }
    };

    loadPdfDetails();
  }, [clearFiles, files]);

  const getPageThumbnail = useCallback(async (pageNumber: number) => {
    if (thumbnails[pageNumber] || !pdfDocRef.current) return;

    try {
      const page = await pdfDocRef.current.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");

      if (!context) return;

      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      setThumbnails((prev) => ({ ...prev, [pageNumber]: dataUrl }));
    } catch (error) {
      console.error(`Page ${pageNumber} render error:`, error);
    }
  }, [thumbnails]);

  const updateRange = useCallback((id: string, field: "from" | "to", value: number) => {
    let nextValue = Number.isNaN(value) ? 1 : value;
    if (nextValue < 1) nextValue = 1;
    if (nextValue > totalPages) nextValue = totalPages;

    setRanges((prev) =>
      prev.map((range) => {
        if (range.id !== id) return range;

        const updated = { ...range, [field]: nextValue };
        if (field === "from" && updated.from > updated.to) updated.to = updated.from;
        if (field === "to" && updated.to < updated.from) updated.from = updated.to;
        return updated;
      })
    );
  }, [totalPages]);

  const addRange = useCallback(() => {
    const lastRange = ranges[ranges.length - 1];
    const nextFrom = lastRange ? Math.min(lastRange.to + 1, totalPages) : 1;
    const nextTo = Math.min(nextFrom + 9, totalPages);
    setRanges((prev) => [...prev, { id: generateFileId(), from: nextFrom, to: nextTo }]);
  }, [ranges, totalPages]);

  const removeRange = useCallback((id: string) => {
    if (ranges.length <= 1) return;
    setRanges((prev) => prev.filter((range) => range.id !== id));
  }, [ranges.length]);

  const togglePageSelection = useCallback((pageNumber: number) => {
    setSelectedPages((prev) => ({
      ...prev,
      [pageNumber]: !prev[pageNumber],
    }));
  }, []);

  const selectedCount = useMemo(
    () => Object.values(selectedPages).filter(Boolean).length,
    [selectedPages]
  );

  const splitPdf = useCallback(async () => {
    if (files.length === 0) return;

    setProcessing(true);

    try {
      const buffer = await readFileAsArrayBuffer(files[0].file);
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdf.getPageCount();
      const zip = new JSZip();
      const outputs: { name: string; blob: Blob }[] = [];
      const baseName = files[0].name.replace(/\.pdf$/i, "");

      if (activeTab === "range") {
        if (rangeMode === "custom") {
          if (mergeAllRanges) {
            const mergedPdf = await PDFDocument.create();
            for (const range of ranges) {
              const indices = Array.from(
                { length: range.to - range.from + 1 },
                (_, index) => range.from - 1 + index
              ).filter((index) => index < pageCount);

              if (indices.length === 0) continue;

              const copiedPages = await mergedPdf.copyPages(pdf, indices);
              copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const bytes = await mergedPdf.save();
            outputs.push({
              name: `${baseName}_split_merged.pdf`,
              blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
            });
          } else {
            for (const range of ranges) {
              const indices = Array.from(
                { length: range.to - range.from + 1 },
                (_, index) => range.from - 1 + index
              ).filter((index) => index < pageCount);

              if (indices.length === 0) continue;

              const splitDoc = await PDFDocument.create();
              const copiedPages = await splitDoc.copyPages(pdf, indices);
              copiedPages.forEach((page) => splitDoc.addPage(page));

              const bytes = await splitDoc.save();
              outputs.push({
                name: `${baseName}_range_${range.from}-${range.to}.pdf`,
                blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
              });
            }
          }
        } else if (rangeMode === "fixed") {
          const pagesPerFile = Math.max(fixedPages, 1);
          let fileIndex = 1;

          for (let start = 0; start < pageCount; start += pagesPerFile) {
            const end = Math.min(start + pagesPerFile, pageCount);
            const splitDoc = await PDFDocument.create();
            const indices = Array.from({ length: end - start }, (_, index) => start + index);
            const copiedPages = await splitDoc.copyPages(pdf, indices);
            copiedPages.forEach((page) => splitDoc.addPage(page));

            const bytes = await splitDoc.save();
            outputs.push({
              name: `${baseName}_part_${fileIndex}_page_${start + 1}-${end}.pdf`,
              blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
            });
            fileIndex += 1;
          }
        } else {
          let fileIndex = 1;
          for (let start = 0; start < pageCount; start += 2) {
            const end = Math.min(start + 2, pageCount);
            const splitDoc = await PDFDocument.create();
            const indices = Array.from({ length: end - start }, (_, index) => start + index);
            const copiedPages = await splitDoc.copyPages(pdf, indices);
            copiedPages.forEach((page) => splitDoc.addPage(page));

            const bytes = await splitDoc.save();
            outputs.push({
              name: `${baseName}_smart_chapter_${fileIndex}.pdf`,
              blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
            });
            fileIndex += 1;
          }
        }
      } else if (activeTab === "pages") {
        if (pagesMode === "all") {
          for (let index = 0; index < pageCount; index += 1) {
            const splitDoc = await PDFDocument.create();
            const [page] = await splitDoc.copyPages(pdf, [index]);
            splitDoc.addPage(page);
            const bytes = await splitDoc.save();
            outputs.push({
              name: `${baseName}_page_${index + 1}.pdf`,
              blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
            });
          }
        } else {
          const selectedIndices = Object.keys(selectedPages)
            .map(Number)
            .filter((pageNumber) => selectedPages[pageNumber])
            .map((pageNumber) => pageNumber - 1)
            .sort((a, b) => a - b);

          if (selectedIndices.length === 0) {
            alert("Please select at least one page to extract.");
            return;
          }

          if (mergeAllRanges) {
            const mergedPdf = await PDFDocument.create();
            const copiedPages = await mergedPdf.copyPages(pdf, selectedIndices);
            copiedPages.forEach((page) => mergedPdf.addPage(page));
            const bytes = await mergedPdf.save();
            outputs.push({
              name: `${baseName}_extracted_merged.pdf`,
              blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
            });
          } else {
            for (const index of selectedIndices) {
              const splitDoc = await PDFDocument.create();
              const [page] = await splitDoc.copyPages(pdf, [index]);
              splitDoc.addPage(page);
              const bytes = await splitDoc.save();
              outputs.push({
                name: `${baseName}_extracted_page_${index + 1}.pdf`,
                blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
              });
            }
          }
        }
      } else {
        const pieces = Math.max(2, Math.ceil(files[0].size / (sizeLimit * 1024 * 1024)));
        const pagesPerPiece = Math.ceil(pageCount / pieces);
        let partIndex = 1;

        for (let start = 0; start < pageCount; start += pagesPerPiece) {
          const end = Math.min(start + pagesPerPiece, pageCount);
          const splitDoc = await PDFDocument.create();
          const indices = Array.from({ length: end - start }, (_, index) => start + index);
          const copiedPages = await splitDoc.copyPages(pdf, indices);
          copiedPages.forEach((page) => splitDoc.addPage(page));
          const bytes = await splitDoc.save();

          outputs.push({
            name: `${baseName}_size_part_${partIndex}.pdf`,
            blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
          });
          partIndex += 1;
        }
      }

      if (outputs.length === 1) {
        downloadBlob(outputs[0].blob, outputs[0].name);
      } else if (outputs.length > 1) {
        for (const output of outputs) {
          zip.file(output.name, output.blob);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `${baseName}_split_files.zip`);
      }
    } catch (error) {
      console.error("PDF Split operation failed:", error);
      alert("Failed to split PDF. Please check the file and parameters.");
    } finally {
      setProcessing(false);
    }
  }, [
    activeTab,
    files,
    fixedPages,
    mergeAllRanges,
    pagesMode,
    rangeMode,
    ranges,
    selectedPages,
    sizeLimit,
  ]);

  const renderRangePreview = () => {
    if (activeTab === "range" && rangeMode === "custom") {
      return (
        <div className="split-range-preview-list">
          {ranges.map((range, index) => (
            <div key={range.id} className="split-range-preview">
              <div className="split-range-preview__title">Range {index + 1}</div>
              <div className="split-range-preview__frame">
                <div className="range-page-card">
                  <div className="range-page-card-image">
                    <PageThumbnail
                      pageNumber={range.from}
                      thumbnails={thumbnails}
                      getPageThumbnail={getPageThumbnail}
                    />
                  </div>
                  <div className="range-page-card-number">{range.from}</div>
                </div>

                <div className="split-range-preview__dots" aria-hidden="true">...</div>

                <div className="range-page-card">
                  <div className="range-page-card-image">
                    <PageThumbnail
                      pageNumber={range.to}
                      thumbnails={thumbnails}
                      getPageThumbnail={getPageThumbnail}
                    />
                  </div>
                  <div className="range-page-card-number">{range.to}</div>
                </div>

                {ranges.length > 1 && (
                  <button
                    onClick={() => removeRange(range.id)}
                    className="range-delete-btn"
                    title="Remove this range"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "range" && rangeMode === "fixed") {
      return (
        <div className="split-range-preview-list">
          <div className="split-range-preview">
            <div className="split-range-preview__title">Equal split preview</div>
            <div className="split-range-preview__summary">
              {Array.from({ length: Math.ceil(totalPages / (fixedPages || 1)) }).map((_, fileIndex) => {
                const start = fileIndex * (fixedPages || 1) + 1;
                const end = Math.min((fileIndex + 1) * (fixedPages || 1), totalPages);
                return (
                  <div key={fileIndex} className="split-summary-chip">
                    <div className="split-summary-chip__index">{fileIndex + 1}</div>
                    <div className="split-summary-chip__copy">
                      <span>File {fileIndex + 1}</span>
                      <span>Pages {start} - {end}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "range" && rangeMode === "smart") {
      return (
        <div className="split-range-preview-list">
          <div className="split-range-preview">
            <div className="split-range-preview__title">Smart split preview</div>
            <div className="split-range-preview__empty">
              <div className="split-range-preview__empty-icon">AI</div>
              <h4>Bookmark-aware splitting</h4>
              <p>Chapters and outline breaks will be detected automatically and exported as separate files.</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "pages") {
      return (
        <div className="split-page-mode">
          <div className="split-page-mode__header">
            <div className="split-page-mode__caption">Select pages to extract ({totalPages} total pages)</div>
            <button onClick={clearFiles} className="split-page-mode__clear">Clear File</button>
          </div>

          <div className="page-grid-container split-page-grid">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
              const isSelected = pagesMode === "all" || selectedPages[pageNumber];

              return (
                <div
                  key={pageNumber}
                  onClick={() => pagesMode === "select" && togglePageSelection(pageNumber)}
                  className={`page-grid-item ${pagesMode === "select" ? "cursor-pointer" : ""} ${isSelected ? "active" : ""}`}
                >
                  <div className="w-full aspect-[3/4] rounded bg-white flex items-center justify-center border border-[#edf2f7] overflow-hidden">
                    <PageThumbnail
                      pageNumber={pageNumber}
                      thumbnails={thumbnails}
                      getPageThumbnail={getPageThumbnail}
                    />
                  </div>
                  <div className="flex items-center justify-between w-full mt-2 px-1">
                    <span className="text-[11px] font-bold text-[#475569]">Page {pageNumber}</span>
                    {pagesMode === "select" && (
                      <input
                        type="checkbox"
                        checked={!!selectedPages[pageNumber]}
                        onChange={() => undefined}
                        className="accent-red-500 w-3.5 h-3.5"
                      />
                    )}
                    {pagesMode === "all" && <span className="split-page-grid__tag">Extract</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="split-range-preview-list">
        <div className="split-range-preview">
          <div className="split-range-preview__title">Size split preview</div>
          <div className="split-range-preview__empty">
            <div className="split-range-preview__empty-icon">MB</div>
            <h4>Split by file size limit</h4>
            <p>Output files will target a maximum size of <strong>{sizeLimit} MB</strong> per part.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout toolId="split"
      title="Split PDF files"
      subtitle="Separate one page or a whole set for easy conversion into independent PDF files."
      hasFiles={files.length > 0}
      fileCount={files.length}
      sidebar={
        <div className="option__panel split-sidebar-panel">
          <div className="split-sidebar-panel__header">
            <div className="option__panel__title split-sidebar-panel__title">Split</div>
          </div>

          <div className="split-tabs-container">
            <button
              onClick={() => setActiveTab("range")}
              className={`split-tab-btn ${activeTab === "range" ? "active" : ""}`}
              title="Split by custom or fixed ranges"
            >
              <span className="split-tab-badge split-tab-badge--success" aria-hidden="true">✓</span>
              <span className="split-tab-btn__icon"><RangeTabIcon /></span>
              <span>Range</span>
            </button>

            <button
              onClick={() => setActiveTab("pages")}
              className={`split-tab-btn ${activeTab === "pages" ? "active" : ""}`}
              title="Split into individual or selected pages"
            >
              <span className="split-tab-btn__icon"><PagesTabIcon /></span>
              <span>Pages</span>
            </button>

            <button
              onClick={() => setActiveTab("size")}
              className={`split-tab-btn ${activeTab === "size" ? "active" : ""}`}
              title="Split by file size limit"
            >
              <span className="split-tab-badge split-tab-badge--premium" aria-hidden="true">★</span>
              <span className="split-tab-btn__icon"><SizeTabIcon /></span>
              <span>Size</span>
            </button>
          </div>

          <div className="option__panel__content split-sidebar-panel__content">
            {activeTab === "range" && (
              <>
                <div className="split-section">
                  <span className="sidebar-label">Range mode:</span>
                  <div className="split-mode-group">
                    <button
                      onClick={() => setRangeMode("custom")}
                      className={`mode-pill-btn ${rangeMode === "custom" ? "active" : ""}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mode-pill-btn__icon">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      <span>Custom</span>
                    </button>
                    <button
                      onClick={() => setRangeMode("fixed")}
                      className={`mode-pill-btn ${rangeMode === "fixed" ? "active" : ""}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mode-pill-btn__icon">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 3v18M15 3v18" />
                      </svg>
                      <span>Fixed</span>
                    </button>
                    <button
                      onClick={() => setRangeMode("smart")}
                      className={`mode-pill-btn ${rangeMode === "smart" ? "active" : ""}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mode-pill-btn__icon">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                      <span>Smart</span>
                    </button>
                  </div>
                </div>

                {rangeMode === "custom" && (
                  <div className="split-section split-custom-settings">
                    <div className="split-range-editor-list">
                      {ranges.map((range, index) => (
                        <div key={range.id} className="split-range-editor">
                          <div className="split-range-editor__head">
                            <span className="split-range-editor__title">Range {index + 1}</span>
                            {ranges.length > 1 && (
                              <button
                                onClick={() => removeRange(range.id)}
                                className="split-range-editor__delete"
                                title="Delete this range"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="split-range-editor__delete-icon">
                                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                </svg>
                                <span>Delete</span>
                              </button>
                            )}
                          </div>

                          <div className="split-range-editor__row">
                            <span className="split-range-editor__handle" aria-hidden="true">
                              <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="2" cy="3" r="1.2" fill="currentColor" />
                                <circle cx="2" cy="9" r="1.2" fill="currentColor" />
                                <circle cx="2" cy="15" r="1.2" fill="currentColor" />
                                <circle cx="10" cy="3" r="1.2" fill="currentColor" />
                                <circle cx="10" cy="9" r="1.2" fill="currentColor" />
                                <circle cx="10" cy="15" r="1.2" fill="currentColor" />
                              </svg>
                            </span>
                            <div className="split-range-editor__controls">
                              <div className="split-range-editor__field split-range-editor__field--from">
                                <span className="split-range-editor__label">From Page</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={totalPages}
                                  value={range.from}
                                  onChange={(event) => updateRange(range.id, "from", parseInt(event.target.value, 10))}
                                />
                              </div>
                              <div className="split-range-editor__field split-range-editor__field--to">
                                <span className="split-range-editor__label">To Page</span>
                                <input
                                  type="number"
                                  min={range.from}
                                  max={totalPages}
                                  value={range.to}
                                  onChange={(event) => updateRange(range.id, "to", parseInt(event.target.value, 10))}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button onClick={addRange} className="split-outline-button">
                      <span aria-hidden="true">+</span>
                      <span>Add Range</span>
                    </button>

                    <label className="split-checkbox-row">
                      <input
                        type="checkbox"
                        checked={mergeAllRanges}
                        onChange={(event) => setMergeAllRanges(event.target.checked)}
                      />
                      <span>Merge all ranges in one PDF file.</span>
                    </label>
                  </div>
                )}

                {rangeMode === "fixed" && (
                  <div className="split-section">
                    <div className="split-input-block">
                      <span className="split-input-block__label">Split in equal ranges of</span>
                      <div className="split-input-block__row">
                        <input
                          type="number"
                          min={1}
                          max={totalPages}
                          value={fixedPages}
                          onChange={(event) => {
                            let value = parseInt(event.target.value, 10);
                            if (isNaN(value) || value < 1) value = 1;
                            if (value > totalPages) value = totalPages;
                            setFixedPages(value);
                          }}
                          className="split-simple-input"
                        />
                        <span className="split-input-block__suffix">pages</span>
                      </div>
                    </div>

                    <div className="split-note split-note--info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="split-note__icon">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>PDF will be split into {Math.ceil(totalPages / (fixedPages || 1))} files of up to {fixedPages} pages each.</span>
                    </div>
                  </div>
                )}

                {rangeMode === "smart" && (
                  <div className="split-section">
                    <div className="split-note split-note--warning">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="split-note__icon">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                      <span>Smart split will export chapters based on detected bookmarks and major outline breaks.</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "pages" && (
              <>
                <div className="split-section">
                  <span className="sidebar-label">Page extraction mode:</span>
                  <div className="split-mode-group">
                    <button
                      onClick={() => setPagesMode("all")}
                      className={`mode-pill-btn ${pagesMode === "all" ? "active" : ""}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mode-pill-btn__icon">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      <span>Extract all</span>
                    </button>
                    <button
                      onClick={() => setPagesMode("select")}
                      className={`mode-pill-btn ${pagesMode === "select" ? "active" : ""}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mode-pill-btn__icon">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
                      </svg>
                      <span>Select pages</span>
                    </button>
                  </div>
                </div>

                {pagesMode === "all" && (
                  <div className="split-section">
                    <div className="split-note split-note--info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="split-note__icon">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>Every page in this document will be exported as an individual PDF file. {totalPages} files will be created.</span>
                    </div>
                  </div>
                )}

                {pagesMode === "select" && (
                  <div className="split-section split-custom-settings">
                    <div className="split-note split-note--info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="split-note__icon">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>Select pages directly from the preview grid, then choose whether to merge them into a single output file.</span>
                    </div>

                    <div className="split-note split-note--success">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="split-note__icon">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
                      </svg>
                      <span>Selected pages: <strong>{selectedCount}</strong></span>
                    </div>

                    <label className="split-checkbox-row">
                      <input
                        type="checkbox"
                        checked={mergeAllRanges}
                        onChange={(event) => setMergeAllRanges(event.target.checked)}
                      />
                      <span>Merge all extracted pages into a single PDF.</span>
                    </label>
                  </div>
                )}
              </>
            )}

            {activeTab === "size" && (
              <div className="split-section">
                <span className="sidebar-label">Split by size limit:</span>
                <div className="split-input-block">
                  <div className="split-input-block__row">
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={sizeLimit}
                      onChange={(event) => {
                        let value = parseInt(event.target.value, 10);
                        if (isNaN(value) || value < 1) value = 1;
                        if (value > 200) value = 200;
                        setSizeLimit(value);
                      }}
                      className="split-simple-input"
                    />
                    <span className="split-input-block__suffix">MB</span>
                  </div>

                  <div className="split-size-slider-wrapper">
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={Math.min(sizeLimit, 100)}
                      onChange={(event) => setSizeLimit(parseInt(event.target.value, 10))}
                      className="split-size-slider"
                    />
                    <div className="split-size-slider-labels">
                      <span>1 MB</span>
                      <span>50 MB</span>
                      <span>100 MB</span>
                    </div>
                  </div>
                </div>

                <div className="split-note split-note--warning">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="split-note__icon">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>File size split uses an estimated target so each exported part stays under the chosen size whenever possible.</span>
                </div>
              </div>
            )}

          </div>

          <div className="split-sidebar-panel__footer split-sidebar-panel__footer--desktop">
            <button onClick={splitPdf} disabled={processing} className="btn-sidebar-cta">
              <span>{processing ? "Splitting..." : "Split PDF"}</span>
              <span className="btn-sidebar-cta__icon">→</span>
            </button>
          </div>
        </div>
      }
    >
      {files.length === 0 ? (
        <>
          <FileUploader onFilesSelected={addFiles} hasFiles={false} />
          <AdSpace />
        </>
      ) : (
        <div className="split-workspace">
          {/* Active File Header */}
          <div className="split-file-header">
            <div className="split-file-header__info">
              {/* PDF Icon */}
              <div className="split-file-header__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div className="split-file-header__meta">
                <h3 className="split-file-header__name" title={files[0].name}>{files[0].name}</h3>
                <p className="split-file-header__details">
                  <span>{formatFileSize(files[0].size)}</span>
                  <span className="split-file-header__bullet" aria-hidden="true">•</span>
                  <span>{totalPages} pages</span>
                </p>
              </div>
            </div>
            
            {/* Action buttons (Change File / Remove) */}
            <div className="split-file-header__actions">
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); changeInputRef.current?.click(); }}
                className="split-header-btn split-header-btn--change"
                title="Choose a different PDF file"
              >
                Change File
              </button>
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); clearFiles(); }}
                className="split-header-btn split-header-btn--remove"
                title="Remove this file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>

          <input
            ref={changeInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                addFiles(Array.from(e.target.files));
              }
            }}
          />

          <AdSpace />
          <div className="split-preview-stack">{renderRangePreview()}</div>
          <button className="split-mobile-cta show--sm" onClick={splitPdf} disabled={processing}>
            <span>{processing ? "Splitting..." : "Split PDF"}</span>
            <span className="split-mobile-cta__icon">→</span>
          </button>
        </div>
      )}

      <ProcessOverlay isActive={processing} message="Splitting PDF..." />
    </ToolLayout>
  );
}
