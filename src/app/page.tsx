"use client";

import Image from "next/image";

const BOOKING_URL = "mailto:hello@hontley.com";

const STEPS = [
  {
    n: "01",
    title: "Discovery Call",
    desc: "30 minutes. We learn your business, your customers, and the problems worth solving.",
  },
  {
    n: "02",
    title: "We Build It",
    desc: "3–5 days. We configure your AI assistant: personality, knowledge, and integrations.",
  },
  {
    n: "03",
    title: "Go Live",
    desc: "Your assistant starts working on WhatsApp (or your preferred channel). We onboard your team and stay available for 30 days.",
  },
];

const PORTFOLIO = [
  {
    name: "Arca Build",
    logo: "/logo-arca.jpg",
    url: "https://arcabuild.co",
    industry: "Construction",
    desc: "AI assistant for a container construction company — handling project inquiries and client intake.",
  },
  {
    name: "Home Inspections Halley",
    logo: "/logo-halley.jpg",
    url: "https://homeinspectionshalley.com",
    industry: "Real Estate Services",
    desc: "AI concierge for a certified Miami home inspector — booking inspections and answering buyer questions 24/7.",
  },
  {
    name: "Bumbei",
    logo: "/logo-bumbei.jpg",
    url: "https://bumbei.com",
    industry: "Fintech",
    desc: "AI assistant for a Bitcoin cashback platform — supporting users and affiliate partners across channels.",
  },
  {
    name: "Galeonica",
    logo: "/logo-galeonica.jpg",
    url: "https://galeonica.com",
    industry: "B2B Fintech",
    desc: "AI concierge for a white-label cashback infrastructure platform — handling partner onboarding and support.",
  },
];

const USE_CASES = [
  { emoji: "🦪", label: "Food & Wholesale", desc: "Orders, availability, delivery scheduling" },
  { emoji: "🏡", label: "Real Estate", desc: "Lead qualification & showing bookings" },
  { emoji: "💆", label: "Service Businesses", desc: "Salons, clinics, fitness studios" },
  { emoji: "🛒", label: "E-commerce", desc: "Order support, FAQs, returns" },
  { emoji: "🎪", label: "Events & Venues", desc: "Inquiries, quotes, bookings" },
  { emoji: "🤝", label: "B2B Sales", desc: "Lead intake, follow-ups, demos" },
];

const PLANS = [
  {
    name: "Starter",
    price: "$500",
    features: [
      "1 channel (WhatsApp or Telegram)",
      "Custom personality & FAQs",
      "Order / inquiry intake",
      "14 days of support",
    ],
    highlight: false,
  },
  {
    name: "Standard",
    price: "$1,000",
    features: [
      "1–2 channels",
      "Custom personality + integrations",
      "Order intake + escalation logic",
      "Team onboarding session",
      "30 days of support",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "$1,500+",
    features: [
      "Multi-channel setup",
      "Advanced workflows",
      "CRM / Sheets integration",
      "Full team onboarding",
      "30 days of support",
    ],
    highlight: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>

      {/* NAV */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--hontley-black)", letterSpacing: "-0.03em" }}>
          Hontley
        </span>
        <a
          href={BOOKING_URL}
          className="text-sm font-semibold px-4 py-2 rounded-lg transition"
          style={{ background: "var(--hontley-accent)", color: "#fff" }}
        >
          Book a Free Call
        </a>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <div
          className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-6"
          style={{ background: "var(--hontley-gray)", color: "var(--hontley-accent)" }}
        >
          🤖 AI Concierge Setup for Small Businesses
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          Your AI concierge,<br />
          <span style={{ color: "var(--hontley-accent)" }}>ready in days.</span>
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8" style={{ color: "var(--hontley-muted)" }}>
          We set up a custom AI assistant for your business on WhatsApp, Telegram, or SMS —
          so your team can focus on what actually matters.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={BOOKING_URL}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-base transition hover:brightness-110"
            style={{ background: "var(--hontley-accent)", color: "#fff" }}
          >
            Book a Free Discovery Call →
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-base transition"
            style={{ border: "1px solid var(--hontley-border)", color: "var(--hontley-muted)" }}
          >
            See how it works
          </a>
        </div>
      </section>

      {/* SOCIAL PROOF / QUOTE */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "var(--hontley-gray)", borderLeft: "4px solid var(--hontley-accent)" }}
        >
          <p className="text-lg italic" style={{ color: "var(--foreground)" }}>
            &ldquo;Time to make an oyster ordering chef concierge robot 🙂&rdquo;
          </p>
          <p className="mt-2 text-sm font-medium" style={{ color: "var(--hontley-muted)" }}>
            — Ross, Everglades Oysters (first Hontley client)
          </p>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Businesses we&apos;ve built for</h2>
        <p className="text-center mb-10" style={{ color: "var(--hontley-muted)" }}>
          Real assistants. Real businesses. Already running.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PORTFOLIO.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl p-5 flex gap-4 items-start transition hover:scale-[1.01]"
              style={{ border: "1px solid var(--hontley-border)", background: "var(--background)" }}
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={40}
                height={40}
                className="rounded-xl shrink-0 mt-0.5 object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base group-hover:underline">{p.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--hontley-gray)", color: "var(--hontley-muted)" }}>
                    {p.industry}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--hontley-muted)" }}>{p.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center space-y-3">
              <div
                className="text-4xl font-black"
                style={{ color: "var(--hontley-accent)" }}
              >
                {s.n}
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--hontley-muted)" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section
        className="py-16"
        style={{ background: "var(--hontley-gray)" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Built for businesses that run on relationships</h2>
          <p className="text-center mb-10" style={{ color: "var(--hontley-muted)" }}>
            If your customers message you to ask questions, place orders, or book appointments — we can automate that.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {USE_CASES.map((uc) => (
              <div
                key={uc.label}
                className="rounded-xl p-5 space-y-1"
                style={{ background: "var(--background)", border: "1px solid var(--hontley-border)" }}
              >
                <div className="text-2xl">{uc.emoji}</div>
                <div className="font-semibold text-sm">{uc.label}</div>
                <div className="text-xs" style={{ color: "var(--hontley-muted)" }}>{uc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Pricing</h2>
        <p className="text-center mb-2" style={{ color: "var(--hontley-muted)" }}>
          One-time setup fee. Your AI costs go directly to the provider (~$30–60/mo).
        </p>
        <p className="text-center text-sm mb-10" style={{ color: "var(--hontley-muted)" }}>
          No hidden markup. Full transparency.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                border: p.highlight
                  ? "2px solid var(--hontley-accent)"
                  : "1px solid var(--hontley-border)",
                background: p.highlight ? "var(--hontley-gray)" : "var(--background)",
              }}
            >
              {p.highlight && (
                <div
                  className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full self-start"
                  style={{ background: "var(--hontley-accent)", color: "#fff" }}
                >
                  Most Popular
                </div>
              )}
              <div>
                <div className="text-lg font-bold">{p.name}</div>
                <div className="text-3xl font-extrabold mt-1">{p.price}</div>
              </div>
              <ul className="space-y-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--hontley-muted)" }}>
                    <span style={{ color: "var(--hontley-accent)" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={BOOKING_URL}
                className="text-center text-sm font-semibold py-2.5 rounded-lg transition"
                style={
                  p.highlight
                    ? { background: "var(--hontley-accent)", color: "#fff" }
                    : { border: "1px solid var(--hontley-border)", color: "var(--foreground)" }
                }
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-sm mt-6" style={{ color: "var(--hontley-muted)" }}>
          Need ongoing improvements? Monthly maintenance from $200/mo.
        </p>
      </section>

      {/* CTA FOOTER */}
      <section
        className="py-16 text-center"
        style={{ background: "var(--hontley-accent)" }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to meet your AI concierge?
          </h2>
          <p className="text-indigo-200 mb-8">
            Book a free 30-minute call. No commitment. We&apos;ll tell you exactly what we&apos;d build for you.
          </p>
          <a
            href={BOOKING_URL}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base transition hover:brightness-110"
            style={{ background: "#fff", color: "var(--hontley-accent)" }}
          >
            Book Your Free Call →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-sm" style={{ color: "var(--hontley-muted)" }}>
        <span className="font-bold" style={{ color: "var(--hontley-accent)" }}>Hontley</span>
        <span>© {new Date().getFullYear()} Hontley. All rights reserved.</span>
        <a href={BOOKING_URL} className="hover:underline">hello@hontley.com</a>
      </footer>

    </main>
  );
}
