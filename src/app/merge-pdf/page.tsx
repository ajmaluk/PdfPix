"use client";

import { useState, useCallback } from "react";
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

export default function MergePdfPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    const entries = newFiles.map((f) => ({
      id: generateFileId(),
      name: f.name,
      size: f.size,
      file: f,
    }));
    setFiles((prev) => [...prev, ...entries]);
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

  const mergePdfs = useCallback(async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const entry of files) {
        const buffer = await readFileAsArrayBuffer(entry.file);
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const indices = pdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(pdf, indices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
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

  return (
    <ToolLayout
      title="Merge PDF files"
      subtitle="Combine PDFs in the order you want with the easiest PDF merger available."
      sidebar={
        <div className="option__panel option__panel--active">
          <div className="option__panel__title">Merge PDF</div>
          <div className="option__panel__content">
            <div className="info drag">To change the order of your PDFs, drag and drop the files as you want.</div>
            <div className="info multiple">Please, select more PDF files by clicking again on &apos;Select PDF files&apos;. Select multiple files by maintaining pressed &apos;Ctrl&apos;</div>
            {files.length >= 2 && (
              <button className="btn btn--primary w-full mt-4" onClick={mergePdfs} disabled={processing}>
                {processing ? "Merging..." : "Merge PDFs!"}
              </button>
            )}
          </div>
        </div>
      }
    >
      <FileUploader onFilesSelected={addFiles} hasFiles={files.length > 0} />
      <div className="add"><div className="in_add">Advertisement</div></div>
      {files.length > 0 && (
        <div className="sidetools">
          <a className="btn-icon btn-icon--white" id="settingsToogle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 14.187V9.813c-2.148-.766-2.726-.802-3.027-1.53s.083-1.17 1.06-3.223L18.94 1.968c-2.026.963-2.488 1.364-3.224 1.06-.727-.302-.768-.89-1.527-3.027H9.813c-.764 2.144-.8 2.725-1.53 3.027-.752.313-1.203-.1-3.223-1.06L1.968 5.06c.977 2.055 1.362 2.493 1.06 3.224S2.146 9.05 0 9.813v4.375c2.14.76 2.725.8 3.027 1.528.304.734-.08 1.167-1.06 3.223l3.093 3.093c2-.95 2.47-1.373 3.223-1.06.728.302.764.88 1.53 3.027h4.374c.758-2.13.8-2.723 1.537-3.03.745-.308 1.186.1 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.06-3.223.3-.726.88-.763 3.027-1.528zM12 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2a5 5 0 1 0 0 10 5 5 0 1 0 0-10z" fill="#383E45"/></svg>
          </a>
          <a className="btn-icon btn-icon--white tooltip active tooltip--left order" id="orderByName" data-order="asc" title="Order files by name">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="#383E45" fillRule="evenodd"><path d="M2.947 15.297V.23c0-.067.026-.123.077-.166S3.14 0 3.22 0h1.635c.08 0 .145.022.196.065s.077.1.077.166v15.066h2.5a.39.39 0 0 1 .261.087.28.28 0 0 1 .102.222c0 .077-.038.154-.114.23l-3.62 3.076a.42.42 0 0 1-.261.087c-.09 0-.178-.03-.26-.087L.11 15.828c-.113-.103-.14-.215-.08-.338.06-.13.174-.193.34-.193h2.575z" fillRule="nonzero"/><path d="M11.222 20.2l2.94-7.52c.194-.496.555-.67 1.1-.67h.54c.513 0 .97.12 1.22.804l2.746 7.386c.083.214.222.603.222.845 0 .536-.485.965-1.068.965-.5 0-.86-.174-1.026-.603l-.582-1.6h-3.66l-.596 1.6c-.153.43-.47.603-1.012.603-.624 0-1.054-.375-1.054-.965 0-.24.14-.63.222-.845zm5.602-1.93l-1.3-3.874h-.028L14.15 18.27h2.663zM11.346 8l4.75-6.083h-3.66c-.602 0-1.088-.333-1.088-.958S11.832 0 12.434 0h5.53c.538 0 .973.25.973 1.042 0 .278-.102.583-.294.82l-4.826 6.222h4.096c.602 0 1.088.333 1.088.958s-.486.958-1.088.958h-5.696C11.448 10 11 9.722 11 8.875c0-.36.154-.625.346-.875z"/></svg>
          </a>
          <a className="btn-icon btn-icon--white tooltip active tooltip--left" id="toggleCover" title="Show-hide pdf covers">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 19"><path d="M11 4c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92A11.82 11.82 0 0 0 21.99 9c-1.73-4.4-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C9.74 4.13 10.35 4 11 4zM1 1.27L3.74 4A11.8 11.8 0 0 0 0 9c1.73 4.4 6 7.5 11 7.5a11.78 11.78 0 0 0 4.38-.84l.42.42L18.73 19 20 17.73 2.27 0 1 1.27zM6.53 6.8l1.55 1.55A2.82 2.82 0 0 0 8 9c0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.4.53-2.2.53-2.76 0-5-2.24-5-5 0-.8.2-1.53.53-2.2zm4.3-.78L14 9.17V9c0-1.66-1.34-3-3-3l-.17.01z" fill="#383E45" fillRule="evenodd"/></svg>
          </a>
        </div>
      )}
      <div className="tool__workarea__rendered" id="fileGroups">
        <FileList files={files} onRemove={removeFile} onReorder={reorderFile} hideSidetools />
      </div>
      {files.length >= 2 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn--primary text-lg px-10 py-3" onClick={mergePdfs} disabled={processing}>
            {processing ? "Merging..." : "Merge PDFs!"}
          </button>
        </div>
      )}
      <ProcessOverlay isActive={processing} message="Merging PDFs..." />
    </ToolLayout>
  );
}
