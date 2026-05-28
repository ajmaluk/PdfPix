"use client";

import { useRef } from "react";
import { useTool } from "@/components/ToolContext";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  hasFiles?: boolean;
  fileCount?: number;
}

export default function FileUploader({ onFilesSelected, accept = ".pdf", hasFiles: propHasFiles, fileCount: propFileCount }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { hasFiles: contextHasFiles, fileCount: contextFileCount } = useTool();
  const activeHasFiles = propHasFiles ?? contextHasFiles;
  const activeFileCount = propFileCount ?? contextFileCount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const isImage = accept.includes("jpg") || accept.includes("jpeg") || accept.includes("png") || accept.includes("image");
  const buttonLabel = isImage ? "Select images" : "Select PDF files";

  return (
    <div
      id="uploader"
      className={`uploader ${activeHasFiles ? "box" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="uploader__main-row">
        <a className="uploader__btn tooltip--left" id="pickfiles" title="Add more files" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" strokeLinecap="round" strokeWidth="2" stroke="#fff" fill="none" strokeLinejoin="round">
            <path d="M10 1.833v16.333"/>
            <path d="M1.833 10h16.333"/>
          </svg>
          <span>{buttonLabel}</span>
          {activeHasFiles && activeFileCount !== undefined && activeFileCount > 0 && (
            <span className="uploader__btn__badge">{activeFileCount}</span>
          )}
        </a>
        <div className="uploader__extra">
          {activeHasFiles && (
            <a className="btn-icon uploader__extra__btn tooltip tooltip--right active" id="uploadDisk" title="Upload from your computer" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="#fff" fillRule="nonzero">
                <path d="M4.8 19c-.442 0-.8-.448-.8-1s.358-1 .8-1h10.4c.442 0 .8.448.8 1s-.358 1-.8 1H4.8z"/>
                <path d="M7 15h6l-1 3H8z"/>
                <path d="M2 2v11h16V2H2zM1 0h18a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1z"/>
              </svg>
            </a>
          )}
          <a className="btn-icon uploader__extra__btn tooltip tooltip--right active" id="gdrive_file_selector" title="Select from Google Drive">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16">
              <path fill="#FFF" d="M8.7375,5.80725 L3.021,15.70725 L0.12375,10.69725 L5.847,0.795 L8.7375,5.80725 Z M17.865,10.38225 L12.078,10.39125 L6.378,0.489 L12.1725,0.489 L17.865,10.38225 Z M17.87625,10.9875 L14.9865,15.9975 L3.5415,15.99 L6.43425,10.98375 L17.87625,10.9875 Z"/>
            </svg>
          </a>
          <a className="btn-icon uploader__extra__btn tooltip tooltip--right active" id="dropbox_file_selector" title="Select from Dropbox">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path fill="#FFF" d="M5.3475,0.7035 L0.096,4.125 L3.708,7.03725 L9.018,3.765 L5.3475,0.7035 Z M17.904,4.14 L12.66525,0.7275 L9.01875,3.7725 L14.29875,7.03875 L17.904,4.14 Z M9.01875,10.305 L12.66525,13.35975 L17.904,9.945 L14.2995,7.0395 L9.01875,10.305 Z M0.096,9.9585 L5.3475,13.35975 L9.01875,10.305 L3.70875,7.0455 L0.096,9.9585 Z M9.01875,10.9635 L5.35575,14.0385 L3.786,13.02 L3.786,14.16 L9.01875,17.30475 L14.271,14.15175 L14.271,13.0125 L12.693,14.031 L9.01875,10.9635 Z"/>
            </svg>
          </a>
        </div>
      </div>
      <div className="uploader__droptxt">or drop files here</div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
