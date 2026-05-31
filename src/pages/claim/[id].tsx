import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";

interface PendingClaim {
  id: string;
  sender_user_id: string;
  recipient_phone: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  share_url: string;
  deep_link: string;
  expires_at: string;
  created_at: string;
  claimed_by_user_id: string | null;
  claimed_at: string | null;
}

export default function ClaimPage() {
  const router = useRouter();
  const { id } = router.query;
  const [claim, setClaim] = useState<PendingClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchClaim = async () => {
      try {
        const response = await fetch(`https://api.dberi.com/v1/claims/${id}`);
        if (!response.ok) {
          throw new Error("Claim not found");
        }
        const data = await response.json();
        setClaim(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load claim");
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "claimed":
        return "#10b981"; // green
      case "expired":
        return "#ef4444"; // red
      case "cancelled":
        return "#6b7280"; // gray
      default:
        return "#f59e0b"; // orange
    }
  };

  const getStatusText = (status: string) => {
    return status.toUpperCase();
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleOpenInApp = () => {
    if (!claim) return;
    window.location.href = claim.deep_link;

    // Fallback to App Store if deep link doesn't work
    setTimeout(() => {
      if (document.hasFocus()) {
        window.location.href = "https://apps.apple.com/app/dberi";
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0a0a0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: "#ffffff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0a0a0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 32,
              fontWeight: 400,
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Claim Not Found
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 16,
              marginBottom: 32,
            }}
          >
            {error || "This claim doesn't exist or has been removed."}
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: 8,
              fontFamily: "Geist, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "background 200ms",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            Go to dberi.com
          </a>
        </div>
      </div>
    );
  }

  const isPending = claim.status === "pending";
  const isClaimed = claim.status === "claimed";
  const isExpired = claim.status === "expired";
  const daysRemaining = isPending ? getDaysRemaining(claim.expires_at) : 0;

  return (
    <>
      <Head>
        <title>
          {isClaimed
            ? "Money Claimed"
            : `You've received ${formatAmount(claim.amount)} - dberi`}
        </title>
        <meta
          name="description"
          content={
            claim.description ||
            `Someone sent you ${formatAmount(claim.amount)}!`
          }
        />
        <meta
          property="og:title"
          content={`You've received ${formatAmount(claim.amount)}`}
        />
        <meta
          property="og:description"
          content={claim.description || "Money transfer via dberi"}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0a0a0b",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        {/* Animated background pattern */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            opacity: 0.1,
            pointerEvents: "none",
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)
            `,
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 40,
            fontFamily: "Geist, sans-serif",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            fontSize: 15,
            color: "#ffffff",
          }}
        >
          dberi
        </div>

        {/* Main Card */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 480,
            width: "100%",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 24,
            padding: "48px 32px",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Gift Icon */}
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 24px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            🎁
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 28,
              fontWeight: 400,
              color: "#ffffff",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {isClaimed
              ? "Already Claimed"
              : isExpired
              ? "Claim Expired"
              : "You've received money!"}
          </h1>

          {/* Amount */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: isClaimed ? "#10b981" : isExpired ? "#ef4444" : "#10b981",
              textAlign: "center",
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            {formatAmount(claim.amount)}
          </div>

          {/* Description */}
          {claim.description && (
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.7)",
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              {claim.description}
            </p>
          )}

          {/* Status Badge */}
          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              background: getStatusColor(claim.status),
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 999,
              margin: "0 auto 16px",
              justifyContent: "center",
              letterSpacing: "0.05em",
            }}
          >
            {getStatusText(claim.status)}
          </div>

          {/* Expiry notice */}
          {isPending && daysRemaining > 0 && (
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              Expires in {daysRemaining} day{daysRemaining === 1 ? "" : "s"}
            </p>
          )}

          {/* Action Buttons */}
          {isPending && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 32,
              }}
            >
              <button
                onClick={handleOpenInApp}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  background: "#10b981",
                  color: "#ffffff",
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 200ms, box-shadow 200ms",
                  fontFamily: "Geist, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(16,185,129,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Claim Money in dberi App
              </button>

              <a
                href="https://apps.apple.com/app/dberi"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  background: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: 500,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  transition: "background 200ms",
                  fontFamily: "Geist, sans-serif",
                  textDecoration: "none",
                  display: "block",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              >
                Download dberi
              </a>
            </div>
          )}

          {(isClaimed || isExpired) && (
            <a
              href="/"
              style={{
                display: "block",
                width: "100%",
                padding: "16px 24px",
                background: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 500,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                textDecoration: "none",
                textAlign: "center",
                fontFamily: "Geist, sans-serif",
                transition: "background 200ms",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              Go to dberi.com
            </a>
          )}
        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop: 32,
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          {isPending
            ? "Open the link in the dberi app to claim your money instantly."
            : isClaimed
            ? "This money has already been claimed."
            : "This claim has expired and can no longer be redeemed."}
        </p>
      </div>
    </>
  );
}
