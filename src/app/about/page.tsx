import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  Globe, 
  Coffee, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Gamepad2, 
  Compass, 
  Code, 
  FileText, 
  Mail, 
  BookOpen, 
  Award,
  Layers
} from "lucide-react";

// Inline brand SVGs to bypass Lucide package differences
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const products = [
  {
    name: "PdfPix",
    type: "Browser-based Utility",
    description: "Free, high-performance in-browser PDF tools to merge, split, compress, convert, edit, and secure PDF files with 100% local privacy.",
    link: "/",
    isExternal: false,
    badge: "Active",
    icon: FileText,
    color: "var(--color-primary)"
  },
  {
    name: "ToolPix",
    type: "AI & Productivity Platform",
    description: "A comprehensive web hub containing multiple AI integrations, converters, image optimizers, and coding utility workflows.",
    link: "https://toolpix.pythonanywhere.com",
    isExternal: true,
    badge: "Active",
    icon: Sparkles,
    color: "#8B5CF6"
  },
  {
    name: "KallanCop",
    type: "Mobile Game",
    description: "A thrilling local multiplayer social deduction game. Published and available to play on the Google Play Store.",
    link: "https://play.google.com/store/apps/details?id=com.ajmal.kallancop",
    isExternal: true,
    badge: "Google Play",
    icon: Gamepad2,
    color: "#F59E0B"
  },
  {
    name: "JoyFul / Joyful Builder",
    type: "AI Website Builder",
    description: "An advanced, smart builder project facilitating AI-assisted lightning-fast website and application layout generation.",
    link: "https://joyful.uthakkan.in",
    isExternal: true,
    badge: "Beta",
    icon: Cpu,
    color: "#EC4899"
  },
  {
    name: "ZyRace",
    type: "Browser Game",
    description: "A high-octane web-based 3D racing game featuring realistic physics, smooth gameplay loop, and responsive design.",
    link: "#",
    isExternal: true,
    badge: "Sandbox",
    icon: Gamepad2,
    color: "#10B981"
  },
  {
    name: "CodePix",
    type: "Coding Learning Platform",
    description: "An interactive, highly engaging programming education platform aimed at teaching code logic visually and effectively.",
    link: "#",
    isExternal: true,
    badge: "Concept",
    icon: Code,
    color: "#3B82F6"
  }
];

const skills = [
  "Python & Flask",
  "JavaScript & Node.js",
  "Flutter & Mobile Development",
  "Firebase & Supabase",
  "AI API Integration & Prompting",
  "SEO & Web Deployment",
  "SQL & MongoDB",
  "UI/UX Fine-Tuning"
];

export default function AboutPage() {
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
        <div className="mx-auto max-w-5xl px-4">
          
          {/* Brand Intro Hero Section */}
          <section 
            className="mb-12 overflow-hidden rounded-3xl bg-white p-8 md:p-12 shadow-sm relative" 
            style={{ 
              border: "1px solid var(--color-border)", 
              boxShadow: "0 20px 50px rgba(15, 23, 42, 0.05)" 
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-60 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full filter blur-3xl opacity-60 -ml-20 -mb-20"></div>
            
             <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <img src="/img/uthakkan.png" alt="UTHAKKAN" className="w-10 h-10 object-contain rounded-xl shadow-sm" />
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                  style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--color-primary)" }}
                >
                  <Layers className="w-3.5 h-3.5" /> About UTHAKKAN
                </span>
              </div>
              <h1 
                className="mb-6 text-4xl md:text-5xl font-extrabold tracking-tight" 
                style={{ color: "var(--color-dark)", lineHeight: 1.15 }}
              >
                Building smart, highly accessible digital products for the future.
              </h1>
              <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-600">
                <strong>UTHAKKAN</strong> is a modern software and technology brand founded by <strong>Muhammed Ajmal U K</strong>. 
                We are dedicated to engineering practical, elegant, and user-centric digital products—ranging from 
                highly secure browser tools and AI automation hubs to interactive games and mobile platforms.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1"><Compass className="w-4 h-4 text-blue-500" /> Focus: AI & Web-first Utility</span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4 text-amber-500" /> Goal: Clean, Serverless-first UX</span>
              </div>
            </div>
          </section>

          {/* Core Mission & Vision */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm" style={{ border: "1px solid var(--color-border)" }}>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-dark)" }}>Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To build high-utility, lightning-fast digital products using state-of-the-art client-side technologies, 
                rich AI models, and secure serverless architecture. We empower users globally by keeping premium utilities 100% free and private.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-sm" style={{ border: "1px solid var(--color-border)" }}>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-dark)" }}>Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To evolve UTHAKKAN into a globally recognized independent software lab, proving that high-quality, privacy-respecting, 
                and beautifully animated tools can be made directly accessible to every browser.
              </p>
            </div>
          </section>

          {/* Founder Profile Section */}
          <section 
            className="mb-12 overflow-hidden rounded-3xl bg-white shadow-sm" 
            style={{ border: "1px solid var(--color-border)" }}
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Founder Photo */}
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                  <img src="/img/ajmal.jpg" alt="Muhammed Ajmal U K" className="w-full h-full object-cover" />
                </div>
                {/* Founder Info */}
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">Meet The Founder</span>
                  <h2 className="text-3xl font-extrabold mb-3" style={{ color: "var(--color-dark)" }}>
                    Muhammed Ajmal U K
                  </h2>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    MCA Student • AI & Full-Stack Developer • Founder of UTHAKKAN
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Based in Kerala, India, Ajmal is a passionate software creator who believes in the power of building 
                    indie products. Driven by design intuition and technical curiosity, he specializes in leveraging 
                    intelligent AI integrations, local web sandboxing (such as client-side PDF/image parsing), and 
                    rich aesthetic layouts to create delightful user flows.
                  </p>

                  {/* Skills Tag List */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Technical Toolbelt</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Handles Grid */}
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href="https://ajmal.uthakkan.in" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 border bg-white hover:bg-gray-50 text-gray-700"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-600" /> Portfolio
                    </a>
                    <a 
                      href="https://github.com/ajmaluk" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 border bg-white hover:bg-gray-50 text-gray-700"
                    >
                      <GithubIcon className="text-gray-700" /> GitHub
                    </a>
                    <a 
                      href="https://in.linkedin.com/in/ajmaluk" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 border bg-white hover:bg-gray-50 text-gray-700"
                    >
                      <LinkedinIcon className="text-blue-700" /> LinkedIn
                    </a>
                    <a 
                      href="https://instagram.com/ajmaluk.me" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 border bg-white hover:bg-gray-50 text-gray-700"
                    >
                      <InstagramIcon className="text-pink-600" /> Instagram
                    </a>
                    <a 
                      href="https://buymeacoffee.com/ajmal.uk" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 border bg-white hover:bg-gray-50 text-gray-700"
                    >
                      <Coffee className="w-3.5 h-3.5 text-amber-500" /> Buy Me A Coffee
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Product Ecosystem Grid */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">UTHAKKAN Projects</span>
                <h2 className="text-3xl font-extrabold" style={{ color: "var(--color-dark)" }}>The Product Ecosystem</h2>
              </div>
              <p className="text-gray-500 max-w-md text-sm">
                Explore a suite of highly-refined products designed, developed, and maintained by the UTHAKKAN brand.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => {
                const IconComponent = product.icon;
                return (
                  <div 
                    key={product.name} 
                    className="rounded-3xl bg-white p-6 shadow-sm border transition-all duration-300 hover:shadow-md relative group flex flex-col justify-between"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div 
                          className="w-10 h-10 rounded-2xl flex items-center justify-center"
                          style={{ background: `${product.color}15`, color: product.color }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span 
                          className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border"
                          style={{ 
                            borderColor: `${product.color}25`, 
                            background: `${product.color}05`,
                            color: product.color
                          }}
                        >
                          {product.badge}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-1" style={{ color: "var(--color-dark)" }}>
                        {product.name}
                      </h3>
                      <p className="text-xs font-medium text-gray-400 mb-3">{product.type}</p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-6">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      {product.link !== "#" ? (
                        <a 
                          href={product.link}
                          target={product.isExternal ? "_blank" : undefined}
                          rel={product.isExternal ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition-colors group-hover:text-blue-700"
                        >
                          Open Project <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 cursor-not-allowed">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Call to action contact box */}
          <section 
            className="rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-sm relative overflow-hidden"
            style={{ 
              backgroundImage: "radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 55%)"
            }}
          >
            <div className="max-w-2xl relative z-10">
              <h2 className="text-3xl font-extrabold mb-4">Have an exciting idea or partnership?</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Ajmal is always open to collaborative ideas, technical feedback, or consulting on custom AI integration pipelines and web structures. Reach out anytime!
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:contact.uthakkan@gmail.com" 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold bg-white text-slate-900 hover:bg-slate-100 transition duration-200"
                >
                  <Mail className="w-4 h-4" /> Email Support
                </a>
                <a 
                  href="https://www.uthakkan.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition duration-200"
                >
                  <Globe className="w-4 h-4" /> UTHAKKAN Main Portal
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
