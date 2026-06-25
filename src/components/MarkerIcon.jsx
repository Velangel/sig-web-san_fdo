import L from 'leaflet';

export const createCircleIcon = (color) => {
  // Detectar si es móvil (ancho de ventana menor a 768px)
  const isMobile = window.innerWidth < 768;
  const size = isMobile ? 36 : 28;

  return L.divIcon({
    className: '',
    html: `<div style="
      background: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      opacity: 0.65;
      border: 1px solid white;
      box-shadow: 0 0 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};