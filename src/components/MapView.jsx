import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { supabase } from '../lib/supabaseClient';
import { createCircleIcon } from './MarkerIcon';

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function MapView({ onSiteClick, onMapClick, adminMode }) {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    const { data } = await supabase.from('sites').select('*');
    setSites(data || []);
  }

  return (
    <MapContainer center={[7.8833, -67.4667]} zoom={14} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {adminMode && <MapClickHandler onClick={onMapClick} />}

      {sites.map(site => (
        <Marker
          key={site.id}
          position={[site.lat, site.lng]}
          icon={createCircleIcon(site.has_green_infra ? '#22c55e' : '#ef4444')}
          eventHandlers={{ click: () => onSiteClick(site) }}
        />
      ))}
    </MapContainer>
  );
}