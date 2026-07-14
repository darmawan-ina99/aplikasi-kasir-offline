import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { formatCurrency } from '@/utils/formatters';
import { Plus, Search, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export default function CustomerListPage() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [address, setAddress] = useState('');

  const customers = useLiveQuery(() =>
    search ? db.customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone||'').includes(search)).toArray()
    : db.customers.orderBy('name').toArray()
  , [search]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.customers.add({ id:uuidv4(), name, phone, address, totalDebt:0, createdAt:Date.now() });
    toast.success('Pelanggan ditambahkan!');
    setName(''); setPhone(''); setAddress(''); setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pelanggan</h1>
        <button onClick={()=>setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16}/>Tambah</button>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input className="input pl-9" placeholder="Cari pelanggan..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {customers?.map(c => (
          <div key={c.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-400">{c.phone||'No HP -'}</p>
                {c.totalDebt > 0 && <p className="text-xs text-red-600 mt-1">Hutang: {formatCurrency(c.totalDebt)}</p>}
              </div>
              <button onClick={async()=>{if(confirm('Hapus?'))await db.customers.delete(c.id)}} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
        {!customers?.length && <p className="text-gray-400 text-center col-span-3 py-8">Belum ada pelanggan</p>}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
            <h2 className="font-bold text-lg mb-4">Tambah Pelanggan</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><label className="label">Nama *</label><input className="input" value={name} onChange={e=>setName(e.target.value)} required/></div>
              <div><label className="label">No. HP</label><input className="input" value={phone} onChange={e=>setPhone(e.target.value)}/></div>
              <div><label className="label">Alamat</label><input className="input" value={address} onChange={e=>setAddress(e.target.value)}/></div>
              <div className="flex gap-2">
                <button type="button" onClick={()=>setShowAdd(false)} className="btn-secondary flex-1">Batal</button>
                <button type="submit" className="btn-primary flex-1">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
