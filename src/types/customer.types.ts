export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  totalDebt: number;
  createdAt: number;
}

export interface Debt {
  id: string;
  customerId: string;
  customerName: string;
  saleId: string;
  invoiceNo: string;
  amount: number;
  paid: number;
  remaining: number;
  status: 'unpaid' | 'partial' | 'paid';
  createdAt: number;
  updatedAt: number;
}
