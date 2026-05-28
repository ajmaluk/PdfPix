"use client";

interface UploadOverlayProps {
  isActive: boolean;
  progress: number;
  fileName?: string;
}

export default function UploadOverlay({ isActive, progress, fileName }: UploadOverlayProps) {
  return (
    <div className={`uploading ${isActive ? "active" : ""}`}>
      <div className="uploading__status">
        <div className="uploading__status__title">Uploading file</div>
        {fileName && <div className="uploading__status__file">{fileName}</div>}
        <div className="uploading__bar">
          <span className="uploading__bar__completed" style={{ width: `${progress}%` }} />
        </div>
        <div className="uploading__status__percent">
          <div className="uploading__status__percent__value">{Math.round(progress)}%</div>
          Uploaded
        </div>
      </div>
    </div>
  );
}
