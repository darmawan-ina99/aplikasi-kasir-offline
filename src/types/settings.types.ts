export interface StoreSettings {
  storeName: string;
  address: string;
  phone: string;
  footerNote: string;
  taxPercent: number;
  currency: string;
  theme: 'light' | 'dark';
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'cashier';
  isActive: boolean;
  createdAt: number;
}
