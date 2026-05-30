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
          <h2 className="home-title__subtitle">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use!
            Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </h2>
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
      </div>
      <Footer />
    </>
  );
}
