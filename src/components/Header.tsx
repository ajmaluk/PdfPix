"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ToolIcon from "@/components/ToolIcon";
import { tools } from "@/lib/tools";

const toolByPath = new Map(tools.map((tool) => [tool.path, tool]));

function normalizePath(path: string | null) {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

function getToolVisual(tool: { id: string; href: string }) {
  const match = toolByPath.get(tool.href);
  return {
    iconId: match?.id ?? tool.id,
    color: match?.color ?? "#6b7280",
  };
}

const toolGroups = [
  {
    category: "Organize PDF",
    items: [
      { id: "merge", name: "Merge PDF", href: "/merge-pdf" },
      { id: "split", name: "Split PDF", href: "/split-pdf" },
      { id: "remove-pages", name: "Remove pages", href: "/remove-pages" },
      { id: "organize", name: "Organize PDF", href: "/organize-pdf" },
      { id: "scan", name: "Scan to PDF", href: "/scan-to-pdf" },
    ],
  },
  {
    category: "Optimize PDF",
    items: [
      { id: "compress", name: "Compress PDF", href: "/compress-pdf" },
      { id: "repair", name: "Repair PDF", href: "/repair-pdf" },
      { id: "ocr", name: "OCR PDF", href: "/ocr-pdf" },
    ],
  },
  {
    category: "Convert to PDF",
    items: [
      { id: "jpg-to-pdf", name: "JPG to PDF", href: "/jpg-to-pdf" },
      { id: "word-to-pdf", name: "WORD to PDF", href: "/word-to-pdf" },
      { id: "powerpoint-to-pdf", name: "POWERPOINT to PDF", href: "/powerpoint-to-pdf" },
      { id: "excel-to-pdf", name: "EXCEL to PDF", href: "/excel-to-pdf" },
      { id: "html-to-pdf", name: "HTML to PDF", href: "/html-to-pdf" },
    ],
  },
  {
    category: "Convert from PDF",
    items: [
      { id: "pdf-to-jpg", name: "PDF to JPG", href: "/pdf-to-jpg" },
      { id: "pdf-to-word", name: "PDF to WORD", href: "/pdf-to-word" },
      { id: "pdf-to-powerpoint", name: "PDF to POWERPOINT", href: "/pdf-to-powerpoint" },
      { id: "pdf-to-excel", name: "PDF to EXCEL", href: "/pdf-to-excel" },
      { id: "pdf-to-pdfa", name: "PDF to PDF/A", href: "/pdf-to-pdfa" },
    ],
  },
  {
    category: "Edit PDF",
    items: [
      { id: "rotate-pdf", name: "Rotate PDF", href: "/rotate-pdf" },
      { id: "add-page-numbers", name: "Add page numbers", href: "/add-page-numbers" },
      { id: "add-watermark", name: "Add watermark", href: "/add-watermark" },
      { id: "crop-pdf", name: "Crop PDF", href: "/crop-pdf" },
      { id: "edit-pdf", name: "Edit PDF", href: "/edit-pdf" },
      { id: "pdf-forms", name: "PDF Forms", href: "/pdf-forms" },
    ],
  },
  {
    category: "PDF Security",
    items: [
      { id: "unlock-pdf", name: "Unlock PDF", href: "/unlock-pdf" },
      { id: "protect-pdf", name: "Protect PDF", href: "/protect-pdf" },
      { id: "sign-pdf", name: "Sign PDF", href: "/sign-pdf" },
      { id: "redact-pdf", name: "Redact PDF", href: "/redact-pdf" },
      { id: "compare-pdf", name: "Compare PDF", href: "/compare-pdf" },
    ],
  },
  {
    category: "PDF Intelligence",
    items: [
      { id: "pdf-summarize", name: "AI Summarizer", href: "/pdf-summarize" },
      { id: "translate-pdf", name: "Translate PDF", href: "/translate-pdf" },
    ],
  },
];

const convertPdfLinks = [
  {
    title: "Convert to PDF",
    items: [
      { id: "jpg-to-pdf", name: "JPG to PDF", href: "/jpg-to-pdf" },
      { id: "word-to-pdf", name: "WORD to PDF", href: "/word-to-pdf" },
      { id: "powerpoint-to-pdf", name: "POWERPOINT to PDF", href: "/powerpoint-to-pdf" },
      { id: "excel-to-pdf", name: "EXCEL to PDF", href: "/excel-to-pdf" },
      { id: "html-to-pdf", name: "HTML to PDF", href: "/html-to-pdf" },
    ],
  },
  {
    title: "Convert from PDF",
    items: [
      { id: "pdf-to-jpg", name: "PDF to JPG", href: "/pdf-to-jpg" },
      { id: "pdf-to-word", name: "PDF to WORD", href: "/pdf-to-word" },
      { id: "pdf-to-powerpoint", name: "PDF to POWERPOINT", href: "/pdf-to-powerpoint" },
      { id: "pdf-to-excel", name: "PDF to EXCEL", href: "/pdf-to-excel" },
      { id: "pdf-to-pdfa", name: "PDF to PDF/A", href: "/pdf-to-pdfa" },
    ],
  },
];

const ecosystemProducts = [
  {
    name: "ToolPix",
    desc: "AI productivity platform featuring image, PDF, and dev utilities.",
    href: "https://toolpix.pythonanywhere.com",
    icon: "✨",
    color: "#8B5CF6",
  },
  {
    name: "Joyful Builder",
    desc: "AI-assisted drag-and-drop website and application layout builder.",
    href: "https://joyful.uthakkan.in",
    icon: "🤖",
    color: "#EC4899",
  },
  {
    name: "KallanCop",
    desc: "Local multiplayer social deduction game on Google Play Store.",
    href: "https://play.google.com/store/apps/details?id=com.ajmal.kallancop",
    icon: "🎮",
    color: "#F59E0B",
  },
] as const;

const pdfPixLinks = [
  { name: "Pricing", href: "/pricing", icon: "pricing" },
  { name: "About us", href: "/about", icon: "about" },
  { name: "Sponsor", href: "/sponsor", icon: "sponsor" },
  { name: "Donate", href: "/donate", icon: "donate" },
  { name: "Founder", href: "/founder", icon: "founder" },
  { name: "Blog", href: "/blog", icon: "blog" },
  { name: "Contact", href: "/contact", icon: "about" },
  { name: "Privacy", href: "/privacy", icon: "privacy" },
  { name: "Terms", href: "/terms", icon: "terms" },
] as const;

const pdfPixLinkColumns = [
  pdfPixLinks.slice(0, Math.ceil(pdfPixLinks.length / 2)),
  pdfPixLinks.slice(Math.ceil(pdfPixLinks.length / 2)),
];

const convertMenuPaths = new Set(convertPdfLinks.flatMap((group) => group.items.map((item) => item.href)));
const directMenuPaths = new Set(["/merge-pdf", "/split-pdf", "/compress-pdf"]);
const allToolsMenuPaths = new Set(
  toolGroups
    .flatMap((group) => group.items.map((item) => item.href))
    .filter((href) => !convertMenuPaths.has(href) && !directMenuPaths.has(href))
);

function NineDotsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="4" height="4" rx="1" />
      <rect x="10" y="3" width="4" height="4" rx="1" />
      <rect x="17" y="3" width="4" height="4" rx="1" />
      <rect x="3" y="10" width="4" height="4" rx="1" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <rect x="17" y="10" width="4" height="4" rx="1" />
      <rect x="3" y="17" width="4" height="4" rx="1" />
      <rect x="10" y="17" width="4" height="4" rx="1" />
      <rect x="17" y="17" width="4" height="4" rx="1" />
    </svg>
  );
}

function SiteLinkIcon({ icon }: { icon: "pricing" | "about" | "privacy" | "terms" | "sponsor" | "blog" | "donate" | "founder" }) {
  if (icon === "pricing") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M7 10h10" />
        <path d="M7 14h4" />
      </svg>
    );
  }

  if (icon === "about") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21s-6.5-4.35-9-8.28C1.24 9.94 3.16 6 7.2 6c2.17 0 3.55 1.2 4.8 2.76C13.25 7.2 14.63 6 16.8 6 20.84 6 22.76 9.94 21 12.72 18.5 16.65 12 21 12 21Z" />
      </svg>
    );
  }

  if (icon === "sponsor") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    );
  }

  if (icon === "donate") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    );
  }

  if (icon === "founder") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }

  if (icon === "blog") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    );
  }

  if (icon === "privacy") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l7 4v5c0 5-3.2 7.76-7 9-3.8-1.24-7-4-7-9V7l7-4Z" />
        <path d="M9.5 12.5 11 14l3.5-3.5" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v18" />
      <path d="M7 7h8.5a2.5 2.5 0 0 1 0 5H10a2.5 2.5 0 0 0 0 5h7" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const currentPath = normalizePath(pathname);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const convertMenuActive = convertMenuPaths.has(currentPath);
  const allToolsMenuActive = allToolsMenuPaths.has(currentPath);

  return (
    <header className="header">
      <nav className="header__nav">
        <button
          className="header__mobile-toggle header__mobile-toggle--left show--sm"
          onClick={() => {
            setLeftOpen(true);
            setRightOpen(false);
          }}
          aria-label="Open PDF tools menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <Link href="/" className="brand" title="PdfPix">
          <span className="sr-only">PdfPix home</span>
          <Image src="/img/pdfpix.svg" alt="PdfPix" width={196} height={40} priority />
        </Link>

        <div className="menu hide--sm">
          <ul className="menu__primary">
            <li>
              <Link href="/merge-pdf" className={currentPath === "/merge-pdf" ? "active" : ""}>Merge PDF</Link>
            </li>
            <li>
              <Link href="/split-pdf" className={currentPath === "/split-pdf" ? "active" : ""}>Split PDF</Link>
            </li>
            <li>
              <Link href="/compress-pdf" className={currentPath === "/compress-pdf" ? "active" : ""}>Compress PDF</Link>
            </li>
            <li className={`nav-has-dropdown nav-has-dropdown--convert-mega ${convertMenuActive ? "active" : ""}`}>
              <span className={`menu--md menu--md-convert ${convertMenuActive ? "active" : ""}`}>Convert PDF <i className="ico ico--down" aria-hidden="true"></i></span>
              <div className="nav-dropdown nav-dropdown--convert-mega">
                <div className="nav-dropdown--convert-mega__pointer" aria-hidden="true"></div>
                <div className="nav-dropdown--convert-mega__grid">
                  {convertPdfLinks.map((col) => (
                    <div key={col.title} className="nav-dropdown--convert-mega__col">
                      <div className="nav-dropdown--convert-mega__title">{col.title}</div>
                      <ul className="nav-dropdown--convert-mega__list">
                        {col.items.map((t) => (
                          <li key={t.id}>
                            <Link href={t.href} className={currentPath === t.href ? "active" : ""}>
                              <ToolIcon id={getToolVisual(t).iconId} color={getToolVisual(t).color} size={26} />
                              <span>{t.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
            <li className={`nav-has-dropdown nav-has-dropdown--tool-mega ${allToolsMenuActive ? "active" : ""}`}>
              <span className={`menu--md menu--md-tools ${allToolsMenuActive ? "active" : ""}`}>All PDF tools <i className="ico ico--down" aria-hidden="true"></i></span>
              <div className="nav-dropdown nav-dropdown--tool-mega">
                <div className="nav-dropdown--tool-mega__pointer" aria-hidden="true"></div>
                <div className="nav-dropdown--tool-mega__grid">
                  {toolGroups.map((group) => (
                    <div key={group.category} className="nav-dropdown--tool-mega__col">
                      <div className="nav-dropdown--tool-mega__title">{group.category}</div>
                      <ul className="nav-dropdown--tool-mega__list">
                        {group.items.map((tool) => (
                          <li key={tool.id}>
                            <Link href={tool.href} className={currentPath === tool.href ? "active" : ""}>
                              <ToolIcon id={getToolVisual(tool).iconId} color={getToolVisual(tool).color} size={26} />
                              <span>{tool.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className="nav-actions">
          <ul>
            <li className="nav-has-dropdown hide--sm">
              <span className="grid-icon-btn grid-icon-btn--products" aria-label="Open site menu">
                <NineDotsIcon />
              </span>
              <div className="nav-dropdown nav-dropdown--products">
                <div className="nav-products">
                  {/* Left Main Products Column */}
                  <div className="nav-products__main">
                    <div className="nav-products__title">Other Products</div>
                    <div className="nav-products__list">
                      {ecosystemProducts.map((prod) => (
                        <a
                          key={prod.name}
                          href={prod.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="nav-products__product"
                        >
                          <div 
                            className="nav-products__product-icon"
                            style={{ background: `${prod.color}15`, color: prod.color }}
                          >
                            {prod.icon}
                          </div>
                          <div className="nav-products__product-copy">
                            <span className="nav-products__product-name">{prod.name}</span>
                            <span className="nav-products__product-desc">{prod.desc}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Right Corporate Links Column */}
                  <div className="nav-products__side">
                    <div className="nav-products__title">PdfPix</div>
                    <div className="nav-products__side-list">
                      {pdfPixLinkColumns.map((column, columnIndex) => (
                        <div key={columnIndex} className="nav-products__side-col">
                          {column.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={`nav-products__item nav-products__item--with-icon ${currentPath === link.href ? "active" : ""}`}
                            >
                              <span className="nav-products__item-icon">
                                <SiteLinkIcon icon={link.icon} />
                              </span>
                              <span>{link.name}</span>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="show--sm">
              <button
                className="grid-icon-btn"
                onClick={() => {
                  setRightOpen(true);
                  setLeftOpen(false);
                }}
                aria-label="Open site menu"
              >
                <NineDotsIcon />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {(leftOpen || rightOpen) && (
        <div className="drawer-backdrop" onClick={() => { setLeftOpen(false); setRightOpen(false); }}></div>
      )}

      <div className={`drawer drawer--left ${leftOpen ? "open" : ""}`}>
        <div className="drawer__header">
          <div className="drawer__logo">
            <Image src="/img/pdfpix.svg" alt="PdfPix" width={196} height={40} />
          </div>
          <button className="drawer__close" onClick={() => setLeftOpen(false)} aria-label="Close tools menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="drawer__content">
          {toolGroups.map((group) => (
            <div key={group.category} className="drawer__section">
              <div className="drawer__section-title">{group.category}</div>
              <ul className="drawer__section-list">
                {group.items.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      className={`drawer__section-item ${currentPath === tool.href ? "active" : ""}`}
                      onClick={() => setLeftOpen(false)}
                    >
                      <ToolIcon id={getToolVisual(tool).iconId} color={getToolVisual(tool).color} size={18} />
                      <span>{tool.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={`drawer drawer--right ${rightOpen ? "open" : ""}`}>
        <div className="drawer__header">
          <div className="drawer__logo">
            <Image src="/img/pdfpix.svg" alt="PdfPix" width={196} height={40} />
          </div>
          <button className="drawer__close" onClick={() => setRightOpen(false)} aria-label="Close site links">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="drawer__content">
          <div className="drawer__section">
            <div className="drawer__section-title">PdfPix</div>
            <ul className="drawer__section-list">
              {pdfPixLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`drawer__section-item ${currentPath === link.href ? "active" : ""}`}
                    onClick={() => setRightOpen(false)}
                  >
                    <SiteLinkIcon icon={link.icon} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="drawer__section">
            <div className="drawer__section-title">Other Products</div>
            <ul className="drawer__section-list">
              {ecosystemProducts.map((prod) => (
                <li key={prod.name}>
                  <a
                    href={prod.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="drawer__section-item"
                    onClick={() => setRightOpen(false)}
                  >
                    <span className="mr-2 text-lg">{prod.icon}</span>
                    <span>{prod.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
