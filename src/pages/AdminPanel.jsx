import { useState } from 'react';
import MapView from '../components/MapView';
import SiteForm from '../components/SiteForm';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [editingSite, setEditingSite] = useState(null);
  const [newSiteCoords, setNewSiteCoords] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const panelAbierto = newSiteCoords || editingSite;

  const handleMapClick = (latlng) => {
    console.log('Clic en mapa:', latlng);
    setNewSiteCoords({ lat: latlng.lat, lng: latlng.lng });
    setEditingSite(null);
  };

  const handleSiteClick = (site) => {
    console.log('Clic en sitio:', site);
    setEditingSite(site);
    setNewSiteCoords(null);
  };

  const closeForm = () => {
    setNewSiteCoords(null);
    setEditingSite(null);
  };

  return (
    <div className="flex h-full">
      {/* Mapa: se ajusta automáticamente */}
      <div className={`transition-all duration-300 ${panelAbierto ? 'w-[calc(100%-24rem)]' : 'w-full'}`}>
        <MapView
          key={mapKey}
          onSiteClick={handleSiteClick}
          onMapClick={handleMapClick}
          adminMode={true}
        />
      </div>

      {/* Botón de prueba (siempre visible) */}
      <button
        onClick={() => {
          setNewSiteCoords({ lat: 7.8833, lng: -67.4667 });
          setEditingSite(null);
        }}
        className="fixed top-20 left-72 bg-blue-500 text-white px-3 py-1 rounded z-[2000]"
      >
        Mostrar formulario (test)
      </button>

      {/* Panel lateral, se muestra al lado del mapa */}
        {panelAbierto && (
        <div className="w-96 bg-white shadow-2xl border-l overflow-y-auto" style={{ height: '100vh' }}>
            <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingSite ? 'Editar sitio' : 'Nuevo sitio'}
              </h2>
              <button onClick={closeForm} className="text-gray-500 hover:text-black text-xl leading-none">
                ✕
              </button>
            </div>
            <SiteForm
              coords={newSiteCoords}
              site={editingSite}
              onClose={closeForm}
              onSave={() => {
                closeForm();
                setMapKey(prev => prev + 1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}