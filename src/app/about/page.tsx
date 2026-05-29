import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const pillars = [
  {
    title: "Local browser processing",
    description:
      "PdfPix is designed to handle PDF work inside your browser whenever possible, which keeps documents private and cuts upload time."
  },
  {
    title: "Useful tools without friction",
    description:
      "The product focuses on common PDF jobs such as merging, splitting, compressing, converting, signing, and redacting with a direct workflow."
  },
  {
    title: "Free access to the full toolkit",
    description:
      "PdfPix keeps its tools open to everyone without accounts, subscriptions, or artificial daily limits."
  }
];

const popularTools = [
  { name: "Merge PDF", href: "/merge-pdf" },
  { name: "Compress PDF", href: "/compress-pdf" },
  { name: "PDF to Word", href: "/pdf-to-word" },
  { name: "JPG to PDF", href: "/jpg-to-pdf" },
  { name: "Protect PDF", href: "/protect-pdf" },
  { name: "OCR PDF", href: "/ocr-pdf" }
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f3f3f9]" style={{ paddingTop: "calc(var(--header-height) + 48px)" }}>
        <div className="mx-auto max-w-5xl px-4 pb-24">
          <section className="mt-8 mb-12 rounded-3xl border border-[#e8eaed] bg-white p-10 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#e5322d]">About PdfPix</p>
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-[#2d3238]">
              Free online PDF tools built for fast, private document work
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-[#6b7280]">
              PdfPix helps people merge PDF files, split pages, compress documents, convert office files, and handle everyday PDF tasks from one browser-based workspace.
            </p>
          </section>

          <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="rounded-2xl border border-[#e8eaed] bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-xl font-bold text-[#2d3238]">{pillar.title}</h2>
                <p className="text-sm leading-relaxed text-gray-600">{pillar.description}</p>
              </article>
            ))}
          </section>

          <section className="mb-12 rounded-3xl border border-[#e8eaed] bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold text-[#2d3238]">What PdfPix offers</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                PdfPix combines PDF organization, conversion, editing, security, and document intelligence tools in a single interface. Typical use cases include combining invoices, converting PDFs to Word, reducing file sizes for email, adding page numbers, protecting files with passwords, and extracting searchable text with OCR.
              </p>
              <p>
                The product is designed for students, freelancers, job seekers, teams, and anyone who needs fast document work without installing desktop software.
              </p>
            </div>
          </section>

          <section className="mb-12 rounded-3xl border border-[#e8eaed] bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-3xl font-bold text-[#2d3238]">Popular tools on PdfPix</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {popularTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-2xl border border-[#eef0f3] bg-[#fcfcfd] px-5 py-4 font-semibold text-[#2d3238] transition duration-200 hover:border-[#e5322d] hover:text-[#e5322d]"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#e8eaed] bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold text-[#2d3238]">Why people use PdfPix</h2>
            <ul className="space-y-3 text-gray-600">
              <li>PdfPix covers both simple tasks like rotate and merge, and higher-value tasks like OCR, redaction, and office-to-PDF conversion.</li>
              <li>The site is structured so visitors can jump between related tools without leaving the main workflow.</li>
              <li>The product keeps the value proposition clear: free access, direct execution, and private browser-first processing.</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
