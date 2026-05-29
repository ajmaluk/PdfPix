"use client";

import { useEffect } from "react";
import { formatFileSize } from "@/lib/pdf-utils";
import { useTool } from "@/components/ToolContext";

interface FileListProps {
  files: { id: string; name: string; size: number; file: File }[];
  onRemove: (id: string) => void;
  onReorder?: (from: number, to: number) => void;
  hideSidetools?: boolean;
}

export default function FileList({ files, onRemove, onReorder, hideSidetools }: FileListProps) {
  const { setHasFiles, setFileCount } = useTool();

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
    <>
      {!hideSidetools && (
        <div className="sidetools">
          <a className="btn-icon btn-icon--white" id="settingsToogle" title="Toggle settings panel">
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
    </>
  );
}
