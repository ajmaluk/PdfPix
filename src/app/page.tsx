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
      </div>
      <Footer />
    </>
  );
}
