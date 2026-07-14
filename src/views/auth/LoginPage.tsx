import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) navigate('/');
    else setError('Username atau password salah!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <ShoppingCart size={32} className="text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kasir Offline</h1>
          <p className="text-gray-500 text-sm mt-1">Masuk untuk melanjutkan</p>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}
          <div>
            <label className="label">Username</label>
            <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin" required autoFocus/>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input className="input pr-10" type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/>
              <button type="button" onClick={()=>setShowPass(p=>!p)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
          <p className="text-xs text-center text-gray-400">Default: admin / admin123</p>
        </form>
      </div>
    </div>
  );
}
