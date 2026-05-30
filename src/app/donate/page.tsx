import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Coffee,
  ExternalLink,
  Sparkles,
  Smile,
  ShieldCheck
} from "lucide-react";

export default function DonatePage() {
  const donationTiers = [
    {
      coffees: 1,
      price: "$5",
      title: "Friendly Boost",
      desc: "Buy me a coffee to say thanks! Helps keep the servers running.",
      icon: "☕",
      color: "from-amber-400 to-orange-400"
    },
    {
      coffees: 3,
      price: "$15",
      title: "Developer Fuel",
      desc: "Keep the coding momentum going! Helps with domain fees.",
      icon: "☕☕☕",
      color: "from-orange-400 to-amber-500",
      popular: true
    },
    {
      coffees: 5,
      price: "$25",
      title: "Super Fan",
      desc: "Direct support that allows developing premium features offline.",
      icon: "🚀",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <>
      <Header />
      <main 
        className="min-h-screen pb-24 overflow-hidden relative" 
        style={{ 
          background: "linear-gradient(180deg, #FFFDF9 0%, #FDF6E9 100%)", 
          paddingTop: "calc(var(--header-height) + 48px)" 
        }}
      >
        {/* Background glows */}
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          {/* Hero Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex flex-col items-center justify-center gap-4 mb-5">
              <span 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: "rgba(245, 158, 11, 0.1)", color: "#D97706" }}
              >
                <Coffee className="w-3.5 h-3.5" /> Buy Me a Coffee
              </span>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" 
              style={{ color: "#78350F" }}
            >
              Support My Coffee Fuel
            </h1>
            <p className="text-lg leading-relaxed text-amber-900/80">
              PdfPix is completely free, secure, and run locally in your web browser. If our tools saved you time or money, consider treating me to a quick cup of coffee to support further development!
            </p>
            <div className="mt-8">
              <a
                href="https://buymeacoffee.com/ajmal.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-amber-600/10 hover:shadow-xl hover:shadow-amber-600/20 transition-all text-sm active:translate-y-0.5"
              >
                Support on Buy Me a Coffee <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Donation Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {donationTiers.map((tier) => (
              <div 
                key={tier.coffees} 
                className={`bg-white rounded-3xl border ${tier.popular ? 'border-amber-500 shadow-md scale-102 relative' : 'border-amber-200/60'} p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    Recommended
                  </span>
                )}
                <div>
                  <div className="text-center mb-6">
                    <span className="text-3xl block mb-2">{tier.icon}</span>
                    <h3 className="font-extrabold text-amber-950 text-lg">{tier.title}</h3>
                    <div className="text-2xl font-black text-amber-600 mt-1">{tier.price}</div>
                  </div>
                  <p className="text-amber-900/70 text-xs text-center leading-relaxed mb-8">
                    {tier.desc}
                  </p>
                </div>

                <a
                  href="https://buymeacoffee.com/ajmal.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-3 rounded-xl font-bold text-xs transition-all ${
                    tier.popular 
                      ? 'bg-amber-600 text-white hover:bg-amber-700' 
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Send {tier.coffees} {tier.coffees === 1 ? "Coffee" : "Coffees"}
                </a>
              </div>
            ))}
          </div>

          {/* Trust points */}
          <div className="bg-white/80 border border-amber-200/50 rounded-3xl p-8 max-w-3xl mx-auto">
            <h3 className="font-bold text-amber-950 text-center mb-6 flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              Why Support This Project?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
                  <Smile className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-950 mb-1">Always Ad-Free</h4>
                  <p className="text-xs text-amber-900/70 leading-relaxed">No ads, cookie banners, tracking scripts, or subscriptions ever.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-950 mb-1">Local Processing</h4>
                  <p className="text-xs text-amber-900/70 leading-relaxed">Your files never leave your device, ensuring maximum confidentiality.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
