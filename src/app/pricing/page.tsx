"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f3f3f9]" style={{ paddingTop: "calc(var(--header-height) + 64px)" }}>
        <div className="max-w-4xl mx-auto px-4 pb-20 text-center">
          <div className="mb-12">
            <h1 className="text-5xl font-extrabold text-[#2d3238] mb-4 tracking-tight">
              Simple Pricing. <span className="text-[#e5322d]">100% Free.</span>
            </h1>
            <p className="text-xl text-[#6b7280] max-w-2xl mx-auto">
              All our PDF and image tools are free to use. No subscriptions, no limits, and no registration required.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white border border-[#e8eaed] rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:shadow-2xl">
            <div className="bg-[#e5322d] text-white py-8 px-6">
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

              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-4 px-6 bg-[#e5322d] hover:bg-[#c8231e] text-white font-bold rounded-xl shadow-lg transition duration-200 text-center block mt-8"
              >
                Start Editing Now
              </button>
            </div>
          </div>

          <div className="mt-16 bg-white border border-[#e8eaed] rounded-xl p-8 max-w-2xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-[#2d3238] mb-2 text-left">Why is it free?</h3>
            <p className="text-gray-600 text-left leading-relaxed">
              We believe that simple tasks like merging, splitting, or compressing PDFs should not cost money. 
              By leveraging advanced in-browser technology, your files are processed locally on your own computer, 
              which reduces our server costs to nearly zero. We support the site through minimal, non-intrusive 
              advertisements to keep our operations running.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
