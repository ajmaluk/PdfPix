import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Heart,
  Check,
  ChevronRight,
  ExternalLink,
  Target,
  Users,
  Terminal
} from "lucide-react";

export default function SponsorPage() {
  const tiers = [
    {
      name: "Backer",
      price: "$5",
      period: "month",
      desc: "Help keep PdfPix servers active and running smoothly.",
      benefits: [
        "Sponsor badge on GitHub profile",
        "Name listed in project contributors",
        "Prioritized community feature ideas"
      ],
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50/50"
    },
    {
      name: "Supporter",
      price: "$15",
      period: "month",
      desc: "Contribute to core development and security audits.",
      benefits: [
        "All Backer benefits",
        "Direct email support for bug reports",
        "Access to pre-releases & beta features"
      ],
      color: "from-indigo-500 to-purple-500",
      bgLight: "bg-indigo-50/50",
      popular: true
    },
    {
      name: "Silver Sponsor",
      price: "$49",
      period: "month",
      desc: "For small businesses using our platform regularly.",
      benefits: [
        "All Supporter benefits",
        "Company logo placed on the homepage",
        "1-on-1 support for integration help"
      ],
      color: "from-blue-500 to-indigo-500",
      bgLight: "bg-blue-50/50"
    },
    {
      name: "Gold Sponsor",
      price: "$99",
      period: "month",
      desc: "Corporate sponsor advocating for secure local PDF processing.",
      benefits: [
        "All Silver benefits",
        "Prominent logo in footer & main headers",
        "Custom feature request prioritization"
      ],
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50/50"
    }
  ];

  const milestones = [
    { title: "Server & Domain Costs", progress: "100%", value: "$30 / $30", done: true, desc: "Covers hosting fees, domain renewal, and fundamental API quotas." },
    { title: "Dedicated Dev Hours", progress: "45%", value: "$180 / $400", done: false, desc: "Permits dedicated weekly hours focusing exclusively on system enhancements." },
    { title: "Full-Time Open Source", progress: "10%", value: "$350 / $3500", done: false, desc: "Allows maintaining this platform and sister products as a primary full-time job." }
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
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          
          {/* Hero Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex flex-col items-center justify-center gap-4 mb-5">
              <span 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6" }}
              >
                <Heart className="w-3.5 h-3.5 fill-current" /> GitHub Sponsors
              </span>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" 
              style={{ color: "var(--color-dark)" }}
            >
              Support Open-Source Software
            </h1>
            <p className="text-lg leading-relaxed text-gray-600">
              PdfPix is built entirely on open-source philosophy. Your sponsorship directly supports our mission to build beautiful, privacy-first, 100% serverless client-side browser utilities.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="https://github.com/sponsors/ajmaluk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-800 hover:shadow-lg transition-all text-sm active:translate-y-0.5"
              >
                Sponsor on GitHub <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tiers Grid */}
          <div className="mb-24">
            <h2 className="text-2xl font-extrabold text-center mb-10" style={{ color: "var(--color-dark)" }}>
              Sponsorship Tiers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier) => (
                <div 
                  key={tier.name} 
                  className={`bg-white rounded-3xl border ${tier.popular ? 'border-purple-500 shadow-md scale-102 relative' : 'border-gray-200'} p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <div className="mb-4">
                      <h3 className="font-extrabold text-gray-900 text-lg">{tier.name}</h3>
                      <div className="flex items-baseline mt-2 mb-1">
                        <span className="text-3xl font-black text-gray-900">{tier.price}</span>
                        <span className="text-xs text-gray-500 ml-1">/ {tier.period}</span>
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed">{tier.desc}</p>
                    </div>

                    <div className="h-[1px] bg-gray-100 my-4" />

                    <ul className="space-y-2.5 mb-8">
                      {tier.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="https://github.com/sponsors/ajmaluk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-2.5 rounded-xl font-bold text-xs transition-all ${
                      tier.popular 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Select Tier
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones & Objectives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Sponsorship Goals</h3>
              </div>
              <div className="space-y-6">
                {milestones.map((ms) => (
                  <div key={ms.title}>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-gray-800">{ms.title}</span>
                      <span className="text-purple-600">{ms.value}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-1.5">
                      <div 
                        className={`h-full rounded-full ${ms.done ? 'bg-emerald-500' : 'bg-purple-600'}`} 
                        style={{ width: ms.progress }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{ms.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <Terminal className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Want to Contribute Code?</h3>
                <p className="text-xs leading-relaxed opacity-90 mb-6">
                  We love code contributions! You can support this project by building new tools, writing tests, or submitting feature pull requests directly on our GitHub repositories.
                </p>
              </div>
              <a
                href="https://github.com/ajmaluk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                <span>Explore Repositories</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
