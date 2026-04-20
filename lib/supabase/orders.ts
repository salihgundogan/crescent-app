import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizePhoneNumber } from "@/lib/auth/phone";

type OrderRow = {
  id: string;
  order_no: string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  note: string | null;
  branches: { name: string }[] | null;
  customer_profiles: { full_name: string; phone: string }[] | null;
  guest_profiles: { full_name: string; phone: string }[] | null;
};

type OrderItemRow = {
  id: string;
  option_label_snapshot: string;
  product_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
};

export type OrderCard = {
  orderNo: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  branchName: string;
  customerName: string;
  customerPhone: string;
};

export type OrderDetail = OrderCard & {
  note: string;
  items: {
    name: string;
    optionLabel: string;
    unitPrice: number;
    quantity: number;
  }[];
};

function mapOrder(row: OrderRow): OrderCard {
  const customer =
    row.customer_profiles?.[0] || row.guest_profiles?.[0] || { full_name: "Misafir", phone: "-" };

  return {
    orderNo: row.order_no,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    branchName: row.branches?.[0]?.name || "Sube",
    customerName: customer.full_name,
    customerPhone: customer.phone,
  };
}

export async function listOrdersBySearch({
  orderNo,
  phone,
}: {
  orderNo?: string;
  phone?: string;
}) {
  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("orders")
    .select(
      "id, order_no, status, payment_method, payment_status, created_at, note, branches(name), customer_profiles(full_name, phone), guest_profiles(full_name, phone)",
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (orderNo) {
    query = query.ilike("order_no", orderNo.trim());
  }

  const { data, error } = await query;
  if (error || !data) {
    return [];
  }

  let orders = (data as unknown as OrderRow[]).map(mapOrder);

  if (phone) {
    try {
      const normalized = normalizePhoneNumber(phone);
      orders = orders.filter((order) => order.customerPhone === normalized);
    } catch {
      orders = [];
    }
  }

  return orders;
}

export async function getOrderDetail(orderNo: string): Promise<OrderDetail | null> {
  const supabase = createSupabaseAdminClient();

  const { data: orderData } = await supabase
    .from("orders")
    .select(
      "id, order_no, status, payment_method, payment_status, created_at, note, branches(name), customer_profiles(full_name, phone), guest_profiles(full_name, phone)",
    )
    .eq("order_no", orderNo)
    .single();

  if (!orderData) {
    return null;
  }

  const { data: itemData } = await supabase
    .from("order_items")
    .select("id, option_label_snapshot, product_name_snapshot, unit_price_snapshot, quantity")
    .eq("order_id", orderData.id);

  const mapped = mapOrder(orderData as unknown as OrderRow);

  return {
    ...mapped,
    note: orderData.note || "",
    items: ((itemData || []) as OrderItemRow[]).map((item) => ({
      name: item.product_name_snapshot,
      optionLabel: item.option_label_snapshot,
      unitPrice: Number(item.unit_price_snapshot),
      quantity: item.quantity,
    })),
  };
}
