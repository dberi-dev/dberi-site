import { useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  image_url: string | null;
  metadata: { emoji?: string } | null;
}

export interface OrderType {
  type: "table" | "pickup" | "delivery";
  tableNumber?: string;
}

interface CartState {
  items: CartItem[];
  orderType: OrderType | null;
  merchantSlug: string | null;
  merchantCurrency?: string;
}

const CART_STORAGE_KEY = "dberi_cart";

export function useCart(merchantSlug?: string, merchantCurrency?: string) {
  const [cart, setCart] = useState<CartState>({
    items: [],
    orderType: null,
    merchantSlug: null,
    merchantCurrency: undefined,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Only load if it's for the same merchant and same currency
        const isSameMerchant = !merchantSlug || parsed.merchantSlug === merchantSlug;
        const isSameCurrency = !merchantCurrency || !parsed.merchantCurrency || parsed.merchantCurrency === merchantCurrency;

        if (isSameMerchant && isSameCurrency) {
          setCart(parsed);
        } else if (isSameMerchant && !isSameCurrency) {
          // Same merchant but different currency - clear cart and notify
          console.log(`Currency changed from ${parsed.merchantCurrency} to ${merchantCurrency}, clearing cart`);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, [merchantSlug, merchantCurrency]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.items.length > 0 || cart.orderType) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((i) => i.id === item.id);

      if (existingIndex >= 0) {
        // Item exists, increment quantity
        const newItems = [...prev.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return {
          ...prev,
          items: newItems,
          merchantSlug: merchantSlug || prev.merchantSlug,
          merchantCurrency: merchantCurrency || prev.merchantCurrency,
        };
      } else {
        // New item
        return {
          ...prev,
          items: [...prev.items, { ...item, quantity: 1 }],
          merchantSlug: merchantSlug || prev.merchantSlug,
          merchantCurrency: merchantCurrency || prev.merchantCurrency,
        };
      }
    });
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
    }));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      ),
    }));
  };

  const setOrderType = (orderType: OrderType) => {
    setCart((prev) => ({
      ...prev,
      orderType,
    }));
  };

  const clearCart = () => {
    setCart({
      items: [],
      orderType: null,
      merchantSlug: null,
    });
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getTotal = () => {
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    items: cart.items,
    orderType: cart.orderType,
    addItem,
    removeItem,
    updateQuantity,
    setOrderType,
    clearCart,
    getTotal,
    getItemCount,
  };
}
