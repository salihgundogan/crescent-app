"use client";

import { useFormStatus } from "react-dom";

function SignOutSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition hover:border-accent hover:text-accent disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Cikis yapiliyor..." : "Cikis yap"}
    </button>
  );
}

export function SignOutButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <SignOutSubmit />
    </form>
  );
}
