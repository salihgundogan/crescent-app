import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizePhoneNumber, phoneToAuthEmail } from "@/lib/auth/phone";

export type AuthFormState = {
  success: boolean;
  message: string;
};

export const INITIAL_AUTH_STATE: AuthFormState = {
  success: false,
  message: "",
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validatePassword(password: string, confirmPassword?: string) {
  if (password.length < 6) {
    throw new Error("Sifre en az 6 karakter olmali.");
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw new Error("Sifreler ayni olmali.");
  }
}

export async function signUpCustomerWithPhone(formData: FormData) {
  const fullName = getString(formData, "fullName");
  const phone = getString(formData, "phone");
  const password = getString(formData, "password");
  const passwordConfirm = getString(formData, "passwordConfirm");

  if (!fullName) {
    throw new Error("Ad soyad gerekli.");
  }

  validatePassword(password, passwordConfirm);

  const normalizedPhone = normalizePhoneNumber(phone);
  const authEmail = phoneToAuthEmail(normalizedPhone);
  const adminClient = createSupabaseAdminClient();

  const { data: existingProfile } = await adminClient
    .from("customer_profiles")
    .select("id")
    .eq("phone", normalizedPhone)
    .maybeSingle();

  if (existingProfile) {
    throw new Error("Bu telefon numarasi ile zaten hesap var.");
  }

  const { data: createdUser, error: createUserError } = await adminClient.auth.admin.createUser({
    email: authEmail,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      phone: normalizedPhone,
      sign_in_method: "phone_alias",
    },
  });

  if (createUserError || !createdUser.user) {
    throw new Error(createUserError?.message || "Hesap olusturulamadi.");
  }

  const { error: profileError } = await adminClient.from("customer_profiles").insert({
    id: createdUser.user.id,
    full_name: fullName,
    phone: normalizedPhone,
  });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(createdUser.user.id);
    throw new Error("Profil kaydi tamamlanamadi. Lutfen tekrar dene.");
  }

  const serverClient = await createSupabaseServerClient();
  const { error: signInError } = await serverClient.auth.signInWithPassword({
    email: authEmail,
    password,
  });

  if (signInError) {
    throw new Error("Hesap olustu ama giris acilamadi. Lutfen tekrar dene.");
  }

  return { normalizedPhone };
}

export async function signInCustomerWithPhone(formData: FormData) {
  const phone = getString(formData, "phone");
  const password = getString(formData, "password");

  validatePassword(password);

  const normalizedPhone = normalizePhoneNumber(phone);
  const authEmail = phoneToAuthEmail(normalizedPhone);
  const serverClient = await createSupabaseServerClient();

  const { error } = await serverClient.auth.signInWithPassword({
    email: authEmail,
    password,
  });

  if (error) {
    throw new Error("Telefon veya sifre hatali.");
  }
}

export async function signOutCustomer() {
  const serverClient = await createSupabaseServerClient();
  const { error } = await serverClient.auth.signOut();

  if (error) {
    throw new Error("Cikis yapilamadi.");
  }
}
