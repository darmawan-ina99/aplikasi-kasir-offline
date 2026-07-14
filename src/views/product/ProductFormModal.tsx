import React from 'react';
import { useForm } from 'react-hook-form';
import { db } from '@/db';
import { Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLiveQuery } from 'dexie-react-hooks';

interface Props { product: Product|null; onClose: () => void; }

export default function ProductFormModal({ product, onClose }: Props) {
  const categories = useLiveQuery(() => db.categories.toArray());
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product ? {
      name: product.name, barcode: product.barcode||'', categoryId: product.categoryId||'',
      buyPrice: product.buyPrice, sellPrice: product.sellPrice, stock: product.stock,
      minStock: product.minStock, unit: product.unit
    } : { name:'', barcode:'', categoryId:'', buyPrice:0, sellPrice:0, stock:0, minStock:5, unit:'pcs' }
  });

  const onSubmit = async (data: any) => {
    if (product) {
      await db.products.update(product.id, { ...data, buyPrice:+data.buyPrice, sellPrice:+data.sellPrice, stock:+data.stock, minStock:+data.minStock, updatedAt:Date.now() });
      toast.success('Produk diperbarui!');
    } else {
      await db.products.add({ id:uuidv4(), ...data, buyPrice:+data.buyPrice, sellPrice:+data.sellPrice, stock:+data.stock, minStock:+data.minStock, isActive:true, createdAt:Date.now(), updatedAt:Date.now() });
      toast.success('Produk ditambahkan!');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{product?'Edit':'Tambah'} Produk</h2>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div><label className="label">Nama Produk *</label><input className="input" {...register('name',{required:true})} placeholder="Nama produk"/></div>
          <div><label className="label">Barcode</label><input className="input" {...register('barcode')} placeholder="Opsional"/></div>
          <div><label className="label">Kategori</label>
            <select className="input" {...register('categoryId')}>
              <option value="">Pilih kategori</option>
              {categories?.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Harga Beli</label><input className="input" type="number" {...register('buyPrice')} min="0"/></div>
            <div><label className="label">Harga Jual *</label><input className="input" type="number" {...register('sellPrice',{required:true})} min="0"/></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Stok</label><input className="input" type="number" {...register('stock')} min="0"/></div>
            <div><label className="label">Stok Min</label><input className="input" type="number" {...register('minStock')} min="0"/></div>
            <div><label className="label">Satuan</label><input className="input" {...register('unit')} placeholder="pcs"/></div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
            <button type="submit" className="btn-primary flex-1">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
