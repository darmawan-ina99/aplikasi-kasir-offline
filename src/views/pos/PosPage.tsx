import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, generateInvoiceNo } from '@/utils/formatters';
import { Product, Sale } from '@/types';
import { Search, Plus, Minus, Trash2, ShoppingCart, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export default function PosPage() {
  const { user } = useAuth();
  const { items, addItem, removeItem, updateQty, clearCart, total, itemCount } = useCart();
  const [search, setSearch] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paid, setPaid] = useState('');
  const [payMethod, setPayMethod] = useState<'cash'|'transfer'|'debt'>('cash');
  const [discount, setDiscount] = useState('0');

  const products = useLiveQuery(() =>
    search.trim()
      ? db.products.filter(p => p.isActive && (p.name.toLowerCase().includes(search.toLowerCase()) || (p.barcode||'').includes(search))).toArray()
      : db.products.where('isActive').equals(1 as any).limit(20).toArray()
  , [search]);

  const addToCart = (p: Product) => {
    addItem({ productId: p.id, productName: p.name, price: p.sellPrice, quantity: 1, subtotal: p.sellPrice });
  };

  const discountAmt = Math.min(parseInt(discount)||0, total);
  const finalTotal = total - discountAmt;
  const change = Math.max((parseInt(paid)||0) - finalTotal, 0);

  const handleCheckout = async () => {
    if (!items.length) return toast.error('Keranjang kosong!');
    if (payMethod === 'cash' && (parseInt(paid)||0) < finalTotal) return toast.error('Pembayaran kurang!');

    const sale: Sale = {
      id: uuidv4(),
      invoiceNo: generateInvoiceNo(),
      items: items.map(i => ({ productId: i.productId, productName: i.productName, quantity: i.quantity, price: i.price, subtotal: i.subtotal })),
      subtotal: total, discount: discountAmt, tax: 0, total: finalTotal,
      paid: parseInt(paid)||finalTotal, change,
      paymentMethod: payMethod,
      cashierId: user!.id, cashierName: user!.name,
      createdAt: Date.now()
    };

    await db.sales.add(sale);
    for (const item of items) {
      const p = await db.products.get(item.productId);
      if (p) await db.products.update(item.productId, { stock: Math.max(p.stock - item.quantity, 0) });
    }

    toast.success(`✅ Transaksi ${sale.invoiceNo} berhasil!`);
    clearCart(); setShowPayment(false); setPaid(''); setDiscount('0');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)]">
      {/* Produk */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input className="input pl-9" placeholder="Cari produk atau scan barcode..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 content-start">
          {products?.map(p => (
            <button key={p.id} onClick={()=>addToCart(p)} disabled={p.stock===0}
              className="card text-left hover:border-blue-300 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed p-3">
              <p className="font-medium text-sm line-clamp-2">{p.name}</p>
              <p className="text-blue-600 font-bold text-sm mt-1">{formatCurrency(p.sellPrice)}</p>
              <p className={`text-xs mt-0.5 ${p.stock<=p.minStock?'text-red-500':'text-gray-400'}`}>Stok: {p.stock} {p.unit}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Keranjang */}
      <div className="lg:w-80 flex flex-col card">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart size={18} className="text-blue-600"/>
          <h2 className="font-semibold">Keranjang</h2>
          <span className="badge bg-blue-100 text-blue-700 ml-auto">{itemCount} item</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {!items.length ? <p className="text-gray-400 text-sm text-center py-8">Belum ada item</p> :
            items.map(item => (
              <div key={item.productId} className="flex items-center gap-2 py-2 border-b dark:border-gray-700">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.productName}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={()=>updateQty(item.productId, item.quantity-1)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"><Minus size={12}/></button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={()=>updateQty(item.productId, item.quantity+1)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"><Plus size={12}/></button>
                </div>
                <button onClick={()=>removeItem(item.productId)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
              </div>
            ))
          }
        </div>

        <div className="border-t dark:border-gray-700 pt-3 mt-3 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(total)}</span></div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Diskon</span>
            <input className="input text-xs py-1 ml-auto w-28" type="number" value={discount} onChange={e=>setDiscount(e.target.value)} min="0"/>
          </div>
          <div className="flex justify-between font-bold"><span>Total</span><span className="text-blue-600">{formatCurrency(finalTotal)}</span></div>
          {items.length > 0 && (
            <div className="flex gap-2">
              <button onClick={clearCart} className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center gap-1"><X size={14}/>Batal</button>
              <button onClick={()=>setShowPayment(true)} className="btn-primary flex-1 text-sm py-2">Bayar</button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Bayar */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">💳 Pembayaran</h2>
            <div className="space-y-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(finalTotal)}</span>
              </div>
              <div>
                <label className="label">Metode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['cash','transfer','debt'] as const).map(m => (
                    <button key={m} onClick={()=>setPayMethod(m)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${payMethod===m?'bg-blue-600 text-white border-blue-600':'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                      {m==='cash'?'Tunai':m==='transfer'?'Transfer':'Hutang'}
                    </button>
                  ))}
                </div>
              </div>
              {payMethod==='cash' && (
                <div>
                  <label className="label">Uang Dibayar</label>
                  <input className="input text-lg font-bold" type="number" value={paid} onChange={e=>setPaid(e.target.value)} placeholder="0" autoFocus/>
                  {parseInt(paid) >= finalTotal && <p className="text-sm text-green-600 mt-1">Kembalian: {formatCurrency(change)}</p>}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={()=>setShowPayment(false)} className="btn-secondary flex-1">Batal</button>
              <button onClick={handleCheckout} className="btn-success flex-1">✅ Proses</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
