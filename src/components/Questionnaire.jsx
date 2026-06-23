import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Lightbox from './Lightbox';

export default function Questionnaire({ siteId, questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loadingOption, setLoadingOption] = useState({}); // { questionId: option }
  const [showImage, setShowImage] = useState({}); // { questionId: boolean }
  const [lightboxImage, setLightboxImage] = useState(null);

  const handleChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));

    const question = questions.find(q => q.id === questionId);
    if (question && question.order_num === 3) {
      // Iniciar preloader
      setLoadingOption(prev => ({ ...prev, [questionId]: option }));
      setShowImage(prev => ({ ...prev, [questionId]: false }));

      setTimeout(() => {
        setLoadingOption(prev => {
          const updated = { ...prev };
          delete updated[questionId];
          return updated;
        });
        setShowImage(prev => ({ ...prev, [questionId]: true }));
      }, 1500);
    }
  };

  const handleImageClick = (imageUrl) => {
    setLightboxImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const records = Object.entries(answers).map(([qId, opt]) => ({
      site_id: siteId,
      question_id: qId,
      selected_option: opt,
    }));

    const { error } = await supabase.from('answers').insert(records);
    if (!error) setSubmitted(true);
  };

  if (submitted) return <p className="text-green-600">✅ Respuestas enviadas. ¡Gracias!</p>;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => {
          const selectedOption = answers[q.id];
          const isThird = q.order_num === 3;
          const isLoading = loadingOption[q.id] !== undefined;
          const imageReady = showImage[q.id];
          const imageToShow =
            selectedOption && isThird && imageReady
              ? q[`image_${selectedOption.toLowerCase()}`]
              : null;

          return (
            <fieldset key={q.id} className="border p-3 rounded">
              <legend className="text-sm font-medium">{q.question_text}</legend>
              <div className="flex flex-col gap-2 mt-2">
                {['A', 'B', 'C'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt}
                      required
                      onChange={() => handleChange(q.id, opt)}
                      className="text-green-600"
                    />
                    {q[`option_${opt.toLowerCase()}`]}
                  </label>
                ))}
              </div>

              {/* Preloader */}
              {isLoading && (
                <div className="mt-3 flex items-center gap-2 text-gray-600 text-sm">
                  <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" />
                  Generando imagen...
                </div>
              )}

              {/* Imagen con barra "Pretensión de mejora" */}
              {imageToShow && (
                <div className="mt-3 rounded overflow-hidden border">
                  <div className="bg-green-700 text-white text-xs font-medium px-3 py-1">
                    Pretensión de mejora
                  </div>
                  <img
                    src={imageToShow}
                    alt={`Opción ${selectedOption}`}
                    className="w-full h-40 object-cover cursor-pointer hover:opacity-90"
                    onClick={() => handleImageClick(imageToShow)}
                  />
                </div>
              )}
            </fieldset>
          );
        })}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enviar respuestas
        </button>
      </form>

      {/* Lightbox exclusivo para imágenes de mejora */}
      <Lightbox
        imageUrl={lightboxImage}
        caption="Pretensión de mejora"
        onClose={() => setLightboxImage(null)}
      />
    </>
  );
}