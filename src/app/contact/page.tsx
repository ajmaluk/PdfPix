import Header from "@/components/Header";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white" style={{ paddingTop: "calc(var(--header-height) + 64px)" }}>
        <div className="max-w-3xl mx-auto px-4 pb-16">
          <h1 className="text-3xl font-bold text-[#2d3238] mb-6">Contact Us</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-[#4b5563]">
          <p>Have questions, suggestions, or found a bug? We&apos;d love to hear from you.</p>
          <p>Email us at <a href="mailto:support@pdfpix.com" className="text-[#ee6c4d] hover:underline">support@pdfpix.com</a></p>
          <p>For feature requests and bug reports, please include as much detail as possible &mdash; including your browser version and the steps to reproduce the issue.</p>
          <h2 className="text-xl font-semibold text-[#2d3238] mt-8">Report a Bug</h2>
          <p>If something isn&apos;t working correctly, please let us know which tool you were using and what happened. Screenshots are always helpful.</p>
        </div>
      </div>
    </main>
    </>
  );
}
