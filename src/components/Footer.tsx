import Image from "next/image";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/site";

const columns = [
  {
    title: "Organize PDF",
    links: [
      { name: "Merge PDF", href: "/merge-pdf" },
      { name: "Split PDF", href: "/split-pdf" },
      { name: "Remove pages", href: "/remove-pages" },
      { name: "Organize PDF", href: "/organize-pdf" },
      { name: "Scan to PDF", href: "/scan-to-pdf" },
    ],
  },
  {
    title: "Optimize PDF",
    links: [
      { name: "Compress PDF", href: "/compress-pdf" },
      { name: "Repair PDF", href: "/repair-pdf" },
      { name: "OCR PDF", href: "/ocr-pdf" },
    ],
  },
  {
    title: "Convert to PDF",
    links: [
      { name: "JPG to PDF", href: "/jpg-to-pdf" },
      { name: "WORD to PDF", href: "/word-to-pdf" },
      { name: "POWERPOINT to PDF", href: "/powerpoint-to-pdf" },
      { name: "EXCEL to PDF", href: "/excel-to-pdf" },
      { name: "HTML to PDF", href: "/html-to-pdf" },
    ],
  },
  {
    title: "Convert from PDF",
    links: [
      { name: "PDF to JPG", href: "/pdf-to-jpg" },
      { name: "PDF to WORD", href: "/pdf-to-word" },
      { name: "PDF to POWERPOINT", href: "/pdf-to-powerpoint" },
      { name: "PDF to EXCEL", href: "/pdf-to-excel" },
      { name: "PDF to PDF/A", href: "/pdf-to-pdfa" },
    ],
  },
  {
    title: "Edit PDF",
    links: [
      { name: "Rotate PDF", href: "/rotate-pdf" },
      { name: "Add page numbers", href: "/add-page-numbers" },
      { name: "Add watermark", href: "/add-watermark" },
      { name: "Crop PDF", href: "/crop-pdf" },
      { name: "Edit PDF", href: "/edit-pdf" },
      { name: "PDF Forms", href: "/pdf-forms" },
    ],
  },
  {
    title: "PDF Security",
    links: [
      { name: "Unlock PDF", href: "/unlock-pdf" },
      { name: "Protect PDF", href: "/protect-pdf" },
      { name: "Sign PDF", href: "/sign-pdf" },
      { name: "Redact PDF", href: "/redact-pdf" },
      { name: "Compare PDF", href: "/compare-pdf" },
    ],
  },
  {
    title: "PDF Intelligence",
    links: [
      { name: "AI Summarizer", href: "/pdf-summarize" },
      { name: "Translate PDF", href: "/translate-pdf" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {columns.map((col) => (
            <div key={col.title} className="footer__col">
              <div className="footer__title">{col.title}</div>
              {col.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer__bottom">
          <div className="footer__brand">
            <Image src="/img/pdfpix-footer.svg" alt="PdfPix" width={196} height={40} />
            <span>&copy; 2026 PdfPix. All rights reserved.</span>
          </div>
          <div className="footer__social">
            <Link href="/about">About Us</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/sponsor">Sponsor</Link>
            <Link href="/donate">Donate</Link>
            <Link href="/founder">Founder</Link>
            <Link href="/contact" title="Contact">Contact</Link>
            <span>{SUPPORT_EMAIL}</span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
