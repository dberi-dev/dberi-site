import React, { useState, type CSSProperties } from "react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface PayScreenProps {
  /** Merchant display name, prefixed by "Pay " in the UI. */
  merchant?: string;
  /** Amount in dollars (e.g. 349 → "$349.00"). */
  amount?: number;
  /** Currency code (e.g. "USD", "GBP", "JPY"). Defaults to "USD". */
  currency?: string;
  /** Called when the user taps the Pay button. */
  onPay?: () => void;
  /** Called when the user dismisses (X) or finishes the success state. */
  onClose?: () => void;
}

type StoreIconProps = { size?: number; color?: string };

// ─────────────────────────────────────────────────────────────
// Currency Symbols
// ─────────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  BSD: "$",
  CAD: "$",
  AUD: "$",
  NZD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  KRW: "₩",
  INR: "₹",
};

const ZERO_DECIMAL_CURRENCIES = ["JPY", "KRW", "VND", "CLP", "TWD", "ISK"];

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

function StoreIcon({ size = 32, color = "#fff" }: StoreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path
        d="M4 9.5L5.4 5.5C5.6 4.9 6.2 4.5 6.8 4.5H21.2C21.8 4.5 22.4 4.9 22.6 5.5L24 9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4 9.5C4 11.4 5.5 13 7.4 13C9.3 13 10.8 11.4 10.8 9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10.8 9.5C10.8 11.4 12.2 13 14 13C15.8 13 17.2 11.4 17.2 9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M17.2 9.5C17.2 11.4 18.7 13 20.6 13C22.5 13 24 11.4 24 9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5.6 13V22.5C5.6 23 6 23.5 6.6 23.5H21.4C22 23.5 22.4 23 22.4 22.5V13"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M11 23.5V17.5C11 17 11.4 16.5 12 16.5H16C16.6 16.5 17 17 17 17.5V23.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        border: "2px solid rgba(255,255,255,0.15)",
        borderTopColor: "rgba(255,255,255,0.55)",
        animation: "payscreen-spin 0.8s linear infinite",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

const btnIcon: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 16,
  border: "none",
  background: "rgba(118,118,128,0.24)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export function PayScreen({
  merchant = "Smart Home Services",
  amount = 349,
  currency = "USD",
  onPay,
  onClose,
}: PayScreenProps) {
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currency);

  const dollars = Math.floor(amount);
  const cents = Math.round((amount - dollars) * 100)
    .toString()
    .padStart(2, "0");
  const formatted = isZeroDecimal
    ? `${Math.round(amount)}`
    : `${amount.toFixed(2)}`;

  const handlePay = () => {
    if (paying || done) return;
    setPaying(true);
    onPay?.();
    setTimeout(() => setDone(true), 1100);
  };

  const handleClose = () => {
    setPaying(false);
    setDone(false);
    onClose?.();
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* keyframes */}
      <style>{`
        @keyframes payscreen-spin { to { transform: rotate(360deg); } }
        @keyframes payscreen-fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>

      {/* subtle top glow */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: 520,
          height: 360,
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.18), rgba(139,92,246,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: "14px 20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button onClick={handleClose} style={btnIcon} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M3 3L11 11M11 3L3 11"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.2 }}>
          Pay
        </div>
        <div style={{ width: 32, height: 32 }} />
      </div>

      <div style={{ flex: 1 }} />

      {/* Merchant block */}
      <div
        style={{
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 10px 30px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          <StoreIcon size={32} color="#fff" />
        </div>
        <div
          style={{
            fontSize: 15,
            color: "rgba(235,235,245,0.6)",
            letterSpacing: -0.1,
          }}
        >
          Pay {merchant}
        </div>
        <div
          style={{
            fontFamily: '"SF Pro Display", -apple-system, system-ui',
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: -1.5,
            lineHeight: 1,
            display: "flex",
            alignItems: "baseline",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              alignSelf: "flex-start",
              marginTop: 8,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {symbol}
          </span>
          {dollars}
          {!isZeroDecimal && <span style={{ color: "rgba(255,255,255,0.95)" }}>.{cents}</span>}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom action */}
      <div
        style={{
          padding: "0 20px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
          zIndex: 2,
        }}
      >
        {done ? (
          <SuccessBlock
            merchant={merchant}
            amount={formatted}
            symbol={symbol}
            onReset={handleClose}
          />
        ) : (
          <button
            onClick={handlePay}
            disabled={paying}
            style={{
              width: "100%",
              height: 56,
              borderRadius: 14,
              border: "none",
              background: paying ? "rgba(255,255,255,0.12)" : "#fff",
              color: paying ? "rgba(255,255,255,0.5)" : "#000",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: -0.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: paying ? "default" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: paying ? "none" : "0 8px 24px rgba(255,255,255,0.08)",
              fontFamily: "inherit",
            }}
          >
            {paying ? (
              <>
                <Spinner />
                <span>Processing…</span>
              </>
            ) : (
              <>Pay {symbol}{formatted}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

interface SuccessBlockProps {
  merchant: string;
  amount: string;
  symbol: string;
  onReset: () => void;
}

function SuccessBlock({ merchant, amount, symbol, onReset }: SuccessBlockProps) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        animation: "payscreen-fadeUp 0.5s ease",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          background: "#4ade80",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 30px rgba(74,222,128,0.4)",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3 }}>
        Payment Sent
      </div>
      <div style={{ fontSize: 14, color: "rgba(235,235,245,0.55)" }}>
        {symbol}{amount} to {merchant}
      </div>
      <button
        onClick={onReset}
        style={{
          marginTop: 8,
          padding: "10px 18px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.08)",
          border: "none",
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Done
      </button>
    </div>
  );
}

export default PayScreen;
