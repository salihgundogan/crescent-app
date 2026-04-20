import { recentOrders } from "@/lib/mock-data";

export default function OrderTrackingPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 md:px-10">
      <section className="rounded-[34px] border border-line bg-surface px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Siparis takip
        </p>
        <h1 className="mt-3 font-display text-4xl text-foreground">
          Siparis no veya telefon ile siparislerini bul.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          Kullanici tarafinda guvenlik sert tutulmayacak kararina gore bu sayfa iki
          yontemi de destekleyecek. Sonraki asamada formu Supabase sorgularina
          baglayacagiz.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[26px] border border-line bg-white p-5">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Siparis no
            </label>
            <div className="mt-3 rounded-full border border-line px-4 py-3 text-sm text-muted">
              ORN: DK-2026-000124
            </div>
          </div>
          <div className="rounded-[26px] border border-line bg-white p-5">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Telefon no
            </label>
            <div className="mt-3 rounded-full border border-line px-4 py-3 text-sm text-muted">
              ORN: 05xx xxx xx xx
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-line bg-[#143728] px-6 py-8 text-white">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Ornek sonuc
          </p>
          <h2 className="text-3xl font-semibold">Aktif siparisler</h2>
        </div>
        <div className="mt-6 space-y-3">
          {recentOrders.slice(0, 3).map((order) => (
            <article
              key={order.orderNo}
              className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                    {order.orderNo}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{order.customer}</h3>
                  <p className="mt-2 text-sm text-white/75">
                    {order.branch} • {order.paymentMethod}
                  </p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-accent-strong">
                  {order.status}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
