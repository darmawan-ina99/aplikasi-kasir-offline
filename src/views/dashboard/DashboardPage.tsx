import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const today = new Date(); today.setHours(0,0,0,0);
  const todayTs = today.getTime();

  const todaySales = useLiveQuery(() => db.sales.where('createdAt').aboveOrEqual(todayTs).toArray(), [todayTs]);
  const products = useLiveQuery(() => db.products.where('isActive').equals(1 as any).toArray());
  const customers = useLiveQuery(() => db.customers.toArray());
  const recentSales = useLiveQuery(() => db.sales.orderBy('createdAt').reverse().limit(5).toArray());

  const todayRevenue = todaySales?.reduce((s, t) => s + t.total, 0) ?? 0;
  const todayCount = todaySales?.length ?? 0;
  const lowStock = products?.filter(p => p.stock <= p.minStock) ?? [];

  const stats = [
    { label: 'Penjualan Hari Ini', value: formatCurrency(todayRevenue), icon: TrendingUp, color: 'bg-green-500', sub: `${todayCount} transaksi` },
    { label: 'Total Produk', value: products?.length ?? 0, icon: Package, color: 'bg-blue-500', sub: `${lowStock.length} stok menipis` },
    { label: 'Total Pelanggan', value: customers?.length ?? 0, icon: Users, color: 'bg-purple-500', sub: 'terdaftar' },
    { label: 'Transaksi Hari Ini', value: todayCount, icon: ShoppingCart, color: 'bg-orange-500', sub: 'transaksi' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
              <div className={`${s.color} p-2 rounded-lg`}>
                <s.icon size={18} className="text-white"/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="card border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-yellow-600"/>
            <h2 className="font-semibold text-yellow-800 dark:text-yellow-400">Stok Menipis</h2>
          </div>
          <div className="space-y-2">
            {lowStock.slice(0,5).map(p => (
              <div key={p.id} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="font-medium text-red-600">{p.stock} {p.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold mb-3">Transaksi Terakhir</h2>
        {!recentSales?.length ? (
          <p className="text-gray-400 text-sm text-center py-4">Belum ada transaksi</p>
        ) : (
          <div className="space-y-2">
            {recentSales.map(s => (
              <div key={s.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium">{s.invoiceNo}</p>
                  <p className="text-xs text-gray-400">{formatDate(s.createdAt)}</p>
                </div>
                <span className="font-semibold text-green-600">{formatCurrency(s.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
