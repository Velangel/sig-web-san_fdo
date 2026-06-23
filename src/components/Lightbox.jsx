import { X } from 'lucide-react';

export default function Lightbox({ imageUrl, caption, onClose }) {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-full bg-white rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior con caption y botón cerrar */}
        <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2">
          <span className="text-sm font-medium">{caption || 'Vista previa'}</span>
          <button onClick={onClose} className="hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <img
          src={imageUrl}
          alt={caption}
          className="max-h-[80vh] w-full object-contain"
        />
      </div>
    </div>
  );
}