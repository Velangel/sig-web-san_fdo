import { useState } from 'react';
import MapView from '../components/MapView';
import SlidePanel from '../components/SlidePanel';

export default function HomePage() {
  const [selectedSite, setSelectedSite] = useState(null);
  const panelAbierto = selectedSite !== null;

  return (
    <div className="flex h-full">
      {/* Mapa */}
      <div className={`transition-all duration-300 ${panelAbierto ? 'md:w-[calc(100%-24rem)]' : 'w-full'}`}>
        <MapView onSiteClick={setSelectedSite} />
      </div>

      {/* Panel en escritorio (lateral) */}
      {panelAbierto && (
        <div className="hidden md:block w-96 bg-white shadow-2xl border-l overflow-y-auto" style={{ height: '100vh' }}>
          <SlidePanel
            site={selectedSite}
            onClose={() => setSelectedSite(null)}
          />
        </div>
      )}

      {/* Panel en móvil (pantalla completa) */}
      {panelAbierto && (
        <div className="fixed inset-0 z-[9000] bg-white overflow-y-auto md:hidden">
          <SlidePanel
            site={selectedSite}
            onClose={() => setSelectedSite(null)}
          />
        </div>
      )}
    </div>
  );
}