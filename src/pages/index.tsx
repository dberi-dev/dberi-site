import { useState, useEffect } from "react";

export default function Home() {
  const [hover, setHover] = useState(false);

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

  const intensity = 0.85;
  const spread = hover ? 90 + 60*intensity : 60 + 40*intensity;
  const blur = hover ? 110 : 80;

  return (
    <>
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.06); }
        }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0a0b", fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <header className="relative z-20" style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, letterSpacing: "-0.01em", fontSize: 15, color: "#ffffff" }}>dberi</span>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <a
              href="https://docs.dberi.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: "-0.005em",
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                transition: "color 200ms",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
            >
              docs
            </a>
            <a
              href="https://dashboard.dberi.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: "-0.005em",
                padding: "10px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                textDecoration: "none",
                transition: "background 200ms, transform 200ms",
                border: "1px solid rgba(255,255,255,0.1)",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              give it a try
            </a>
          </div>
        </header>

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

        {/* Main Content */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center" style={{ minHeight: "100vh", padding: "120px 24px 80px", position: "relative" }}>
          <div style={{ width: "100%", maxWidth: 880 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 64 }}>
              <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "18px 34px",
                  borderRadius: 999,
                  background: "#f7f4ec",
                  color: "#0a0a0b",
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 500,
                  fontSize: 15,
                  letterSpacing: "-0.005em",
                  boxShadow: `0 0 ${blur}px ${spread*0.35}px rgba(247,244,236,${0.22*intensity}),
                              0 0 ${blur*2}px ${spread}px rgba(247,244,236,${0.10*intensity}),
                              inset 0 0 0 1px rgba(255,255,255,0.6)`,
                  transition: "box-shadow 700ms cubic-bezier(.2,.7,.2,1), transform 400ms",
                  transform: hover ? "translateY(-1px)" : "translateY(0)",
                  animation: "breathe 4.5s ease-in-out infinite"
                }}
              >
                <a
                  href="mailto:ivoine@dberi.com"
                  style={{
                    color: "#0a0a0b",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  email
                </a>
                <span style={{ color: "rgba(10,10,11,0.3)" }}>|</span>
                <a
                  href="https://cal.com/ivoine"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0a0a0b",
                    cursor: "pointer",
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 500,
                    fontSize: 15,
                    letterSpacing: "-0.005em",
                    padding: 0,
                    textDecoration: "none",
                  }}
                >
                  book a dinner
                </a>
              </div>
            </div>

            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 400,
                fontSize: "clamp(40px, 6.2vw, 84px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                margin: "0 0 28px",
                color: "#ffffff",
              }}
            >
              Modern financial infrastructure
              <br />
              for the <em style={{ fontStyle: "italic", color: "#e9d9b6" }}>Caribbean</em>.
            </h1>

            <p
              style={{
                margin: "0 auto",
                maxWidth: 560,
                color: "rgba(255,255,255,0.5)",
                fontSize: 16,
                lineHeight: 1.55,
              }}
            >
              Payment rails for the Caribbean. Locals and tourists pay merchants, and send money to each other, instantly.
            </p>

            <div
              style={{
                marginTop: 64,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 32,
                color: "rgba(255,255,255,0.4)",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                flexWrap: "wrap",
              }}
            >
              <span>Built for</span>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Locals</span>
              <span style={{ width: 3, height: 3, background: "rgba(255,255,255,0.4)", borderRadius: "50%", display: "inline-block", opacity: 0.5 }} />
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Tourists</span>
              <span style={{ width: 3, height: 3, background: "rgba(255,255,255,0.4)", borderRadius: "50%", display: "inline-block", opacity: 0.5 }} />
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Merchants</span>
              <span style={{ width: 3, height: 3, background: "rgba(255,255,255,0.4)", borderRadius: "50%", display: "inline-block", opacity: 0.5 }} />
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Person&#8209;to&#8209;person</span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
