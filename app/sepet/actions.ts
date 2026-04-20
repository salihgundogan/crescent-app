"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizePhoneNumber } from "@/lib/auth/phone";
import type { CartItem } from "@/lib/cart/types";

export type PlaceOrderState = {
  success: boolean;
  message: string;
  orderNo?: string;
};

export const INITIAL_PLACE_ORDER_STATE: PlaceOrderState = {
  success: false,
  message: "",
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function createOrderNo() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `DK-${year}-${random}`;
}

export async function placeOrderAction(
  _prevState: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  const branchId = readText(formData, "branchId");
  const paymentMethod = readText(formData, "paymentMethod");
  const fullName = readText(formData, "fullName");
  const phoneInput = readText(formData, "phone");
  const note = readText(formData, "note");
  const cartPayload = readText(formData, "cartPayload");

  if (!branchId) {
    return { success: false, message: "Lutfen sube sec." };
  }

  if (!cartPayload) {
    return { success: false, message: "Sepet bos gorunuyor." };
  }

  let cartItems: CartItem[] = [];
  try {
    cartItems = JSON.parse(cartPayload) as CartItem[];
  } catch {
    return { success: false, message: "Sepet verisi okunamadi." };
  }

  if (!cartItems.length) {
    return { success: false, message: "Sepet bos gorunuyor." };
  }

  let normalizedPhone = "";
  try {
    normalizedPhone = normalizePhoneNumber(phoneInput);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Telefon numarasi hatali.",
    };
  }

  const supabase = createSupabaseAdminClient();
  const sessionClient = await createSupabaseServerClient();
  const { data: userResult } = await sessionClient.auth.getUser();
  const userId = userResult.user?.id ?? null;

  let customerId: string | null = null;
  let guestProfileId: string | null = null;

  if (userId) {
    customerId = userId;
  } else {
    if (!fullName) {
      return { success: false, message: "Misafir siparis icin ad soyad gerekli." };
    }

    const { data: guestProfile, error: guestError } = await supabase
      .from("guest_profiles")
      .insert({
        full_name: fullName,
        phone: normalizedPhone,
      })
      .select("id")
      .single();

    if (guestError || !guestProfile) {
      return { success: false, message: "Misafir bilgisi kaydedilemedi." };
    }

    guestProfileId = guestProfile.id;
  }

  const orderNo = createOrderNo();
  const paymentMethodLabel =
    paymentMethod === "online_odeme" ? "Online odeme" : "Dukkanda odeme";

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_no: orderNo,
      customer_id: customerId,
      guest_profile_id: guestProfileId,
      branch_id: branchId,
      status: "Alindi",
      payment_method: paymentMethodLabel,
      payment_status: paymentMethod === "online_odeme" ? "Odeme bekliyor" : "Dukkanda odeyecek",
      note: note || null,
      policy_snapshot: "Iade yoktur, degisim vardir.",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, message: "Siparis olusturulamadi. Tekrar dene." };
  }

  const items = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_option_id: item.optionId,
    product_name_snapshot: item.name,
    option_label_snapshot: item.optionLabel,
    unit_price_snapshot: item.unitPrice,
    quantity: item.quantity,
  }));

  const { error: itemError } = await supabase.from("order_items").insert(items);

  if (itemError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { success: false, message: "Siparis kalemleri kaydedilemedi." };
  }

  revalidatePath("/admin");
  revalidatePath("/siparis-takip");

  return {
    success: true,
    message: "Siparis alindi. Dukkandan teslim alabilirsin.",
    orderNo,
  };
}
