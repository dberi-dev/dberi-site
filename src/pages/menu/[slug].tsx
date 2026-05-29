import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";

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
  // Map icon keys to emojis
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [showTableInput, setShowTableInput] = useState(false);

  useEffect(() => {
    if (table && typeof table === "string") {
      setTableNumber(table);
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

  const categories = ["All", ...Array.from(new Set(menuData.items.map((item) => item.category || "Uncategorized")))];
  const filteredItems = selectedCategory === "All"
    ? menuData.items
    : menuData.items.filter((item) => (item.category || "Uncategorized") === selectedCategory);

  // Group items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <>
      <Head>
        <title>{`${menuData.merchant_name} - Menu`}</title>
        <meta name="description" content={`View the menu for ${menuData.merchant_name}`} />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "20px 16px",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ maxWidth: 1024, margin: "0 auto" }}>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              {menuData.merchant_name}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#6b7280",
              }}
            >
              {tableNumber ? `Table ${tableNumber}` : "Menu"}
            </p>
          </div>
        </div>

        {/* Table Number Banner */}
        {!tableNumber && (
          <div
            style={{
              background: "#fef3c7",
              borderBottom: "1px solid #fbbf24",
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                maxWidth: 1024,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <p style={{ fontSize: 14, color: "#92400e" }}>
                {showTableInput ? "Enter your table number" : "Dining in? Add your table number"}
              </p>
              {!showTableInput ? (
                <button
                  onClick={() => setShowTableInput(true)}
                  style={{
                    padding: "6px 12px",
                    background: "#fbbf24",
                    color: "#78350f",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Add Table
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Table #"
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #fbbf24",
                      borderRadius: 6,
                      fontSize: 14,
                      width: 80,
                    }}
                  />
                  <button
                    onClick={() => {
                      if (tableNumber.trim()) {
                        router.push(`/menu/${slug}?table=${encodeURIComponent(tableNumber.trim())}`);
                      }
                      setShowTableInput(false);
                    }}
                    style={{
                      padding: "6px 12px",
                      background: "#fbbf24",
                      color: "#78350f",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Set
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "12px 16px",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              maxWidth: 1024,
              margin: "0 auto",
              display: "flex",
              gap: 8,
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "8px 16px",
                  border: selectedCategory === category ? "2px solid #6366f1" : "1px solid #e5e7eb",
                  borderRadius: 999,
                  background: selectedCategory === category ? "#eef2ff" : "#ffffff",
                  color: selectedCategory === category ? "#6366f1" : "#6b7280",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ maxWidth: 1024, margin: "0 auto", padding: "24px 16px" }}>
          {selectedCategory === "All" ? (
            // Group by category
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
                <div key={category}>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 16,
                    }}
                  >
                    {category}
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
                              fontSize: 64,
                            }}
                          >
                            {getIconEmoji(item.metadata?.emoji)}
                          </div>
                        )}
                        <div style={{ padding: 16 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "start",
                              marginBottom: 8,
                            }}
                          >
                            <h3
                              style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: "#111827",
                              }}
                            >
                              {item.name}
                            </h3>
                            <p
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#6366f1",
                              }}
                            >
                              {formatPrice(item.price, item.currency)}
                            </p>
                          </div>
                          {item.description && (
                            <p
                              style={{
                                fontSize: 14,
                                color: "#6b7280",
                                marginBottom: 8,
                                lineHeight: 1.5,
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                          {item.stock_quantity !== null && (
                            <p
                              style={{
                                fontSize: 12,
                                color: item.stock_quantity > 0 ? "#10b981" : "#ef4444",
                                fontWeight: 600,
                              }}
                            >
                              {item.stock_quantity > 0 ? `${item.stock_quantity} in stock` : "Out of stock"}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show filtered items
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
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
                        fontSize: 64,
                      }}
                    >
                      {getIconEmoji(item.metadata?.emoji)}
                    </div>
                  )}
                  <div style={{ padding: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: 8,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {item.name}
                      </h3>
                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#6366f1",
                        }}
                      >
                        {formatPrice(item.price, item.currency)}
                      </p>
                    </div>
                    {item.description && (
                      <p
                        style={{
                          fontSize: 14,
                          color: "#6b7280",
                          marginBottom: 8,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                    {item.stock_quantity !== null && (
                      <p
                        style={{
                          fontSize: 12,
                          color: item.stock_quantity > 0 ? "#10b981" : "#ef4444",
                          fontWeight: 600,
                        }}
                      >
                        {item.stock_quantity > 0 ? `${item.stock_quantity} in stock` : "Out of stock"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            background: "#ffffff",
            borderTop: "1px solid #e5e7eb",
            padding: "24px 16px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
            Powered by <strong style={{ color: "#111827" }}>dberi</strong>
          </p>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>
            Accept payments instantly with dberi
          </p>
        </div>
      </div>
    </>
  );
}
