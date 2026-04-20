import Link from "next/link";
import { listOrdersBySearch } from "@/lib/supabase/orders";

type TrackingPageProps = {
  searchParams: Promise<{
    orderNo?: string;
    phone?: string;
  }>;
};

export default async function OrderTrackingPage({ searchParams }: TrackingPageProps) {
  const params = await searchParams;
  const orderNo = params.orderNo?.trim() || "";
  const phone = params.phone?.trim() || "";
  const orders = orderNo || phone ? await listOrdersBySearch({ orderNo, phone }) : [];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 md:px-10">
      <section className="rounded-[34px] border border-line bg-surface px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Siparis takip
        </p>
        <h1 className="mt-3 font-display text-4xl text-foreground">
          Siparis no veya telefon ile siparislerini bul.
        </h1>
        <form className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="orderNo"
            defaultValue={orderNo}
            placeholder="ORN: DK-2026-123456"
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <input
            type="text"
            name="phone"
            defaultValue={phone}
            placeholder="05xx xxx xx xx"
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white md:col-span-2 md:justify-self-start"
          >
            Siparisleri ara
          </button>
        </form>
      </section>

      <section className="rounded-[34px] border border-line bg-[#143728] px-6 py-8 text-white">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Sonuc
          </p>
          <h2 className="text-3xl font-semibold">
            {orders.length ? `${orders.length} siparis bulundu` : "Siparis sonucu bekleniyor"}
          </h2>
        </div>
        <div className="mt-6 space-y-3">
          {orders.length ? (
            orders.map((order) => (
              <article
                key={order.orderNo}
                className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                      {order.orderNo}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{order.customerName}</h3>
                    <p className="mt-2 text-sm text-white/75">
                      {order.branchName} | {order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-accent-strong">
                      {order.status}
                    </span>
                    <Link
                      href={`/siparis/${order.orderNo}`}
                      className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Detay
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-white/70">
              Arama yapmak icin siparis no veya telefon numarasi gir.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
