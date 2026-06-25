import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { MapPin, BarChart3, LogIn, Shield, X } from 'lucide-react';

export default function Sidebar({ onClose }) {
  const { isAdmin } = useAdmin();

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col p-4 h-full relative">
      {/* Botón cerrar (solo en móvil, visible gracias al padre) */}
      <button
        className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-black"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      <nav className="bg-neutral border-b border-green-800 mt-12 mb-4">
      <div className="bg-neutral border-b border-green-800 mt-3 mb-4"></div>
      <div className='text-green-800 hover:text-green-600'>
      <h2 className="tracking-tight text-4xl font-bold whitespace-nowrap"><b>S.I.G</b></h2>
      <h2 className="tracking-tight text-1xl font-bold whitespace-nowrap mb-6">INFRAESTRUCTURA VERDE</h2>
      </div>
      </nav>
      {/*'#3A522C'*/}
      
      <nav className="flex-1 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 p-2 hover:bg-green-700 hover:text-white font-semibold rounded-sm"
          onClick={onClose}
        >
          <MapPin size={20} /> Mapa
        </Link>
        <Link
          to="/ranking"
          className="flex items-center gap-2 p-2 hover:bg-green-700 hover:text-white font-semibold rounded-sm"
          onClick={onClose}
        >
          <BarChart3 size={20} /> Ranking
        </Link>
        {!isAdmin && (
          <Link
            to="/admin/login"
            className="flex items-center gap-2 p-2 hover:bg-green-700 hover:text-white font-semibold rounded-sm"
            onClick={onClose}
          >
            <LogIn size={20} /> Panel de administrador
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-2 p-2 hover:bg-green-700 hover:text-white font-semibold rounded-sm"
            onClick={onClose}
          >
            <Shield size={20} /> Panel Admin
          </Link>
        )}
      </nav>
    </aside>
  );
}