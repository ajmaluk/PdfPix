import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "var(--brand-surface)", paddingTop: "calc(var(--header-height) + 64px)" }}>
        <div className="max-w-4xl mx-auto px-4 pb-20 text-center">
          <div className="mb-12">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
              Simple Pricing. <span style={{ color: "var(--color-primary)" }}>100% Free.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl" style={{ color: "var(--color-text-light)" }}>
              All our PDF and image tools are free to use. No subscriptions, no limits, and no registration required.
            </p>
          </div>

          <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-white shadow-xl transition duration-300 hover:shadow-2xl" style={{ border: "1px solid var(--color-border)" }}>
            <div className="px-6 py-8 text-white" style={{ backgroundImage: "var(--brand-gradient)" }}>
              <span className="uppercase text-xs font-bold tracking-widest opacity-85">Lifetime Access</span>
              <h2 className="text-3xl font-bold mt-1">Free Plan</h2>
              <div className="mt-4 flex justify-center items-baseline">
                <span className="text-5xl font-extrabold tracking-tight">$0</span>
                <span className="ml-1 text-xl font-semibold opacity-85">/forever</span>
              </div>
            </div>

            <div className="py-8 px-8 text-left space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">Unlimited Access to All 30+ Tools</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">No Account or Credit Card Needed</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">100% Secure Local Processing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">No File Size Limits</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-medium">Ad-supported (Free Forever)</span>
                </li>
              </ul>

              <Link
                href="/merge-pdf"
                className="mt-8 block w-full rounded-xl px-6 py-4 text-center font-bold text-white shadow-lg transition duration-200"
                style={{ backgroundImage: "var(--brand-gradient)" }}
              >
                Start with Merge PDF
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-xl bg-white p-8 shadow-sm" style={{ border: "1px solid var(--color-border)" }}>
            <h3 className="mb-2 text-left text-xl font-bold" style={{ color: "var(--color-dark)" }}>Why is it free?</h3>
            <p className="text-gray-600 text-left leading-relaxed">
              We believe that simple tasks like merging, splitting, or compressing PDFs should not cost money. 
              By leveraging advanced in-browser technology, your files are processed locally on your own computer, 
              which reduces our server costs to nearly zero. We support the site through minimal, non-intrusive 
              advertisements to keep our operations running.
            </p>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 mx-auto md:grid-cols-2">
            <Link href="/compress-pdf" className="rounded-2xl bg-white p-5 text-left shadow-sm transition" style={{ border: "1px solid var(--color-border)" }}>
              <h2 className="mb-2 text-lg font-bold" style={{ color: "var(--color-dark)" }}>Compress large PDF files</h2>
              <p className="text-sm text-gray-600">Reduce file size before sharing contracts, resumes, and project documents.</p>
            </Link>
            <Link href="/pdf-to-word" className="rounded-2xl bg-white p-5 text-left shadow-sm transition" style={{ border: "1px solid var(--color-border)" }}>
              <h2 className="mb-2 text-lg font-bold" style={{ color: "var(--color-dark)" }}>Convert PDF to Word</h2>
              <p className="text-sm text-gray-600">Turn PDFs into editable documents without paying for a separate PDF suite.</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
