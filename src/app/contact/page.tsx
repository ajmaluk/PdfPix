import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/site";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "var(--brand-surface)", paddingTop: "calc(var(--header-height) + 64px)" }}>
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <h1 className="mb-6 text-4xl font-bold" style={{ color: "var(--color-dark)" }}>Contact PdfPix</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_0.9fr]">
            <div className="prose prose-gray max-w-none space-y-4 text-[#4b5563]">
              <p>Have questions, suggestions, partnership inquiries, or found a bug in one of the PDF tools? Contact the PdfPix team by email.</p>
              <p>Email us at <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline" style={{ color: "var(--color-primary)" }}>{SUPPORT_EMAIL}</a>.</p>
              <p>For feature requests and bug reports, include the tool name, browser, device, and the steps needed to reproduce the issue.</p>
              <h2 className="mt-8 text-xl font-semibold" style={{ color: "var(--color-dark)" }}>Common support topics</h2>
              <p>We can help with document conversion issues, formatting problems, browser compatibility, failed downloads, and requests for new PDF features.</p>
              <h2 className="mt-8 text-xl font-semibold" style={{ color: "var(--color-dark)" }}>Helpful links</h2>
              <p>
                Before reaching out, you may want to review our <Link href="/privacy" className="hover:underline" style={{ color: "var(--color-primary)" }}>Privacy Policy</Link> or start with popular tools like <Link href="/merge-pdf" className="hover:underline" style={{ color: "var(--color-primary)" }}>Merge PDF</Link> and <Link href="/compress-pdf" className="hover:underline" style={{ color: "var(--color-primary)" }}>Compress PDF</Link>.
              </p>
            </div>
            <aside className="rounded-2xl p-6" style={{ border: "1px solid var(--color-border)", background: "#fcfeff" }}>
              <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--color-dark)" }}>Support checklist</h2>
              <ul className="space-y-3 text-sm leading-relaxed text-gray-600">
                <li>Tell us which PdfPix tool you used.</li>
                <li>Describe what you expected and what happened instead.</li>
                <li>Attach screenshots when the issue is visual.</li>
                <li>Mention whether the source file was PDF, Word, Excel, JPG, or PowerPoint.</li>
              </ul>
            </aside>
          </div>
        </div>
    </main>
      <Footer />
    </>
  );
}
