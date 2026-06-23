import L from 'leaflet';

export const createCircleIcon = (color, size = 23) => {
  return L.divIcon({
    className: '',
    html: `<div style="
      background: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      opacity: 0.75;
      border: 2px solid white;
      box-shadow: 0 0 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};