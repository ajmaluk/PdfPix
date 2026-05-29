import { useEffect, useRef } from "react";
import { formatFileSize } from "@/lib/pdf-utils";
import { useTool } from "@/components/ToolContext";

interface FileListProps {
  files: { id: string; name: string; size: number; file: File }[];
  onRemove: (id: string) => void;
  onReorder?: (from: number, to: number) => void;
  hideSidetools?: boolean;
  onAddFiles?: (files: File[]) => void;
  accept?: string;
}

export default function FileList({ files, onRemove, onReorder, hideSidetools, onAddFiles, accept = ".pdf" }: FileListProps) {
  const { setHasFiles, setFileCount } = useTool();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  if (files.length === 0) return null;

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;
    onReorder?.(index, newIndex);
  };

  return (
    <div className="flex items-start justify-center gap-6 w-full">
      <div className="tool__workarea__rendered flex-1" id="fileGroups" style={{ paddingTop: '12px' }}>
        {files.map((file, index) => (
          <div key={file.id} className="file">
            <div className="file__actions">
              <div className="file__btn remove" onClick={() => onRemove(file.id)} title="Remove this file">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="#47474f"><path d="M1.41 0L6 4.59 10.59 0 12 1.41 7.41 6 12 10.59 10.59 12 6 7.41 1.41 12 0 10.59 4.59 6 0 1.41z"/></svg>
              </div>
              {onReorder && (
                <div className="file__btn rotate" onClick={() => moveItem(index, index > 0 ? -1 : 1)} title="Move">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#47474f"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
                </div>
              )}
            </div>
            <div className="file__canvas">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#ee6c4d" opacity="0.4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8" fill="none" stroke="#fff" strokeWidth="2"/>
              </svg>
            </div>
            <div className="file__info">
              <span className="file__info__name">{file.name}</span>
              <span className="file__info__size">{formatFileSize(file.size)}</span>
            </div>
          </div>
        ))}
      </div>

      {onAddFiles && (
        <div className="merge-grid-actions-container hidden md:flex">
          {/* Add more files FAB */}
          <div className="merge-fab-add group relative">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
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

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onAddFiles(Array.from(e.target.files));
                e.target.value = "";
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
