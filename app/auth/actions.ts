"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type AuthFormState,
  signInCustomerWithPhone,
  signOutCustomer,
  signUpCustomerWithPhone,
} from "@/lib/auth/customer-auth";

export async function signUpCustomerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    await signUpCustomerWithPhone(formData);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Kayit tamamlanamadi.",
    };
  }

  revalidatePath("/");
  revalidatePath("/hesabim");
  redirect("/hesabim?welcome=1");
}

export async function signInCustomerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    await signInCustomerWithPhone(formData);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Giris yapilamadi.",
    };
  }

  revalidatePath("/");
  revalidatePath("/hesabim");
  redirect("/hesabim");
}

export async function signOutCustomerAction() {
  try {
    await signOutCustomer();
  } catch {
    // The next redirect still gives the user a clear place to continue.
  }

  revalidatePath("/");
  revalidatePath("/hesabim");
  redirect("/");
}
