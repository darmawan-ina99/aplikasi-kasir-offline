export interface SaleItem {
  productId: string;
  productName: string;
  barcode?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  change: number;
  paymentMethod: 'cash' | 'transfer' | 'debt';
  note?: string;
  cashierId: string;
  cashierName: string;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}
