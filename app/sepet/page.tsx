import { CartCheckout } from "@/components/cart/cart-checkout";
import { getHomepageCatalogData } from "@/lib/supabase/catalog";

export default async function CartPage() {
  const { branches } = await getHomepageCatalogData();

  return <CartCheckout branches={branches} />;
}
