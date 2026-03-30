import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#f9f9f9", fontFamily: "'Inter', sans-serif" }}>

      {/* Navigation */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-12 py-5">
          <div
            className="text-2xl font-bold animate-fade-in"
            style={{ fontFamily: "'Manrope', sans-serif", color: "#572000" }}
          >
            dberi
          </div>
          <button
            className="transition-all cursor-pointer"
            style={{
              backgroundColor: "#ff6b00",
              color: "#572000",
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "14px",
              padding: "12px 32px",
              borderRadius: "9999px",
              border: "none",
            }}
          >
            Book a Call
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-12 py-24 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div className="flex flex-col justify-center animate-slide-in-left">
            <h1
              className="leading-tight"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(42px, 5vw, 72px)",
                letterSpacing: "-2px",
                color: "#572000",
              }}
            >
              Innovative Payment System in The Bahamas
            </h1>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: "#5a4136" }}>
              Built for Bahamian merchants of every size — restaurants, retail, tourism, and more.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="https://docs.dberi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
                style={{
                  backgroundColor: "#ff6b00",
                  color: "#572000",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "16px",
                  padding: "18px 40px",
                  borderRadius: "32px",
                  textDecoration: "none",
                }}
              >
                Read Docs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <button
                className="inline-flex items-center justify-center transition-all cursor-pointer"
                style={{
                  backgroundColor: "transparent",
                  color: "#1a1c1c",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  padding: "18px 40px",
                  borderRadius: "32px",
                  border: "2px solid #1a1c1c",
                }}
              >
                Book a Call
              </button>
            </div>
          </div>

          {/* Hero Card */}
          <div className="flex items-center justify-center lg:justify-end animate-slide-in-right">
            <div
              className="w-full max-w-sm float-animation"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "32px",
                padding: "32px",
                boxShadow: "0 20px 60px rgba(255,107,0,0.15), 0 0 30px rgba(255,107,0,0.3), 0 0 60px rgba(255,107,0,0.1)",
                border: "1px solid rgba(255,107,0,0.1)",
                animation: "float 4s ease-in-out infinite, neon-pulse 3s ease-in-out infinite",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className="flex h-10 w-10 items-center justify-center"
                  style={{ borderRadius: "12px", backgroundColor: "#ff6b00" }}
                >
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center"
                  style={{ borderRadius: "9999px", backgroundColor: "#ffdbcc" }}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#ff6b00" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>TOTAL BALANCE</p>
                <p className="text-4xl font-bold" style={{ fontFamily: "'Manrope', sans-serif", color: "#1a1c1c" }}>$14,850.00</p>
              </div>

              <div className="space-y-3">
                <div
                  className="flex items-center justify-between p-4"
                  style={{ borderRadius: "16px", backgroundColor: "#fff5f0", border: "1px solid #ffdbcc" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-white" style={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                      <svg className="h-5 w-5" style={{ color: "#ff6b00" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>QR Payment</p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>Just now</p>
                    </div>
                  </div>
                  <p className="font-bold" style={{ color: "#ff6b00" }}>+$45.00</p>
                </div>

                <div
                  className="flex items-center justify-between p-4"
                  style={{ borderRadius: "16px", backgroundColor: "#f3f3f3" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-white" style={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                      <svg className="h-5 w-5" style={{ color: "#5a4136" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>Link Shared</p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>2m ago</p>
                    </div>
                  </div>
                  <p className="font-bold" style={{ color: "#1a1c1c" }}>$120.00</p>
                </div>
              </div>

              <button
                className="mt-6 w-full transition-all cursor-pointer"
                style={{
                  backgroundColor: "#ff6b00",
                  color: "#572000",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "14px",
                  padding: "16px",
                  borderRadius: "32px",
                  border: "none",
                }}
              >
                Request Payment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Step By Step */}
      <section style={{ backgroundColor: "#f3f3f3" }} className="px-12 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 scroll-animate">
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(36px, 4vw, 56px)",
                letterSpacing: "-2px",
                color: "#1a1c1c",
              }}
            >
              Step By Step
            </h2>
            <p className="mt-3 text-lg font-medium" style={{ color: "#ff6b00", fontFamily: "'Inter', sans-serif" }}>
              From joining to becoming a professional merchant
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "01", title: "Create a request", desc: "Generate unique payment requests instantly from mobile or dashboard" },
              { num: "02", title: "Customer pays", desc: "Accept payments via QR code, secure link, or digital invoice" },
              { num: "03", title: "Instant recording", desc: "Every transaction logged on double-entry ledger in real-time" },
              { num: "04", title: "Track balance", desc: "Monitor available and pending balances with total clarity" },
            ].map((step, i) => (
              <div
                key={i}
                className="scroll-animate neon-glow"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "32px",
                  padding: "32px 24px",
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: "36px",
                    color: "#ff6b00",
                  }}
                >
                  {step.num}
                </p>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#1a1c1c",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#5a4136", lineHeight: "1.6" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Every Way They Pay */}
      <section className="px-12 py-24 lg:py-32" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="scroll-animate">
              <h2
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(36px, 4vw, 56px)",
                  letterSpacing: "-2px",
                  color: "#1a1c1c",
                }}
              >
                Every way<br />
                <span style={{ color: "#ff6b00" }}>they pay.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: "#5a4136" }}>
                Multiple payment methods tailored for the Bahamian market, built on secure, modern infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z", title: "QR Codes", desc: "Instant scan-to-pay for retail" },
                { icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", title: "Payment Links", desc: "Dynamic links for commerce" },
                { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Digital Invoices", desc: "Professional B2B billing" },
                { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", title: "Order-based", desc: "Direct inventory integration" },
              ].map((method, i) => (
                <div
                  key={i}
                  className="scroll-animate"
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "32px",
                    padding: "32px 24px",
                    animationDelay: `${i * 100}ms`,
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="mb-4">
                    <svg className="h-8 w-8" style={{ color: "#ff6b00" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={method.icon} />
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "18px", color: "#1a1c1c", marginBottom: "8px" }}>
                    {method.title}
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#5a4136" }}>
                    {method.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visibility — dark section */}
      <section
        className="px-12 py-24 lg:py-32 relative overflow-hidden"
        style={{ backgroundColor: "#1a1c1c" }}
      >
        <div className="mx-auto max-w-7xl relative">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="animate-slide-in-left">
              <h2
                className="mb-10"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(36px, 4vw, 56px)",
                  letterSpacing: "-2px",
                  color: "#f9f9f9",
                }}
              >
                Visibility
              </h2>
              <div className="space-y-8">
                {[
                  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Double-entry Ledger", desc: "Institutional-grade accounting for every cent" },
                  { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Real-time Analytics", desc: "Track everything as it happens, no delay" },
                  { icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Wallet Segmentation", desc: "Separate funds for better cashflow management" },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-5">
                    <div
                      className="flex-shrink-0 flex h-12 w-12 items-center justify-center"
                      style={{ borderRadius: "16px", backgroundColor: "rgba(255,107,0,0.15)" }}
                    >
                      <svg className="h-6 w-6" style={{ color: "#ff6b00" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "20px", color: "#f9f9f9", marginBottom: "6px" }}>
                        {feature.title}
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#94a3b8", lineHeight: "1.6" }}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History Card */}
            <div className="flex items-center justify-center animate-slide-in-right">
              <div
                className="w-full max-w-md float-animation"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "32px",
                  padding: "28px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 30px rgba(255,107,0,0.2), 0 0 60px rgba(255,107,0,0.08)",
                  animation: "float 4s ease-in-out infinite, neon-pulse 3s ease-in-out infinite",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "18px", color: "#1a1c1c" }}>
                    Transaction History
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#94a3b8" }}>This Month</p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: (
                        <svg className="h-5 w-5" style={{ color: "#374151" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      ),
                      name: "Nassau Grocery Mart", detail: "Order #9921 · QR Payment", amount: "+$245.80", status: "SETTLED", amountColor: "#16a34a",
                    },
                    {
                      icon: (
                        <svg className="h-5 w-5" style={{ color: "#374151" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      ),
                      name: "Island Tours Inc.", detail: "Payment Link · Inv T-442", amount: "+$1,200.00", status: "PENDING", amountColor: "#ff6b00",
                    },
                    {
                      icon: (
                        <svg className="h-5 w-5" style={{ color: "#374151" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      ),
                      name: "Refund: Customer #21", detail: "Adjustment · Manual", amount: "-$45.00", status: "PROCESSED", amountColor: "#ba1a1a",
                    },
                  ].map((txn, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4"
                      style={{ borderRadius: "16px", backgroundColor: "#f3f3f3" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center bg-white"
                          style={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                        >
                          {txn.icon}
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1a1c1c" }}>{txn.name}</p>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#94a3b8" }}>{txn.detail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "14px", color: txn.amountColor }}>{txn.amount}</p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>{txn.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Every Bahamian Merchant */}
      <section className="px-12 py-24 lg:py-32" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 scroll-animate">
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(36px, 4vw, 56px)",
                letterSpacing: "-2px",
                color: "#1a1c1c",
              }}
            >
              Every Bahamian Merchant<br />
              <span style={{ color: "#ff6b00" }}>Is Our Priority</span>
            </h2>
            <p className="mt-4 text-lg italic" style={{ color: "#5a4136" }}>
              Infrastructure that will transform people's lives
            </p>

            {/* Pricing note */}
            <div
              className="inline-block mt-8 px-8 py-4"
              style={{
                backgroundColor: "#fff5f0",
                borderRadius: "32px",
                borderLeft: "4px solid #ff6b00",
              }}
            >
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "13px", color: "#5a4136" }}>Simple Pricing</p>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "18px", color: "#ff6b00" }}>
                1% on transactions above $20
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:grid-cols-6 mt-12">
            {[
              { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", label: "Restaurants" },
              { icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", label: "Retail" },
              { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", label: "Grocery" },
              { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", label: "Government" },
              { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Tourism" },
              { icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Freelancers" },
            ].map((merchant, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 scroll-animate"
                style={{
                  backgroundColor: "#f3f3f3",
                  borderRadius: "32px",
                  padding: "32px 16px",
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <svg className="h-8 w-8" style={{ color: "#ff6b00" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={merchant.icon} />
                </svg>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "12px", color: "#1a1c1c", textAlign: "center" }}>
                  {merchant.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Early Access CTA */}
      <section
        className="px-12 py-24 lg:py-32 relative overflow-hidden"
        style={{ backgroundColor: "#ff6b00" }}
      >
        <div className="mx-auto max-w-4xl text-center relative z-10 scroll-animate">
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 56px)",
              letterSpacing: "-2px",
              color: "#572000",
            }}
          >
            Get Early Access
          </h2>
          <p className="mb-12 text-xl" style={{ color: "#572000", opacity: 0.85 }}>
            Be among the first merchants to revolutionize payments in the Bahamas
          </p>

          <form className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-72 focus:outline-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: "32px",
                padding: "18px 28px",
                fontSize: "16px",
                color: "#1a1c1c",
                border: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <input
              type="text"
              placeholder="Business name"
              className="w-full sm:w-72 focus:outline-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: "32px",
                padding: "18px 28px",
                fontSize: "16px",
                color: "#1a1c1c",
                border: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <button
              type="submit"
              className="w-full sm:w-auto cursor-pointer transition-all shimmer-btn"
              style={{
                backgroundColor: "#572000",
                color: "#ffffff",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "16px",
                padding: "18px 40px",
                borderRadius: "32px",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              Join the Waitlist
            </button>
          </form>

          <p
            className="mt-10 text-sm font-semibold tracking-widest"
            style={{ color: "#572000", opacity: 0.7, fontFamily: "'Inter', sans-serif" }}
          >
            DESIGNED FOR BAHAMIAN MERCHANTS
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#f1f5f9", borderTop: "1px solid #e2e8f0" }} className="px-12 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <div
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "'Manrope', sans-serif", color: "#572000" }}
          >
            dberi
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#64748b" }}>
            © 2026 dberi Financial Infrastructure
          </p>
        </div>
      </footer>
    </div>
  );
}
