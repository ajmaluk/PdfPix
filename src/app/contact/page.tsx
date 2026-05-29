import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/site";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white" style={{ paddingTop: "calc(var(--header-height) + 64px)" }}>
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <h1 className="text-4xl font-bold text-[#2d3238] mb-6">Contact PdfPix</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_0.9fr]">
            <div className="prose prose-gray max-w-none space-y-4 text-[#4b5563]">
              <p>Have questions, suggestions, partnership inquiries, or found a bug in one of the PDF tools? Contact the PdfPix team by email.</p>
              <p>Email us at <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#ee6c4d] hover:underline">{SUPPORT_EMAIL}</a>.</p>
              <p>For feature requests and bug reports, include the tool name, browser, device, and the steps needed to reproduce the issue.</p>
              <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Common support topics</h2>
              <p>We can help with document conversion issues, formatting problems, browser compatibility, failed downloads, and requests for new PDF features.</p>
              <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Helpful links</h2>
              <p>
                Before reaching out, you may want to review our <Link href="/privacy" className="text-[#ee6c4d] hover:underline">Privacy Policy</Link> or start with popular tools like <Link href="/merge-pdf" className="text-[#ee6c4d] hover:underline">Merge PDF</Link> and <Link href="/compress-pdf" className="text-[#ee6c4d] hover:underline">Compress PDF</Link>.
              </p>
            </div>
            <aside className="rounded-2xl border border-[#e8eaed] bg-[#fcfcfd] p-6">
              <h2 className="text-xl font-bold text-[#2d3238] mb-4">Support checklist</h2>
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
