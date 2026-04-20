import { branches as fallbackBranches, recentOrders } from "@/lib/mock-data";
import {
  getAdminCatalogData,
  getAdminCatalogSummary,
  getHomepageCatalogData,
} from "@/lib/supabase/catalog";
import {
  createCategoryAction,
  createProductAction,
  deleteProductAction,
  toggleProductAvailabilityAction,
} from "@/app/admin/actions";

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

export default async function AdminPage() {
  const [{ branches }, summary, catalog] = await Promise.all([
    getHomepageCatalogData(),
    getAdminCatalogSummary(),
    getAdminCatalogData(),
  ]);

  const adminSummary = [
    {
      label: "Toplam urun",
      value: String(summary.productsCount),
      detail: "Var / yok mantigi ile yonetilecek",
    },
    {
      label: "Aktif kategori",
      value: String(summary.categoriesCount),
      detail: "Admin panelinden serbest yonetim",
    },
    {
      label: "Sube",
      value: String(summary.branchesCount),
      detail: "Iki admin hepsini gorur",
    },
    {
      label: "Odeme tipi",
      value: "2",
      detail: "Dukkanda odeme + online odeme",
    },
  ];

  const branchCards = branches.length ? branches : fallbackBranches;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 md:px-10">
      <div className="rounded-[32px] border border-line bg-[#1b4b31] px-6 py-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
          Admin paneli
        </p>
        <h1 className="mt-3 font-display text-4xl">
          Iki admin, tek panel, urunleri simdi canli yonetim.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
          Bu ekranda kategori ekleyebilir, yeni urun acabilir, urunleri var/yok
          yapabilir ve silebilirsin.
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
            {branchCards.map((branch) => (
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
              Siparis entegrasyonu siradaki adim
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
                      {order.branch} | {order.paymentMethod}
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

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[30px] border border-line bg-surface px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Kategori ekle
          </p>
          <form action={createCategoryAction} className="mt-4 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Kategori adi"
              required
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
            />
            <input
              type="number"
              name="sortOrder"
              placeholder="Sira (orn: 10)"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
            >
              Kategori ekle
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {catalog.categories.map((category) => (
              <span
                key={category.id}
                className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-line bg-surface px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Yeni urun ekle
          </p>
          <form action={createProductAction} className="mt-4 grid gap-3">
            <input
              type="text"
              name="name"
              placeholder="Urun adi"
              required
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <textarea
              name="description"
              placeholder="Urun aciklamasi (opsiyonel)"
              className="min-h-24 rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <select
              name="categoryId"
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
              defaultValue=""
            >
              <option value="">Kategori sec (opsiyonel)</option>
              {catalog.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-2">
              <input
                type="text"
                name="option1Label"
                placeholder="Secenek 1 ad (zorunlu)"
                required
                className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                name="option1Price"
                placeholder="Secenek 1 fiyat (zorunlu)"
                required
                className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <input
                type="text"
                name="option1Detail"
                placeholder="Secenek 1 detay"
                className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <div className="hidden md:block" />
              <input
                type="text"
                name="option2Label"
                placeholder="Secenek 2 ad (opsiyonel)"
                className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                name="option2Price"
                placeholder="Secenek 2 fiyat (opsiyonel)"
                className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <input
                type="text"
                name="option2Detail"
                placeholder="Secenek 2 detay"
                className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-accent md:col-span-2"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
            >
              Urunu kaydet
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-[30px] border border-line bg-surface px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Urun listesi
          </p>
          <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted">
            {catalog.products.length} urun
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {catalog.products.map((product) => (
            <article
              key={product.id}
              className="rounded-[24px] border border-line bg-white px-4 py-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    {product.categoryName}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-foreground">{product.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{product.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.options.map((option) => (
                      <span
                        key={option.id}
                        className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted"
                      >
                        {option.label} - {option.price} TL
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={toggleProductAvailabilityAction}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input
                      type="hidden"
                      name="currentValue"
                      value={String(product.isAvailable)}
                    />
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-2 text-xs font-semibold ${
                        product.isAvailable
                          ? "bg-[#dff0dd] text-[#255a36]"
                          : "bg-[#fff1d8] text-[#91590d]"
                      }`}
                    >
                      {product.isAvailable ? "Var -> Yok yap" : "Yok -> Var yap"}
                    </button>
                  </form>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="productId" value={product.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-[#4b2020] px-3 py-2 text-xs font-semibold text-white"
                    >
                      Urunu sil
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
