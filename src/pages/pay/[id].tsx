import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, PaymentRequestButtonElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaApple, FaGooglePay } from "react-icons/fa";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentLink {
  id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  share_url: string;
  deep_link: string;
  expires_at: string;
  created_at: string;
  paid_by_user_id: string | null;
  paid_at: string | null;
  merchant_name?: string;
}

function CheckoutForm({ paymentLink, onSuccess }: { paymentLink: PaymentLink; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'BS', // Bahamas
      currency: 'usd',
      total: {
        label: paymentLink.description || 'Payment',
        amount: paymentLink.amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      setProcessing(true);
      setError(null);

      try {
        const response = await fetch(`https://api.dberi.com/v1/payment-links/${paymentLink.id}/pay-web`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_method_id: ev.paymentMethod.id,
            phone_number: ev.payerPhone || '',
            email: ev.payerEmail || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Payment failed');
        }

        const data = await response.json();

        if (data.requires_action && data.client_secret) {
          const { error: confirmError } = await stripe.confirmCardPayment(data.client_secret);
          if (confirmError) {
            ev.complete('fail');
            setError(confirmError.message || "Payment confirmation failed");
            setProcessing(false);
            return;
          }
        }

        ev.complete('success');
        onSuccess();
      } catch (err) {
        ev.complete('fail');
        setError(err instanceof Error ? err.message : "Payment failed");
        setProcessing(false);
      }
    });
  }, [stripe, paymentLink]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          phone: phoneNumber,
          email: email || undefined,
        },
      });

      if (pmError) {
        setError(pmError.message || "Failed to process card");
        setProcessing(false);
        return;
      }

      // Call your backend to process the payment
      const response = await fetch(`https://api.dberi.com/v1/payment-links/${paymentLink.id}/pay-web`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          phone_number: phoneNumber,
          email: email || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }

      const data = await response.json();

      // Handle 3D Secure if required
      if (data.requires_action && data.client_secret) {
        const { error: confirmError } = await stripe.confirmCardPayment(data.client_secret);
        if (confirmError) {
          setError(confirmError.message || "Payment confirmation failed");
          setProcessing(false);
          return;
        }
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      {paymentRequest && (
        <>
          <div style={{ marginBottom: 24 }}>
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    type: 'default',
                    theme: 'light',
                    height: '48px',
                  },
                },
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              gap: 12,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>or pay with card</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>
        </>
      )}
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="phone"
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 8,
          }}
        >
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1 (242) 555-0123"
          required
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#ffffff",
            fontSize: 15,
            fontFamily: "Geist, sans-serif",
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="email"
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 8,
          }}
        >
          Email (optional)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#ffffff",
            fontSize: 15,
            fontFamily: "Geist, sans-serif",
          }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 8,
          }}
        >
          Card Information *
        </label>
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  color: "#ffffff",
                  fontFamily: "Geist, sans-serif",
                  "::placeholder": {
                    color: "rgba(255,255,255,0.4)",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 8,
            color: "#ef4444",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          width: "100%",
          padding: "16px 24px",
          background: processing ? "rgba(255,255,255,0.3)" : "#ffffff",
          color: "#0a0a0b",
          fontSize: 16,
          fontWeight: 600,
          borderRadius: 12,
          border: "none",
          cursor: processing ? "not-allowed" : "pointer",
          transition: "all 200ms",
          fontFamily: "Geist, sans-serif",
        }}
      >
        {processing ? "Processing..." : `Pay $${(paymentLink.amount / 100).toFixed(2)}`}
      </button>

      <p
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
          marginTop: 16,
        }}
      >
        Secured by Stripe. Your card details are encrypted and never stored on our servers.
      </p>
    </form>
  );
}

type Platform = 'ios' | 'android' | 'other';

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'other';

  const ua = window.navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  } else if (/android/.test(ua)) {
    return 'android';
  }

  return 'other';
}

export default function PaymentLinkPage() {
  const router = useRouter();
  const { id } = router.query;
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWebPayment, setShowWebPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [platform, setPlatform] = useState<Platform>('other');

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchPaymentLink = async () => {
      try {
        console.log('Fetching payment link:', id);
        const response = await fetch(`https://api.dberi.com/v1/payment-links/${id}`);
        if (!response.ok) {
          throw new Error("Payment link not found");
        }
        const data = await response.json();
        setPaymentLink(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load payment link");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentLink();
  }, [id]);

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "#10b981";
      case "expired":
        return "#ef4444";
      case "cancelled":
        return "#6b7280";
      default:
        return "#f59e0b";
    }
  };

  const getStatusText = (status: string) => {
    return status.toUpperCase();
  };

  const getAppStoreUrl = () => {
    if (platform === 'ios') {
      return "https://apps.apple.com/app/dberi";
    } else if (platform === 'android') {
      return null; // Coming soon
    }
    return null;
  };

  const getDownloadButtonText = () => {
    if (platform === 'ios') {
      return "Download on App Store";
    } else if (platform === 'android') {
      return "Coming Soon on Google Play";
    }
    return "Coming Soon";
  };

  const handleOpenInApp = () => {
    if (!paymentLink) return;

    if (platform === 'ios') {
      window.location.href = paymentLink.deep_link;
      setTimeout(() => {
        if (document.hasFocus()) {
          const appStoreUrl = getAppStoreUrl();
          if (appStoreUrl) {
            window.location.href = appStoreUrl;
          }
        }
      }, 2000);
    } else {
      // For non-iOS platforms, just show web payment
      setShowWebPayment(true);
    }
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

  if (error || !paymentLink) {
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 32,
              fontWeight: 400,
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Payment Link Not Found
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 16,
              marginBottom: 32,
            }}
          >
            {error || "This payment link doesn't exist or has been removed."}
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
            }}
          >
            Go to dberi.com
          </a>
        </div>
      </div>
    );
  }

  const isPending = paymentLink.status === "pending";
  const isPaid = paymentLink.status === "paid" || paymentSuccess;
  const isExpired = paymentLink.status === "expired";

  if (isPaid) {
    return (
      <>
        <Head>
          <title>Payment Completed - dberi</title>
        </Head>
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
              maxWidth: 480,
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 24,
              padding: "48px 32px",
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 32,
                fontWeight: 400,
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              Payment Successful!
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 32,
              }}
            >
              Your payment of {formatAmount(paymentLink.amount)} has been processed successfully.
            </p>
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
              }}
            >
              Go to dberi.com
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Pay ${formatAmount(paymentLink.amount)} - dberi`}</title>
        <meta
          name="description"
          content={
            paymentLink.description ||
            `Payment request for ${formatAmount(paymentLink.amount)}`
          }
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
          {!showWebPayment ? (
            <>
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
                💰
              </div>

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
                Payment Request
              </h1>

              <div
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: "#ffffff",
                  textAlign: "center",
                  marginBottom: 16,
                  letterSpacing: "-0.02em",
                }}
              >
                {formatAmount(paymentLink.amount)}
              </div>

              {paymentLink.description && (
                <p
                  style={{
                    fontSize: 16,
                    color: "rgba(255,255,255,0.7)",
                    textAlign: "center",
                    marginBottom: 24,
                    lineHeight: 1.5,
                  }}
                >
                  {paymentLink.description}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  background: getStatusColor(paymentLink.status),
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 999,
                  margin: "0 auto 32px",
                  justifyContent: "center",
                  letterSpacing: "0.05em",
                }}
              >
                {getStatusText(paymentLink.status)}
              </div>

              {isPending && (
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: 16,
                      textAlign: "left",
                    }}
                  >
                    Choose one of the payment options
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {platform === 'ios' && (
                      <button
                        onClick={() => setShowWebPayment(true)}
                        style={{
                          width: "100%",
                          padding: "18px 24px",
                          background: "#000000",
                          color: "#ffffff",
                          fontSize: 18,
                          fontWeight: 600,
                          borderRadius: 12,
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <FaApple size={24} />
                        <span>Pay</span>
                      </button>
                    )}

                    {platform === 'android' && (
                      <button
                        onClick={() => setShowWebPayment(true)}
                        style={{
                          width: "100%",
                          padding: "18px 24px",
                          background: "#ffffff",
                          color: "#000000",
                          fontSize: 18,
                          fontWeight: 600,
                          borderRadius: 12,
                          border: "1px solid rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <FaGooglePay size={36} />
                      </button>
                    )}

                    <button
                      onClick={() => setShowWebPayment(true)}
                      style={{
                        width: "100%",
                        padding: "18px 24px",
                        background: "rgba(255,255,255,0.95)",
                        color: "#000000",
                        fontSize: 16,
                        fontWeight: 500,
                        borderRadius: 12,
                        border: "1px solid rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        fontFamily: "Geist, sans-serif",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Pay by card</div>
                      <div style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                        To pay, please enter your VISA, MasterCard or Maestro payment card information.
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {isExpired && (
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
                  }}
                >
                  Go to dberi.com
                </a>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setShowWebPayment(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 14,
                  cursor: "pointer",
                  marginBottom: 24,
                  padding: 0,
                  fontFamily: "Geist, sans-serif",
                }}
              >
                ← Back
              </button>

              <h1
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 24,
                  fontWeight: 400,
                  color: "#ffffff",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Pay {formatAmount(paymentLink.amount)}
              </h1>

              {paymentLink.description && (
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    textAlign: "center",
                    marginBottom: 32,
                  }}
                >
                  {paymentLink.description}
                </p>
              )}

              <Elements stripe={stripePromise}>
                <CheckoutForm
                  paymentLink={paymentLink}
                  onSuccess={() => setPaymentSuccess(true)}
                />
              </Elements>
            </>
          )}
        </div>

        <p
          style={{
            marginTop: 32,
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          {isPending && !showWebPayment
            ? platform === 'ios'
              ? "Open the link in the dberi app for the fastest checkout, or pay with your card on the web."
              : platform === 'android'
              ? "Android app coming soon! Pay with your card on the web for now."
              : "Pay with your card on the web. Mobile apps available on iOS."
            : isPending && showWebPayment
            ? "Enter your card details to complete the payment securely."
            : isExpired
            ? "This payment link has expired."
            : "This payment has already been completed."}
        </p>
      </div>
    </>
  );
}
