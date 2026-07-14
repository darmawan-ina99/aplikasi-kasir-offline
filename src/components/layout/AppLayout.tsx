import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings, Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pos', icon: ShoppingCart, label: 'Kasir' },
  { to: '/products', icon: Package, label: 'Produk' },
  { to: '/customers', icon: Users, label: 'Pelanggan' },
  { to: '/reports', icon: BarChart3, label: 'Laporan' },
  { to: '/settings', icon: Settings, label: 'Pengaturan' },
];

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const filteredNav = isAdmin ? navItems : navItems.filter(n => ['/pos', '/products'].includes(n.to));

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600">🏪 Kasir</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1"><X size={20}/></button>
        </div>
        <nav className="p-4 space-y-1">
          {filteredNav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to==='/'} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`
              }>
              <Icon size={18}/>{label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggle} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm hover:bg-gray-200">
              {isDark ? <Sun size={14}/> : <Moon size={14}/>}
            </button>
            <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100">
              <LogOut size={14}/> Keluar
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}/>}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1"><Menu size={22}/></button>
          <h1 className="font-bold text-blue-600">🏪 Kasir Offline</h1>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
