"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(formData: FormData, key: string) {
  const value = Number(readText(formData, key));
  return Number.isFinite(value) ? value : NaN;
}

function refreshAdminViews() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createCategoryAction(formData: FormData) {
  const name = readText(formData, "name");
  const sortOrder = readNumber(formData, "sortOrder");

  if (!name) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  const slug = slugify(name);

  await supabase.from("categories").insert({
    name,
    slug: `${slug}-${Date.now()}`,
    sort_order: Number.isNaN(sortOrder) ? 999 : sortOrder,
    is_active: true,
  });

  refreshAdminViews();
}

export async function createProductAction(formData: FormData) {
  const name = readText(formData, "name");
  const description = readText(formData, "description");
  const categoryId = readText(formData, "categoryId");
  const option1Label = readText(formData, "option1Label");
  const option1Price = readNumber(formData, "option1Price");
  const option1Detail = readText(formData, "option1Detail");
  const option2Label = readText(formData, "option2Label");
  const option2Price = readNumber(formData, "option2Price");
  const option2Detail = readText(formData, "option2Detail");

  if (!name || !option1Label || Number.isNaN(option1Price)) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  const slug = `${slugify(name)}-${Date.now()}`;
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description: description || null,
      category_id: categoryId || null,
      is_available: true,
      is_active: true,
    })
    .select("id")
    .single();

  if (productError || !product) {
    return;
  }

  const options: {
    product_id: string;
    label: string;
    detail: string | null;
    price: number;
    sort_order: number;
    is_default: boolean;
  }[] = [
    {
      product_id: product.id,
      label: option1Label,
      detail: option1Detail || null,
      price: option1Price,
      sort_order: 1,
      is_default: true,
    },
  ];

  if (option2Label && !Number.isNaN(option2Price)) {
    options.push({
      product_id: product.id,
      label: option2Label,
      detail: option2Detail || null,
      price: option2Price,
      sort_order: 2,
      is_default: false,
    });
  }

  await supabase.from("product_options").insert(options);
  refreshAdminViews();
}

export async function toggleProductAvailabilityAction(formData: FormData) {
  const productId = readText(formData, "productId");
  const currentValue = readText(formData, "currentValue");

  if (!productId) {
    return;
  }

  const isAvailable = currentValue === "true";
  const supabase = createSupabaseAdminClient();

  await supabase
    .from("products")
    .update({ is_available: !isAvailable })
    .eq("id", productId);

  refreshAdminViews();
}

export async function deleteProductAction(formData: FormData) {
  const productId = readText(formData, "productId");
  if (!productId) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  await supabase.from("products").delete().eq("id", productId);

  refreshAdminViews();
}
