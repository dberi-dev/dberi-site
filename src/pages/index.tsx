import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000000", fontFamily: "'Inter', sans-serif" }}>
      {/* Animated background pattern */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)
          `,
        }}
      />

      {/* Navigation */}
      <header className="relative z-50 px-6 py-8">
        <nav className="mx-auto max-w-7xl flex items-center justify-between">
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            dberi
          </div>
          <div
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.02em",
            }}
          >
            Nassau, Bahamas
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="px-6 pt-20 pb-32">
          <div className="mx-auto max-w-5xl">
            {/* Main headline */}
            <div className="mb-20">
              <h1
                className="mb-8"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(52px, 9vw, 120px)",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.95,
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Get set up
                <br />
                <span
                  style={{
                    background: "linear-gradient(to right, #ffffff 0%, #888888 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  with the Founder
                </span>
              </h1>

              <p
                className="mx-auto text-center mb-12"
                style={{
                  fontSize: "20px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.6)",
                  maxWidth: "700px",
                }}
              >
                I'll come to you and help you get dberi running in your business.
                <br />
                Personal setup, training, and support—all at no cost.
              </p>

              <div className="flex justify-center">
                <button
                  data-cal-link="your-cal-username/dinner-onboarding"
                  data-cal-config='{"layout":"month_view"}'
                  className="group relative overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    padding: "20px 48px",
                    borderRadius: "100px",
                    border: "2px solid #ffffff",
                    boxShadow: "0 0 40px rgba(255,255,255,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 0 60px rgba(255,255,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 0 40px rgba(255,255,255,0.15)";
                  }}
                >
                  Book a call
                </button>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-32">
              {[
                {
                  title: "I come to you",
                  description: "Your business, your home, or anywhere in Nassau that works for you",
                },
                {
                  title: "Complete setup",
                  description: "Get dberi configured and running with your operations",
                },
                {
                  title: "Hands-on training",
                  description: "Learn everything you need to process payments confidently",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative p-6 rounded-2xl transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.6,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Large quote section */}
            <div
              className="relative p-12 rounded-3xl mb-32"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="absolute top-8 left-12 opacity-20"
                style={{
                  fontSize: "120px",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                "
              </div>
              <div className="relative z-10 max-w-3xl mx-auto text-center pt-8">
                <p
                  className="mb-8"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Modern financial infrastructure for the Bahamas
                </p>
                <p
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  A payment system designed for everyone—from street vendors to enterprise retailers.
                  Built on institutional-grade technology with double-entry ledger accounting, real-time analytics,
                  and seamless payment methods crafted for the Bahamian market.
                </p>
              </div>
            </div>

            {/* Stats/Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-32">
              <div
                className="p-8 rounded-2xl"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
              >
                <div
                  className="mb-4"
                  style={{
                    fontSize: "56px",
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Free
                </div>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "rgba(0,0,0,0.7)",
                  }}
                >
                  Personal onboarding at no cost. I want to make sure you succeed with dberi.
                </p>
              </div>

              <div
                className="p-8 rounded-2xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="mb-4"
                  style={{
                    fontSize: "56px",
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 900,
                    lineHeight: 1,
                    color: "#ffffff",
                    letterSpacing: "-0.04em",
                  }}
                >
                  1:1
                </div>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Dedicated time with the founder. Just you, me, and getting your business set up right.
                </p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center">
              <div
                className="inline-block mb-6 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.05em",
                  }}
                >
                  Available throughout Nassau
                </p>
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Let's build the future of Bahamian commerce together
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
