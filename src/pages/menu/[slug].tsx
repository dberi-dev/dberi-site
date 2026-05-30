import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useCart } from "../../hooks/useCart";
import { PayScreen } from "../../components/PayScreen";

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
  merchant_name: string;
  merchant_slug: string;
  currency: string;
  items: MenuItem[];
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", BSD: "$", CAD: "$", EUR: "€", GBP: "£", JPY: "¥", KRW: "₩", CNY: "¥", INR: "₹", AUD: "$", NZD: "$",
};

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
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const cart = useCart(typeof slug === "string" ? slug : undefined);

  // Set order type based on table parameter
  useEffect(() => {
    if (table && typeof table === "string" && !cart.orderType) {
      cart.setOrderType({ type: "table", tableNumber: table });
    }
  }, [table]);

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
    return `${symbol}${(price / 100).toFixed(2)}`;
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

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setSelectedCategory(category);
    setShowSidebar(false);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
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
            borderTopColor: "#000000",
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
          backgroundColor: "#ffffff",
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

  // Filter items by search query
  const filteredItems = menuData.items.filter((item) => {
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Group items by category
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          .menu-grid {
            grid-template-columns: 1fr !important;
            padding: 16px !important;
          }
          .header-content {
            padding: 12px 16px !important;
          }
          .search-container {
            margin-top: 12px;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none !important;
          }
        }
      `}</style>

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
          className="header-content"
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "16px 20px",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Mobile Menu Button */}
                <button
                  className="mobile-menu-button"
                  onClick={() => setShowSidebar(!showSidebar)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                    <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                  </svg>
                </button>

                <div>
                  <h1
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 4,
                    }}
                  >
                    {menuData.merchant_name}
                  </h1>
                  {cart.orderType && (
                    <p style={{ fontSize: 13, color: "#6b7280" }}>
                      {cart.orderType.type === "table" && `Table ${cart.orderType.tableNumber}`}
                      {cart.orderType.type === "pickup" && "Pickup"}
                      {cart.orderType.type === "delivery" && "Delivery"}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Type Selector (if not in-store) */}
              {!table && (
                <button
                  onClick={() => setShowOrderTypeModal(true)}
                  style={{
                    padding: "8px 16px",
                    background: cart.orderType ? "#10b981" : "#6366f1",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cart.orderType
                    ? (cart.orderType.type === "pickup" ? "Pickup" : "Delivery")
                    : "Select Order Type"}
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="search-container" style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  fontSize: 15,
                  outline: "none",
                }}
              />
              <svg
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                width="20"
                height="20"
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
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", maxWidth: 1400, margin: "0 auto", width: "100%", position: "relative" }}>
          {/* Desktop Sidebar */}
          <div
            className="desktop-sidebar"
            style={{
              width: 220,
              background: "#ffffff",
              borderRight: "1px solid #e5e7eb",
              padding: "20px 0",
              overflowY: "auto",
              position: "sticky",
              top: 140,
              height: "calc(100vh - 140px)",
            }}
          >
            <div style={{ padding: "0 16px", marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Categories
              </p>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  background: selectedCategory === category ? "#f3f4f6" : "transparent",
                  color: selectedCategory === category ? "#111827" : "#6b7280",
                  fontSize: 14,
                  fontWeight: selectedCategory === category ? 600 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  borderLeft: selectedCategory === category ? "3px solid #6366f1" : "3px solid transparent",
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Mobile Sidebar Overlay */}
          {showSidebar && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 25,
              }}
              onClick={() => setShowSidebar(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "80%",
                  maxWidth: 300,
                  background: "#ffffff",
                  height: "100vh",
                  overflowY: "auto",
                  padding: "20px 0",
                }}
              >
                <div style={{ padding: "0 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Categories
                  </p>
                  <button
                    onClick={() => setShowSidebar(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 24,
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "none",
                      background: selectedCategory === category ? "#f3f4f6" : "transparent",
                      color: selectedCategory === category ? "#111827" : "#6b7280",
                      fontSize: 14,
                      fontWeight: selectedCategory === category ? 600 : 500,
                      cursor: "pointer",
                      textAlign: "left",
                      borderLeft: selectedCategory === category ? "3px solid #6366f1" : "3px solid transparent",
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="menu-grid" style={{ flex: 1, padding: "24px", overflowY: "auto", paddingBottom: 120 }}>
            {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
              <div
                key={category}
                ref={(el) => {
                  categoryRefs.current[category] = el;
                }}
                style={{ marginBottom: 40 }}
              >
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 16,
                    paddingBottom: 8,
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  {category}
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 16,
                  }}
                >
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "#ffffff",
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: 160,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: 160,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 56,
                          }}
                        >
                          {getIconEmoji(item.metadata?.emoji)}
                        </div>
                      )}
                      <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "start",
                              marginBottom: 6,
                            }}
                          >
                            <h3
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "#111827",
                              }}
                            >
                              {item.name}
                            </h3>
                            <p
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#6366f1",
                                whiteSpace: "nowrap",
                                marginLeft: 8,
                              }}
                            >
                              {formatPrice(item.price, item.currency)}
                            </p>
                          </div>
                          {item.description && (
                            <p
                              style={{
                                fontSize: 13,
                                color: "#6b7280",
                                marginBottom: 8,
                                lineHeight: 1.4,
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.is_available || (item.stock_quantity !== null && item.stock_quantity <= 0)}
                          style={{
                            width: "100%",
                            padding: "10px 16px",
                            background: item.is_available && (item.stock_quantity === null || item.stock_quantity > 0)
                              ? "#10b981"
                              : "#e5e7eb",
                            color: item.is_available && (item.stock_quantity === null || item.stock_quantity > 0)
                              ? "#ffffff"
                              : "#9ca3af",
                            border: "none",
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: item.is_available && (item.stock_quantity === null || item.stock_quantity > 0)
                              ? "pointer"
                              : "not-allowed",
                            marginTop: 8,
                          }}
                        >
                          {!item.is_available || (item.stock_quantity !== null && item.stock_quantity <= 0)
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Cart Button */}
        {cart.items.length > 0 && (
          <button
            onClick={() => setShowCart(true)}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              background: "#6366f1",
              color: "#ffffff",
              border: "none",
              borderRadius: 999,
              padding: "14px 20px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              zIndex: 30,
              maxWidth: "calc(100vw - 48px)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 2L7.8 6M17 2l1.2 4M20.5 6h-17l1.7 11h13.6l1.7-11z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="21" r="1.5" fill="currentColor" />
              <circle cx="17" cy="21" r="1.5" fill="currentColor" />
            </svg>
            <span style={{ whiteSpace: "nowrap" }}>Cart ({cart.getItemCount()})</span>
            <span style={{
              background: "rgba(255,255,255,0.2)",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}>
              {formatPrice(cart.getTotal(), menuData.currency)}
            </span>
          </button>
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
                height: "100vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Cart Header */}
              <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Your Order</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 28,
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
              <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      marginBottom: 16,
                      padding: 12,
                      background: "#f9fafb",
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
                          fontSize: 32,
                        }}
                      >
                        {getIconEmoji(item.metadata?.emoji)}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#6366f1", marginBottom: 8 }}>
                        {formatPrice(item.price, item.currency)}
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
                            fontSize: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                            background: "#ffffff",
                            cursor: "pointer",
                            fontSize: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
                            fontSize: 13,
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
              <div style={{ padding: 20, borderTop: "1px solid #e5e7eb" }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: "#6b7280" }}>Subtotal</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                      {formatPrice(cart.getTotal(), menuData.currency)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #e5e7eb" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Total</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#6366f1" }}>
                      {formatPrice(cart.getTotal(), menuData.currency)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (needsOrderType) {
                      setShowOrderTypeModal(true);
                    } else {
                      setShowCheckout(true);
                    }
                    setShowCart(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "#10b981",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {needsOrderType ? "Select Order Type & Checkout" : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Type Modal */}
        {showOrderTypeModal && !table && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={() => setShowOrderTypeModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: 24,
                maxWidth: 400,
                width: "100%",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
                Select Order Type
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  onClick={() => {
                    cart.setOrderType({ type: "pickup" });
                    setShowOrderTypeModal(false);
                    if (cart.items.length > 0) {
                      setShowCheckout(true);
                    }
                  }}
                  style={{
                    padding: "16px",
                    background: cart.orderType?.type === "pickup" ? "#6366f1" : "#f3f4f6",
                    color: cart.orderType?.type === "pickup" ? "#ffffff" : "#111827",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  🚶 Pickup
                </button>
                <button
                  onClick={() => {
                    cart.setOrderType({ type: "delivery" });
                    setShowOrderTypeModal(false);
                    if (cart.items.length > 0) {
                      setShowCheckout(true);
                    }
                  }}
                  style={{
                    padding: "16px",
                    background: cart.orderType?.type === "delivery" ? "#6366f1" : "#f3f4f6",
                    color: cart.orderType?.type === "delivery" ? "#ffffff" : "#111827",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  🚗 Delivery
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
            <PayScreen
              merchant={menuData.merchant_name}
              amount={cart.getTotal() / 100}
              currency={menuData.currency}
              onPay={() => {
                console.log("Payment initiated");
              }}
              onClose={() => {
                setShowCheckout(false);
                cart.clearCart();
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
