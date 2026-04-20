import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutCustomerAction } from "@/app/auth/actions";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { formatPhoneForDisplay } from "@/lib/auth/phone";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AccountPageProps = {
  searchParams: Promise<{
    welcome?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const supabase = await createSupabaseServerClient();
  const [{ data: authUser }, { welcome }] = await Promise.all([
    supabase.auth.getUser(),
    searchParams,
  ]);

  if (!authUser.user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("full_name, phone, created_at")
    .eq("id", authUser.user.id)
    .single();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 md:px-10">
      <section className="card-shadow rounded-[34px] border border-line bg-surface px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              Hesabim
            </p>
            <h1 className="mt-3 font-display text-4xl text-foreground">
              {profile?.full_name || "Musteri hesabi"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Bu sayfa aktif oturumu dogrular. Sonraki adimda favoriler, siparisler ve
              profil duzenleme alanlari buraya baglanacak.
            </p>
          </div>
          <SignOutButton action={signOutCustomerAction} />
        </div>

        {welcome ? (
          <div className="mt-6 rounded-2xl bg-[#dff0dd] px-4 py-3 text-sm text-[#255a36]">
            Hesap olusturuldu ve giris acildi.
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-[26px] border border-line bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Telefon
            </p>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              {profile?.phone ? formatPhoneForDisplay(profile.phone) : "-"}
            </p>
          </article>
          <article className="rounded-[26px] border border-line bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Gizli auth tipi
            </p>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              Telefon tabanli giris
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[30px] border border-line bg-surface px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Sonraki isler
          </p>
          <div className="mt-4 space-y-3">
            {[
              "Favoriler sayfasini bu hesaba baglamak",
              "Misafir siparis ile uye siparis akisini ayirmak",
              "Siparisleri telefon veya siparis no ile listelemek",
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

        <div className="rounded-[30px] border border-line bg-[#143728] px-6 py-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Sifre unutma
          </p>
          <h2 className="mt-2 text-3xl font-semibold">Ilk surumde admin destekli olacak.</h2>
          <p className="mt-3 text-sm leading-7 text-white/80">
            Kullanicilar mail kullanmadigi icin otomatik sifre reset yerine admin
            panelinden kullanici yonetimi kurgulayacagiz.
          </p>
          <Link
            href="/admin"
            className="mt-5 inline-flex rounded-full bg-white px-4 py-3 text-sm font-semibold text-accent-strong transition hover:bg-accent-soft"
          >
            Admin demo ekranina git
          </Link>
        </div>
      </section>
    </main>
  );
}
