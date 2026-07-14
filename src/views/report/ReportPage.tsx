import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Download } from 'lucide-react';

export default function ReportPage() {
  const [filter, setFilter] = useState<'today'|'week'|'month'>('today');

  const getStartDate = () => {
    const d = new Date(); d.setHours(0,0,0,0);
    if (filter==='week') d.setDate(d.getDate()-7);
    if (filter==='month') d.setDate(1);
    return d.getTime();
  };

  const sales = useLiveQuery(() => db.sales.where('createdAt').aboveOrEqual(getStartDate()).reverse().toArray(), [filter]);

  const totalRevenue = sales?.reduce((s,t)=>s+t.total, 0) ?? 0;
  const totalDiscount = sales?.reduce((s,t)=>s+t.discount, 0) ?? 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Laporan Penjualan</h1>

      <div className="flex gap-2">
        {(['today','week','month'] as const).map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter===f?'bg-blue-600 text-white':'bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
            {f==='today'?'Hari Ini':f==='week'?'7 Hari':'Bulan Ini'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card"><p className="text-xs text-gray-500">Total Penjualan</p><p className="text-xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p></div>
        <div className="card"><p className="text-xs text-gray-500">Jumlah Transaksi</p><p className="text-xl font-bold">{sales?.length ?? 0}</p></div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">Riwayat Transaksi</h2>
        <div className="space-y-2">
          {sales?.map(s => (
            <div key={s.id} className="flex justify-between items-start py-2 border-b dark:border-gray-700 last:border-0">
              <div>
                <p className="font-medium text-sm">{s.invoiceNo}</p>
                <p className="text-xs text-gray-400">{formatDate(s.createdAt)} • {s.paymentMethod}</p>
                <p className="text-xs text-gray-400">{s.items.length} item</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{formatCurrency(s.total)}</p>
                {s.discount>0 && <p className="text-xs text-orange-500">Diskon: {formatCurrency(s.discount)}</p>}
              </div>
            </div>
          ))}
          {!sales?.length && <p className="text-center text-gray-400 py-6">Tidak ada transaksi</p>}
        </div>
      </div>
    </div>
  );
}
