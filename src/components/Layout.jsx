import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Menu } from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar en escritorio (siempre visible) */}
      <div className="hidden md:flex">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Sidebar móvil (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[9998] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full bg-white shadow-xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Botón hamburguesa (solo en móviles) */}
      <button
        className="md:hidden fixed top-4 left-4 z-[9999] bg-white p-2 rounded shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

        <main className="flex-1 relative">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}