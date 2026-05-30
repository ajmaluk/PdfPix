"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolIcon from "@/components/ToolIcon";
import { tools } from "@/lib/tools";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_URL,
} from "@/lib/site";

const categories = [
  "All",
  "Workflows",
  "Organize PDF",
  "Optimize PDF",
  "Convert PDF",
  "Edit PDF",
  "PDF Security",
  "PDF Intelligence",
];

const homepageTopics = [
  {
    title: "Organize PDF files online",
    description:
      "Use PdfPix to merge PDF files, split large documents, remove pages, reorder files, and prepare clean document packs for school, office, legal, and client workflows.",
    links: [
      { href: "/merge-pdf", label: "Merge PDF" },
      { href: "/split-pdf", label: "Split PDF" },
      { href: "/organize-pdf", label: "Organize PDF" },
      { href: "/remove-pages", label: "Remove Pages" },
    ],
  },
  {
    title: "Convert PDF and office documents faster",
    description:
      "Convert PDF to Word, PDF to Excel, PDF to JPG, Word to PDF, PowerPoint to PDF, and Excel to PDF from one browser-based workspace without switching between separate services.",
    links: [
      { href: "/pdf-to-word", label: "PDF to Word" },
      { href: "/pdf-to-excel", label: "PDF to Excel" },
      { href: "/word-to-pdf", label: "Word to PDF" },
      { href: "/powerpoint-to-pdf", label: "PowerPoint to PDF" },
    ],
  },
  {
    title: "Edit, protect, and prepare PDFs",
    description:
      "Add watermarks, rotate pages, fill PDF forms, redact sensitive information, password-protect files, and sign documents when you need final delivery-ready PDFs.",
    links: [
      { href: "/edit-pdf", label: "Edit PDF" },
      { href: "/protect-pdf", label: "Protect PDF" },
      { href: "/redact-pdf", label: "Redact PDF" },
      { href: "/pdf-forms", label: "PDF Forms" },
    ],
  },
];

const homepageFaqs = [
  {
    question: "What is PdfPix used for?",
    answer:
      "PdfPix is an online PDF toolkit for merging, splitting, compressing, converting, editing, signing, securing, translating, and organizing PDF files from the browser.",
  },
  {
    question: "Can I use PdfPix as a free PDF converter?",
    answer:
      "Yes. The homepage links directly to free PDF converter tools for Word, Excel, PowerPoint, JPG, PNG, HTML, PDF/A, and image workflows.",
  },
  {
    question: "Which PDF tools are most useful for everyday work?",
    answer:
      "The most common workflows are merge PDF, split PDF, compress PDF, PDF to Word, Word to PDF, protect PDF, redact PDF, and sign PDF because they solve common office and document-sharing tasks quickly.",
  },
  {
    question: "Does PdfPix include AI PDF tools?",
    answer:
      "Yes. PdfPix includes AI-oriented tools such as PDF summarization and PDF translation alongside OCR and core document conversion utilities.",
  },
];

export default function HomePage() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? tools
    : filter === "Workflows"
    ? tools.filter((t) => t.category === "organize" || t.category === "convert" || t.category === "edit" || t.category === "security")
    : tools.filter((t) => {
      const normalized = filter.toLowerCase();
      return t.category ===
        { "organize pdf": "organize", "optimize pdf": "optimize", "convert pdf": "convert", "edit pdf": "edit", "pdf security": "security", "pdf intelligence": "intelligence" }[normalized];
    });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "PdfPix PDF Tools",
    "itemListElement": tools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${SITE_URL}${tool.path}/`,
      "name": tool.title,
      "description": tool.description
    }))
  };

  return (
    <>
      {/* Homepage Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": SITE_NAME,
            "url": SITE_URL,
            "description": SITE_DESCRIPTION,
            "inLanguage": "en"
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
            "logo": SITE_OG_IMAGE
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema)
        }}
      />
      <Header />
      <div className="main" style={{ marginTop: "20px" }}>
        <div className="pattern-bg"></div>
        <div className="home-title">
          <h1 className="home-title__title">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="home-title__subtitle">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use!
            Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
        </div>
        <div className="tools">
          <div className="tools__filter">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`tag ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
          <div className="tools__container">
            {filtered.map((tool) => (
              <div key={tool.id} className="tools__item">
                <Link href={tool.path} title={tool.title}>
                  <div className="tools__item__icon">
                    <span className="tools__item__icon-inner">
                      <ToolIcon id={tool.id} color={tool.color} size={78} />
                    </span>
                  </div>
                  <h3>{tool.title}</h3>
                  <div className="tools__item__content">
                    <p>{tool.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <section className="max-w-5xl mx-auto px-4 pb-20 pt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl p-6" style={{ border: "1px solid var(--color-border)", background: "rgba(255,255,255,0.9)", boxShadow: "0 18px 46px rgba(15, 23, 42, 0.08)" }}>
              <h2 className="mb-3 text-xl font-bold" style={{ color: "var(--color-dark)" }}>Private by design</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                PdfPix runs core PDF processing in your browser, which helps protect confidential documents and removes slow uploads.
              </p>
            </div>
            <div className="rounded-2xl p-6" style={{ border: "1px solid var(--color-border)", background: "rgba(255,255,255,0.9)", boxShadow: "0 18px 46px rgba(15, 23, 42, 0.08)" }}>
              <h2 className="mb-3 text-xl font-bold" style={{ color: "var(--color-dark)" }}>Tools for every workflow</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                Merge, split, compress, convert, redact, sign, translate, and organize PDF files from one toolkit.
              </p>
            </div>
            <div className="rounded-2xl p-6" style={{ border: "1px solid var(--color-border)", background: "rgba(255,255,255,0.9)", boxShadow: "0 18px 46px rgba(15, 23, 42, 0.08)" }}>
              <h2 className="mb-3 text-xl font-bold" style={{ color: "var(--color-dark)" }}>Built for speed</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                Open a tool, drop your file, and finish the task in a few clicks without registration or waiting queues.
              </p>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <div className="rounded-[2rem] border p-8 md:p-12" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,251,255,0.96) 100%)", boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)" }}>
            <div className="max-w-4xl">
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl" style={{ color: "var(--color-dark)" }}>
                Free PDF tools online for conversion, editing, compression, and secure document work
              </h2>
              <p className="mt-5 text-base leading-8 text-gray-700 md:text-lg">
                PdfPix is built for people who need an online PDF editor, PDF converter, PDF compressor, and document workflow toolkit in one place. Instead of sending users through separate pages with inconsistent behavior, PdfPix brings together practical browser-based PDF tools for organizing files, converting office documents, preparing client-ready exports, and handling sensitive PDFs with faster turnaround.
              </p>
              <p className="mt-4 text-base leading-8 text-gray-700">
                The homepage is designed to help users discover the right tool for a specific task: merge PDF for combining files, split PDF for extracting pages, compress PDF for upload limits, convert PDF to Word or Excel for editing, and use protect, redact, sign, or OCR tools when document handling becomes more specialized. That makes the page useful for both tool-intent keywords and broader informational searches around PDF workflows.
              </p>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {homepageTopics.map((topic) => (
              <article
                key={topic.title}
                className="rounded-3xl border p-7"
                style={{ borderColor: "var(--color-border)", background: "rgba(255,255,255,0.94)", boxShadow: "0 18px 46px rgba(15, 23, 42, 0.06)" }}
              >
                <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
                  {topic.title}
                </h2>
                <p className="mt-4 text-sm leading-8 text-gray-700">{topic.description}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {topic.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full px-4 py-2 text-sm font-semibold"
                      style={{ background: "rgba(17, 117, 239, 0.08)", color: "var(--color-primary)" }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border p-8 md:p-10" style={{ borderColor: "var(--color-border)", background: "#ffffff" }}>
              <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
                Why people search for online PDF tools like PdfPix
              </h2>
              <p className="mt-5 text-sm leading-8 text-gray-700">
                Most users are not looking for generic software. They are looking for a direct solution to a document problem: how to merge PDF files, how to reduce PDF size, how to convert PDF to Word, how to sign a PDF online, or how to protect a PDF before sending it. A strong homepage should answer those use cases in plain language so both users and search engines understand the full scope of the product.
              </p>
              <p className="mt-4 text-sm leading-8 text-gray-700">
                PdfPix supports document organization, optimization, conversion, editing, security, and AI-assisted PDF workflows. That includes tools for OCR PDF, translate PDF, summarize PDF, redact PDF, compare PDF, PDF forms, HTML to PDF, and scan to PDF. This broader coverage helps the homepage rank across long-tail PDF keywords while still keeping the core experience focused.
              </p>
              <p className="mt-4 text-sm leading-8 text-gray-700">
                For users who want more background on the product ecosystem, the site also links to the <Link href="/blog" style={{ color: "var(--color-primary)" }}>blog</Link>, the <Link href="/founder" style={{ color: "var(--color-primary)" }}>founder page</Link>, and the <Link href="/about" style={{ color: "var(--color-primary)" }}>about page</Link>. Those pages add brand context around PdfPix, UTHAKKAN, browser-first tools, and the wider set of products around the platform.
              </p>
            </div>
            <aside className="rounded-3xl border p-8 md:p-10" style={{ borderColor: "var(--color-border)", background: "#fcfeff" }}>
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
                Popular PDF workflows
              </h2>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-gray-700">
                <li>Merge PDFs for reports, applications, and submission packs.</li>
                <li>Compress PDFs for email attachments and portal upload limits.</li>
                <li>Convert PDFs to Word or Excel for editing and extraction.</li>
                <li>Protect, unlock, redact, and sign PDFs for secure sharing.</li>
                <li>Summarize, translate, and OCR PDFs for faster review and reuse.</li>
              </ul>
            </aside>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="rounded-3xl border p-8 md:p-10" style={{ borderColor: "var(--color-border)", background: "#ffffff", boxShadow: "0 18px 46px rgba(15, 23, 42, 0.05)" }}>
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
              Frequently asked questions about PdfPix
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {homepageFaqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border p-6"
                  style={{ borderColor: "var(--color-border)", background: "#fcfeff" }}
                >
                  <h3 className="text-lg font-bold" style={{ color: "var(--color-dark)" }}>
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-700">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
