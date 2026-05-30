"use client";

import Link from "next/link";
import { seoData } from "@/lib/seo-data";
import {
  SITE_URL,
  SITE_NAME,
  SITE_OG_IMAGE,
  SUPPORT_EMAIL,
  getCategoryLabel,
  getCanonicalUrl,
  getRelatedTools,
  getPathForSeoId,
  getToolForSeoId,
} from "@/lib/site";

interface ToolSEOContentProps {
  toolId: string;
}

const categoryIntentCopy: Record<string, string> = {
  "Organize PDF":
    "This tool is useful when you need to rearrange, combine, split, or prepare PDF pages for sharing, submissions, and document cleanup.",
  "Optimize PDF":
    "This tool is useful when you need better file size, better scan quality, or a PDF that is easier to search, open, and store.",
  "Convert PDF":
    "This tool is useful when you need to move content between PDF files and common office formats without using desktop software.",
  "Edit PDF":
    "This tool is useful when you need to add, change, or clean up visible content inside a PDF while staying in your browser.",
  "PDF Security":
    "This tool is useful when you need to protect, unlock, sign, compare, or permanently remove sensitive PDF information.",
  "PDF Intelligence":
    "This tool is useful when you need AI-assisted extraction, summarization, or translation for document workflows.",
  "PDF Tools":
    "This tool is useful when you need a fast PDF workflow that runs directly in your browser without uploading files to a server.",
};

export default function ToolSEOContent({ toolId }: ToolSEOContentProps) {
  const data = seoData[toolId];
  if (!data) return null;

  const { description, heading, steps, faqs } = data;
  const toolUrl = getCanonicalUrl(getPathForSeoId(toolId) ?? "/");
  const tool = getToolForSeoId(toolId);
  const relatedTools = getRelatedTools(toolId);
  const categoryLabel = tool ? getCategoryLabel(tool.category) : "PDF Tools";
  const useCaseCopy = categoryIntentCopy[categoryLabel] ?? categoryIntentCopy["PDF Tools"];

  // Structured Data Schemas
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": heading,
    "url": toolUrl,
    "image": SITE_OG_IMAGE,
    "description": description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 and JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "email": SUPPORT_EMAIL
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${SITE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryLabel
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": heading,
        "item": toolUrl
      }
    ]
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": heading,
    "url": toolUrl,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "email": SUPPORT_EMAIL
    },
    "featureList": steps,
    "description": description
  };

  return (
    <div className="seo-section mt-16 w-full pb-20" style={{ borderTop: "1px solid var(--color-border)", background: "linear-gradient(180deg, rgba(245,249,255,0.8) 0%, #ffffff 38%)" }}>
      {/* Schemas injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />

      <div className="max-w-4xl mx-auto px-6 pt-16">
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section
            className="rounded-2xl p-6"
            style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}
          >
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
              What is {heading}?
            </h2>
            <p className="text-sm leading-7 text-gray-700">
              {description}
            </p>
          </section>
          <section
            className="rounded-2xl p-6"
            style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}
          >
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
              When should you use it?
            </h2>
            <p className="text-sm leading-7 text-gray-700">
              {useCaseCopy}
            </p>
          </section>
        </div>

        <section className="mb-16 rounded-2xl p-6 text-left" style={{ background: "#fcfeff", border: "1px solid var(--color-border)" }}>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
            Browser-based PDF processing
          </h2>
          <p className="text-sm leading-7 text-gray-700">
            PdfPix is designed for direct browser workflows. For most tools, files stay on your device during processing, which helps reduce upload delays and supports privacy-focused document handling for everyday PDF tasks.
          </p>
        </section>

        {/* Step-by-Step Instructions */}
        {steps && steps.length > 0 && (
          <div className="mb-16 text-left">
            <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
              How to use{" "}{heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, idx) => (
                <div id={`step-${idx + 1}`} key={idx} className="relative flex flex-col items-start rounded-2xl p-6 transition duration-300 hover:shadow-md" style={{ background: "rgba(255,255,255,0.9)", border: "1px solid var(--color-border)" }}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm" style={{ backgroundImage: "var(--brand-gradient)", boxShadow: "0 10px 24px rgba(17, 117, 239, 0.22)" }}>
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Grid */}
        <div className="mb-16 text-left">
            <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
              Why choose{" "}{SITE_NAME}{" "}for{" "}{heading}?
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 rounded-2xl p-6 shadow-sm" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <div className="rounded-xl p-3" style={{ background: "rgba(19, 162, 241, 0.12)", color: "#0f58d9" }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-base">100% Secure & Private</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Unlike traditional web converters, all processing happens locally inside your browser. Your sensitive PDF files are never uploaded to any remote servers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl p-6 shadow-sm" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <div className="rounded-xl p-3" style={{ background: "rgba(255, 152, 0, 0.14)", color: "#ff8a00" }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-base">No File Size Limits</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Because conversions run locally using your computer&apos;s CPU power, we don&apos;t impose any artificial file size caps, queue delays, or wait times.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl p-6 shadow-sm" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <div className="rounded-xl p-3" style={{ background: "rgba(17, 117, 239, 0.12)", color: "#1175ef" }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-base">100% Free Forever</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Get full access to all features without subscriptions, credit card inputs, or registration walls. No branding watermarks added to your outputs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl p-6 shadow-sm" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <div className="rounded-xl p-3" style={{ background: "rgba(255, 214, 86, 0.24)", color: "#f59e0b" }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-base">Universal Compatibility</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  PdfPix runs smoothly inside any modern browser on macOS, Windows, Linux, iOS, or Android, without needing external applications or plugins.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        {faqs && faqs.length > 0 && (
          <div className="mb-16 text-left">
            <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group overflow-hidden rounded-xl [&_summary::-webkit-details-marker]:hidden"
                  style={{ background: "#fcfeff", border: "1px solid var(--color-border)" }}
                >
                  <summary className="flex items-center justify-between px-6 py-4 font-semibold text-gray-900 cursor-pointer list-none hover:bg-gray-50 transition duration-150 select-none">
                    <span>{faq.question}</span>
                    <span className="ml-4 transition duration-300 group-open:-rotate-180 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="bg-white px-6 pb-5 pt-1" style={{ borderTop: "1px solid rgba(217, 228, 242, 0.85)" }}>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {relatedTools.length > 0 && (
          <div className="text-left">
            <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
              Related PDF tools
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.id}
                  href={relatedTool.path}
                  className="block rounded-2xl p-6 transition duration-200 hover:shadow-md"
                  style={{ border: "1px solid var(--color-border)", background: "#fcfeff" }}
                >
                  <div className="mb-2 text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                    {getCategoryLabel(relatedTool.category)}
                  </div>
                  <h3 className="mb-2 text-xl font-bold" style={{ color: "var(--color-dark)" }}>{relatedTool.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{relatedTool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
