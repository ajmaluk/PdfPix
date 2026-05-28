"use client";

export default function ToolIcon({ id, color, size = 18 }: { id: string; color: string; size?: number }) {
  const s = (n: number) => Math.round(n * (size / 48));

  switch (id) {
    case "merge":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <g fill={color} fillRule="evenodd">
            <path d="M5.488.363h21.75c1.78 0 2.43.184 3.082.535a3.66 3.66 0 0 1 1.512 1.512c.348.652.535 1.297.535 3.082v21.746c0 1.78-.187 2.43-.535 3.082a3.66 3.66 0 0 1-1.512 1.512c-.652.348-1.3.535-3.082.535H5.488c-1.78 0-2.43-.187-3.082-.535A3.66 3.66 0 0 1 .895 30.32c-.348-.652-.535-1.3-.535-3.082V5.488c0-1.78.188-2.43.535-3.082A3.7 3.7 0 0 1 2.406.895c.652-.348 1.3-.53 3.082-.53zm0 0"/>
            <path d="M44.563 49.69H22.816c-1.78 0-2.43-.184-3.082-.535a3.6 3.6 0 0 1-1.512-1.512c-.348-.652-.535-1.297-.535-3.082V22.816c0-1.78.184-2.43.535-3.082a3.6 3.6 0 0 1 1.512-1.512c.652-.348 1.3-.535 3.082-.535h21.746c1.785 0 2.43.188 3.082.535.645.34 1.172.867 1.512 1.512.352.652.535 1.3.535 3.082v21.746c0 1.785-.184 2.43-.535 3.082a3.6 3.6 0 0 1-1.512 1.512c-.652.352-1.297.535-3.082.535zm0 0"/>
          </g>
          <path fill="#FFF" d="M17.906 10.965a.87.87 0 0 0-.875.86v3.8L9.84 8.523a.886.886 0 0 0-1.238 0 .85.85 0 0 0-.254.605.86.86 0 0 0 .254.6l7.195 7.098h-3.875c-.484 0-.875.387-.875.86s.4.86.875.86h5.984a.9.9 0 0 0 .332-.066.86.86 0 0 0 .473-.465.8.8 0 0 0 .066-.328v-5.87a.86.86 0 0 0-.87-.86zm14.418 28.008c.48 0 .87-.383.87-.86v-3.797l7.195 7.098a.88.88 0 0 0 1.234 0 .85.85 0 0 0 .258-.605c0-.23-.094-.45-.258-.605l-7.2-7.102h3.875c.484 0 .875-.383.875-.86s-.4-.855-.875-.855h-5.984a.9.9 0 0 0-.336.066.9.9 0 0 0-.473.46.9.9 0 0 0-.066.328v5.87c0 .477.4.86.875.86z"/>
          <path fill="#FFF" d="M22.223 28.873c-.355.352-.93.352-1.285 0s-.355-.934 0-1.3a.91.91 0 0 1 1.285 0 .927.927 0 0 1 0 1.3m3.374-3.357a.91.91 0 0 1-1.285 0 .91.91 0 0 1 0-1.285.914.914 0 0 1 1.285 0 .91.91 0 0 1 0 1.285m3.36-3.364a.91.91 0 0 1-1.285 0 .91.91 0 0 1 0-1.285.91.91 0 0 1 1.285 0 .91.91 0 0 1 0 1.285zm0 0"/>
        </svg>
      );
    case "split":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <g fill={color} fillRule="evenodd">
            <path d="M5.488.363h21.75c1.78 0 2.43.184 3.082.535a3.66 3.66 0 0 1 1.512 1.512c.348.652.535 1.297.535 3.082v21.746c0 1.78-.187 2.43-.535 3.082a3.66 3.66 0 0 1-1.512 1.512c-.652.348-1.3.535-3.082.535H5.488c-1.78 0-2.43-.187-3.082-.535A3.66 3.66 0 0 1 .895 30.32c-.348-.652-.535-1.3-.535-3.082V5.488c0-1.78.188-2.43.535-3.082A3.7 3.7 0 0 1 2.406.895c.652-.348 1.3-.53 3.082-.53zm0 0"/>
            <path d="M44.563 49.69H22.816c-1.78 0-2.43-.184-3.082-.535a3.6 3.6 0 0 1-1.512-1.512c-.348-.652-.535-1.297-.535-3.082V22.816c0-1.78.184-2.43.535-3.082a3.6 3.6 0 0 1 1.512-1.512c.652-.348 1.3-.535 3.082-.535h21.746c1.785 0 2.43.188 3.082.535.645.34 1.172.867 1.512 1.512.352.652.535 1.3.535 3.082v21.746c0 1.785-.184 2.43-.535 3.082a3.6 3.6 0 0 1-1.512 1.512c-.652.352-1.297.535-3.082.535zm0 0"/>
          </g>
          <path fill="#FFF" d="M9.22 15.87a.87.87 0 0 0 .875-.86v-3.8l7.195 7.102a.88.88 0 0 0 1.234 0 .85.85 0 0 0 0-1.215L11.328 10h3.875c.484 0 .875-.387.875-.86s-.4-.86-.875-.86H9.22a.9.9 0 0 0-.332.066.86.86 0 0 0-.539.793v5.875c0 .473.4.86.87.86zm31.793 18.2a.865.865 0 0 0-.875.855v3.8L32.94 31.63a.88.88 0 0 0-1.234 0 .84.84 0 0 0-.258.605.85.85 0 0 0 .258.605l7.2 7.1H35.02c-.48 0-.87.387-.87.86a.86.86 0 0 0 .871.855H41a.88.88 0 0 0 .805-.527.9.9 0 0 0 .066-.328v-5.883a.87.87 0 0 0-.87-.855z"/>
          <path fill="#FFF" d="M22.233 18.883c-.355.352-.93.352-1.285 0s-.355-.934 0-1.3a.91.91 0 0 1 1.285 0 .927.927 0 0 1 0 1.3m3.365-3.367a.91.91 0 0 1-1.285 0 .91.91 0 0 1 0-1.285.914.914 0 0 1 1.285 0 .91.91 0 0 1 0 1.285m3.36-3.364a.91.91 0 0 1-1.285 0 .91.91 0 0 1 0-1.285.91.91 0 0 1 1.285 0 .91.91 0 0 1 0 1.285zm0 0"/>
        </svg>
      );
    case "compress":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <path fill={color} fillRule="evenodd" d="M31.523 28h14.953c1.223 0 1.668.13 2.117.367.44.234.805.598 1.04 1.04.242.45.367.895.367 2.117v14.953c0 1.223-.13 1.668-.367 2.117-.234.44-.598.805-1.04 1.04-.45.242-.895.367-2.117.367H31.523c-1.223 0-1.668-.13-2.117-.367a2.52 2.52 0 0 1-1.04-1.04c-.242-.45-.367-.895-.367-2.117V31.523c0-1.223.13-1.668.367-2.117.234-.44.598-.805 1.04-1.04.45-.242.895-.367 2.117-.367zm0-28h14.953c1.223 0 1.668.13 2.117.367.44.234.805.598 1.04 1.04.242.45.367.895.367 2.117v14.953c0 1.223-.13 1.668-.367 2.117-.234.44-.598.805-1.04 1.04-.45.242-.895.367-2.117.367H31.523c-1.223 0-1.668-.13-2.117-.367a2.52 2.52 0 0 1-1.04-1.04c-.242-.45-.367-.895-.367-2.117V3.523c0-1.223.13-1.668.367-2.117.234-.44.598-.805 1.04-1.04C29.855.125 30.3 0 31.523 0m-28 28h14.953c1.223 0 1.668.13 2.117.367.44.234.805.598 1.04 1.04.242.45.367.895.367 2.117v14.953c0 1.223-.13 1.668-.367 2.117-.234.44-.598.805-1.04 1.04-.45.242-.895.367-2.117.367H3.523c-1.223 0-1.668-.13-2.117-.367a2.52 2.52 0 0 1-1.04-1.04C.125 48.145 0 47.7 0 46.477V31.523c0-1.223.13-1.668.367-2.117.234-.44.598-.805 1.04-1.04.45-.242.895-.367 2.117-.367zm0-28h14.953c1.223 0 1.668.13 2.117.367.44.234.805.598 1.04 1.04.242.45.367.895.367 2.117v14.953c0 1.223-.13 1.668-.367 2.117-.234.44-.598.805-1.04 1.04-.45.242-.895.367-2.117.367H3.523c-1.223 0-1.668-.13-2.117-.367a2.52 2.52 0 0 1-1.04-1.04C.125 20.145 0 19.7 0 18.477V3.523C0 2.3.13 1.852.367 1.406A2.56 2.56 0 0 1 1.406.367C1.855.13 2.3 0 3.523 0m0 0"/>
          <path fill="#FFF" d="M35 41.8c0 .48.398.867.883.867a.88.88 0 0 0 .883-.867v-3.844l5.145 5.05a.89.89 0 0 0 1.246 0 .85.85 0 0 0 .262-.613c0-.23-.094-.45-.262-.613l-5.14-5.047h3.914a.88.88 0 0 0 .883-.867.874.874 0 0 0-.883-.867h-6.05a.875.875 0 0 0-.817.536.8.8 0 0 0-.066.328zm7.3-26.387c.48 0 .867-.398.867-.883a.88.88 0 0 0-.867-.883h-3.844l5.05-5.14a.9.9 0 0 0 0-1.25.86.86 0 0 0-1.227 0l-5.047 5.148V8.492a.876.876 0 0 0-.867-.883.87.87 0 0 0-.867.879v6.05c0 .113.023.23.066.336a.86.86 0 0 0 .47.477.8.8 0 0 0 .332.07H42.3z"/>
        </svg>
      );
    case "word-to-pdf":
    case "pdf-to-word":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M12 14h4.5l2.5 13.5 2.5-13.5h4.5l2.5 13.5 2.5-13.5H36l-4.5 22h-4.5l-2.5-13.5-2.5 13.5h-4.5z"/>
        </svg>
      );
    case "powerpoint-to-pdf":
    case "ppt-to-pdf":
    case "pdf-to-powerpoint":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M15 36V14h8.5q3.15 0 4.95 1.65 1.8 1.65 1.8 4.5t-1.8 4.5Q27 26.3 23.85 26.3H18.2V36H15zm3.2-12.7h5.1q1.65 0 2.625-.825t.975-2.325-.975-2.325-2.625-.825H18.2z"/>
        </svg>
      );
    case "jpg-to-pdf":
    case "pdf-to-jpg":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M15 15h20v20H15z" opacity="0.2"/>
          <circle cx="21" cy="21" r="3" fill={color} />
          <path fill={color} d="M15 35l6-8 5 6 5-7 9 9z"/>
        </svg>
      );
    case "html-to-pdf":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" d="M19 17l-7 8 7 8m12-16l7 8-7 8M23 33l4-16"/>
        </svg>
      );
    case "excel-to-pdf":
    case "pdf-to-excel":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="m36.61 41-2.508-4.72c-.102-.176-.195-.5-.3-.973h-.04q-.071.334-.336 1.012L30.9 41H27l4.64-7.25-4.246-7.25h3.992l2.082 4.348c.164.344.313.754.438 1.227h.04c.082-.285.234-.703.457-1.266l2.316-4.31h3.66l-4.37 7.19L40.5 41z"/>
        </svg>
      );
    case "pdf-to-pdfa":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M16 36V14h11l7 7v15z" />
          <path fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M21 27l3 3 5-5" />
        </svg>
      );
    case "rotate-pdf":
    case "rotate":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M31 19l4 4-4 4v-3h-3q-2.5 0-4.25 1.75T22 30t1.75 4.25T28 36h4v3h-4q-3.75 0-6.375-2.625T19 30t2.625-6.375T28 21h3z"/>
        </svg>
      );
    case "edit-pdf":
    case "edit":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 36h4.5l13.25-13.25-4.5-4.5L14 31.5zm17.8-14.3l-3.5-3.5 2.85-2.85q.5-.5 1.15-.5t1.15.5l1.2 1.2q.5.5.5 1.15t-.5 1.15z"/>
        </svg>
      );
    case "remove-pages":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M16 37V13h10l6 6v18zm13-19V16H19v18h14V18z"/>
          <path fill={color} d="M22 28h8v2h-8z"/>
        </svg>
      );
    case "add-watermark":
    case "watermark":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 36V14h10l6 6v16zm9-19V16H17v18h16V17z"/>
          <path fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" d="M20 26q1 0 2-.5t1.5-1.5q.5 1 1.5 1.5t2 .5q1 0 2-.5t1.5-1.5q.5 1 1.5 1.5t2 .5"/>
        </svg>
      );
    case "add-page-numbers":
    case "page-numbers":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 36V14h10l6 6v16zm9-19V16H17v18h16V17z"/>
          <path fill={color} d="M20 25h4v4h-4zm6 0h4v4h-4z"/>
          <path fill="none" stroke={color} strokeWidth="1.2" d="M20 25v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
        </svg>
      );
    case "organize":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M15 36V14h8l6 6v16zm7-19V16h-4v18h10V17z"/>
          <path fill={color} d="M20 25h10v-2H20zm0 4h10v-2H20zm0 4h7v-2h-7z"/>
        </svg>
      );
    case "crop-pdf":
    case "crop":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M20 14h-3v3h-3v3h3v13h13v3h3v-3h3v-3H30V20a3 3 0 0 0-3-3h-7zm0 3h7v7h-7z"/>
          <path fill={color} d="M33 17h3v3h-3zM14 30h3v3h-3z" opacity="0.5"/>
        </svg>
      );
    case "unlock-pdf":
    case "unlock":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M32 22h-9v-2q0-2.5-1.75-4.25T17 14t-4.25 1.75T11 20h3q0-1.25.875-2.125T17 17t2.125.875T20 20v2h-2q-1.2 0-2.1.9T15 25v8q0 1.2.9 2.1t2.1.9h14q1.2 0 2.1-.9t.9-2.1v-8q0-1.2-.9-2.1T32 22zm-7 7.5q0 1.05-.725 1.775T22.5 32t-1.775-.725T20 29.5q0-1.05.725-1.775T22.5 27t1.775.725T25 29.5z"/>
        </svg>
      );
    case "protect-pdf":
    case "protect":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M25 14q-2.5 0-4.25 1.75T19 20v2h-2q-1.2 0-2.1.9T14 25v8q0 1.2.9 2.1t2.1.9h16q1.2 0 2.1-.9t.9-2.1v-8q0-1.2-.9-2.1T33 22h-2v-2q0-2.5-1.75-4.25T25 14zm0 3q1.25 0 2.125.875T28 20v2H22v-2q0-1.25.875-2.125T25 17zm-2.5 12.5q0 1.05.725 1.775T25 32t1.775-.725.725-1.775q0-1.05-.725-1.775T25 27t-1.775.725-.725 1.775z"/>
        </svg>
      );
    case "sign-pdf":
    case "sign":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 36h4.5l13.25-13.25-4.5-4.5L14 31.5zm19.25-14.3l-3.5-3.5 1.35-1.35q.5-.5 1.15-.5t1.15.5l1.2 1.2q.5.5.5 1.15t-.5 1.15z"/>
          <path fill={color} d="M12 38v3h20v-3z" opacity="0.5"/>
        </svg>
      );
    case "redact-pdf":
    case "redact":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 37V13h10l6 6v18zm9-19V16H17v18h16V17z"/>
          <rect x="19" y="24" width="12" height="4" rx="1" fill={color} />
        </svg>
      );
    case "compare-pdf":
    case "compare":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 36V14h6v22z"/>
          <path fill={color} d="M30 36V14h6v22z"/>
          <path fill={color} d="M14 19h6v2h-6zm16 0h6v2h-6zM14 24h6v2h-6zm16 0h6v2h-6zM14 29h6v2h-6zm16 0h6v2h-6z" opacity="0.5"/>
        </svg>
      );
    case "scan":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M34 14H16q-1.2 0-2.1.9T13 17v3h3v-3h18v16H16v-3h-3v3q0 1.2.9 2.1t2.1.9h18q1.2 0 2.1-.9t.9-2.1V17q0-1.2-.9-2.1T34 14z"/>
          <path fill={color} d="M10 24h30v2H10z"/>
        </svg>
      );
    case "ocr":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 36V14h10l6 6v16zm9-19V16H17v18h16V17z"/>
          <path fill={color} d="M20 25h10v2H20zm0 3h8v2H20z"/>
        </svg>
      );
    case "repair":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 36V14h10l6 6v16zm9-19V16H17v18h16V17z"/>
          <path fill={color} d="M31 20q-3 0-5.25 2.25T23.5 27.5q0 .7.1 1.3l-7 7q-.55.55-.55 1.35t.55 1.35 1.35.55 1.35-.55l7-7q.6.1 1.3.1 3 0 5.25-2.25T35 24q0-.75-.15-1.5t-.35-1.25l-3.25 3.25q-.55.55-1.375.55t-1.375-.55-.55-1.375.55-1.375l3.25-3.25q-.5-.2-1.25-.35T31 20z"/>
        </svg>
      );
    case "pdf-forms":
    case "forms":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M15 36V14h10l6 6v16zm9-19V16H18v18h14V17z"/>
          <path fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 28l4 4 7-7"/>
        </svg>
      );
    case "pdf-summarize":
    case "summarize":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 36V14h10l6 6v16zm9-19V16H17v18h16V17z"/>
          <path fill={color} d="M22 28h4v4h-4zm6-6h4v4h-4z"/>
          <circle cx="22" cy="22" r="1.5" fill={color} />
          <circle cx="28" cy="28" r="1.5" fill={color} />
        </svg>
      );
    case "translate-pdf":
    case "translate":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="3" y="3" width="44" height="44" rx="10" fill={color} opacity="0.15" />
          <rect x="7" y="7" width="36" height="36" rx="6" fill={color} opacity="0.3" />
          <path fill={color} d="M14 36V14h10l6 6v16zm9-19V16H17v18h16V17z"/>
          <path fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M23 24l-4 4 4 4m4-8l4 4-4 4"/>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <rect x="2" y="2" width="46" height="46" rx="8" fill={color} opacity="0.12" />
          <rect x="8" y="8" width="34" height="34" rx="6" fill={color} opacity="0.25" />
          <rect x="14" y="14" width="22" height="22" rx="4" fill={color} />
        </svg>
      );
  }
}
