export interface Category {
  id: string;
  name: string;
  icon?: string;
  createdAt: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: number;
}

export interface Product {
  id: string;
  barcode?: string;
  name: string;
  categoryId?: string;
  supplierId?: string;
  buyPrice: number;
  sellPrice: number;
  wholesalePrice?: number;
  stock: number;
  minStock: number;
  unit: string;
  image?: string;
  description?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}
