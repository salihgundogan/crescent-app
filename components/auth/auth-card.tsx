"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/auth/submit-button";
import { INITIAL_AUTH_STATE } from "@/lib/auth/constants";
import type { AuthFormState } from "@/lib/auth/customer-auth";

type AuthCardProps = {
  title: string;
  description: string;
  submitLabel: string;
  pendingLabel: string;
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  mode: "signin" | "signup";
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        type={type}
        name={name}
        required
        placeholder={placeholder}
        className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
      />
    </label>
  );
}

export function AuthCard({
  title,
  description,
  submitLabel,
  pendingLabel,
  action,
  mode,
}: AuthCardProps) {
  const [state, formAction] = useActionState(action, INITIAL_AUTH_STATE);

  return (
    <section className="card-shadow w-full max-w-lg rounded-[32px] border border-line bg-surface px-6 py-6">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
        Musteri hesabi
      </p>
      <h1 className="mt-3 font-display text-4xl text-foreground">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>

      <form action={formAction} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <Field
            label="Ad soyad"
            name="fullName"
            placeholder="Ornek: Salih Gundogan"
          />
        ) : null}

        <Field
          label="Telefon no"
          name="phone"
          placeholder="05xx xxx xx xx"
        />

        <Field
          label="Sifre"
          name="password"
          type="password"
          placeholder="En az 6 karakter"
        />

        {mode === "signup" ? (
          <Field
            label="Sifre tekrar"
            name="passwordConfirm"
            type="password"
            placeholder="Sifreyi tekrar gir"
          />
        ) : null}

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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <SubmitButton idleLabel={submitLabel} pendingLabel={pendingLabel} />
          <Link
            href={mode === "signup" ? "/giris" : "/kayit"}
            className="text-sm font-semibold text-accent transition hover:text-accent-strong"
          >
            {mode === "signup"
              ? "Zaten hesabin var mi? Giris yap"
              : "Hesabin yok mu? Kayit ol"}
          </Link>
        </div>
      </form>

      <div className="mt-6 rounded-[24px] border border-line bg-white px-4 py-4 text-sm leading-7 text-muted">
        SMS dogrulamasi ilk surumde yok. Kullanici telefon numarasi ile kayit olur,
        ama sistem Supabase tarafinda bunu gorunmeyen bir email hesabi olarak saklar.
      </div>
    </section>
  );
}
