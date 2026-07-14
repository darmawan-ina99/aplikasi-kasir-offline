import Dexie, { Table } from 'dexie';
import { Product, Category, Supplier, Sale, Customer, Debt, User, StoreSettings } from '@/types';

export class KasirDB extends Dexie {
  products!: Table<Product>;
  categories!: Table<Category>;
  suppliers!: Table<Supplier>;
  sales!: Table<Sale>;
  customers!: Table<Customer>;
  debts!: Table<Debt>;
  users!: Table<User>;
  settings!: Table<StoreSettings & { id: string }>;

  constructor() {
    super('KasirOfflineDB');
    this.version(1).stores({
      products: 'id, barcode, name, categoryId, supplierId, isActive, createdAt',
      categories: 'id, name, createdAt',
      suppliers: 'id, name, createdAt',
      sales: 'id, invoiceNo, customerId, cashierId, paymentMethod, createdAt',
      customers: 'id, name, phone, createdAt',
      debts: 'id, customerId, saleId, status, createdAt',
      users: 'id, username, role, isActive',
      settings: 'id',
    });
  }
}

export const db = new KasirDB();
