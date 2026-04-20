"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useCart, getCartItemKey } from "@/components/cart/cart-provider";
import {
  INITIAL_PLACE_ORDER_STATE,
  placeOrderAction,
} from "@/app/sepet/actions";
import type { BranchCard } from "@/lib/cart/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

export function CartCheckout({ branches }: { branches: BranchCard[] }) {
  const { items, totalPrice, updateQuantity, removeItem, clear } = useCart();
  const [state, formAction] = useActionState(placeOrderAction, INITIAL_PLACE_ORDER_STATE);

  useEffect(() => {
    if (state.success) {
      clear();
    }
  }, [clear, state.success]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 md:px-10">
      <section className="rounded-[32px] border border-line bg-surface px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">Sepet</p>
        <h1 className="mt-2 font-display text-4xl text-foreground">Siparisini tamamla</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Teslimat sadece dukkandan. Siparis hazir oldugunda teslim alabilirsin.
        </p>
      </section>

      {!items.length ? (
        <section className="rounded-[30px] border border-line bg-surface px-6 py-8">
          <p className="text-sm text-muted">Sepet bos. Ana sayfadan urun ekleyebilirsin.</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white"
          >
            Urunlere don
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-line bg-surface px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              Sepet kalemleri
            </p>
            <div className="mt-4 space-y-3">
              {items.map((item) => {
                const key = getCartItemKey(item);

                return (
                  <article key={key} className="rounded-[22px] border border-line bg-white px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                          {item.category}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-foreground">{item.name}</h3>
                        <p className="mt-1 text-sm text-muted">{item.optionLabel}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(key)}
                        className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted"
                      >
                        Kaldir
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(key, item.quantity - 1)}
                          className="h-8 w-8 rounded-full border border-line text-sm font-semibold text-muted"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(key, item.quantity + 1)}
                          className="h-8 w-8 rounded-full border border-line text-sm font-semibold text-muted"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold text-accent-strong">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-[30px] border border-line bg-surface px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              Checkout
            </p>
            <form action={formAction} className="mt-4 space-y-3">
              <select
                name="branchId"
                required
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
                defaultValue=""
              >
                <option value="">Sube sec</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>

              <select
                name="paymentMethod"
                required
                defaultValue="dukkanda_odeme"
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
              >
                <option value="dukkanda_odeme">Dukkanda odeme</option>
                <option value="online_odeme">Online odeme (yakinda)</option>
              </select>

              <input
                type="text"
                name="fullName"
                placeholder="Ad soyad (misafir siparis icin zorunlu)"
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
              />

              <input
                type="text"
                name="phone"
                required
                placeholder="Telefon no"
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
              />

              <textarea
                name="note"
                placeholder="Siparis notu (opsiyonel)"
                className="min-h-24 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
              />

              <input type="hidden" name="cartPayload" value={JSON.stringify(items)} />

              <div className="rounded-2xl border border-line bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  Toplam
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{formatPrice(totalPrice)}</p>
              </div>

              {state.message ? (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    state.success
                      ? "bg-[#dff0dd] text-[#255a36]"
                      : "bg-[#fff1d8] text-[#91590d]"
                  }`}
                >
                  {state.message}
                </div>
              ) : null}

              {state.orderNo ? (
                <Link
                  href={`/siparis/${state.orderNo}`}
                  className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-accent"
                >
                  Siparis detayina git: {state.orderNo}
                </Link>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                Siparisi olustur
              </button>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}
