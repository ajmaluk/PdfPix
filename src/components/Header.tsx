"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ToolIcon from "@/components/ToolIcon";

const icoColors: Record<string, string> = {
  merge: "#ee6c4d", split: "#ee6c4d", compress: "#8fbc5d",
  "remove-pages": "#ee6c4d", organize: "#ee6c4d", scan: "#ee6c4d",
  repair: "#8fbc5d", ocr: "#8fbc5d",
  "jpg-to-pdf": "#d6bf2d", "word-to-pdf": "#5f83c6", "powerpoint-to-pdf": "#ee6c4d",
  "excel-to-pdf": "#5ea162", "html-to-pdf": "#d6bf2d",
  "pdf-to-jpg": "#d6bf2d", "pdf-to-word": "#5f83c6", "pdf-to-powerpoint": "#ee6c4d",
  "pdf-to-excel": "#5ea162", "pdf-to-pdfa": "#ab6993",
  "rotate-pdf": "#ab6993", "add-page-numbers": "#ab6993", "add-watermark": "#ab6993",
  "crop-pdf": "#ab6993", "edit-pdf": "#ab6993", "pdf-forms": "#ab6993",
  "unlock-pdf": "#5f83c6", "protect-pdf": "#5f83c6", "sign-pdf": "#5f83c6",
  "redact-pdf": "#5f83c6", "compare-pdf": "#5f83c6",
  "pdf-summarize": "#ee6c4d", "translate-pdf": "#ee6c4d",
};

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

const productLinks = [
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

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

export default function Header() {
  const pathname = usePathname();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

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
          <img src="/img/pdfpix.svg" alt="PdfPix" />
        </Link>

        <div className="menu hide--sm">
          <ul className="menu__primary">
            <li>
              <Link href="/merge-pdf" className={pathname === "/merge-pdf" ? "active" : ""}>Merge PDF</Link>
            </li>
            <li>
              <Link href="/split-pdf" className={pathname === "/split-pdf" ? "active" : ""}>Split PDF</Link>
            </li>
            <li>
              <Link href="/compress-pdf" className={pathname === "/compress-pdf" ? "active" : ""}>Compress PDF</Link>
            </li>
            <li className="nav-has-dropdown">
              <span>Convert PDF <i className="ico ico--down"></i></span>
              <div className="nav-dropdown">
                <ul>
                  {convertPdfLinks.map((col) => (
                    <li key={col.title}>
                      <ul>
                        <li><div className="nav__title">{col.title}</div></li>
                        {col.items.map((t) => (
                          <li key={t.id}>
                            <Link href={t.href} className={pathname === t.href ? "active" : ""}>
                              <ToolIcon id={t.id} color={icoColors[t.id]} />
                              {t.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className="nav-has-dropdown nav-has-dropdown--full">
              <span className="menu--md">All PDF tools <i className="ico ico--down"></i></span>
              <div className="nav-dropdown nav-dropdown--full">
                <ul>
                  {toolGroups.map((group) => (
                    <li key={group.category}>
                      <ul>
                        <li><div className="nav__title">{group.category}</div></li>
                        {group.items.map((tool) => (
                          <li key={tool.id}>
                            <Link href={tool.href} className={pathname === tool.href ? "active" : ""}>
                              <ToolIcon id={tool.id} color={icoColors[tool.id]} />
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div className="nav-actions">
          <ul>
            <li className="nav-has-dropdown hide--sm">
              <span className="grid-icon-btn" aria-label="Open product menu">
                <NineDotsIcon />
              </span>
              <div className="nav-dropdown nav-dropdown--products">
                <div className="nav-products">
                  {productLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="nav-products__item">
                      {link.name}
                    </Link>
                  ))}
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
                aria-label="Open site links"
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
            <img src="/img/pdfpix.svg" alt="PdfPix" />
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
                      className={`drawer__section-item ${pathname === tool.href ? "active" : ""}`}
                      onClick={() => setLeftOpen(false)}
                    >
                      <ToolIcon id={tool.id} color={icoColors[tool.id]} size={18} />
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
            <img src="/img/pdfpix.svg" alt="PdfPix" />
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
            <div className="drawer__section-title">Site Links</div>
            <ul className="drawer__section-list">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="drawer__section-item" onClick={() => setRightOpen(false)}>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
