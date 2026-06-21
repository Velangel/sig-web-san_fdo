import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function SiteForm({ coords, site, onClose, onSave }) {
  // Datos del sitio
  const [name, setName] = useState(site?.name || '');
  const [temperature, setTemperature] = useState(site?.temperature || '');
  const [hasGreenInfra, setHasGreenInfra] = useState(site?.has_green_infra ?? true);
  const [existingPhotos, setExistingPhotos] = useState(site?.photos || []);
  const [newPhotoFiles, setNewPhotoFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Preguntas con posibles imágenes existentes
  const [questions, setQuestions] = useState(() => {
    if (site?.questions) {
      return site.questions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        image_a: q.image_a || null,
        image_b: q.image_b || null,
        image_c: q.image_c || null,
        order_num: q.order_num,
      }));
    }
    return [
      { order_num: 1, question_text: '', option_a: '', option_b: '', option_c: '', image_a: null, image_b: null, image_c: null },
      { order_num: 2, question_text: '', option_a: '', option_b: '', option_c: '', image_a: null, image_b: null, image_c: null },
      { order_num: 3, question_text: '', option_a: '', option_b: '', option_c: '', image_a: null, image_b: null, image_c: null },
    ];
  });

  // Estado para archivos nuevos de imágenes de opciones (solo para pregunta 3)
  const [newOptionImages, setNewOptionImages] = useState({
    3: { A: null, B: null, C: null }
  });

  const handleOptionImageChange = (orderNum, option, file) => {
    setNewOptionImages(prev => ({
      ...prev,
      [orderNum]: {
        ...prev[orderNum],
        [option]: file
      }
    }));
  };

  // Subir fotos del sitio
  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    setNewPhotoFiles((prev) => [...prev, ...files]);
  };

  const removeNewPhoto = (index) => {
    setNewPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (url) => {
    setExistingPhotos((prev) => prev.filter((p) => p !== url));
  };

  const uploadPhotos = async () => {
    const urls = [];
    for (const file of newPhotoFiles) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('site-photos').upload(fileName, file);
      if (error) throw error;
      const publicUrl = supabase.storage.from('site-photos').getPublicUrl(fileName).data.publicUrl;
      urls.push(publicUrl);
    }
    return urls;
  };

  const uploadOptionImage = async (file) => {
    if (!file) return null;
    const fileName = `${Date.now()}_option_${file.name}`;
    const { data, error } = await supabase.storage.from('site-photos').upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from('site-photos').getPublicUrl(fileName).data.publicUrl;
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const newUrls = await uploadPhotos();
      const allPhotos = [...existingPhotos, ...newUrls];

      let siteId = site?.id;

      if (site) {
        const { error } = await supabase
          .from('sites')
          .update({
            name,
            temperature: parseFloat(temperature),
            has_green_infra: hasGreenInfra,
            photos: allPhotos,
          })
          .eq('id', site.id);
        if (error) throw error;
      } else {
        const { data: newSite, error } = await supabase
          .from('sites')
          .insert({
            name,
            lat: coords.lat,
            lng: coords.lng,
            temperature: parseFloat(temperature),
            has_green_infra: hasGreenInfra,
            photos: allPhotos,
          })
          .select()
          .single();
        if (error) throw error;
        siteId = newSite.id;
      }

      // Guardar preguntas
      if (siteId) {
        await supabase.from('questions').delete().eq('site_id', siteId);

        const questionsToInsert = [];
        for (const q of questions) {
          if (q.question_text.trim() === '') continue;

          let imageA = q.image_a;
          let imageB = q.image_b;
          let imageC = q.image_c;

          // Si es la pregunta 3, subir las imágenes nuevas que se hayan seleccionado
          if (q.order_num === 3) {
            const newA = newOptionImages[3]?.A;
            const newB = newOptionImages[3]?.B;
            const newC = newOptionImages[3]?.C;
            if (newA) imageA = await uploadOptionImage(newA);
            if (newB) imageB = await uploadOptionImage(newB);
            if (newC) imageC = await uploadOptionImage(newC);
          }

          questionsToInsert.push({
            site_id: siteId,
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            image_a: imageA || null,
            image_b: imageB || null,
            image_c: imageC || null,
            order_num: q.order_num,
          });
        }

        if (questionsToInsert.length > 0) {
          const { error: qError } = await supabase.from('questions').insert(questionsToInsert);
          if (qError) throw qError;
        }
      }

      onSave();
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Ocurrió un error al guardar.');
    } finally {
      setUploading(false);
    }
  };

  // ---- RENDER ----
  const previewNewPhotos = newPhotoFiles.map((file, i) => (
    <div key={i} className="relative inline-block mr-2 mb-2">
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        className="h-20 w-32 object-cover rounded"
      />
      <button
        type="button"
        onClick={() => removeNewPhoto(i)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
      >
        <X size={14} />
      </button>
    </div>
  ));

  return (
    <div className="h-full bg-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {site ? 'Editar sitio' : 'Nuevo sitio'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        {/* Temperatura */}
        <div>
          <label className="block text-sm font-medium mb-1">Temperatura media (°C)</label>
          <input
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        {/* Infraestructura verde */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasGreenInfra}
            onChange={(e) => setHasGreenInfra(e.target.checked)}
            className="h-4 w-4 text-green-600"
          />
          <label className="text-sm">Cuenta con infraestructura verde</label>
        </div>

        {/* Coordenadas */}
        {coords && (
          <p className="text-xs text-gray-500">
            Coordenadas: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </p>
        )}

        {/* Fotos existentes */}
        {existingPhotos.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1">Fotos actuales</label>
            <div className="flex flex-wrap gap-2">
              {existingPhotos.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="" className="h-20 w-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(url)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subir nuevas fotos */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Agregar fotos del sitio
          </label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-sm flex items-center gap-1 border border-blue-200">
              <Upload size={16} />
              Seleccionar archivos
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddPhoto}
                className="hidden"
              />
            </label>
          </div>
          {newPhotoFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">{previewNewPhotos}</div>
          )}
        </div>

        <hr />

        {/* Preguntas */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Preguntas del cuestionario</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-4 p-3 border rounded bg-gray-50">
              <p className="text-sm font-medium mb-1">Pregunta {idx + 1}</p>
              <input
                type="text"
                placeholder="Texto de la pregunta"
                value={q.question_text}
                onChange={(e) => handleQuestionChange(idx, 'question_text', e.target.value)}
                className="w-full border rounded p-1.5 text-sm mb-2"
              />
              <div className="grid grid-cols-1 gap-1">
                <input
                  type="text"
                  placeholder="Opción A"
                  value={q.option_a}
                  onChange={(e) => handleQuestionChange(idx, 'option_a', e.target.value)}
                  className="border rounded p-1 text-sm"
                />
                <input
                  type="text"
                  placeholder="Opción B"
                  value={q.option_b}
                  onChange={(e) => handleQuestionChange(idx, 'option_b', e.target.value)}
                  className="border rounded p-1 text-sm"
                />
                <input
                  type="text"
                  placeholder="Opción C"
                  value={q.option_c}
                  onChange={(e) => handleQuestionChange(idx, 'option_c', e.target.value)}
                  className="border rounded p-1 text-sm"
                />
              </div>

              {/* SECCIÓN NUEVA: Imágenes para opciones (solo pregunta 3) */}
              {idx === 2 && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs font-medium text-gray-600">Imágenes para cada opción:</p>
                  {['A', 'B', 'C'].map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-4">{opt}</span>
                      {questions[idx][`image_${opt.toLowerCase()}`] && (
                        <img
                          src={questions[idx][`image_${opt.toLowerCase()}`]}
                          alt={`Opción ${opt}`}
                          className="h-10 w-16 object-cover rounded"
                        />
                      )}
                      <label className="cursor-pointer text-blue-600 text-sm hover:underline flex items-center gap-1">
                        <Upload size={14} />
                        {questions[idx][`image_${opt.toLowerCase()}`] ? 'Cambiar' : 'Subir'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleOptionImageChange(3, opt, e.target.files[0])
                          }
                          className="hidden"
                        />
                      </label>
                      {newOptionImages[3]?.[opt] && (
                        <span className="text-xs text-green-600">{newOptionImages[3][opt].name}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? 'Guardando...' : site ? 'Actualizar sitio' : 'Crear sitio'}
        </button>
      </form>
    </div>
  );
}