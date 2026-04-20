import { signUpCustomerAction } from "@/app/auth/actions";
import { AuthCard } from "@/components/auth/auth-card";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 py-10 md:px-10">
      <AuthCard
        title="Telefonla hizli hesap olustur"
        description="Kullanicilar mail bilmek zorunda degil. Telefon, ad soyad ve sifre yeterli."
        submitLabel="Hesap olustur"
        pendingLabel="Hesap olusturuluyor..."
        action={signUpCustomerAction}
        mode="signup"
      />
    </main>
  );
}
