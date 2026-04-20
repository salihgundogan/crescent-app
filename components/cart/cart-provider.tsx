"use client";

import Link from "next/link";
import {
  createContext,
  startTransition,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/cart/types";

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "dukkanapp_cart_v1";

function itemKey(item: Pick<CartItem, "productId" | "optionId">) {
  return `${item.productId}:${item.optionId ?? "no-option"}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as CartItem[];
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    startTransition(() => {
      setItems((prev) => {
        const key = itemKey(newItem);
        const existing = prev.find((item) => itemKey(item) === key);

        if (existing) {
          return prev.map((item) =>
            itemKey(item) === key ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }

        return [...prev, { ...newItem, quantity: 1 }];
      });
    });
  };

  const updateQuantity = (key: string, quantity: number) => {
    startTransition(() => {
      setItems((prev) =>
        prev
          .map((item) => (itemKey(item) === key ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      );
    });
  };

  const removeItem = (key: string) => {
    startTransition(() => {
      setItems((prev) => prev.filter((item) => itemKey(item) !== key));
    });
  };

  const clear = () => {
    startTransition(() => setItems([]));
  };

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );
  const deferredQuantity = useDeferredValue(totalQuantity);

  const value: CartContextValue = {
    items,
    totalQuantity,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Link
        href="/sepet"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-accent-strong"
      >
        Sepet ({deferredQuantity})
      </Link>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
}

export function getCartItemKey(item: Pick<CartItem, "productId" | "optionId">) {
  return itemKey(item);
}
