import { Inter } from "next/font/google";
import { useEffect } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

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
    <div className={`${inter.variable} min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white font-sans overflow-x-hidden`}>
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="text-2xl font-bold tracking-tight text-gray-900 animate-fade-in">
            dberi
          </div>
          <button className="rounded-full bg-gradient-to-r from-orange-600 to-orange-600 px-8 py-3 text-sm font-semibold text-white hover:from-orange-700 hover:to-orange-700 transition-all cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl">
            Book a Call
          </button>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center animate-slide-in-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
              Innovative Payment System in The Bahamas
            </h1>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="https://docs.dberi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-base font-semibold text-white hover:bg-orange-700 transition-all cursor-pointer transform hover:scale-105 shadow-lg"
              >
                Read Docs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <button className="inline-flex items-center justify-center rounded-full border-2 border-gray-900 px-8 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-all cursor-pointer transform hover:scale-105">
                Book a Call
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end animate-slide-in-right">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-600 rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl border border-gray-100 transform group-hover:scale-105 transition-all duration-500">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-500">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 tracking-wider">TOTAL BALANCE</p>
                  <p className="text-4xl font-bold text-gray-900 mt-1">$14,850.00</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-50 to-orange-50 p-4 border border-orange-100/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                        <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">QR Payment</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-orange-600">+$45.00</p>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                        <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Link Shared</p>
                        <p className="text-xs text-gray-500">2m ago</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900">$120.00</p>
                  </div>
                </div>
                <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-orange-600 to-orange-600 py-4 text-sm font-semibold text-white hover:from-orange-700 hover:to-orange-700 transition-all cursor-pointer transform hover:scale-105 shadow-lg">
                  Request Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-5xl font-bold text-gray-900 lg:text-6xl mb-4">
              Step By Step
            </h2>
            <p className="text-xl text-orange-600 font-medium">
              From joining to becoming a professional merchant
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "01", title: "Create a request", desc: "Generate unique payment requests instantly from mobile or dashboard" },
              { num: "02", title: "Customer pays", desc: "Accept payments via QR code, secure link, or digital invoice" },
              { num: "03", title: "Instant recording", desc: "Every transaction logged on double-entry ledger in real-time" },
              { num: "04", title: "Track balance", desc: "Monitor available and pending balances with total clarity" }
            ].map((step, i) => (
              <div
                key={i}
                className="group rounded-3xl bg-white p-8 border border-gray-200 hover:border-orange-300 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl scroll-animate"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4">
                  <span className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="scroll-animate">
              <h2 className="text-5xl font-bold text-gray-900 lg:text-6xl mb-6">
                Every way
                <br />
                <span className="bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
                  they pay.
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Multiple payment methods tailored for the Bahamian market, built on secure, modern infrastructure.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z", title: "QR Codes", desc: "Instant scan-to-pay for retail" },
                { icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", title: "Payment Links", desc: "Dynamic links for commerce" },
                { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Digital Invoices", desc: "Professional B2B billing" },
                { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", title: "Order-based", desc: "Direct inventory integration" }
              ].map((method, i) => (
                <div
                  key={i}
                  className="group rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8 border border-gray-200 hover:border-orange-300 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-xl scroll-animate"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mb-4">
                    <svg className="h-10 w-10 text-orange-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={method.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{method.title}</h3>
                  <p className="text-sm text-gray-600">{method.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 px-6 py-24 lg:px-8 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="mx-auto max-w-7xl relative">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-5xl font-bold text-white lg:text-6xl mb-8">Visibility</h2>
              <div className="space-y-8">
                {[
                  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Double-entry Ledger", desc: "Institutional-grade accounting for every cent" },
                  { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Real-time Analytics", desc: "Track everything as it happens, no delay" },
                  { icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Wallet Segmentation", desc: "Separate funds for better cashflow" }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6 group cursor-pointer transform hover:translate-x-4 transition-transform duration-300">
                    <div className="flex-shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                        <svg className="h-7 w-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl mb-2 group-hover:text-orange-300 transition-colors">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center animate-slide-in-right">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg">Transaction History</h3>
                    <p className="text-sm text-gray-500 font-medium">This Month</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { emoji: "🛒", name: "Nassau Grocery Mart", detail: "Order #9921 • QR Payment", amount: "+$245.80", status: "SETTLED", color: "text-green-600" },
                      { emoji: "🔗", name: "Island Tours Inc.", detail: "Payment Link • Inv T-442", amount: "+$1,200.00", status: "PENDING", color: "text-green-600" },
                      { emoji: "↩️", name: "Refund: Customer #21", detail: "Adjustment • Manual", amount: "-$45.00", status: "PROCESSED", color: "text-red-600" }
                    ].map((txn, i) => (
                      <div key={i} className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 hover:bg-gray-100 transition-all cursor-pointer transform hover:scale-105">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                            <span className="text-xl">{txn.emoji}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{txn.name}</p>
                            <p className="text-xs text-gray-500">{txn.detail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-base ${txn.color}`}>{txn.amount}</p>
                          <p className="text-xs text-gray-500 font-medium">{txn.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 scroll-animate">
            <h2 className="text-5xl font-bold text-gray-900 lg:text-6xl mb-6">
              Every Bahamian Merchant
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
                Is Our Priority
              </span>
            </h2>
            <p className="text-xl text-gray-600 italic mb-8">
              Infrastructure that will transform people's lives
            </p>
            <div className="inline-block rounded-2xl bg-gradient-to-r from-orange-50 to-orange-50 border border-orange-200 px-8 py-4">
              <p className="text-sm font-semibold text-gray-900">Simple Pricing</p>
              <p className="text-lg font-bold text-orange-600">1% on transactions above $20</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 sm:grid-cols-6 mt-16">
            {[
              { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", label: "Restaurants" },
              { icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", label: "Retail" },
              { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", label: "Grocery" },
              { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", label: "Government" },
              { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Tourism" },
              { icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Freelancers" }
            ].map((merchant, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 rounded-2xl bg-white border border-gray-200 p-8 transform hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer group scroll-animate"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <svg className="h-10 w-10 text-orange-600 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={merchant.icon} />
                </svg>
                <p className="text-xs font-semibold text-gray-900 text-center">{merchant.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-32 lg:px-8 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-600 to-orange-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi1oMnYtMmgtMnptMC00aDJ2MmgtMnYtMnptMC00aDJ2MmgtMnYtMnptMC00aDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="mx-auto max-w-4xl text-center relative z-10 scroll-animate">
          <h2 className="text-5xl font-bold text-white lg:text-6xl mb-6">
            Get Early Access
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Be among the first merchants to revolutionize payments in the Bahamas
          </p>
          <form className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-72 rounded-full bg-white/95 backdrop-blur px-8 py-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all shadow-xl text-lg"
            />
            <input
              type="text"
              placeholder="Business name"
              className="w-full sm:w-72 rounded-full bg-white/95 backdrop-blur px-8 py-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all shadow-xl text-lg"
            />
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-gray-900 px-12 py-5 font-bold text-white hover:bg-gray-800 transition-all cursor-pointer transform hover:scale-105 shadow-2xl text-lg"
            >
              Join Waitlist
            </button>
          </form>
          <p className="mt-8 text-sm font-semibold text-white/90 tracking-wider">
            DESIGNED FOR BAHAMIAN MERCHANTS
          </p>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 px-6 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <div className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
            dberi
          </div>
          <p className="text-sm text-gray-500">
            © 2026 dberi Financial Infrastructure
          </p>
        </div>
      </footer>
    </div>
  );
}
