import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderDetail } from "@/lib/supabase/orders";

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

type OrderDetailPageProps = {
  params: Promise<{
    orderNo: string;
  }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNo } = await params;
  const order = await getOrderDetail(orderNo);

  if (!order) {
    notFound();
  }

  const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 md:px-10">
      <section className="rounded-[34px] border border-line bg-surface px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Siparis detay
        </p>
        <h1 className="mt-3 font-display text-4xl text-foreground">{order.orderNo}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
            {order.status}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
            {order.paymentMethod}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
            {order.paymentStatus}
          </span>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[30px] border border-line bg-surface px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Musteri
          </p>
          <p className="mt-3 text-xl font-semibold text-foreground">{order.customerName}</p>
          <p className="mt-2 text-sm text-muted">{order.customerPhone}</p>
          <p className="mt-4 text-sm text-muted">{order.branchName}</p>
          {order.note ? <p className="mt-4 text-sm text-muted">Not: {order.note}</p> : null}
        </div>
        <div className="rounded-[30px] border border-line bg-[#143728] px-6 py-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Toplam
          </p>
          <p className="mt-2 text-4xl font-semibold">{formatPrice(total)}</p>
          <Link
            href="/siparis-takip"
            className="mt-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold"
          >
            Siparis aramaya don
          </Link>
        </div>
      </section>

      <section className="rounded-[30px] border border-line bg-surface px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
          Urunler
        </p>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div
              key={`${item.name}-${item.optionLabel}`}
              className="rounded-[22px] border border-line bg-white px-4 py-4"
            >
              <p className="text-lg font-semibold text-foreground">{item.name}</p>
              <p className="mt-1 text-sm text-muted">{item.optionLabel}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted">{item.quantity} adet</span>
                <span className="font-semibold text-accent-strong">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
