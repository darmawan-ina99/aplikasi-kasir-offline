# 🏪 Aplikasi Kasir Offline

Aplikasi POS (Point of Sale) offline-first berbasis **Vite + React + TypeScript + Tailwind CSS** dengan database lokal **IndexedDB via Dexie.js**.

## ✨ Fitur
- 🛒 Kasir / POS dengan keranjang belanja
- 📦 Manajemen produk & kategori
- 👥 Manajemen pelanggan
- 📊 Laporan penjualan harian/mingguan/bulanan
- ⚙️ Pengaturan toko
- 🌙 Dark mode
- 📱 PWA (bisa install di HP)
- 💾 100% offline dengan IndexedDB

## 🚀 Cara Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000

**Login default:** admin / admin123

## 🏗️ Build Production

```bash
npm run build
```

## 🛠️ Tech Stack
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Dexie.js (IndexedDB)
- React Router v6
- Zustand, React Hook Form, Zod
- Lucide Icons
- React Hot Toast

## 📂 Deploy ke GitHub Pages

```bash
npm run build
# Upload folder dist/ ke GitHub Pages
```
