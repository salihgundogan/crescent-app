export type CartItem = {
  productId: string;
  optionId: string | null;
  name: string;
  category: string;
  optionLabel: string;
  optionDetail: string;
  unitPrice: number;
  quantity: number;
};

export type BranchCard = {
  id: string;
  name: string;
  address: string;
  hours: string;
};
