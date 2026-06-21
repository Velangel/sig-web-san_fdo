import L from 'leaflet';

export const createCircleIcon = (color, size = 20) => {
  return L.divIcon({
    className: '', // elimina estilos por defecto
    html: `<div style="
      background: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      opacity: 0.65;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};