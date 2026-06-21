import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Questionnaire from './Questionnaire';

export default function SlidePanel({ site, onClose }) {
  const [questions, setQuestions] = useState([]);
  
  useEffect(() => {
    if (site) {
      fetchQuestions(site.id);
    } else {
      setQuestions([]);
    }
  }, [site]);
  
  async function fetchQuestions(siteId) {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('site_id', siteId)
      .order('order_num');
    setQuestions(data || []);
  }
  
  if (!site) return null;
  
  return (
    <div className="w-96 bg-white shadow-2xl border-l overflow-y-auto" style={{ height: '100vh' }}>
      <div className="p-4">
        <button onClick={onClose} className="float-right text-gray-500 hover:text-black">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-2">{site.name}</h2>
        
        <p className="text-sm text-gray-600">📍 Lat: {site.lat.toFixed(5)}, Lng: {site.lng.toFixed(5)}</p>
        <p className="text-sm">🌡️ Temperatura media: {site.temperature} °C</p>
        
        {/* Galería de fotos */}
        <div className="flex gap-2 my-4 overflow-x-auto">
          {site.photos?.map((url, idx) => (
            <img key={idx} src={url} alt={`Foto ${idx+1}`} className="h-32 w-48 object-cover rounded" />
          ))}
        </div>
        
        <hr className="my-4" />
        <h3 className="font-semibold mb-2">📋 Cuestionario</h3>
        <Questionnaire siteId={site.id} questions={questions} />
      </div>
    </div>
  );
}