import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useCart } from "../../hooks/useCart";
import { FaApple, FaGoogle, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CardPaymentForm({
  amount,
  currency,
  customerName,
  customerEmail,
  merchantId,
  merchantName,
  orderType,
  onSuccess,
  onError
}: {
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  merchantId: string;
  merchantName: string;
  orderType: any;
  onSuccess: () => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create Payment Intent
      console.log("Creating payment intent with:", {
        amount,
        currency,
        customerName,
        merchantId,
        merchantName,
        orderType
      });

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          customerName,
          customerEmail,
          merchantId,
          merchantName,
          orderType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to create payment" }));
        console.error("Payment intent error:", errorData);
        throw new Error(errorData.error || "Failed to create payment");
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName,
            email: customerEmail || undefined,
          },
        },
      });

      if (result.error) {
        onError(result.error.message || "Payment failed");
        setProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err: any) {
      onError(err.message || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        marginBottom: 16,
        background: "#f9fafb",
      }}>
        <CardElement options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#111827",
              "::placeholder": {
                color: "#9ca3af",
              },
            },
          },
        }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          width: "100%",
          padding: "14px",
          background: processing ? "#93c5fd" : "#3b82f6",
          color: "#ffffff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: processing ? "not-allowed" : "pointer",
        }}
      >
        {processing ? "Processing..." : (() => {
          const symbol = CURRENCY_SYMBOLS[currency] || "$";
          const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currency.toUpperCase());
          const formattedAmount = isZeroDecimal
            ? amount.toLocaleString()
            : (amount / 100).toFixed(2);
          return `Pay ${symbol}${formattedAmount}`;
        })()}
      </button>
    </form>
  );
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  category: string | null;
  image_url: string | null;
  stock_quantity: number | null;
  is_available: boolean;
  metadata: { emoji?: string } | null;
}

interface MenuData {
  merchant_id: string;
  merchant_name: string;
  merchant_slug: string;
  currency: string;
  items: MenuItem[];
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", BSD: "$", CAD: "$", AUD: "$", NZD: "$", SGD: "$", HKD: "$",
  EUR: "€", GBP: "£",
  JPY: "¥", CNY: "¥", KRW: "₩",
  INR: "₹", BRL: "R$", MXN: "$", ZAR: "R",
  CHF: "CHF", SEK: "kr", NOK: "kr", DKK: "kr",
  THB: "฿", PHP: "₱", IDR: "Rp", MYR: "RM",
  AED: "د.إ", SAR: "﷼", QAR: "﷼", KWD: "د.ك",
  TRY: "₺", PLN: "zł", CZK: "Kč", HUF: "Ft",
  ILS: "₪", RUB: "₽", UAH: "₴",
};

// Currencies that don't use decimal places (amounts are in whole units)
const ZERO_DECIMAL_CURRENCIES = [
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA",
  "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF"
];

function getIconEmoji(emoji: string | null | undefined): string {
  if (!emoji) return "📦";
  const emojiMap: Record<string, string> = {
    coffee: "☕", milk: "🥛", beer: "🍺", "ice-cream": "🍦",
    croissant: "🥐", cookie: "🍪", "cookie-alt": "🧁",
    sandwich: "🥪", salad: "🥗", pizza: "🍕", beef: "🥩",
    apple: "🍎", banana: "🍌", carrot: "🥕", droplets: "💧",
    fish: "🐠", "cherry-alt": "🍒", wine: "🍷",
    shirt: "👕", sparkles: "✨",
  };
  return emojiMap[emoji] || "📦";
}

export default function MenuPage() {
  const router = useRouter();
  const { slug, table } = router.query;
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [hasSelectedTable, setHasSelectedTable] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    items: typeof cart.items;
    total: number;
    currency: string;
    customerName: string;
    orderType: typeof cart.orderType;
    merchantName: string;
  } | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const cart = useCart(
    typeof slug === "string" ? slug : undefined,
    menuData?.currency
  );

  useEffect(() => {
    if (table && typeof table === "string" && !cart.orderType) {
      cart.setOrderType({ type: "table", tableNumber: table });
      setHasSelectedTable(true);
    } else if (!table && !hasSelectedTable && !loading) {
      // Show table selector on initial load if no table URL param
      setShowTableSelector(true);
    }
  }, [table, loading, hasSelectedTable]);

  useEffect(() => {
    if (!slug) return;

    const fetchMenu = async () => {
      try {
        const response = await fetch(`https://api.dberi.com/v1/public/menu/${slug}`);
        if (!response.ok) {
          throw new Error("Menu not found");
        }
        const data = await response.json();
        setMenuData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [slug]);

  const formatPrice = (price: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency] || "$";
    const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currency.toUpperCase());

    if (isZeroDecimal) {
      // Zero-decimal currencies: use whole units (¥450, not ¥450.00)
      return `${symbol}${price.toLocaleString()}`;
    } else {
      // Regular currencies: divide by 100 to get dollars/euros ($3.00)
      return `${symbol}${(price / 100).toFixed(2)}`;
    }
  };

  // Calculate cart total using current prices from menuData
  const getCartTotal = () => {
    return cart.items.reduce((sum, item) => {
      const currentItem = menuData?.items.find(i => i.id === item.id);
      const currentPrice = currentItem?.price ?? item.price;
      return sum + (currentPrice * item.quantity);
    }, 0);
  };

  const handleAddToCart = (item: MenuItem) => {
    cart.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      currency: item.currency,
      image_url: item.image_url,
      metadata: item.metadata,
    });
  };

  const handleCheckout = async () => {
    if (checkoutLoading || cart.items.length === 0 || !customerName) return;

    setCheckoutLoading(true);

    try {
      // Create line items for Stripe
      const lineItems = cart.items.map((item) => ({
        price_data: {
          currency: (menuData?.currency || "USD").toLowerCase(),
          product_data: {
            name: item.name,
            images: item.image_url ? [item.image_url] : [],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }));

      // Create checkout session
      const response = await fetch("/api/create-menu-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineItems,
          merchantName: menuData?.merchant_name,
          orderType: cart.orderType,
          customerName,
          customerEmail: customerEmail || undefined,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  };

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(0,0,0,0.1)",
            borderTopColor: "#3b82f6",
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

  if (error || !menuData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
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
            background: "#ffffff",
            padding: 40,
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#000000",
              marginBottom: 12,
            }}
          >
            Menu Not Found
          </h1>
          <p
            style={{
              color: "#666666",
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            {error || "This menu doesn't exist or is not available."}
          </p>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(menuData.items.map((item) => item.category || "Uncategorized")));

  const filteredItems = menuData.items.filter((item) => {
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const needsOrderType = !cart.orderType && cart.items.length > 0;

  return (
    <>
      <Head>
        <title>{`${menuData.merchant_name} - Menu`}</title>
        <meta name="description" content={`View the menu for ${menuData.merchant_name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "12px 16px",
            position: "sticky",
            top: 0,
            zIndex: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {menuData.merchant_name}
              </h1>
              {cart.orderType && (
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                  {cart.orderType.type === "table" && cart.orderType.tableNumber === "N/A" && "Takeaway"}
                  {cart.orderType.type === "table" && cart.orderType.tableNumber !== "N/A" && `Table ${cart.orderType.tableNumber}`}
                  {cart.orderType.type === "pickup" && "Pickup"}
                  {cart.orderType.type === "delivery" && "Delivery"}
                </p>
              )}
            </div>

            {!table && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#f3f4f6",
                    borderRadius: 8,
                    padding: 3,
                  }}
                >
                  <button
                    onClick={() => cart.setOrderType({ type: "delivery" })}
                    style={{
                      padding: "6px 12px",
                      background: cart.orderType?.type === "delivery" ? "#3b82f6" : "transparent",
                      color: cart.orderType?.type === "delivery" ? "#ffffff" : "#6b7280",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Delivery
                  </button>
                  <button
                    onClick={() => cart.setOrderType({ type: "pickup" })}
                    style={{
                      padding: "6px 12px",
                      background: cart.orderType?.type === "pickup" ? "#3b82f6" : "transparent",
                      color: cart.orderType?.type === "pickup" ? "#ffffff" : "#6b7280",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Pickup
                  </button>
                </div>
                {cart.orderType && cart.orderType.type !== "table" && (
                  <button
                    onClick={() => cart.setOrderType(null as any)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "none",
                      background: "#ef4444",
                      color: "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                    title="Clear selection"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                background: "#f9fafb",
              }}
            />
            <svg
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", position: "relative", paddingBottom: cart.items.length > 0 ? 100 : 0 }}>
          {/* Sidebar */}
          <div
            style={{
              width: 80,
              background: "#ffffff",
              borderRight: "1px solid #e5e7eb",
              overflowY: "auto",
              position: "sticky",
              top: 110,
              height: "calc(100vh - 110px)",
              flexShrink: 0,
            }}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const iconColor = isSelected ? "#3b82f6" : "#6b7280";

              // Category icon component
              const getCategoryIcon = () => {
                switch (category) {
                  case "Drinks":
                    return (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="6" y1="1" x2="6" y2="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="10" y1="1" x2="10" y2="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="14" y1="1" x2="14" y2="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    );
                  case "Food":
                    return (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
                        <path d="M12 2a5 5 0 0 0-5 5v1a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.2 15.5A7.95 7.95 0 0 0 12 20a7.95 7.95 0 0 0 6.8-4.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 8v13h14V8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    );
                  case "Desserts":
                    return (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
                        <path d="M7 21h10M12 21v-7M5.5 14h13c1.5-4.5 0-9-6.5-9S3 9.5 4.5 14z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 5v2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    );
                  default:
                    return (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8v8M8 12h8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    );
                }
              };

              return (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  style={{
                    width: "100%",
                    padding: "16px 8px",
                    border: "none",
                    background: isSelected ? "#eff6ff" : "transparent",
                    color: iconColor,
                    fontSize: 12,
                    fontWeight: isSelected ? 600 : 500,
                    cursor: "pointer",
                    textAlign: "center",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {getCategoryIcon()}
                  <span style={{ lineHeight: 1.2, wordBreak: "break-word" }}>{category}</span>
                </button>
              );
            })}
          </div>

          {/* Menu Items */}
          <div style={{ flex: 1, overflowY: "auto", background: "#f5f5f5" }}>
            {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
              <div
                key={category}
                ref={(el) => {
                  categoryRefs.current[category] = el;
                }}
                style={{ marginBottom: 12 }}
              >
                <div
                  style={{
                    padding: "12px 16px 8px",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#111827",
                    background: "#f5f5f5",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  {category}
                </div>
                <div style={{ background: "#ffffff" }}>
                  {categoryItems.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        padding: 12,
                        borderBottom: index < categoryItems.length - 1 ? "1px solid #f3f4f6" : "none",
                        gap: 12,
                      }}
                    >
                      {/* Item Image */}
                      <div style={{ flexShrink: 0 }}>
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            style={{
                              width: 90,
                              height: 90,
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 90,
                              height: 90,
                              borderRadius: 8,
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 36,
                            }}
                          >
                            {getIconEmoji(item.metadata?.emoji)}
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <h3
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#111827",
                            margin: "0 0 4px 0",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </h3>
                        {item.description && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "#9ca3af",
                              margin: "0 0 8px 0",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              lineHeight: 1.4,
                            }}
                          >
                            {item.description}
                          </p>
                        )}
                        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <span
                              style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: "#ef4444",
                              }}
                            >
                              {formatPrice(item.price, item.currency)}
                            </span>
                          </div>
                          {(() => {
                            const cartItem = cart.items.find(i => i.id === item.id);
                            const isAvailable = item.is_available && (item.stock_quantity === null || item.stock_quantity > 0);

                            if (!isAvailable) {
                              return (
                                <button
                                  disabled
                                  style={{
                                    padding: "6px 16px",
                                    background: "#e5e7eb",
                                    color: "#9ca3af",
                                    border: "none",
                                    borderRadius: 6,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "not-allowed",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Sold Out
                                </button>
                              );
                            }

                            if (cartItem) {
                              return (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <button
                                    onClick={() => cart.updateQuantity(item.id, cartItem.quantity - 1)}
                                    style={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: 6,
                                      border: "1px solid #e5e7eb",
                                      background: "#ffffff",
                                      cursor: "pointer",
                                      fontSize: 16,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#6b7280",
                                    }}
                                  >
                                    −
                                  </button>
                                  <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center", color: "#111827" }}>
                                    {cartItem.quantity}
                                  </span>
                                  <button
                                    onClick={() => cart.updateQuantity(item.id, cartItem.quantity + 1)}
                                    style={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: 6,
                                      border: "1px solid #3b82f6",
                                      background: "#3b82f6",
                                      cursor: "pointer",
                                      fontSize: 16,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#ffffff",
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <button
                                onClick={() => handleAddToCart(item)}
                                style={{
                                  padding: "6px 16px",
                                  background: "#3b82f6",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: 6,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                +
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Bar */}
        {cart.items.length > 0 && (
          <div
            onClick={() => setShowCart(true)}
            style={{
              position: "fixed",
              bottom: 16,
              left: 16,
              right: 16,
              background: "#3b82f6",
              color: "#ffffff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
              zIndex: 30,
              borderRadius: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#3b82f6",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {cart.getItemCount()}
              </div>
              <div>
                {cart.orderType && (
                  <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 2 }}>
                    {cart.orderType.type === "table" && cart.orderType.tableNumber === "N/A" && "Takeaway"}
                    {cart.orderType.type === "table" && cart.orderType.tableNumber !== "N/A" && `Table ${cart.orderType.tableNumber}`}
                    {cart.orderType.type === "pickup" && "Pickup"}
                    {cart.orderType.type === "delivery" && "Delivery"}
                  </div>
                )}
                <div style={{ fontSize: 13, opacity: 0.9 }}>View Cart</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {formatPrice(getCartTotal(), menuData.currency)}
                </div>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Cart Drawer */}
        {showCart && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 40,
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={() => setShowCart(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 450,
                background: "#ffffff",
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Cart Header */}
              <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Your Cart</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 24,
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: 0,
                      width: 32,
                      height: 32,
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div style={{
                flex: 1,
                padding: 16,
                overflowY: "auto",
                background: "#f9fafb",
                WebkitOverflowScrolling: "touch",
                minHeight: 0,
              }}>
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      marginBottom: 12,
                      padding: 12,
                      background: "#ffffff",
                      borderRadius: 8,
                    }}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 6,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 6,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                          flexShrink: 0,
                        }}
                      >
                        {getIconEmoji(item.metadata?.emoji)}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#ef4444", margin: "0 0 8px 0" }}>
                        {(() => {
                          // Get current price from menuData instead of stored cart price
                          const currentItem = menuData?.items.find(i => i.id === item.id);
                          const currentPrice = currentItem?.price ?? item.price;
                          const currentCurrency = menuData?.currency ?? item.currency;
                          return formatPrice(currentPrice, currentCurrency);
                        })()}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                            background: "#ffffff",
                            cursor: "pointer",
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#6b7280",
                          }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: 14, fontWeight: 600, minWidth: 24, textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: "1px solid #3b82f6",
                            background: "#3b82f6",
                            cursor: "pointer",
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                          }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => cart.removeItem(item.id)}
                          style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            fontSize: 12,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div style={{
                padding: "16px 16px calc(32px + env(safe-area-inset-bottom))",
                borderTop: "1px solid #e5e7eb",
                background: "#ffffff",
                flexShrink: 0,
              }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: "#6b7280" }}>Subtotal ({cart.getItemCount()} items)</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                      {formatPrice(getCartTotal(), menuData.currency)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #e5e7eb" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>
                      {formatPrice(getCartTotal(), menuData.currency)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckoutForm(true);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#3b82f6",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Form Modal */}
        {showCheckoutForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "#ffffff",
              zIndex: 50,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                minHeight: "100vh",
                padding: "20px 24px calc(24px + env(safe-area-inset-bottom))",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Checkout</h2>
                <button
                  onClick={() => {
                    setShowCheckoutForm(false);
                    setShowCart(true);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 24,
                    cursor: "pointer",
                    color: "#6b7280",
                    padding: 0,
                    width: 32,
                    height: 32,
                  }}
                >
                  ×
                </button>
              </div>

              {/* Order Summary */}
              <div style={{ marginBottom: 20, padding: 16, background: "#f9fafb", borderRadius: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Order Summary</div>
                {cart.items.map((item) => {
                  // Get current price from menuData instead of stored cart price
                  const currentItem = menuData?.items.find(i => i.id === item.id);
                  const currentPrice = currentItem?.price ?? item.price;
                  const currentCurrency = menuData?.currency ?? item.currency;

                  return (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: "#6b7280" }}>{item.quantity}x {item.name}</span>
                      <span style={{ color: "#111827", fontWeight: 600 }}>{formatPrice(currentPrice * item.quantity, currentCurrency)}</span>
                    </div>
                  );
                })}
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>
                    {formatPrice(getCartTotal(), menuData.currency)}
                  </span>
                </div>
              </div>

              {/* Customer Info Form */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
                  Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    marginBottom: 16,
                  }}
                />
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Payment Method</div>

                {!showCardPayment ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <button
                      onClick={handleCheckout}
                      disabled={!customerName || checkoutLoading}
                      style={{
                        width: "100%",
                        padding: "14px",
                        background: "#000000",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: !customerName || checkoutLoading ? "not-allowed" : "pointer",
                        opacity: !customerName || checkoutLoading ? 0.5 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      {checkoutLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          <FaApple size={20} />
                          Apple Pay
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={!customerName || checkoutLoading}
                      style={{
                        width: "100%",
                        padding: "14px",
                        background: "#ffffff",
                        color: "#000000",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: !customerName || checkoutLoading ? "not-allowed" : "pointer",
                        opacity: !customerName || checkoutLoading ? 0.5 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      {checkoutLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          <FaGoogle size={18} />
                          Google Pay
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (customerName) {
                          setShowCardPayment(true);
                        }
                      }}
                      disabled={!customerName}
                      style={{
                        width: "100%",
                        padding: "14px",
                        background: "#3b82f6",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: !customerName ? "not-allowed" : "pointer",
                        opacity: !customerName ? 0.5 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <FaCreditCard size={18} />
                      Pay with Card
                    </button>
                  </div>
                ) : (
                  <Elements stripe={stripePromise}>
                    <CardPaymentForm
                      amount={getCartTotal()}
                      currency={menuData?.currency || "USD"}
                      customerName={customerName}
                      customerEmail={customerEmail}
                      merchantId={menuData?.merchant_id || ""}
                      merchantName={menuData?.merchant_name || ""}
                      orderType={cart.orderType}
                      onSuccess={() => {
                        // Store receipt data before clearing cart
                        setReceiptData({
                          items: [...cart.items],
                          total: getCartTotal(),
                          currency: menuData?.currency || "USD",
                          customerName,
                          orderType: cart.orderType,
                          merchantName: menuData?.merchant_name || "",
                        });
                        cart.clearCart();
                        setShowCheckoutForm(false);
                        setShowCardPayment(false);
                        setShowReceipt(true);
                      }}
                      onError={(error) => {
                        alert(error);
                      }}
                    />
                    <button
                      onClick={() => setShowCardPayment(false)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "transparent",
                        color: "#6b7280",
                        border: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        marginTop: 8,
                      }}
                    >
                      ← Back to payment methods
                    </button>
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Receipt Screen */}
        {showReceipt && receiptData && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "#ffffff",
              zIndex: 50,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                minHeight: "100vh",
                padding: "20px 24px calc(24px + env(safe-area-inset-bottom))",
                maxWidth: 600,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Success Icon */}
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <FaCheckCircle size={80} color="#10b981" />
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 8, textAlign: "center" }}>
                Payment Successful!
              </h2>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 32, textAlign: "center" }}>
                Thank you for your order, {receiptData.customerName}
              </p>

              {/* Order Details */}
              <div style={{ width: "100%", background: "#f9fafb", borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Order Details</div>

                {/* Items */}
                {receiptData.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                    <span style={{ color: "#6b7280" }}>
                      {item.quantity}x {item.name}
                    </span>
                    <span style={{ color: "#111827", fontWeight: 600 }}>
                      {formatPrice(item.price * item.quantity, receiptData.currency)}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: 12, marginTop: 12, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Total Paid</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#10b981" }}>
                    {formatPrice(receiptData.total, receiptData.currency)}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div style={{ width: "100%", marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: "#6b7280" }}>Merchant</span>
                  <span style={{ color: "#111827", fontWeight: 600 }}>{receiptData.merchantName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: "#6b7280" }}>Order Type</span>
                  <span style={{ color: "#111827", fontWeight: 600, textTransform: "capitalize" }}>
                    {receiptData.orderType?.type}
                    {receiptData.orderType?.tableNumber && ` - Table ${receiptData.orderType.tableNumber}`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "#6b7280" }}>Date</span>
                  <span style={{ color: "#111827", fontWeight: 600 }}>
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>

              {/* Done Button */}
              <button
                onClick={() => {
                  setShowReceipt(false);
                  setReceiptData(null);
                  setCustomerName("");
                  setCustomerEmail("");
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#3b82f6",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Table Selector Modal */}
        {showTableSelector && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: 24,
                maxWidth: 400,
                width: "100%",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 20px 0", textAlign: "center" }}>
                Select Table Number
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {[...Array(10)].map((_, i) => {
                  const tableNum = i + 1;
                  const isSelected = cart.orderType?.type === "table" && cart.orderType.tableNumber === String(tableNum);
                  return (
                    <button
                      key={tableNum}
                      onClick={() => {
                        cart.setOrderType({ type: "table", tableNumber: String(tableNum) });
                        setHasSelectedTable(true);
                        setShowTableSelector(false);
                      }}
                      style={{
                        padding: "16px 12px",
                        background: isSelected ? "#3b82f6" : "#f9fafb",
                        color: isSelected ? "#ffffff" : "#111827",
                        border: isSelected ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "#eff6ff";
                          e.currentTarget.style.borderColor = "#3b82f6";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "#f9fafb";
                          e.currentTarget.style.borderColor = "#e5e7eb";
                        }
                      }}
                    >
                      {tableNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  cart.setOrderType({ type: "table", tableNumber: "N/A" });
                  setHasSelectedTable(true);
                  setShowTableSelector(false);
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: cart.orderType?.type === "table" && cart.orderType.tableNumber === "N/A" ? "#3b82f6" : "#f9fafb",
                  color: cart.orderType?.type === "table" && cart.orderType.tableNumber === "N/A" ? "#ffffff" : "#111827",
                  border: cart.orderType?.type === "table" && cart.orderType.tableNumber === "N/A" ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Takeaway
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
