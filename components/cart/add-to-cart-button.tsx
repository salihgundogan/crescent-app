"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

type AddToCartButtonProps = {
  item: {
    productId: string;
    optionId: string | null;
    name: string;
    category: string;
    optionLabel: string;
    optionDetail: string;
    unitPrice: number;
  };
};

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="flex-1 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
    >
      {added ? "Sepete eklendi" : "Sepete ekle"}
    </button>
  );
}
