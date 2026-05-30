import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Globe, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Gamepad2, 
  Award,
  Layers,
  Code,
  FileText,
  Briefcase
} from "lucide-react";

// Inline brand SVGs for stability
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function FounderPage() {
  const personalLinks = [
    { name: "Portfolio", desc: "Official developer showcase", url: "https://ajmal.uthakkan.in", icon: <Globe className="w-5 h-5 text-blue-600" /> },
    { name: "GitHub", desc: "Explore open-source repositories", url: "https://github.com/ajmaluk", icon: <GithubIcon className="text-gray-700" /> },
    { name: "LinkedIn", desc: "Connect with me professionally", url: "https://in.linkedin.com/in/ajmaluk", icon: <LinkedinIcon className="text-blue-700" /> },
    { name: "Instagram", desc: "Personal snippets and updates", url: "https://instagram.com/ajmaluk.me", icon: <InstagramIcon className="text-pink-600" /> },
  ];

  const brandLinks = [
    { name: "UTHAKKAN Website", desc: "Official brand website", url: "https://www.uthakkan.in", icon: "🏢" },
    { name: "About UTHAKKAN", desc: "Our story, mission, and products", url: "https://www.uthakkan.in/about", icon: "📖" },
    { name: "UTHAKKAN LinkedIn", desc: "Company news & business updates", url: "https://www.linkedin.com/company/uthakkan", icon: "📊" },
    { name: "UTHAKKAN Instagram", desc: "Product updates & announcements", url: "https://www.instagram.com/uthakkan_", icon: "🎨" },
  ];

  const productLinks = [
    { 
      name: "ToolPix", 
      desc: "AI productivity platform featuring image manipulation, PDF editors, utility tools, converters, and quick development helpers.", 
      url: "https://toolpix.pythonanywhere.com", 
      badge: "AI & Productivity",
      badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
      icon: Sparkles
    },
    { 
      name: "Joyful Builder", 
      desc: "An AI-assisted, drag-and-drop website and application builder concept designed to make prototyping quick and accessible.", 
      url: "https://joyful.uthakkan.in", 
      badge: "AI Builder",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: Cpu
    },
    { 
      name: "KallanCop", 
      desc: "Local multiplayer social deduction game. Host sessions, uncover the thief, and play with friends. Download on Google Play Store.", 
      url: "https://play.google.com/store/apps/details?id=com.ajmal.kallancop", 
      badge: "Mobile Game",
      badgeColor: "bg-amber-50 text-amber-600 border-amber-100",
      icon: Gamepad2
    },
  ];

  return (
    <>
      <Header />
      <main 
        className="min-h-screen pb-24 overflow-hidden relative" 
        style={{ 
          background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)", 
          paddingTop: "calc(var(--header-height) + 48px)" 
        }}
      >
        {/* Background glows */}
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          
          {/* Creator Profile Box */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 mb-16 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0">
                <img src="/img/ajmal.jpg" alt="Muhammed Ajmal U K" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3.5 mb-4 justify-center md:justify-start">
                  <h1 className="text-3xl font-black text-gray-900">Muhammed Ajmal U K</h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 mx-auto md:mx-0">
                    Founder & Lead Engineer
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Hi there! I am Muhammed Ajmal U K, a software developer passionate about building lightweight, privacy-focused client-side browser tools. I run and operate my personal developmental studio and software brand <strong className="text-gray-900 font-bold">UTHAKKAN</strong>. 
                  My goal is to create products like PdfPix that are completely secure, compile entirely inside your web browser, and respect user privacy.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                    <Code className="w-3.5 h-3.5 text-gray-400" /> React & TypeScript
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Web Applications
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                    <Award className="w-3.5 h-3.5 text-gray-400" /> Game Design
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Digital Products Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">UTHAKKAN Ecosystem</span>
                <h2 className="text-3xl font-extrabold" style={{ color: "var(--color-dark)" }}>Ecosystem Products</h2>
              </div>
              <div className="h-[1px] bg-gray-200 flex-1 hidden md:block" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {productLinks.map((prod) => {
                const IconComponent = prod.icon;
                return (
                  <a
                    key={prod.name}
                    href={prod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                          <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full border font-bold ${prod.badgeColor}`}>
                          {prod.badge}
                        </span>
                      </div>
                      <h3 className="text-gray-900 font-bold group-hover:text-blue-600 transition-colors text-lg mb-2">{prod.name}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {prod.desc}
                      </p>
                    </div>
                    <span className="text-xs text-blue-600 font-bold group-hover:underline flex items-center gap-1">
                      Visit Product <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Profile & UTHAKKAN Brand Link Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Personal Links */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">🧑‍💻</span>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-dark)" }}>Personal Profiles</h2>
              </div>
              <div className="space-y-4">
                {personalLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-sm hover:translate-x-1 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
                        {link.icon}
                      </span>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm group-hover:text-blue-600 transition-colors">{link.name}</h4>
                        <p className="text-gray-500 text-xs mt-0.5">{link.desc}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* UTHAKKAN Brand Links */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">🏢</span>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-dark)" }}>UTHAKKAN Brand</h2>
              </div>
              <div className="space-y-4">
                {brandLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-sm hover:translate-x-1 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-lg">
                        {link.icon}
                      </span>
                      <div>
                        <h4 className="text-gray-900 font-bold text-sm group-hover:text-purple-600 transition-colors">{link.name}</h4>
                        <p className="text-gray-500 text-xs mt-0.5">{link.desc}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
