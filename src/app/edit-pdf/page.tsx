"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckSquare,
  Eraser,
  Hand,
  Highlighter,
  ImagePlus,
  Minus,
  Move,
  Paintbrush,
  Pencil,
  Plus,
  Sidebar,
  Shapes,
  Type,
  Undo2,
  Upload,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import type { PDFDocumentProxy } from "pdfjs-dist";
import Header from "@/components/Header";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessOverlay from "@/components/ProcessOverlay";
import {
  downloadBlob,
  formatFileSize,
  generateFileId,
  readFileAsArrayBuffer,
} from "@/lib/pdf-utils";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

interface PagePreview {
  src: string;
  width: number;
  height: number;
}

interface TextOverlay {
  id: string;
  type: "text";
  x: number;
  y: number;
  width: number;
  text: string;
  fontSize: number;
  color: string;
  page: number;
}

interface ShapeOverlay {
  id: string;
  type: "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  fillOpacity: number;
  borderWidth: number;
  page: number;
}

interface InkPoint {
  x: number;
  y: number;
}

interface DrawOverlay {
  id: string;
  type: "draw";
  points: InkPoint[];
  color: string;
  lineWidth: number;
  page: number;
}

interface ImageOverlay {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  page: number;
}

interface ExistingTextItem {
  id: string;
  type: "existing-text";
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  originalText: string;
  fontSize: number;
  color: string;
  page: number;
  edited: boolean;
}

interface PdfTextContentItem {
  str: string;
  width: number;
  height: number;
  transform: number[];
}

type OverlayItem = TextOverlay | ShapeOverlay | DrawOverlay | ImageOverlay;
type EditorItem = OverlayItem | ExistingTextItem;
type EditorMode = "annotate" | "edit";
type EditorTool = "select" | "pan" | "text" | "shape" | "image" | "draw";

interface EditorSnapshot {
  overlays: Record<number, OverlayItem[]>;
  textItems: Record<number, ExistingTextItem[]>;
}

const COLORS = [
  "#111827",
  "#e5322d",
  "#2563eb",
  "#0f766e",
  "#7c3aed",
  "#f59e0b",
];

function isPdfTextContentItem(item: unknown): item is PdfTextContentItem {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Partial<PdfTextContentItem>;
  return (
    typeof candidate.str === "string"
    && typeof candidate.width === "number"
    && typeof candidate.height === "number"
    && Array.isArray(candidate.transform)
  );
}

function dataUrlToImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function sampleCanvasColor(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const clampedX = Math.max(0, Math.floor(x));
  const clampedY = Math.max(0, Math.floor(y));
  const clampedWidth = Math.max(1, Math.floor(width));
  const clampedHeight = Math.max(1, Math.floor(height));
  const pixels = context.getImageData(clampedX, clampedY, clampedWidth, clampedHeight).data;

  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let index = 0; index < pixels.length; index += 16) {
    red += pixels[index];
    green += pixels[index + 1];
    blue += pixels[index + 2];
    count += 1;
  }

  return `rgb(${Math.round(red / count)}, ${Math.round(green / count)}, ${Math.round(blue / count)})`;
}

function LazyPageImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      className={className}
    />
  );
}

function PageRenderSurface({
  pageNumber,
  preview,
  textItems,
  overlays,
  activePage,
  isCompact,
  selectedItemId,
  selectedTool,
  zoom,
  previewLoader,
  onActivatePage,
  onPageClick,
  onExistingTextPointerDown,
  onExistingTextChange,
  onOverlayPointerDown,
}: {
  pageNumber: number;
  preview?: PagePreview;
  textItems: ExistingTextItem[];
  overlays: OverlayItem[];
  activePage: number;
  isCompact: boolean;
  selectedItemId: string | null;
  selectedTool: EditorTool;
  zoom: number;
  previewLoader: (pageNumber: number) => void;
  onActivatePage: (pageNumber: number) => void;
  onPageClick: (pageNumber: number, event: React.MouseEvent<HTMLDivElement>) => void;
  onExistingTextPointerDown: (event: React.PointerEvent<HTMLDivElement>, item: ExistingTextItem) => void;
  onExistingTextChange: (id: string, value: string) => void;
  onOverlayPointerDown: (event: React.PointerEvent<Element>, overlay: OverlayItem) => void;
}) {
  useEffect(() => {
    previewLoader(pageNumber);
  }, [pageNumber, previewLoader]);

  const pageStyle = !preview
    ? undefined
    : {
        aspectRatio: `${preview.width} / ${preview.height}`,
      };

  return (
    <div
      className={`edit-editor-page ${activePage === pageNumber ? "is-active" : ""} ${isCompact ? "is-grid" : "is-stage"}`}
      onClick={() => onActivatePage(pageNumber)}
    >
      <div
        className={`edit-editor-page__frame ${selectedTool === "pan" ? "is-pan" : ""}`}
        style={pageStyle}
      >
        {!preview ? (
          <div className="edit-editor-page__loading">Rendering page {pageNumber}...</div>
        ) : (
          <div
            className="edit-editor-page__canvas"
            style={{ transform: `scale(${isCompact ? 1 : zoom})` }}
            onClick={(event) => {
              event.stopPropagation();
              onPageClick(pageNumber, event);
            }}
          >
            <LazyPageImage
              src={preview.src}
              alt={`Page ${pageNumber}`}
              width={preview.width}
              height={preview.height}
              className="edit-editor-page__image"
            />

            <div className="edit-editor-page__overlay-layer">
              {textItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`edit-overlay edit-overlay--existing-text ${isSelected ? "is-selected" : ""} ${isSelected && selectedTool === "text" ? "is-editing" : ""}`}
                    style={{
                      left: `${item.x * 100}%`,
                      top: `${item.y * 100}%`,
                      width: `${item.width * 100}%`,
                      minHeight: `${item.height * 100}%`,
                      color: item.color,
                      fontSize: `${item.fontSize}px`,
                    }}
                    onPointerDown={(event) => onExistingTextPointerDown(event, item)}
                  >
                    {isSelected && selectedTool === "text" ? (
                      <textarea
                        value={item.text}
                        rows={Math.max(2, Math.ceil(item.height * 12))}
                        onChange={(event) => onExistingTextChange(item.id, event.target.value)}
                        onPointerDown={(event) => event.stopPropagation()}
                      />
                    ) : (
                      item.text
                    )}
                  </div>
                );
              })}

              {overlays.map((overlay) => {
                if (overlay.type === "draw") {
                  return (
                    <svg
                      key={overlay.id}
                      viewBox="0 0 1000 1000"
                      className={`edit-overlay edit-overlay--draw ${selectedItemId === overlay.id ? "is-selected" : ""}`}
                      onPointerDown={(event) => onOverlayPointerDown(event, overlay)}
                    >
                      <path
                        d={overlay.points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x * 1000} ${point.y * 1000}`).join(" ")}
                        fill="none"
                        stroke={overlay.color}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={Math.max(overlay.lineWidth * 10, 6)}
                      />
                    </svg>
                  );
                }

                const sharedStyle = {
                  left: `${overlay.x * 100}%`,
                  top: `${overlay.y * 100}%`,
                };

                if (overlay.type === "text") {
                  return (
                    <div
                      key={overlay.id}
                      className={`edit-overlay edit-overlay--text ${selectedItemId === overlay.id ? "is-selected" : ""}`}
                      style={{
                        ...sharedStyle,
                        width: `${overlay.width * 100}%`,
                        color: overlay.color,
                        fontSize: `${overlay.fontSize}px`,
                      }}
                      onPointerDown={(event) => onOverlayPointerDown(event, overlay)}
                    >
                      {overlay.text}
                    </div>
                  );
                }

                if (overlay.type === "shape") {
                  return (
                    <div
                      key={overlay.id}
                      className={`edit-overlay edit-overlay--shape ${selectedItemId === overlay.id ? "is-selected" : ""}`}
                      style={{
                        ...sharedStyle,
                        width: `${overlay.width * 100}%`,
                        height: `${overlay.height * 100}%`,
                        borderColor: overlay.strokeColor,
                        borderWidth: `${overlay.borderWidth}px`,
                        backgroundColor: overlay.fillColor,
                        opacity: overlay.fillOpacity,
                      }}
                      onPointerDown={(event) => onOverlayPointerDown(event, overlay)}
                    />
                  );
                }

                return (
                  <div
                    key={overlay.id}
                    className={`edit-overlay edit-overlay--image ${selectedItemId === overlay.id ? "is-selected" : ""}`}
                    style={{
                      ...sharedStyle,
                      width: `${overlay.width * 100}%`,
                      height: `${overlay.height * 100}%`,
                    }}
                    onPointerDown={(event) => onOverlayPointerDown(event, overlay)}
                  >
                    <LazyPageImage
                      src={overlay.src}
                      alt="Placed asset"
                      width={Math.round(preview.width * overlay.width)}
                      height={Math.round(preview.height * overlay.height)}
                      className="edit-overlay__image"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="edit-editor-page__number">{pageNumber}</div>
    </div>
  );
}

export default function EditPdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [mode, setMode] = useState<EditorMode>("annotate");
  const [tool, setTool] = useState<EditorTool>("select");
  const [activePage, setActivePage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [thumbs, setThumbs] = useState<Record<number, PagePreview>>({});
  const [previews, setPreviews] = useState<Record<number, PagePreview>>({});
  const [pageTextItems, setPageTextItems] = useState<Record<number, ExistingTextItem[]>>({});
  const [pageOverlays, setPageOverlays] = useState<Record<number, OverlayItem[]>>({});
  const [textDraft, setTextDraft] = useState("Add text");
  const [textColor, setTextColor] = useState("#111827");
  const [textSize, setTextSize] = useState(28);
  const [shapeColor, setShapeColor] = useState("#e5322d");
  const [drawColor, setDrawColor] = useState("#f59e0b");
  const [drawWidth, setDrawWidth] = useState(4);
  const [shapeOpacity, setShapeOpacity] = useState(0.18);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [history, setHistory] = useState<EditorSnapshot[]>([]);

  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const drawingRef = useRef<{ page: number; points: InkPoint[] } | null>(null);

  const selectedItem = useMemo<EditorItem | null>(
    () =>
      Object.values(pageOverlays).flat().find((overlay) => overlay.id === selectedItemId)
      ?? Object.values(pageTextItems).flat().find((item) => item.id === selectedItemId)
      ?? null,
    [pageOverlays, pageTextItems, selectedItemId]
  );

  useEffect(() => {
    const updateCompact = () => setIsCompact(window.innerWidth < 1024);
    updateCompact();
    window.addEventListener("resize", updateCompact);
    return () => window.removeEventListener("resize", updateCompact);
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const [file] = newFiles;
    if (!file) return;
    setFiles([{ id: generateFileId(), name: file.name, size: file.size, file }]);
  }, []);

  const resetEditor = useCallback(() => {
    setFiles([]);
    setTotalPages(0);
    setActivePage(1);
    setSelectedItemId(null);
    setThumbs({});
    setPreviews({});
    setPageTextItems({});
    setPageOverlays({});
    setPendingImage(null);
    setHistory([]);
    pdfDocRef.current = null;
  }, []);

  const pushHistory = useCallback((
    nextOverlays: Record<number, OverlayItem[]>,
    nextTextItems: Record<number, ExistingTextItem[]>
  ) => {
    setHistory((prev) => [
      ...prev.slice(-24),
      {
        overlays: JSON.parse(JSON.stringify(nextOverlays)) as Record<number, OverlayItem[]>,
        textItems: JSON.parse(JSON.stringify(nextTextItems)) as Record<number, ExistingTextItem[]>,
      },
    ]);
  }, []);

  useEffect(() => {
    if (files.length === 0) return;

    const loadPdf = async () => {
      setLoadingPdf(true);
      try {
        const buffer = await readFileAsArrayBuffer(files[0].file);
        const data = new Uint8Array(buffer);
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
        const doc = await pdfjsLib.getDocument({ data: data.slice(0) }).promise;
        pdfDocRef.current = doc;
        setTotalPages(doc.numPages);
        setActivePage(1);
        setSelectedItemId(null);
        setThumbs({});
        setPreviews({});
        setPageTextItems({});
        setPageOverlays({});
      } catch (error) {
        console.error("Failed to load PDF for editing:", error);
        alert("Failed to load PDF for editing.");
        resetEditor();
      } finally {
        setLoadingPdf(false);
      }
    };

    loadPdf();
  }, [files, resetEditor]);

  const renderPage = useCallback(async (pageNumber: number, scale: number) => {
    if (!pdfDocRef.current) return null;
    const page = await pdfDocRef.current.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) return null;
    await page.render({ canvasContext: context, viewport }).promise;
    return {
      src: canvas.toDataURL("image/png"),
      width: canvas.width,
      height: canvas.height,
    } satisfies PagePreview;
  }, []);

  const ensureThumb = useCallback(async (pageNumber: number) => {
    if (thumbs[pageNumber]) return;
    const preview = await renderPage(pageNumber, 0.18);
    if (preview) {
      setThumbs((prev) => (prev[pageNumber] ? prev : { ...prev, [pageNumber]: preview }));
    }
  }, [renderPage, thumbs]);

  const ensurePreview = useCallback(async (pageNumber: number) => {
    if (previews[pageNumber]) return;
    const preview = await renderPage(pageNumber, isCompact ? 0.54 : 1.08);
    if (preview) {
      setPreviews((prev) => (prev[pageNumber] ? prev : { ...prev, [pageNumber]: preview }));
    }
  }, [isCompact, previews, renderPage]);

  const ensureTextItems = useCallback(async (pageNumber: number) => {
    if (pageTextItems[pageNumber] || !pdfDocRef.current) return;
    const pdfjsLib = await import("pdfjs-dist");
    const page = await pdfDocRef.current.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();

    const items: ExistingTextItem[] = textContent.items.flatMap((item, index) => {
      if (!isPdfTextContentItem(item) || item.str.trim().length === 0) {
        return [];
      }

        const transform = pdfjsLib.Util.transform(viewport.transform, item.transform);
        const fontSize = Math.max(Math.abs(transform[3]), 11);
        const width = Math.max((item.width * viewport.scale) / viewport.width, 0.02);
        const height = Math.max(fontSize / viewport.height, 0.018);

        return [{
          id: `${pageNumber}-text-${index}`,
          type: "existing-text",
          page: pageNumber,
          x: Math.max(0, Math.min(transform[4] / viewport.width, 0.96)),
          y: Math.max(0, Math.min((transform[5] - fontSize) / viewport.height, 0.96)),
          width: Math.min(width, 0.96),
          height: Math.min(height, 0.18),
          text: item.str,
          originalText: item.str,
          fontSize,
          color: "#111827",
          edited: false,
        }];
      });

    setPageTextItems((prev) => (prev[pageNumber] ? prev : { ...prev, [pageNumber]: items }));
  }, [pageTextItems]);

  useEffect(() => {
    if (totalPages === 0) return;
    const start = Math.max(1, activePage - 2);
    const end = Math.min(totalPages, activePage + 2);
    for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
      ensureThumb(pageNumber);
      ensurePreview(pageNumber);
      ensureTextItems(pageNumber);
    }
  }, [activePage, ensurePreview, ensureTextItems, ensureThumb, totalPages]);

  useEffect(() => {
    if (!isCompact || totalPages === 0) return;
    const visibleCount = Math.min(totalPages, 12);
    for (let pageNumber = 1; pageNumber <= visibleCount; pageNumber += 1) {
      ensurePreview(pageNumber);
      ensureTextItems(pageNumber);
    }
  }, [ensurePreview, ensureTextItems, isCompact, totalPages]);

  const setOverlays = useCallback((
    updater: (prev: Record<number, OverlayItem[]>) => Record<number, OverlayItem[]>,
    captureHistory = true
  ) => {
    setPageOverlays((prev) => {
      const next = updater(prev);
      if (captureHistory) {
        pushHistory(next, pageTextItems);
      }
      return next;
    });
  }, [pageTextItems, pushHistory]);

  const addOverlay = useCallback((page: number, overlay: OverlayItem) => {
    setOverlays((prev) => ({
      ...prev,
      [page]: [...(prev[page] ?? []), overlay],
    }));
    setSelectedItemId(overlay.id);
  }, [setOverlays]);

  const updateOverlay = useCallback((
    id: string,
    updater: (overlay: OverlayItem) => OverlayItem,
    captureHistory = true
  ) => {
    setOverlays((prev) => {
      const next: Record<number, OverlayItem[]> = {};
      for (const [key, overlays] of Object.entries(prev)) {
        next[Number(key)] = overlays.map((overlay) => (overlay.id === id ? updater(overlay) : overlay));
      }
      return next;
    }, captureHistory);
  }, [setOverlays]);

  const updateTextItem = useCallback((
    id: string,
    updater: (item: ExistingTextItem) => ExistingTextItem,
    captureHistory = true
  ) => {
    setPageTextItems((prev) => {
      const next: Record<number, ExistingTextItem[]> = {};
      for (const [key, items] of Object.entries(prev)) {
        next[Number(key)] = items.map((item) => (item.id === id ? updater(item) : item));
      }
      if (captureHistory) {
        pushHistory(pageOverlays, next);
      }
      return next;
    });
  }, [pageOverlays, pushHistory]);

  const removeSelectedOverlay = useCallback(() => {
    if (!selectedItemId || !selectedItem) return;

    if (selectedItem.type === "existing-text") {
      updateTextItem(selectedItem.id, (item) => ({ ...item, text: "", edited: true }));
      return;
    }

    setOverlays((prev) => {
      const next: Record<number, OverlayItem[]> = {};
      for (const [key, overlays] of Object.entries(prev)) {
        next[Number(key)] = overlays.filter((overlay) => overlay.id !== selectedItemId);
      }
      return next;
    });
    setSelectedItemId(null);
  }, [selectedItem, selectedItemId, setOverlays, updateTextItem]);

  const undoLast = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const nextHistory = [...prev];
      const last = nextHistory.pop();
      if (last) {
        setPageOverlays(last.overlays);
        setPageTextItems(last.textItems);
      }
      return nextHistory;
    });
  }, []);

  const readImageAsDataUrl = useCallback((file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  }), []);

  const getPointFromEvent = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1),
      y: Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1),
    };
  }, []);

  const handlePageClick = useCallback((pageNumber: number, event: React.MouseEvent<HTMLDivElement>) => {
    const point = getPointFromEvent(event);
    setActivePage(pageNumber);
    setSelectedItemId(null);

    if (tool === "text") {
      addOverlay(pageNumber, {
        id: generateFileId(),
        type: "text",
        page: pageNumber,
        x: point.x,
        y: point.y,
        width: 0.28,
        text: textDraft,
        fontSize: textSize,
        color: textColor,
      });
      return;
    }

    if (tool === "shape") {
      addOverlay(pageNumber, {
        id: generateFileId(),
        type: "shape",
        page: pageNumber,
        x: point.x,
        y: point.y,
        width: 0.22,
        height: 0.11,
        strokeColor: shapeColor,
        fillColor: shapeColor,
        fillOpacity: shapeOpacity,
        borderWidth: 2,
      });
      return;
    }

    if (tool === "image" && pendingImage) {
      addOverlay(pageNumber, {
        id: generateFileId(),
        type: "image",
        page: pageNumber,
        x: point.x,
        y: point.y,
        width: 0.22,
        height: 0.18,
        src: pendingImage,
      });
      setPendingImage(null);
    }
  }, [addOverlay, getPointFromEvent, pendingImage, shapeColor, shapeOpacity, textColor, textDraft, textSize, tool]);

  const handleOverlayPointerDown = useCallback((event: React.PointerEvent<Element>, overlay: OverlayItem) => {
    event.stopPropagation();
    setActivePage(overlay.page);
    setSelectedItemId(overlay.id);

    if (tool !== "select" || overlay.type === "draw") return;

    const pageElement = event.currentTarget.closest(".edit-editor-page__canvas") as HTMLDivElement | null;
    if (!pageElement) return;

    const startRect = pageElement.getBoundingClientRect();
    const originX = (event.clientX - startRect.left) / startRect.width;
    const originY = (event.clientY - startRect.top) / startRect.height;
    const baseX = "x" in overlay ? overlay.x : 0;
    const baseY = "y" in overlay ? overlay.y : 0;

    const move = (moveEvent: PointerEvent) => {
      const deltaX = (moveEvent.clientX - startRect.left) / startRect.width - originX;
      const deltaY = (moveEvent.clientY - startRect.top) / startRect.height - originY;

      updateOverlay(overlay.id, (current) => {
        if (current.type === "draw") return current;
        return {
          ...current,
          x: Math.min(Math.max(baseX + deltaX, 0), 0.94),
          y: Math.min(Math.max(baseY + deltaY, 0), 0.94),
        };
      }, false);
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setPageOverlays((prev) => {
        pushHistory(prev, pageTextItems);
        return prev;
      });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, [pageTextItems, pushHistory, tool, updateOverlay]);

  const handleExistingTextPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>, item: ExistingTextItem) => {
    event.stopPropagation();
    setActivePage(item.page);
    setSelectedItemId(item.id);
    setMode("edit");
    setTool("text");
  }, []);

  const handlePointerStart = useCallback((pageNumber: number, event: React.PointerEvent<HTMLDivElement>) => {
    if (tool !== "draw") return;
    const rect = event.currentTarget.getBoundingClientRect();
    drawingRef.current = {
      page: pageNumber,
      points: [{
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      }],
    };

    const move = (moveEvent: PointerEvent) => {
      if (!drawingRef.current) return;
      drawingRef.current.points.push({
        x: Math.min(Math.max((moveEvent.clientX - rect.left) / rect.width, 0), 1),
        y: Math.min(Math.max((moveEvent.clientY - rect.top) / rect.height, 0), 1),
      });
    };

    const end = () => {
      if (drawingRef.current && drawingRef.current.points.length > 1) {
        addOverlay(drawingRef.current.page, {
          id: generateFileId(),
          type: "draw",
          page: drawingRef.current.page,
          points: drawingRef.current.points,
          color: drawColor,
          lineWidth: drawWidth,
        });
      }
      drawingRef.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  }, [addOverlay, drawColor, drawWidth, tool]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const src = await readImageAsDataUrl(file);
      setPendingImage(src);
      setTool("image");
      setMode("edit");
    } catch (error) {
      console.error("Failed to read image asset:", error);
    } finally {
      event.target.value = "";
    }
  }, [readImageAsDataUrl]);

  const handleExistingTextChange = useCallback((id: string, value: string) => {
    updateTextItem(id, (item) => ({
      ...item,
      text: value,
      edited: value !== item.originalText,
    }));
  }, [updateTextItem]);

  const saveChanges = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const pdf = await PDFDocument.create();

      for (let index = 0; index < totalPages; index += 1) {
        const pageNumber = index + 1;
        const preview = await renderPage(pageNumber, 1.8);
        if (!preview) continue;

        const canvas = document.createElement("canvas");
        canvas.width = preview.width;
        canvas.height = preview.height;
        const context = canvas.getContext("2d");
        if (!context) continue;

        const baseImage = await dataUrlToImage(preview.src);
        context.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        const pageTextLayers = pageTextItems[pageNumber] ?? [];
        const pageItems = pageOverlays[pageNumber] ?? [];

        for (const item of pageTextLayers) {
          if (!item.edited) continue;

          const x = item.x * canvas.width;
          const y = item.y * canvas.height;
          const width = item.width * canvas.width;
          const height = Math.max(item.height * canvas.height, item.fontSize * 1.4);

          context.fillStyle = sampleCanvasColor(context, x, y, width, height);
          context.fillRect(x - 2, y - 2, width + 4, height + 4);

          if (item.text.trim()) {
            context.fillStyle = item.color;
            context.font = `${item.fontSize}px Helvetica, Arial, sans-serif`;
            context.textBaseline = "top";
            item.text.split("\n").forEach((line, lineIndex) => {
              context.fillText(line, x, y + lineIndex * item.fontSize * 1.18, width);
            });
          }
        }

        for (const item of pageItems) {
          if (item.type === "text") {
            context.fillStyle = item.color;
            context.font = `${item.fontSize}px Helvetica, Arial, sans-serif`;
            context.textBaseline = "top";
            item.text.split("\n").forEach((line, lineIndex) => {
              context.fillText(
                line,
                item.x * canvas.width,
                item.y * canvas.height + lineIndex * item.fontSize * 1.18,
                item.width * canvas.width
              );
            });
            continue;
          }

          if (item.type === "shape") {
            context.globalAlpha = item.fillOpacity;
            context.fillStyle = item.fillColor;
            context.fillRect(
              item.x * canvas.width,
              item.y * canvas.height,
              item.width * canvas.width,
              item.height * canvas.height
            );
            context.globalAlpha = 1;
            context.strokeStyle = item.strokeColor;
            context.lineWidth = item.borderWidth;
            context.strokeRect(
              item.x * canvas.width,
              item.y * canvas.height,
              item.width * canvas.width,
              item.height * canvas.height
            );
            continue;
          }

          if (item.type === "image") {
            const placedImage = await dataUrlToImage(item.src);
            context.drawImage(
              placedImage,
              item.x * canvas.width,
              item.y * canvas.height,
              item.width * canvas.width,
              item.height * canvas.height
            );
            continue;
          }

          context.strokeStyle = item.color;
          context.lineWidth = item.lineWidth;
          context.lineCap = "round";
          context.lineJoin = "round";
          context.beginPath();
          item.points.forEach((point, pointIndex) => {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;
            if (pointIndex === 0) {
              context.moveTo(x, y);
            } else {
              context.lineTo(x, y);
            }
          });
          context.stroke();
        }

        const flattenedPage = await pdf.embedPng(canvas.toDataURL("image/png"));
        const page = pdf.addPage([canvas.width, canvas.height]);
        page.drawImage(flattenedPage, {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
        });
      }

      const bytes = await pdf.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), `edited_${files[0].name}`);
    } catch (error) {
      console.error("Failed to save edited PDF:", error);
      alert("Failed to save edited PDF.");
    } finally {
      setProcessing(false);
    }
  }, [files, pageOverlays, pageTextItems, renderPage, totalPages]);

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  const activePreview = previews[activePage];
  const totalOverlayCount = Object.values(pageOverlays).reduce((sum, overlays) => sum + overlays.length, 0);
  const totalDetectedTextCount = Object.values(pageTextItems).reduce((sum, items) => sum + items.length, 0);
  const editedTextCount = Object.values(pageTextItems).reduce((sum, items) => sum + items.filter((item) => item.edited).length, 0);

  const noFileSidebar = (
    <div className="option__panel">
      <div className="option__panel__title">Edit PDF</div>
      <div className="option__panel__content">
        <div className="info">
          Upload a PDF to open a client-side editor with page previews, detected text blocks, text overlays, shapes, image placement, and freehand annotations.
        </div>
      </div>
    </div>
  );

  if (files.length === 0) {
    return (
      <ToolLayout
        title="Edit PDF"
        subtitle="Add text, images, shapes or freehand annotations to a PDF document."
        sidebar={noFileSidebar}
      >
        <FileUploader onFilesSelected={addFiles} hasFiles={false} />
        <div className="add"><div className="in_add">Advertisement</div></div>
      </ToolLayout>
    );
  }

  return (
    <>
      <Header />
      <main className="edit-editor-shell">
        <section className="edit-toolbar">
          <div className="edit-toolbar__primary">
            <div className="edit-mode-pill">
              <button
                className={mode === "annotate" ? "is-active" : ""}
                onClick={() => {
                  setMode("annotate");
                  setTool("draw");
                }}
              >
                <Paintbrush size={18} />
                Annotate
              </button>
              <button
                className={mode === "edit" ? "is-active" : ""}
                onClick={() => {
                  setMode("edit");
                  setTool("text");
                }}
              >
                <Type size={18} />
                Edit
              </button>
            </div>

            <div className="edit-toolbar__tools">
              <button className={tool === "select" ? "is-active" : ""} onClick={() => setTool("select")} title="Select">
                <Move size={20} />
              </button>
              <button className={tool === "pan" ? "is-active" : ""} onClick={() => setTool("pan")} title="Pan">
                <Hand size={20} />
              </button>
              <button className={tool === "text" ? "is-active" : ""} onClick={() => { setMode("edit"); setTool("text"); }} title="Add or edit text">
                <Type size={20} />
              </button>
              <button className={tool === "image" ? "is-active" : ""} onClick={() => imageInputRef.current?.click()} title="Insert image">
                <ImagePlus size={20} />
              </button>
              <button className={tool === "shape" ? "is-active" : ""} onClick={() => { setMode("annotate"); setTool("shape"); }} title="Shapes">
                <Shapes size={20} />
              </button>
              <button className={tool === "draw" ? "is-active" : ""} onClick={() => { setMode("annotate"); setTool("draw"); }} title="Freehand">
                <Pencil size={20} />
              </button>
              <button onClick={removeSelectedOverlay} disabled={!selectedItem} title="Remove selection">
                <Eraser size={20} />
              </button>
            </div>
          </div>

          <div className="edit-toolbar__secondary">
            <button className="edit-toolbar__pill" onClick={() => setZoom((value) => Math.max(0.7, value - 0.1))}>
              <Minus size={18} />
            </button>
            <div className="edit-toolbar__zoom">{Math.round(zoom * 100)}%</div>
            <button className="edit-toolbar__pill" onClick={() => setZoom((value) => Math.min(1.8, value + 0.1))}>
              <Plus size={18} />
            </button>
            <button className="edit-toolbar__pill" onClick={undoLast} disabled={history.length === 0}>
              <Undo2 size={18} />
            </button>
            <button className={`edit-toolbar__pill ${isCompact ? "is-active" : ""}`} onClick={() => setIsCompact((value) => !value)}>
              <Sidebar size={18} />
            </button>
          </div>
        </section>

        <section className="edit-editor-layout">
          {!isCompact && (
            <aside className="edit-sidebar edit-sidebar--pages">
              <div className="edit-sidebar__section">
                <div className="edit-sidebar__head">
                  <div>
                    <h2>Pages</h2>
                    <p>{totalPages} page{totalPages === 1 ? "" : "s"}</p>
                  </div>
                  <button className="edit-sidebar__icon" onClick={() => setIsCompact(true)} title="Grid mode">
                    <CheckSquare size={18} />
                  </button>
                </div>

                <div className="edit-thumbnail-strip">
                  {pages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      className={`edit-thumbnail ${pageNumber === activePage ? "is-active" : ""}`}
                      onClick={() => setActivePage(pageNumber)}
                    >
                      <div className="edit-thumbnail__frame">
                        {thumbs[pageNumber] ? (
                          <LazyPageImage
                            src={thumbs[pageNumber].src}
                            alt={`Page ${pageNumber}`}
                            width={thumbs[pageNumber].width}
                            height={thumbs[pageNumber].height}
                            className="edit-thumbnail__image"
                          />
                        ) : (
                          <span>Page {pageNumber}</span>
                        )}
                      </div>
                      <span className="edit-thumbnail__label">{pageNumber}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          <section className="edit-stage">
            <div className={`edit-stage__viewport ${isCompact ? "is-grid" : "is-single"}`}>
              {isCompact ? (
                <div className="edit-page-grid">
                  {pages.map((pageNumber) => (
                    <div
                      key={pageNumber}
                      className="edit-page-grid__item"
                      onPointerDown={(event) => handlePointerStart(pageNumber, event)}
                    >
                      <PageRenderSurface
                        pageNumber={pageNumber}
                        preview={previews[pageNumber]}
                        textItems={pageTextItems[pageNumber] ?? []}
                        overlays={pageOverlays[pageNumber] ?? []}
                        activePage={activePage}
                        isCompact
                        selectedItemId={selectedItemId}
                        selectedTool={tool}
                        zoom={1}
                        previewLoader={ensurePreview}
                        onActivatePage={setActivePage}
                        onPageClick={handlePageClick}
                        onExistingTextPointerDown={handleExistingTextPointerDown}
                        onExistingTextChange={handleExistingTextChange}
                        onOverlayPointerDown={handleOverlayPointerDown}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="edit-single-stage" onPointerDown={(event) => handlePointerStart(activePage, event)}>
                  <PageRenderSurface
                    pageNumber={activePage}
                    preview={activePreview}
                    textItems={pageTextItems[activePage] ?? []}
                    overlays={pageOverlays[activePage] ?? []}
                    activePage={activePage}
                    isCompact={false}
                    selectedItemId={selectedItemId}
                    selectedTool={tool}
                    zoom={zoom}
                    previewLoader={ensurePreview}
                    onActivatePage={setActivePage}
                    onPageClick={handlePageClick}
                    onExistingTextPointerDown={handleExistingTextPointerDown}
                    onExistingTextChange={handleExistingTextChange}
                    onOverlayPointerDown={handleOverlayPointerDown}
                  />
                </div>
              )}
            </div>

            <div className="edit-bottom-bar">
              <button onClick={() => setActivePage((page) => Math.max(1, page - 1))}>
                <Minus size={18} />
              </button>
              <div className="edit-bottom-bar__page">{activePage} / {totalPages}</div>
              <button onClick={() => setActivePage((page) => Math.min(totalPages, page + 1))}>
                <Plus size={18} />
              </button>
              <div className="edit-bottom-bar__divider" />
              <div className="edit-bottom-bar__page">{Math.round(zoom * 100)}%</div>
              <button onClick={() => setZoom((value) => Math.max(0.7, value - 0.1))}>
                <Minus size={18} />
              </button>
              <button onClick={() => setZoom((value) => Math.min(1.8, value + 0.1))}>
                <Plus size={18} />
              </button>
            </div>
          </section>

          {!isCompact && (
            <aside className="edit-sidebar edit-sidebar--settings">
              <div className="edit-sidebar__section">
                <div className="edit-sidebar__head">
                  <div>
                    <h2>Edit PDF</h2>
                    <p>{files[0].name}</p>
                  </div>
                </div>

                <div className="edit-info-card">
                  <Highlighter size={18} />
                  <p>Existing text is detected page-by-page now. Click a text block in Edit mode to change it, or add new layers with the toolbar.</p>
                </div>

                <div className="edit-settings-block">
                  <label>Draft text</label>
                  <textarea
                    value={textDraft}
                    onChange={(event) => setTextDraft(event.target.value)}
                    rows={4}
                  />
                </div>

                <div className="edit-settings-grid">
                  <div className="edit-settings-block">
                    <label>Text size</label>
                    <input
                      type="number"
                      min={10}
                      max={72}
                      value={textSize}
                      onChange={(event) => setTextSize(Math.max(10, Math.min(72, parseInt(event.target.value || "12", 10))))}
                    />
                  </div>
                  <div className="edit-settings-block">
                    <label>Stroke width</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={drawWidth}
                      onChange={(event) => setDrawWidth(Math.max(1, Math.min(12, parseInt(event.target.value || "1", 10))))}
                    />
                  </div>
                </div>

                <div className="edit-settings-block">
                  <label>Colors</label>
                  <div className="edit-color-row">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        className={`edit-color-swatch ${textColor === color || drawColor === color || shapeColor === color ? "is-active" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setTextColor(color);
                          setDrawColor(color);
                          setShapeColor(color);
                          if (selectedItem?.type === "text") {
                            updateOverlay(selectedItem.id, (overlay) => overlay.type === "text" ? { ...overlay, color } : overlay);
                          }
                          if (selectedItem?.type === "draw") {
                            updateOverlay(selectedItem.id, (overlay) => overlay.type === "draw" ? { ...overlay, color } : overlay);
                          }
                          if (selectedItem?.type === "shape") {
                            updateOverlay(selectedItem.id, (overlay) => overlay.type === "shape" ? { ...overlay, strokeColor: color, fillColor: color } : overlay);
                          }
                          if (selectedItem?.type === "existing-text") {
                            updateTextItem(selectedItem.id, (item) => ({ ...item, color, edited: true }));
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="edit-settings-block">
                  <label>Shape opacity</label>
                  <input
                    type="range"
                    min={0.05}
                    max={0.6}
                    step={0.01}
                    value={shapeOpacity}
                    onChange={(event) => setShapeOpacity(parseFloat(event.target.value))}
                  />
                </div>

                {selectedItem && (
                  <div className="edit-settings-block">
                    <label>Selected layer</label>
                    <div className="edit-selected-card">
                      <strong>{selectedItem.type.toUpperCase()}</strong>
                      <span>Page {selectedItem.page}</span>
                      {(selectedItem.type === "text" || selectedItem.type === "existing-text") && (
                        <textarea
                          rows={4}
                          value={selectedItem.text}
                          onChange={(event) => {
                            if (selectedItem.type === "existing-text") {
                              handleExistingTextChange(selectedItem.id, event.target.value);
                              return;
                            }
                            updateOverlay(selectedItem.id, (overlay) => overlay.type === "text" ? { ...overlay, text: event.target.value } : overlay);
                          }}
                        />
                      )}
                      {selectedItem.type === "shape" && (
                        <input
                          type="range"
                          min={0.05}
                          max={0.4}
                          step={0.01}
                          value={selectedItem.fillOpacity}
                          onChange={(event) => updateOverlay(selectedItem.id, (overlay) => overlay.type === "shape" ? { ...overlay, fillOpacity: parseFloat(event.target.value) } : overlay)}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="edit-metrics">
                  <div><span>File size</span><strong>{formatFileSize(files[0].size)}</strong></div>
                  <div><span>Layers</span><strong>{totalOverlayCount}</strong></div>
                  <div><span>Detected text</span><strong>{totalDetectedTextCount}</strong></div>
                  <div><span>Edited text</span><strong>{editedTextCount}</strong></div>
                  <div><span>Active tool</span><strong>{tool}</strong></div>
                  <div><span>Mode</span><strong>{mode}</strong></div>
                </div>

                <button className="btn-sidebar-cta edit-save-desktop" onClick={saveChanges} disabled={processing || loadingPdf}>
                  <span>{processing ? "Saving..." : "Save changes"}</span>
                  <span className="btn-sidebar-cta__icon">→</span>
                </button>

                <button className="edit-secondary-button" onClick={resetEditor}>
                  <Upload size={16} />
                  Replace PDF
                </button>
              </div>
            </aside>
          )}
        </section>

        <button className="edit-save-mobile show--sm" onClick={saveChanges} disabled={processing || loadingPdf}>
          <span>{processing ? "Saving..." : "Save changes"}</span>
          <span className="btn-sidebar-cta__icon">→</span>
        </button>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleImageUpload}
        />
      </main>

      <ProcessOverlay
        isActive={processing || loadingPdf}
        message={loadingPdf ? "Preparing PDF editor..." : "Saving changes..."}
      />
    </>
  );
}
