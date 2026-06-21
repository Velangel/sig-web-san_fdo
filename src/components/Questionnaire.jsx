import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Questionnaire({ siteId, questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((q) => {
        const selectedOption = answers[q.id];
        const isThirdQuestion = q.order_num === 3;
        const imageToShow =
          selectedOption && isThirdQuestion
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
            {/* Mostrar imagen si se seleccionó opción y es pregunta 3 */}
            {selectedOption && isThirdQuestion && imageToShow && (
              <div className="mt-3">
                <img
                  src={imageToShow}
                  alt={`Opción ${selectedOption}`}
                  className="w-full h-40 object-cover rounded border"
                />
              </div>
            )}
          </fieldset>
        );
      })}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Enviar respuestas
      </button>
    </form>
  );
}