import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { highlightedPolicies } from "@/lib/mock-data";
import { getHomepageCatalogData } from "@/lib/supabase/catalog";

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function getOptionId(option: unknown) {
  if (option && typeof option === "object" && "id" in option) {
    const value = (option as { id?: string | null }).id;
    return value ?? null;
  }
  return null;
}

export default async function Home() {
  const { branches, categories, products } = await getHomepageCatalogData();

  return (
    <main className="grain">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-6 md:px-10">
        <nav className="flex flex-col gap-4 rounded-[28px] border border-line/80 bg-surface/80 px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              DukkanApp
            </p>
            <h1 className="font-display text-2xl text-foreground">
              Baharat siparisini sade, hizli ve dukkan odakli kuruyoruz.
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              href="/kayit"
              className="rounded-full border border-line bg-white px-4 py-2 text-foreground transition hover:border-accent hover:text-accent"
            >
              Uye ol
            </Link>
            <Link
              href="/sepet"
              className="rounded-full border border-line bg-white px-4 py-2 text-foreground transition hover:border-accent hover:text-accent"
            >
              Sepet
            </Link>
            <Link
              href="#urunler"
              className="rounded-full border border-line bg-white px-4 py-2 text-foreground transition hover:border-accent hover:text-accent"
            >
              Urunleri incele
            </Link>
            <Link
              href="/siparis-takip"
              className="rounded-full border border-accent bg-accent px-4 py-2 text-white transition hover:bg-accent-strong"
            >
              Siparis takibi
            </Link>
            <Link
              href="/admin"
              className="rounded-full border border-line bg-accent-soft px-4 py-2 text-accent-strong transition hover:border-accent"
            >
              Admin demo
            </Link>
          </div>
        </nav>

        <div className="hero-glow card-shadow grid gap-8 rounded-[36px] border border-line px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-accent px-4 py-2 font-semibold text-white">
                Faz 1 aktif plan
              </span>
              <span className="rounded-full border border-line bg-white/80 px-4 py-2 font-semibold text-muted">
                Siparis ver + dukkanda ode
              </span>
              <span className="rounded-full border border-line bg-white/80 px-4 py-2 font-semibold text-muted">
                Faz 2: iyzico online odeme
              </span>
            </div>
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                Iki sube, ortak stok, tek panel
              </p>
              <h2 className="font-display text-4xl leading-tight text-foreground md:text-6xl">
                Musteri sepete ekler, teslim subesini secmeden siparis ilerlemez.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted md:text-lg">
                Sistem misafir siparisi destekler. Uye olan kullanici favorilerine urun
                ekleyebilir. Siparisler siparis no ile takip edilir, odeme tipi olarak
                dukkanda odeme simdiden, online odeme ise ikinci fazda eklenir.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  Teslim sekli
                </p>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  Sadece dukkan teslimi
                </p>
              </div>
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  Giris modeli
                </p>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  Misafir veya telefon + sifre
                </p>
              </div>
              <div className="rounded-[24px] border border-line bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  Siparis hizi
                </p>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  Hazir oldugu en kisa sure
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[30px] border border-line bg-[#163829] p-5 text-white">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">
                    Ornek siparis akisi
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    Sepet -&gt; Sube -&gt; Odeme tipi -&gt; Siparis no
                  </h3>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  MVP
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  "Urun secimi ve arama",
                  "Favori kaydetme (uye kullanici)",
                  "Dukkan secimi",
                  "Dukkanda odeme veya online odeme",
                  "Siparis no ile takip",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent-strong">
                      {index + 1}
                    </span>
                    <p className="text-sm text-white/90">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[22px] bg-white px-4 py-4 text-accent-strong">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  Siparis notu
                </p>
                <p className="mt-2 text-sm font-medium">
                  Iade yoktur, degisim vardir. Gerekirse dukkan ekibi musteri
                  memnuniyeti icin destek olur.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
          <div className="card-shadow rounded-[32px] border border-line bg-surface px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              Subeler
            </p>
            <div className="mt-4 space-y-4">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="rounded-[24px] border border-line bg-white px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {branch.name}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {branch.address}
                      </p>
                    </div>
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                      {branch.hours}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-shadow rounded-[32px] border border-line bg-surface px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                  MVP kapsam
                </p>
                <h3 className="mt-2 font-display text-3xl text-foreground">
                  Projeyi once kullanilir hale, sonra odemeli hale getiriyoruz.
                </h3>
              </div>
              <div className="rounded-[24px] border border-line bg-white px-4 py-4 text-sm text-muted">
                Favoriler icin uyelik var.
                <br />
                Misafir siparis devam ediyor.
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {highlightedPolicies.map((policy) => (
                <div
                  key={policy.title}
                  className="rounded-[26px] border border-line bg-white p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    {policy.eyebrow}
                  </p>
                  <h4 className="mt-2 text-xl font-semibold text-foreground">
                    {policy.title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-muted">{policy.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="urunler" className="card-shadow rounded-[34px] border border-line bg-surface px-6 py-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Urun vitrin demo
              </p>
              <h3 className="mt-2 font-display text-3xl text-foreground">
                Admin isterse gram, paket, demet veya adet bazli secenek tanimlayacak.
              </h3>
            </div>
            <div className="flex min-w-[280px] items-center rounded-full border border-line bg-white px-4 py-3 text-sm text-muted">
              Search burada kategori ve isim filtreleyecek...
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-line bg-accent-soft px-4 py-2 text-sm font-semibold text-accent-strong"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="group rounded-[30px] border border-line bg-white p-4 transition hover:-translate-y-1 hover:border-accent"
              >
                <div className="flex aspect-[4/3] items-end justify-between rounded-[24px] bg-linear-to-br from-accent-soft to-[#f4e1cd] p-4">
                  <div>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-accent-strong">
                      {product.category}
                    </span>
                    <h4 className="mt-3 text-2xl font-semibold text-foreground">
                      {product.name}
                    </h4>
                  </div>
                  <div className="rounded-2xl border border-white/40 bg-white/40 px-3 py-2 text-right backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      Durum
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {product.isAvailable ? "Var" : "Yok"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">{product.description}</p>
                <div className="mt-5 space-y-3">
                  {(product.options.length
                    ? product.options
                    : [
                        {
                          id: null,
                          label: "Secenek bekleniyor",
                          detail: "Admin panelinden secenek ekleyin",
                          price: 0,
                        },
                      ]
                  ).map((option, index) => (
                    <div
                      key={`${option.label}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-line bg-surface-strong px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{option.label}</p>
                        <p className="text-sm text-muted">{option.detail}</p>
                      </div>
                      <span className="text-sm font-bold text-accent-strong">
                        {formatPrice(option.price)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  <AddToCartButton
                    item={{
                      productId: product.id,
                      optionId: getOptionId(product.options[0]),
                      name: product.name,
                      category: product.category,
                      optionLabel: product.options[0]?.label || "Standart",
                      optionDetail: product.options[0]?.detail || "",
                      unitPrice: product.options[0]?.price || 0,
                    }}
                  />
                  <button className="rounded-full border border-line px-4 py-3 text-sm font-semibold text-muted transition hover:border-accent hover:text-accent">
                    Favori
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="card-shadow rounded-[32px] border border-line bg-surface px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              Teknik yapi
            </p>
            <h3 className="mt-2 font-display text-3xl text-foreground">
              Secilen stack CV icin de guclu durur.
            </h3>
            <div className="mt-6 grid gap-3">
              {[
                "Next.js App Router ile storefront ve admin panel",
                "Supabase Postgres + Storage + Auth",
                "Musteri auth: telefon + sifre, arka planda gizli email auth",
                "Faz 2 odeme: iyzico Checkout Form",
                "Play Store hedefi icin daha sonra mobil kabuk veya React Native",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-line bg-white px-4 py-4 text-sm leading-7 text-muted"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="card-shadow rounded-[32px] border border-line bg-[#1b4b31] px-6 py-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">
              Sonraki adimlar
            </p>
            <h3 className="mt-2 font-display text-3xl">
              Bundan sonra veritabani ve auth akisini kurabiliriz.
            </h3>
            <div className="mt-6 space-y-3">
              {[
                "Supabase projesini acip tablolar ve RLS politikalarini olusturmak",
                "Musteri girisi, misafir checkout ve siparis olusturma akisini yazmak",
                "Iki adminli panelde urun, kategori, sube ve siparis ekranlarini bitirmek",
                "Son fazda iyzico odeme ve Play Store stratejisine gecmek",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-accent-strong">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-white/85">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
