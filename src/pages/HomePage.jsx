import { useState } from 'react';
import MapView from '../components/MapView';
import SlidePanel from '../components/SlidePanel';

export default function HomePage() {
  const [selectedSite, setSelectedSite] = useState(null);

  const panelAbierto = selectedSite !== null;

  return (
    <div className="flex h-full">
      {/* Mapa: se ajusta cuando el panel está abierto */}
      <div className={`transition-all duration-300 ${panelAbierto ? 'w-[calc(100%-24rem)]' : 'w-full'}`}>
        <MapView onSiteClick={setSelectedSite} />
      </div>

      {/* Panel lateral, se muestra al lado del mapa */}
      {panelAbierto && (
        <div className="w-96 bg-white shadow-2xl border-l overflow-y-auto h-full">
          <SlidePanel
            site={selectedSite}
            onClose={() => setSelectedSite(null)}
          />
        </div>
      )}
    </div>
  );
}