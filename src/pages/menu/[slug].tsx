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
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const cart = useCart(typeof slug === "string" ? slug : undefined);

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
            borderTopColor: "#10b981",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
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
                  {cart.orderType.type === "table" && `Table ${cart.orderType.tableNumber}`}
                  {cart.orderType.type === "pickup" && "Pickup"}
                  {cart.orderType.type === "delivery" && "Delivery"}
                </p>
              )}
            </div>

            {!table && (
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
                    background: cart.orderType?.type === "delivery" ? "#10b981" : "transparent",
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
                    background: cart.orderType?.type === "pickup" ? "#10b981" : "transparent",
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
              const iconColor = isSelected ? "#10b981" : "#6b7280";

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
                    background: isSelected ? "#f0fdf4" : "transparent",
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
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.is_available || (item.stock_quantity !== null && item.stock_quantity <= 0)}
                            style={{
                              padding: "6px 16px",
                              background: item.is_available && (item.stock_quantity === null || item.stock_quantity > 0)
                                ? "#10b981"
                                : "#e5e7eb",
                              color: item.is_available && (item.stock_quantity === null || item.stock_quantity > 0)
                                ? "#ffffff"
                                : "#9ca3af",
                              border: "none",
                              borderRadius: 6,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: item.is_available && (item.stock_quantity === null || item.stock_quantity > 0)
                                ? "pointer"
                                : "not-allowed",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {!item.is_available || (item.stock_quantity !== null && item.stock_quantity <= 0)
                              ? "Sold Out"
                              : "+"}
                          </button>
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
              background: "#10b981",
              color: "#ffffff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
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
                  color: "#10b981",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {cart.getItemCount()}
              </div>
              <div>
                <div style={{ fontSize: 13, opacity: 0.9 }}>View Cart</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {formatPrice(cart.getTotal(), menuData.currency)}
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
                height: "100vh",
                overflowY: "auto",
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
              <div style={{ flex: 1, padding: 16, overflowY: "auto", background: "#f9fafb" }}>
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
                            border: "1px solid #10b981",
                            background: "#10b981",
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
              <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", background: "#ffffff" }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: "#6b7280" }}>Subtotal ({cart.getItemCount()} items)</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                      {formatPrice(cart.getTotal(), menuData.currency)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #e5e7eb" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>
                      {formatPrice(cart.getTotal(), menuData.currency)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCheckout(true);
                    setShowCart(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#10b981",
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
                    background: cart.orderType?.type === "pickup" ? "#10b981" : "#f3f4f6",
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
                    background: cart.orderType?.type === "delivery" ? "#10b981" : "#f3f4f6",
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
