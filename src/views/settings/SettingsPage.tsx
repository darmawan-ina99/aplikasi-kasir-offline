import React, { useState, useEffect } from 'react';
import { db } from '@/db';
import { useTheme } from '@/context/ThemeContext';
import { useLiveQuery } from 'dexie-react-hooks';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();
  const settings = useLiveQuery(() => db.settings.get('main'));
  const [form, setForm] = useState({ storeName:'', address:'', phone:'', footerNote:'', taxPercent:0 });

  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.settings.update('main', form);
    toast.success('Pengaturan disimpan!');
  };

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-2xl font-bold">Pengaturan</h1>
      <form onSubmit={save} className="card space-y-3">
        <h2 className="font-semibold">Info Toko</h2>
        <div><label className="label">Nama Toko</label><input className="input" value={form.storeName} onChange={e=>setForm(p=>({...p,storeName:e.target.value}))}/></div>
        <div><label className="label">Alamat</label><input className="input" value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))}/></div>
        <div><label className="label">No. Telepon</label><input className="input" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/></div>
        <div><label className="label">Catatan Struk</label><input className="input" value={form.footerNote} onChange={e=>setForm(p=>({...p,footerNote:e.target.value}))}/></div>
        <div><label className="label">Pajak (%)</label><input className="input" type="number" value={form.taxPercent} onChange={e=>setForm(p=>({...p,taxPercent:+e.target.value}))} min="0" max="100"/></div>
        <button type="submit" className="btn-primary w-full">Simpan</button>
      </form>

      <div className="card">
        <h2 className="font-semibold mb-3">Tampilan</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm">Mode Gelap</span>
          <button onClick={toggle} className={`relative w-11 h-6 rounded-full transition-colors ${isDark?'bg-blue-600':'bg-gray-300'}`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isDark?'translate-x-6':'translate-x-1'}`}/>
          </button>
        </div>
      </div>
    </div>
  );
}
