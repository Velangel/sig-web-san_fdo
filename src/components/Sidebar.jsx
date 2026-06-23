import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { MapPin, BarChart3, LogIn, Shield } from 'lucide-react';

export default function Sidebar() {
  const { isAdmin } = useAdmin();
  
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col p-4">
      
      <nav className="bg-neutral border-b border-green-800 mb-4">
      <div className='text-green-800 hover:text-green-600'>
      <h2 className="tracking-tight text-4xl font-bold whitespace-nowrap"><b>S.I.G</b></h2>
      <h2 className="tracking-tight text-1xl font-bold whitespace-nowrap mb-6">INFRAESTRUCTURA VERDE</h2>
      </div>
      </nav>
      {/*'#3A522C'*/}
      
      <nav className="flex-1 space-y-2">
        <Link to="/" className="flex items-center gap-2 p-2 hover:bg-green-700 hover:text-white font-semibold rounded-sm">
          <MapPin size={20} /> Mapa
        </Link>
        <Link to="/ranking" className="flex items-center gap-2 p-2 hover:bg-green-700 hover:text-white font-semibold rounded-sm">
          <BarChart3 size={20} /> Ranking
        </Link>
        {!isAdmin && (
          <Link to="/admin/login" className="flex items-center gap-2 p-2 hover:bg-green-700 hover:text-white font-semibold rounded-sm">
            <LogIn size={20} /> Panel de administrador
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="flex items-center gap-2 p-2 bg-green-200 rounded-sm">
            <Shield size={20} /> Panel Admin
          </Link>
        )}
      </nav>
    </aside>
  );
}