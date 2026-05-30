import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SUPPORT_EMAIL } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "var(--brand-surface)", paddingTop: "calc(var(--header-height) + 64px)" }}>
        <div className="max-w-3xl mx-auto px-4 pb-16">
          <h1 className="mb-6 text-3xl font-bold" style={{ color: "var(--color-dark)" }}>Privacy Policy</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-[#4b5563]">
          <p className="text-sm text-[#6b7280]">Last updated: May 2026</p>
          <h2 className="mt-8 text-xl font-semibold" style={{ color: "var(--color-dark)" }}>Your Privacy Matters</h2>
          <p>PdfPix processes all files entirely in your browser. We do not upload, store, or transmit your documents to any server. Your files stay on your device from start to finish.</p>
          <h2 className="mt-8 text-xl font-semibold" style={{ color: "var(--color-dark)" }}>What We Collect</h2>
          <p>We use basic analytics (via Cloudflare) to understand aggregate usage patterns &mdash; which tools are popular, error rates, and performance metrics. This data is anonymous and does not include any personal information or document contents.</p>
          <h2 className="mt-8 text-xl font-semibold" style={{ color: "var(--color-dark)" }}>Cookies</h2>
          <p>We do not use tracking cookies. Cloudflare may set essential cookies for security and performance purposes.</p>
          <h2 className="mt-8 text-xl font-semibold" style={{ color: "var(--color-dark)" }}>Third Parties</h2>
          <p>We do not share any data with third parties. All processing is client-side and self-contained.</p>
          <h2 className="mt-8 text-xl font-semibold" style={{ color: "var(--color-dark)" }}>How PdfPix handles files</h2>
          <p>Most PdfPix workflows are designed to process files locally in your browser session. That means the content of your PDFs, Word files, spreadsheets, and images is not sent to a remote document-processing server as part of the normal workflow.</p>
          <h2 className="mt-8 text-xl font-semibold" style={{ color: "var(--color-dark)" }}>Contact</h2>
          <p>Questions about this policy? Email us at <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline" style={{ color: "var(--color-primary)" }}>{SUPPORT_EMAIL}</a>.</p>
        </div>
      </div>
    </main>
      <Footer />
    </>
  );
}
