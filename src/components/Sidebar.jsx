import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { MapPin, BarChart3, LogIn, Shield } from 'lucide-react';

export default function Sidebar() {
  const { isAdmin } = useAdmin();
  
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">🌿 EcoMap</h2>
      <nav className="flex-1 space-y-2">
        <Link to="/" className="flex items-center gap-2 p-2 hover:bg-green-100 rounded">
          <MapPin size={20} /> Ver mapa
        </Link>
        <Link to="/ranking" className="flex items-center gap-2 p-2 hover:bg-green-100 rounded">
          <BarChart3 size={20} /> Ver ranking
        </Link>
        {!isAdmin && (
          <Link to="/admin/login" className="flex items-center gap-2 p-2 hover:bg-green-100 rounded">
            <LogIn size={20} /> Entrar como admin
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="flex items-center gap-2 p-2 bg-green-200 rounded">
            <Shield size={20} /> Panel Admin
          </Link>
        )}
      </nav>
    </aside>
  );
}