import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export default function AdminLogin() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(user, pass)) {
      navigate('/admin');
    } else {
      setError('Credenciales inválidas');
    }
  };
  
  return (
    <div className="flex items-center justify-center h-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-sm shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Acceso Admin</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input type="text" placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)}
          className="w-full border p-2 mb-2 rounded-sm" />
        <input type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)}
          className="w-full border p-2 mb-4 rounded-sm" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-sm">Entrar</button>
      </form>
    </div>
  );
}