"use client";

import { seoData } from "@/lib/seo-data";
import {
  SITE_NAME,
  SITE_OG_IMAGE,
  getCanonicalUrl,
  getPathForSeoId,
} from "@/lib/site";

interface ToolSEOContentProps {
  toolId: string;
}

export default function ToolSEOContent({ toolId }: ToolSEOContentProps) {
  const data = seoData[toolId];
  if (!data) return null;

  const { description, heading, steps, faqs } = data;
  const toolUrl = getCanonicalUrl(getPathForSeoId(toolId) ?? "/");

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
    }
  };

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="seo-section w-full border-t border-[#e8eaed] bg-white mt-16 pb-20">
      {/* Schemas injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-4xl mx-auto px-6 pt-16">
        {/* Step-by-Step Instructions */}
        {steps && steps.length > 0 && (
          <div className="mb-16 text-left">
            <h2 className="text-3xl font-extrabold text-[#2d3238] mb-8 text-center tracking-tight">
              How to use {heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-start bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 relative transition duration-300 hover:shadow-md">
                  <div className="w-10 h-10 rounded-full bg-[#e5322d] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm shadow-[#e5322d]/25">
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
          <h2 className="text-3xl font-extrabold text-[#2d3238] mb-8 text-center tracking-tight">
            Why choose {SITE_NAME} for {heading}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex bg-[#fdfdfd] border border-[#e8eaed] rounded-2xl p-6 gap-4 items-start shadow-sm">
              <div className="p-3 bg-red-50 text-[#e5322d] rounded-xl">
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

            <div className="flex bg-[#fdfdfd] border border-[#e8eaed] rounded-2xl p-6 gap-4 items-start shadow-sm">
              <div className="p-3 bg-green-50 text-[#8fbc5d] rounded-xl">
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

            <div className="flex bg-[#fdfdfd] border border-[#e8eaed] rounded-2xl p-6 gap-4 items-start shadow-sm">
              <div className="p-3 bg-blue-50 text-[#5f83c6] rounded-xl">
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

            <div className="flex bg-[#fdfdfd] border border-[#e8eaed] rounded-2xl p-6 gap-4 items-start shadow-sm">
              <div className="p-3 bg-purple-50 text-[#ab6993] rounded-xl">
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
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-[#2d3238] mb-8 text-center tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-[#fcfcfd] border border-[#e8eaed] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 font-semibold text-gray-900 cursor-pointer list-none hover:bg-gray-50 transition duration-150 select-none">
                    <span>{faq.question}</span>
                    <span className="ml-4 transition duration-300 group-open:-rotate-180 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1 border-t border-[#f1f3f5] bg-white">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
