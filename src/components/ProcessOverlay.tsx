"use client";

interface ProcessOverlayProps {
  isActive: boolean;
  message?: string;
}

export default function ProcessOverlay({ isActive, message = "Processing your files..." }: ProcessOverlayProps) {
  return (
    <div className={`process ${isActive ? "active" : ""}`}>
      <p className="processAction">{message}</p>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="animate-spin">
        <circle cx="12" cy="12" r="10" stroke="#e8eaed" strokeWidth="3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#ee6c4d" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p className="text-sm text-[#6b7280] mt-2">Do not close your browser. Wait until your files are uploaded and processed! This might take a few minutes.</p>
    </div>
  );
}
