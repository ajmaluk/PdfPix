import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SUPPORT_EMAIL } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white" style={{ paddingTop: "calc(var(--header-height) + 64px)" }}>
        <div className="max-w-3xl mx-auto px-4 pb-16">
          <h1 className="text-3xl font-bold text-[#2d3238] mb-6">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-[#4b5563]">
          <p className="text-sm text-[#6b7280]">Last updated: May 2026</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Your Privacy Matters</h2>
          <p>PdfPix processes all files entirely in your browser. We do not upload, store, or transmit your documents to any server. Your files stay on your device from start to finish.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">What We Collect</h2>
          <p>We use basic analytics (via Cloudflare) to understand aggregate usage patterns &mdash; which tools are popular, error rates, and performance metrics. This data is anonymous and does not include any personal information or document contents.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Cookies</h2>
          <p>We do not use tracking cookies. Cloudflare may set essential cookies for security and performance purposes.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Third Parties</h2>
          <p>We do not share any data with third parties. All processing is client-side and self-contained.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">How PdfPix handles files</h2>
          <p>Most PdfPix workflows are designed to process files locally in your browser session. That means the content of your PDFs, Word files, spreadsheets, and images is not sent to a remote document-processing server as part of the normal workflow.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Contact</h2>
          <p>Questions about this policy? Email us at <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#ee6c4d] hover:underline">{SUPPORT_EMAIL}</a>.</p>
        </div>
      </div>
    </main>
      <Footer />
    </>
  );
}
