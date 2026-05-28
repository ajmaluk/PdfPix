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
  { category: "Organize PDF", items: [
    { id: "merge", name: "Merge PDF", href: "/merge-pdf" },
    { id: "split", name: "Split PDF", href: "/split-pdf" },
    { id: "remove-pages", name: "Remove pages", href: "/remove-pages" },
    { id: "organize", name: "Organize PDF", href: "/organize-pdf" },
    { id: "scan", name: "Scan to PDF", href: "/scan-to-pdf" },
  ]},
  { category: "Optimize PDF", items: [
    { id: "compress", name: "Compress PDF", href: "/compress-pdf" },
    { id: "repair", name: "Repair PDF", href: "/repair-pdf" },
    { id: "ocr", name: "OCR PDF", href: "/ocr-pdf" },
  ]},
  { category: "Convert to PDF", items: [
    { id: "jpg-to-pdf", name: "JPG to PDF", href: "/jpg-to-pdf" },
    { id: "word-to-pdf", name: "WORD to PDF", href: "/word-to-pdf" },
    { id: "powerpoint-to-pdf", name: "POWERPOINT to PDF", href: "/powerpoint-to-pdf" },
    { id: "excel-to-pdf", name: "EXCEL to PDF", href: "/excel-to-pdf" },
    { id: "html-to-pdf", name: "HTML to PDF", href: "/html-to-pdf" },
  ]},
  { category: "Convert from PDF", items: [
    { id: "pdf-to-jpg", name: "PDF to JPG", href: "/pdf-to-jpg" },
    { id: "pdf-to-word", name: "PDF to WORD", href: "/pdf-to-word" },
    { id: "pdf-to-powerpoint", name: "PDF to POWERPOINT", href: "/pdf-to-powerpoint" },
    { id: "pdf-to-excel", name: "PDF to EXCEL", href: "/pdf-to-excel" },
    { id: "pdf-to-pdfa", name: "PDF to PDF/A", href: "/pdf-to-pdfa" },
  ]},
  { category: "Edit PDF", items: [
    { id: "rotate-pdf", name: "Rotate PDF", href: "/rotate-pdf" },
    { id: "add-page-numbers", name: "Add page numbers", href: "/add-page-numbers" },
    { id: "add-watermark", name: "Add watermark", href: "/add-watermark" },
    { id: "crop-pdf", name: "Crop PDF", href: "/crop-pdf" },
    { id: "edit-pdf", name: "Edit PDF", href: "/edit-pdf" },
    { id: "pdf-forms", name: "PDF Forms", href: "/pdf-forms" },
  ]},
  { category: "PDF Security", items: [
    { id: "unlock-pdf", name: "Unlock PDF", href: "/unlock-pdf" },
    { id: "protect-pdf", name: "Protect PDF", href: "/protect-pdf" },
    { id: "sign-pdf", name: "Sign PDF", href: "/sign-pdf" },
    { id: "redact-pdf", name: "Redact PDF", href: "/redact-pdf" },
    { id: "compare-pdf", name: "Compare PDF", href: "/compare-pdf" },
  ]},
  { category: "PDF Intelligence", items: [
    { id: "pdf-summarize", name: "AI Summarizer", href: "/pdf-summarize" },
    { id: "translate-pdf", name: "Translate PDF", href: "/translate-pdf" },
  ]},
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

export default function Header() {
  const pathname = usePathname();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const [otherOpen, setOtherOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);

  return (
    <header className="header">
      <nav className="header__nav">
        {/* Left Side Hamburger (Mobile Only) */}
        <button 
          className="header__mobile-toggle header__mobile-toggle--left show--sm" 
          onClick={() => { setLeftOpen(true); setRightOpen(false); }}
          aria-label="Open PDF tools menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Brand Logo */}
        <Link href="/" className="brand" title="PdfPix">
          <img src="/img/pdfpix.svg" alt="PdfPix" />
        </Link>

        {/* Desktop Menu links (Hidden on Mobile) */}
        <div className="menu hide--sm">
          <ul>
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
          </ul>
          <ul className="menu__main">
            <li className="nav-has-dropdown nav-has-dropdown--full">
              <span className="menu--md hide--sm">All PDF tools <i className="ico ico--down"></i></span>
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

        {/* Right Actions / Nine-dots */}
        <div className="nav-actions">
          <ul>
            {/* Desktop Only 9-dots (Hidden on Mobile) */}
            <li className="nav-has-dropdown nav-has-dropdown--mega hide--sm">
              <span className="grid-icon-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
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
              </span>
              <div className="nav-dropdown nav-dropdown--mega">
                <div className="mega-dropdown__grid">
                  {/* Column 1: Other Products */}
                  <div className="mega-dropdown__col">
                    <div className="mega-dropdown__title">Other Products</div>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="https://toolpix.pythonanywhere.com" target="_blank" rel="noopener noreferrer" className="mega-dropdown__item">
                          <div className="mega-dropdown__icon bg-blue-100 text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
                          </div>
                          <div>
                            <div className="mega-dropdown__item-title">ToolPix</div>
                            <div className="mega-dropdown__item-desc">Multiple AI and utility tools</div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="https://play.google.com/store/apps/details?id=com.ajmal.kallancop" target="_blank" rel="noopener noreferrer" className="mega-dropdown__item">
                          <div className="mega-dropdown__icon bg-red-100 text-red-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          </div>
                          <div>
                            <div className="mega-dropdown__item-title">KallanCop</div>
                            <div className="mega-dropdown__item-desc">Social deduction mobile game</div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="https://joyful.uthakkan.in" target="_blank" rel="noopener noreferrer" className="mega-dropdown__item">
                          <div className="mega-dropdown__icon bg-green-100 text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                          </div>
                          <div>
                            <div className="mega-dropdown__item-title">JoyFul</div>
                            <div className="mega-dropdown__item-desc">AI Website Builder platform</div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="mega-dropdown__item">
                          <div className="mega-dropdown__icon bg-yellow-100 text-yellow-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          </div>
                          <div>
                            <div className="mega-dropdown__item-title">ZyRace</div>
                            <div className="mega-dropdown__item-desc">Physics-based racing game</div>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Column 2: Solutions & Applications */}
                  <div className="mega-dropdown__col divider-left">
                    <div className="mega-dropdown__title">Solutions</div>
                    <ul className="mega-dropdown__list mb-6">
                      <li>
                        <a href="#" className="mega-dropdown__item">
                          <div className="mega-dropdown__icon bg-red-100 text-red-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                          </div>
                          <div>
                            <div className="mega-dropdown__item-title">Business</div>
                            <div className="mega-dropdown__item-desc">PDF editing for business teams</div>
                          </div>
                        </a>
                      </li>
                    </ul>
                    
                    <div className="mega-dropdown__title">Applications</div>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#" className="mega-dropdown__item">
                          <div className="mega-dropdown__icon bg-red-100 text-red-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                          </div>
                          <div>
                            <div className="mega-dropdown__item-title">Desktop App</div>
                            <div className="mega-dropdown__item-desc">Available for Mac and Windows</div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="mega-dropdown__item">
                          <div className="mega-dropdown__icon bg-red-100 text-red-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                          </div>
                          <div>
                            <div className="mega-dropdown__item-title">Mobile App</div>
                            <div className="mega-dropdown__item-desc">Available for iOS and Android</div>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Column 3: Corporate Links */}
                  <div className="mega-dropdown__col divider-left">
                    <ul className="mega-dropdown__links-list">
                      <li>
                        <Link href="/pricing" className="mega-dropdown__link-item">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                          Pricing
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="mega-dropdown__link-item">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                          Security
                        </Link>
                      </li>
                      <li>
                        <Link href="/" className="mega-dropdown__link-item">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                          Features
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="mega-dropdown__link-item font-semibold text-red-600">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                          About us
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="mega-dropdown__link-item">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 1118 0z"/></svg>
                          Help
                        </Link>
                      </li>
                      <li>
                        <a href="#" className="mega-dropdown__link-item">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 012.496 2.25l.801 7.211M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          Language
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            {/* Mobile Only 9-dots (Grid Menu toggler) */}
            <li className="show--sm">
              <button 
                className="grid-icon-btn" 
                onClick={() => { setRightOpen(true); setLeftOpen(false); }}
                aria-label="Open company products menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
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
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Backdrops and Drawers */}
      {(leftOpen || rightOpen) && (
        <div className="drawer-backdrop" onClick={() => { setLeftOpen(false); setRightOpen(false); }}></div>
      )}

      {/* Left Drawer: PDF Tools (Mobile View) */}
      <div className={`drawer drawer--left ${leftOpen ? "open" : ""}`}>
        <div className="drawer__header">
          <div className="drawer__logo">
            <img src="/img/pdfpix.svg" alt="PdfPix" style={{ height: "28px" }} />
          </div>
          <button className="drawer__close" onClick={() => setLeftOpen(false)}>
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

      {/* Right Drawer: Company & Links (Mobile View) */}
      <div className={`drawer drawer--right ${rightOpen ? "open" : ""}`}>
        <div className="drawer__header">
          <div className="drawer__logo">
            <span className="font-extrabold text-[#e5322d] text-lg tracking-tight">UTHAKKAN</span>
          </div>
          <button className="drawer__close" onClick={() => setRightOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="drawer__content">
          <ul className="drawer__menu-list">
            {/* OTHER PRODUCTS Accordion */}
            <li>
              <div className="drawer__accordion-header" onClick={() => setOtherOpen(!otherOpen)}>
                <span>OTHER PRODUCTS</span>
                <span className={`drawer__accordion-arrow ${otherOpen ? "rotated" : ""}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>
              <div className={`drawer__accordion-content ${otherOpen ? "expanded" : ""}`}>
                <ul className="drawer__accordion-list">
                  <li>
                    <a href="https://toolpix.pythonanywhere.com" target="_blank" rel="noopener noreferrer" className="drawer__accordion-item">
                      <strong>ToolPix</strong> - Multiple AI Tools
                    </a>
                  </li>
                  <li>
                    <a href="https://play.google.com/store/apps/details?id=com.ajmal.kallancop" target="_blank" rel="noopener noreferrer" className="drawer__accordion-item">
                      <strong>KallanCop</strong> - Social game
                    </a>
                  </li>
                  <li>
                    <a href="https://joyful.uthakkan.in" target="_blank" rel="noopener noreferrer" className="drawer__accordion-item">
                      <strong>JoyFul</strong> - AI Web Builder
                    </a>
                  </li>
                  <li>
                    <a href="#" className="drawer__accordion-item">
                      <strong>ZyRace</strong> - Racing game project
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            {/* SOLUTIONS Accordion */}
            <li>
              <div className="drawer__accordion-header" onClick={() => setSolutionsOpen(!solutionsOpen)}>
                <span>SOLUTIONS</span>
                <span className={`drawer__accordion-arrow ${solutionsOpen ? "rotated" : ""}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>
              <div className={`drawer__accordion-content ${solutionsOpen ? "expanded" : ""}`}>
                <ul className="drawer__accordion-list">
                  <li>
                    <a href="#" className="drawer__accordion-item">
                      <strong>Business</strong> - Workflows for teams
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            {/* APPLICATIONS Accordion */}
            <li>
              <div className="drawer__accordion-header" onClick={() => setAppsOpen(!appsOpen)}>
                <span>APPLICATIONS</span>
                <span className={`drawer__accordion-arrow ${appsOpen ? "rotated" : ""}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>
              <div className={`drawer__accordion-content ${appsOpen ? "expanded" : ""}`}>
                <ul className="drawer__accordion-list">
                  <li>
                    <a href="#" className="drawer__accordion-item">Desktop App</a>
                  </li>
                  <li>
                    <a href="#" className="drawer__accordion-item">Mobile App</a>
                  </li>
                </ul>
              </div>
            </li>

            {/* Separator */}
            <li className="drawer__divider"></li>

            {/* Standard Links */}
            <li>
              <Link href="/pricing" className="drawer__link" onClick={() => setRightOpen(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/about" className="drawer__link" onClick={() => setRightOpen(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Security
              </Link>
            </li>
            <li>
              <Link href="/" className="drawer__link" onClick={() => setRightOpen(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Features
              </Link>
            </li>
            <li>
              <Link href="/about" className="drawer__link text-[#e5322d] font-bold" onClick={() => setRightOpen(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                About us
              </Link>
            </li>
            
            <li className="drawer__divider"></li>
            
            <li>
              <Link href="/contact" className="drawer__link-footer" onClick={() => setRightOpen(false)}>
                Help
              </Link>
            </li>
            <li>
              <a href="#" className="drawer__link-footer">
                Language
              </a>
            </li>
          </ul>
      </div>
    </div>
  </header>
);
}
