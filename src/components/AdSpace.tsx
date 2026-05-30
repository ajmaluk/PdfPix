"use client";

import Link from "next/link";

const SHOW_AD_SPACE = false;

const highlights = [
  {
    label: "AI Tools",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="2.5" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="M8 12h.01" />
        <path d="M16 12h.01" />
        <path d="M12 8v.01" />
        <path d="M12 16v.01" />
      </svg>
    ),
  },
  {
    label: "Developer Utilities",
    tone: "indigo",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 4-4 16" />
      </svg>
    ),
  },
  {
    label: "Digital Experiences",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 19.5c4.5-1 7.5-4 8.5-8.5C14 6.5 18 4.5 21 4c-.5 3-2.5 7-7 8 0 0-1 4-4 7-1.5 1.5-3.5 1.5-5.5.5z" />
        <path d="M9 15 5 19" />
        <path d="M15 9h.01" />
      </svg>
    ),
  },
] as const;

const toneClasses: Record<(typeof highlights)[number]["tone"], string> = {
  blue: "bg-[linear-gradient(135deg,rgba(15,117,239,0.14),rgba(146,221,255,0.26))] text-[#1175ef] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]",
  indigo: "bg-[linear-gradient(135deg,rgba(49,46,129,0.08),rgba(59,130,246,0.18))] text-[#2563eb] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
  amber: "bg-[linear-gradient(135deg,rgba(255,177,0,0.14),rgba(255,236,179,0.55))] text-[#f59e0b] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
};

export default function AdSpace() {
  if (!SHOW_AD_SPACE) {
    return null;
  }

  return (
    <aside
      className="relative mb-6 w-full overflow-hidden rounded-[26px] border border-white/70 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,35,80,0.10)] backdrop-blur sm:p-5 lg:p-6"
      aria-label="UTHAKKAN promo"
    >
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          aria-hidden="true"
          style={{
            background: [
              "radial-gradient(circle at 0% 100%, rgba(120, 196, 255, 0.26) 0, rgba(120, 196, 255, 0) 24%)",
              "radial-gradient(circle at 100% 0%, rgba(255, 214, 102, 0.28) 0, rgba(255, 214, 102, 0) 26%)",
              "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(249,252,255,0.98) 100%)",
            ].join(", "),
          }}
        />

        <div className="pointer-events-none absolute -left-10 top-6 h-28 w-28 rounded-full bg-[#8ddcff]/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-8 bottom-2 h-24 w-24 rounded-full bg-[#ffd76a]/20 blur-3xl" aria-hidden="true" />

        <div className="relative grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <div className="mx-auto flex lg:mx-0">
            <div className="rounded-[24px] bg-white/90 p-2.5 shadow-[0_18px_40px_rgba(30,64,175,0.10)] ring-1 ring-white/90">
              <div
                className="h-[88px] w-[88px] rounded-[20px] bg-contain bg-center bg-no-repeat sm:h-[96px] sm:w-[96px] lg:h-[118px] lg:w-[118px]"
                style={{ backgroundImage: "url('/img/uthakkan.png')" }}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="font-[var(--font-nobile)] text-[2rem] font-bold leading-none tracking-[-0.05em] text-[#0f2148] sm:text-[2.45rem] lg:text-[3.5rem]">
              UTHAKKAN
            </div>
            <p className="mt-2 text-[0.95rem] font-semibold tracking-[-0.02em] text-[#455f87] sm:text-[1.2rem] lg:text-[1.75rem]">
              AI Tools, Developer Utilities &amp; Digital Experiences
            </p>
            <p className="mt-3 max-w-[50rem] text-sm leading-relaxed text-[#526581] sm:text-[1rem] lg:text-[1.35rem]">
              Build smarter with practical AI tools, utilities, and digital products.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 lg:justify-start">
              {highlights.map((item, index) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses[item.tone]}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-semibold tracking-[-0.02em] text-[#2f466a] sm:text-base lg:text-[1.05rem]">
                    {item.label}
                  </span>
                  {index < highlights.length - 1 ? (
                    <span className="ml-1 hidden text-lg font-black text-[#1f7cf2] lg:inline-block" aria-hidden="true">
                      •
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Link
              href="https://uthakkan.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-4 rounded-full border border-[#2c80f5] bg-[linear-gradient(180deg,#1788ff_0%,#155ee8_100%)] px-5 py-3 text-white shadow-[0_18px_34px_rgba(17,117,239,0.28)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(17,117,239,0.34)] sm:px-6 lg:min-w-[23rem] lg:px-7 lg:py-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/12 backdrop-blur">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3a15.5 15.5 0 0 1 0 18" />
                  <path d="M12 3a15.5 15.5 0 0 0 0 18" />
                </svg>
              </span>
              <span className="h-9 w-px bg-white/20" aria-hidden="true" />
              <span className="text-lg font-bold tracking-[-0.03em] sm:text-[1.7rem]">uthakkan.in</span>
            </Link>
          </div>
        </div>
    </aside>
  );
}
