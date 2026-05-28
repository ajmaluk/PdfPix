"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f3f3f9]" style={{ paddingTop: "calc(var(--header-height) + 48px)" }}>
        <div className="max-w-6xl mx-auto px-4 pb-24">
          
          {/* Header Banner */}
          <div className="text-center mb-16 mt-8">
            <h1 className="text-5xl font-extrabold text-[#2d3238] tracking-tight">
              About <span className="text-[#e5322d]">UTHAKKAN</span>
            </h1>
            <p className="text-xl text-[#6b7280] mt-3 max-w-2xl mx-auto">
              Building smart, useful, and accessible digital products for the future.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Column: UTHAKKAN Brand & Products */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* UTHAKKAN Overview */}
              <div className="bg-white border border-[#e8eaed] rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#2d3238] mb-4">The Brand</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>UTHAKKAN</strong> is a software and technology product brand founded by <strong>Ajmal U K</strong>, 
                  focused on designing and developing innovative digital products. The brand works across AI tools, 
                  full-stack web applications, mobile apps, productivity platforms, and browser-based experiences.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our goal is to create practical, accessible, and production-ready software solutions for users, 
                  developers, students, and businesses alike, solving real-world problems with clean design and smart automation.
                </p>
              </div>

              {/* Mission & Vision Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#e8eaed] rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#e5322d] mb-2">Our Mission</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    To build smart, useful, and accessible digital products using modern web technologies, AI integrations, 
                    and scalable software architecture.
                  </p>
                </div>
                <div className="bg-white border border-[#e8eaed] rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#e5322d] mb-2">Our Vision</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    To become a strong independent technology brand that creates reliable AI tools, web platforms, mobile apps, 
                    and digital products for global users.
                  </p>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-[#e8eaed] rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#2d3238] mb-4">Ecosystem Products</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-[#e5322d]">
                          <a href="https://toolpix.pythonanywhere.com" target="_blank" rel="noopener noreferrer" className="hover:underline">ToolPix</a>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">AI/Productivity</td>
                        <td className="px-4 py-4 text-xs text-gray-600">A web platform with multiple AI and utility tools like image, PDF, and coding converters.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-[#e5322d]">
                          <a href="https://play.google.com/store/apps/details?id=com.ajmal.kallancop" target="_blank" rel="noopener noreferrer" className="hover:underline">KallanCop</a>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">Mobile Game</td>
                        <td className="px-4 py-4 text-xs text-gray-600">A local multiplayer social deduction game published on Google Play Store.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-[#e5322d]">
                          <a href="https://joyful.uthakkan.in" target="_blank" rel="noopener noreferrer" className="hover:underline">JoyFul</a>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">AI Website Builder</td>
                        <td className="px-4 py-4 text-xs text-gray-600">A project focused on AI-assisted website and web application generation.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">ZyRace</td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">Browser Game</td>
                        <td className="px-4 py-4 text-xs text-gray-600">A web-based racing game project with physics-based gameplay.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">CodePix</td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">Learning Platform</td>
                        <td className="px-4 py-4 text-xs text-gray-600">A coding education platform concept featuring interactive learning exercises.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column: Founder Profile */}
            <div className="space-y-8">
              
              {/* Profile Card */}
              <div className="bg-white border border-[#e8eaed] rounded-xl p-8 shadow-sm text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-content-center text-3xl font-extrabold text-[#e5322d] border border-red-200 shadow-sm">
                  AJ
                </div>
                <h2 className="text-xl font-bold text-[#2d3238] mt-4">Muhammed Ajmal U K</h2>
                <p className="text-sm text-[#e5322d] font-semibold mt-1">Founder of UTHAKKAN</p>
                <p className="text-xs text-gray-500 mt-0.5">MCA Student & AI Developer</p>
                <div className="border-t border-gray-100 my-6"></div>
                
                <p className="text-xs text-gray-600 text-left leading-relaxed">
                  Muhammed Ajmal U K (Aju) is an MCA student and full-stack developer based in Kerala, India. 
                  He is passionate about integrating AI APIs, building web products, and constructing modern local utilities.
                </p>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-6">
                  <a href="https://in.linkedin.com/in/ajmaluk" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    LinkedIn
                  </a>
                  <a href="https://github.com/ajmaluk" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                  <a href="https://ajmal.uthakkan.in" target="_blank" rel="noopener noreferrer" className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 border border-[#e5322d] rounded-lg text-xs font-bold text-[#e5322d] hover:bg-red-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.657-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.657-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    Visit Portfolio
                  </a>
                </div>
              </div>

              {/* Technical Skills */}
              <div className="bg-white border border-[#e8eaed] rounded-xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-[#2d3238] mb-4">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">Python (Flask)</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">JavaScript</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">Flutter</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">Firebase</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">Supabase</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">MySQL</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">MongoDB</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">AI API Integration</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">SEO & Growth</span>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white border border-[#e8eaed] rounded-xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-[#2d3238] mb-4">Achievements</h3>
                <ul className="space-y-3 text-xs text-gray-600 leading-relaxed">
                  <li className="flex items-start">
                    <span className="text-[#e5322d] font-bold mr-2">✓</span>
                    <span>Published local multiplayer game <strong>KallanCop</strong> on Google Play Store.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#e5322d] font-bold mr-2">✓</span>
                    <span>Built and optimized <strong>ToolPix</strong> reaching substantial search visibility.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#e5322d] font-bold mr-2">✓</span>
                    <span>Achieved <strong>Google Cloud Arcade Champion Tier</strong> status.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
