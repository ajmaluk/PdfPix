"use client";

function normalizeIconId(id: string) {
  switch (id) {
    case "pdf-to-powerpoint":
      return "pdf-to-ppt";
    case "powerpoint-to-pdf":
      return "ppt-to-pdf";
    case "rotate-pdf":
      return "rotate";
    case "edit-pdf":
      return "edit";
    case "add-watermark":
      return "watermark";
    case "add-page-numbers":
      return "page-numbers";
    case "unlock-pdf":
      return "unlock";
    case "protect-pdf":
      return "protect";
    case "sign-pdf":
      return "sign";
    case "redact-pdf":
      return "redact";
    case "compare-pdf":
      return "compare";
    case "pdf-summarize":
      return "summarize";
    case "translate-pdf":
      return "translate";
    case "pdf-forms":
      return "forms";
    default:
      return id;
  }
}

function TileIcon({
  size,
  color,
  children,
}: {
  size: number;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true">
      <rect x="4" y="4" width="42" height="42" rx="11" fill={color} opacity="0.16" />
      <rect x="9" y="9" width="32" height="32" rx="8" fill={color} />
      {children}
    </svg>
  );
}

function FileBadge({
  x,
  y,
  accent,
  label,
  labelSize = 6.8,
}: {
  x: number;
  y: number;
  accent: string;
  label: string;
  labelSize?: number;
}) {
  return (
    <>
      <rect x={x} y={y + 2} width="17" height="22" rx="4.2" fill="#ffffff" opacity="0.97" />
      <path d={`M${x + 12} ${y + 2}h5v5`} fill="none" stroke="#d1d5db" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x={x} y={y + 10} width="17" height="9" rx="2.6" fill={accent} />
      <text
        x={x + 8.5}
        y={y + 16.5}
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
        fontSize={labelSize}
        fontWeight="700"
        textAnchor="middle"
      >
        {label}
      </text>
    </>
  );
}

function AppBadge({
  x,
  y,
  fill,
  label,
  textSize = 10,
}: {
  x: number;
  y: number;
  fill: string;
  label: string;
  textSize?: number;
}) {
  return (
    <>
      <rect x={x} y={y} width="18" height="18" rx="4.2" fill={fill} />
      <text
        x={x + 9}
        y={y + 12.5}
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
        fontSize={textSize}
        fontWeight="700"
        textAnchor="middle"
      >
        {label}
      </text>
    </>
  );
}

function ConvertIcon({
  size,
  direction,
  appFill,
  appLabel,
  pdfAccent = "#ef4444",
  fileLabel = "PDF",
  appTextSize = 10,
  fileTextSize = 7.6,
}: {
  size: number;
  direction: "from-pdf" | "to-pdf";
  appFill: string;
  appLabel: string;
  pdfAccent?: string;
  fileLabel?: string;
  appTextSize?: number;
  fileTextSize?: number;
}) {
  const fileX = direction === "from-pdf" ? 8 : 19;
  const fileY = direction === "from-pdf" ? 10 : 19;
  const appX = direction === "from-pdf" ? 21 : 8;
  const appY = direction === "from-pdf" ? 21 : 8;

  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true">
      <FileBadge x={fileX} y={fileY} accent={pdfAccent} label={fileLabel} labelSize={fileTextSize} />
      <AppBadge x={appX} y={appY} fill={appFill} label={appLabel} textSize={appTextSize} />
    </svg>
  );
}

function MergeIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true">
      <rect x="6" y="8" width="22" height="22" rx="4.5" fill={color} />
      <rect x="22" y="20" width="22" height="22" rx="4.5" fill={color} />
      <path d="M17 14v8h-8m8 0-6-6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33 36v-8h8m-8 0 6 6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24.8" cy="24.8" r="1.6" fill="#fff" />
      <circle cx="29.5" cy="24.8" r="1.6" fill="#fff" />
      <circle cx="34.2" cy="24.8" r="1.6" fill="#fff" />
    </svg>
  );
}

function SplitIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true">
      <rect x="6" y="8" width="22" height="22" rx="4.5" fill={color} />
      <rect x="22" y="20" width="22" height="22" rx="4.5" fill={color} />
      <path d="M12 14h8v8m0-8-6 6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 36h-8v-8m0 8 6-6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24.8" cy="24.8" r="1.6" fill="#fff" />
      <circle cx="29.5" cy="24.8" r="1.6" fill="#fff" />
      <circle cx="34.2" cy="24.8" r="1.6" fill="#fff" />
    </svg>
  );
}

function CompressIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true">
      <rect x="7" y="8" width="16" height="16" rx="3" fill={color} />
      <rect x="27" y="8" width="16" height="16" rx="3" fill={color} />
      <rect x="7" y="28" width="16" height="16" rx="3" fill={color} />
      <rect x="27" y="28" width="16" height="16" rx="3" fill={color} />
      <path d="M15 14v4h-4m4 0-4-4" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 38v-4h-4m4 0-4 4" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 14v4h4m-4 0 4-4" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 38v-4h4m-4 0 4 4" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ToolIcon({ id, color, size = 18 }: { id: string; color: string; size?: number }) {
  const normalizedId = normalizeIconId(id);

  switch (normalizedId) {
    case "merge":
      return <MergeIcon size={size} color={color} />;
    case "split":
      return <SplitIcon size={size} color={color} />;
    case "compress":
      return <CompressIcon size={size} color={color} />;

    case "pdf-to-word":
      return <ConvertIcon size={size} direction="from-pdf" appFill="#5f83c6" appLabel="W" />;
    case "word-to-pdf":
      return <ConvertIcon size={size} direction="to-pdf" appFill="#5f83c6" appLabel="W" />;
    case "pdf-to-ppt":
      return <ConvertIcon size={size} direction="from-pdf" appFill="#f28c63" appLabel="P" />;
    case "ppt-to-pdf":
      return <ConvertIcon size={size} direction="to-pdf" appFill="#f28c63" appLabel="P" />;
    case "pdf-to-excel":
      return <ConvertIcon size={size} direction="from-pdf" appFill="#74b06f" appLabel="X" />;
    case "excel-to-pdf":
      return <ConvertIcon size={size} direction="to-pdf" appFill="#74b06f" appLabel="X" />;
    case "pdf-to-jpg":
      return <ConvertIcon size={size} direction="from-pdf" appFill="#d9bf29" appLabel="J" />;
    case "jpg-to-pdf":
      return <ConvertIcon size={size} direction="to-pdf" appFill="#d9bf29" appLabel="J" />;
    case "html-to-pdf":
      return <ConvertIcon size={size} direction="to-pdf" appFill="#8b5cf6" appLabel="</>" appTextSize={6.5} />;
    case "pdf-to-pdfa":
      return <ConvertIcon size={size} direction="from-pdf" appFill="#8b5cf6" appLabel="A" />;

    case "rotate":
      return (
        <TileIcon size={size} color={color}>
          <path d="M33.5 17.5v7h-7" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 28a8.5 8.5 0 1 1-4.7-9" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
        </TileIcon>
      );
    case "edit":
      return (
        <TileIcon size={size} color={color}>
          <path d="M18 32.5h4.7L34 21.2l-4.7-4.7L18 27.8z" fill="#fff" />
          <path d="M28.2 17.6l4.3 4.3" fill="none" stroke={color} strokeWidth="1.2" />
        </TileIcon>
      );
    case "remove-pages":
      return (
        <TileIcon size={size} color={color}>
          <path d="M19 15h9l4 4v16H19z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M28 15v5h5M21.5 28h8" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </TileIcon>
      );
    case "watermark":
      return (
        <TileIcon size={size} color={color}>
          <path d="M18 15h9l4 4v16H18z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M20 29c2-2 3.5-1 5 0s3 .8 5-1" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" />
        </TileIcon>
      );
    case "page-numbers":
      return (
        <TileIcon size={size} color={color}>
          <path d="M18 15h9l4 4v16H18z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M21.5 26.5h3M21.5 31h3M27 31h3" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </TileIcon>
      );
    case "organize":
      return (
        <TileIcon size={size} color={color}>
          <path d="M19 15h9l4 4v16H19z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M22 24h8M22 28h8M22 32h5" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" />
        </TileIcon>
      );
    case "crop":
      return (
        <TileIcon size={size} color={color}>
          <path d="M19 16v15h15M16 19h7a3 3 0 0 1 3 3v7" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M31 16v6M16 31h6" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
        </TileIcon>
      );
    case "unlock":
      return (
        <TileIcon size={size} color={color}>
          <path d="M19.5 24v-2.5a5.5 5.5 0 0 1 10.5-2.3" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
          <rect x="17" y="23" width="16" height="12" rx="3" fill="none" stroke="#fff" strokeWidth="2.8" />
        </TileIcon>
      );
    case "protect":
      return (
        <TileIcon size={size} color={color}>
          <path d="M19.5 23v-2a5.5 5.5 0 0 1 11 0v2" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
          <rect x="17" y="23" width="16" height="12" rx="3" fill="none" stroke="#fff" strokeWidth="2.8" />
        </TileIcon>
      );
    case "sign":
      return (
        <TileIcon size={size} color={color}>
          <path d="M19 31.5h4.5L34 21l-4.5-4.5L19 27z" fill="#fff" />
          <path d="M17 35h16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </TileIcon>
      );
    case "redact":
      return (
        <TileIcon size={size} color={color}>
          <path d="M19 15h9l4 4v16H19z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="21" y="25" width="10" height="4" rx="1.2" fill="#fff" />
        </TileIcon>
      );
    case "compare":
      return (
        <TileIcon size={size} color={color}>
          <path d="M20 17v16M30 17v16M24 19h-4M24 25h-4M24 31h-4M30 19h-4M30 25h-4M30 31h-4" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </TileIcon>
      );
    case "scan":
      return (
        <TileIcon size={size} color={color}>
          <path d="M17 20h16v10H17z" fill="none" stroke="#fff" strokeWidth="2.6" />
          <path d="M20 17h10M20 33h10" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        </TileIcon>
      );
    case "ocr":
      return (
        <TileIcon size={size} color={color}>
          <path d="M19 15h9l4 4v16H19z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M22 24h8M22 28h6M22 32h7" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" />
        </TileIcon>
      );
    case "repair":
      return (
        <TileIcon size={size} color={color}>
          <path d="M20 18h10l-2 4 2 4H20l2-4z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M24 26l-5 6M26 24l5-6" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </TileIcon>
      );
    case "forms":
      return (
        <TileIcon size={size} color={color}>
          <path d="M19 15h9l4 4v16H19z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M22 24h7M22 28h5M22 32h8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </TileIcon>
      );
    case "summarize":
      return (
        <TileIcon size={size} color={color}>
          <path d="M20 18h10v14H20z" fill="none" stroke="#fff" strokeWidth="2.2" />
          <path d="M23 22v6M27 24v4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </TileIcon>
      );
    case "translate":
      return (
        <TileIcon size={size} color={color}>
          <path d="M21 19h8M25 19v12M21 31h8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M30 23l4 4m0-4-4 4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </TileIcon>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true">
          <rect x="4" y="4" width="42" height="42" rx="11" fill={color} opacity="0.16" />
          <rect x="9" y="9" width="32" height="32" rx="8" fill={color} />
        </svg>
      );
  }
}
