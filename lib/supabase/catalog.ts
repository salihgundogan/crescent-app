import { createSupabaseServerClient } from "@/lib/supabase/server";
import { branches as fallbackBranches, categories as fallbackCategories, featuredProducts } from "@/lib/mock-data";

type BranchRow = {
  id: string;
  name: string;
  address: string;
  working_hours_start: string;
  working_hours_end: string;
};

type CategoryRow = {
  id: string;
  name: string;
  sort_order: number;
};

type ProductOptionRow = {
  id: string;
  label: string;
  detail: string | null;
  price: number;
  sort_order: number;
};

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  is_available: boolean;
  category_id: string | null;
  categories: { name: string }[] | null;
  product_options: ProductOptionRow[] | null;
};

function toHourMinute(value: string) {
  return value.slice(0, 5);
}

function mapBranches(rows: BranchRow[]) {
  return rows.map((branch) => ({
    id: branch.id,
    name: branch.name,
    address: branch.address,
    hours: `${toHourMinute(branch.working_hours_start)} - ${toHourMinute(branch.working_hours_end)}`,
  }));
}

function mapCategories(rows: CategoryRow[]) {
  return rows.map((category) => category.name);
}

function mapProducts(rows: ProductRow[]) {
  return rows.map((product) => ({
    id: product.id,
    category: product.categories?.[0]?.name || "Kategorisiz",
    name: product.name,
    description:
      product.description ||
      "Urun aciklamasi henuz eklenmedi. Admin panelinden aciklama girilebilir.",
    isAvailable: product.is_available,
    options:
      product.product_options?.map((option) => ({
        label: option.label,
        detail: option.detail || "Secenek detayi belirtilmedi",
        price: Number(option.price),
      })) || [],
  }));
}

export async function getHomepageCatalogData() {
  const supabase = await createSupabaseServerClient();

  const [branchResult, categoryResult, productResult] = await Promise.all([
    supabase
      .from("branches")
      .select("id, name, address, working_hours_start, working_hours_end")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("categories")
      .select("id, name, sort_order")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select(
        "id, name, description, is_available, category_id, categories(name), product_options(id, label, detail, price, sort_order)",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  const branches =
    branchResult.error || !branchResult.data?.length
      ? [...fallbackBranches]
      : mapBranches(branchResult.data as BranchRow[]);

  const categories =
    categoryResult.error || !categoryResult.data?.length
      ? [...fallbackCategories]
      : mapCategories(categoryResult.data as CategoryRow[]);

  const products =
    productResult.error || !productResult.data?.length
      ? [...featuredProducts]
      : mapProducts(productResult.data as ProductRow[]);

  return {
    branches,
    categories,
    products,
  };
}

export async function getAdminCatalogSummary() {
  const supabase = await createSupabaseServerClient();

  const [branchResult, productResult, categoryResult] = await Promise.all([
    supabase.from("branches").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("categories").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const branchesCount = branchResult.count ?? fallbackBranches.length;
  const productsCount = productResult.count ?? featuredProducts.length;
  const categoriesCount = categoryResult.count ?? fallbackCategories.length;

  return {
    branchesCount,
    productsCount,
    categoriesCount,
  };
}
