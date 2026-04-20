import { adminSummary, branches, recentOrders } from "@/lib/mock-data";

function badgeColor(status: string) {
  switch (status) {
    case "Hazirlaniyor":
      return "bg-[#fff1d8] text-[#91590d]";
    case "Hazir":
      return "bg-[#dff0dd] text-[#255a36]";
    case "Teslim edildi":
      return "bg-[#e6e8fb] text-[#3142a0]";
    default:
      return "bg-[#f1efe8] text-[#6a6254]";
  }
}

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 md:px-10">
      <div className="rounded-[32px] border border-line bg-[#1b4b31] px-6 py-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
          Admin paneli
        </p>
        <h1 className="mt-3 font-display text-4xl">Iki admin, tek panel, tum siparisler.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
          Bu ilk taslakta iki admin de tum urunleri, siparisleri ve subeleri gorur.
          Bir sonraki adimda Supabase auth ve rol kontrolu baglanacak.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {adminSummary.map((item) => (
          <article
            key={item.label}
            className="rounded-[28px] border border-line bg-surface px-5 py-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              {item.label}
            </p>
            <p className="mt-3 text-4xl font-semibold text-foreground">{item.value}</p>
            <p className="mt-2 text-sm text-muted">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[30px] border border-line bg-surface px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Sube ayarlari
          </p>
          <div className="mt-4 space-y-4">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="rounded-[24px] border border-line bg-white px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{branch.name}</h2>
                    <p className="mt-2 text-sm leading-7 text-muted">{branch.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                      {branch.hours}
                    </span>
                    <p className="mt-3 text-sm text-muted">{branch.managerLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-line bg-surface px-6 py-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Son siparisler
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">
                Siparis durumlari panelden guncellenir.
              </h2>
            </div>
            <div className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-muted">
              Tum siparisler gorunur
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {recentOrders.map((order) => (
              <article
                key={order.orderNo}
                className="rounded-[24px] border border-line bg-white px-4 py-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                      {order.orderNo}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">
                      {order.customer}
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      {order.branch} • {order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-2 text-sm font-semibold ${badgeColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <span className="rounded-full border border-line px-3 py-2 text-sm font-semibold text-muted">
                      {order.total}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
