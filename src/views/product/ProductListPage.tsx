import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { formatCurrency } from '@/utils/formatters';
import { Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import ProductFormModal from './ProductFormModal';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function ProductListPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product|null>(null);

  const products = useLiveQuery(() =>
    search ? db.products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.barcode||'').includes(search)).toArray()
    : db.products.orderBy('name').toArray()
  , [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    await db.products.delete(id);
    toast.success('Produk dihapus');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produk</h1>
        <button onClick={()=>{setEditProduct(null);setShowForm(true)}} className="btn-primary flex items-center gap-2">
          <Plus size={16}/> Tambah
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input className="input pl-9" placeholder="Cari nama atau barcode..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-2 font-semibold">Nama</th>
              <th className="text-right py-2 font-semibold">Harga</th>
              <th className="text-right py-2 font-semibold">Stok</th>
              <th className="text-center py-2 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(p => (
              <tr key={p.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2.5">
                  <p className="font-medium">{p.name}</p>
                  {p.barcode && <p className="text-xs text-gray-400">{p.barcode}</p>}
                </td>
                <td className="text-right py-2.5 text-blue-600 font-medium">{formatCurrency(p.sellPrice)}</td>
                <td className="text-right py-2.5">
                  <span className={`${p.stock<=p.minStock?'text-red-600 font-bold':''} flex items-center justify-end gap-1`}>
                    {p.stock<=p.minStock && <AlertTriangle size={12}/>}
                    {p.stock} {p.unit}
                  </span>
                </td>
                <td className="text-center py-2.5">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={()=>{setEditProduct(p);setShowForm(true)}} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit2 size={15}/></button>
                    <button onClick={()=>handleDelete(p.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={15}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products?.length && <p className="text-center text-gray-400 py-8">Belum ada produk</p>}
      </div>

      {showForm && <ProductFormModal product={editProduct} onClose={()=>setShowForm(false)}/>}
    </div>
  );
}
