import { signInCustomerAction } from "@/app/auth/actions";
import { AuthCard } from "@/components/auth/auth-card";

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 py-10 md:px-10">
      <AuthCard
        title="Telefon numaranla giris yap"
        description="Musteri tarafinda e-posta gostermiyoruz. Kullanici sadece telefon numarasi ve sifre ile devam eder."
        submitLabel="Giris yap"
        pendingLabel="Giris yapiliyor..."
        action={signInCustomerAction}
        mode="signin"
      />
    </main>
  );
}
