import { db } from './schema';
import { v4 as uuidv4 } from 'uuid';

export async function seedDatabase() {
  const count = await db.users.count();
  if (count > 0) return;

  // Default admin user
  await db.users.add({
    id: uuidv4(),
    name: 'Administrator',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    createdAt: Date.now()
  });

  // Default settings
  await db.settings.add({
    id: 'main',
    storeName: 'Toko Saya',
    address: 'Jl. Contoh No. 1',
    phone: '08123456789',
    footerNote: 'Terima kasih telah berbelanja!',
    taxPercent: 0,
    currency: 'Rp',
    theme: 'light'
  });

  // Sample categories
  const catId1 = uuidv4();
  const catId2 = uuidv4();
  await db.categories.bulkAdd([
    { id: catId1, name: 'Minuman', icon: '🥤', createdAt: Date.now() },
    { id: catId2, name: 'Makanan', icon: '🍱', createdAt: Date.now() }
  ]);

  // Sample products
  await db.products.bulkAdd([
    { id: uuidv4(), name: 'Aqua 600ml', categoryId: catId1, barcode: '8886010010057', buyPrice: 2500, sellPrice: 3500, wholesalePrice: 3000, stock: 100, minStock: 10, unit: 'botol', isActive: true, createdAt: Date.now(), updatedAt: Date.now() },
    { id: uuidv4(), name: 'Indomie Goreng', categoryId: catId2, barcode: '089686010253', buyPrice: 2800, sellPrice: 3500, stock: 50, minStock: 10, unit: 'bungkus', isActive: true, createdAt: Date.now(), updatedAt: Date.now() }
  ]);
}
