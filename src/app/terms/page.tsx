import Header from "@/components/Header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white" style={{ paddingTop: "calc(var(--header-height) + 64px)" }}>
        <div className="max-w-3xl mx-auto px-16 pb-16">
          <h1 className="text-3xl font-bold text-[#2d3238] mb-6">Terms of Service</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-[#4b5563]">
          <p className="text-sm text-[#6b7280]">Last updated: May 2026</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Use of Service</h2>
          <p>PdfPix provides free, browser-based PDF editing tools. By using this service, you agree to these terms. All processing is done client-side &mdash; we do not store or transmit your files.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Acceptable Use</h2>
          <p>You agree not to use PdfPix for any unlawful purpose or in violation of any applicable laws. You are solely responsible for the files you process using our tools.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Intellectual Property</h2>
          <p>PdfPix and its logo are trademarks. The software libraries used are open-source under their respective licenses.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Limitation of Liability</h2>
          <p>PdfPix is provided &quot;as is&quot; without warranty. We are not liable for any damages arising from the use of our service. Files are processed locally and are your responsibility.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Changes</h2>
          <p>We may update these terms at any time. Continued use of PdfPix after changes constitutes acceptance of the new terms.</p>
        </div>
      </div>
    </main>
    </>
  );
}
