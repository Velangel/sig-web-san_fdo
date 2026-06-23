import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetchRanking();

    const channel = supabase
      .channel('ranking-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'answers' },
        () => fetchRanking()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchRanking() {
    // Obtenemos todas las respuestas con la pregunta y el sitio
    const { data } = await supabase
      .from('answers')
      .select(`
        site_id,
        sites!inner(name),
        question_id,
        selected_option,
        questions!inner(order_num)
      `)
      .eq('questions.order_num', 1); // asumimos que la pregunta 1 es "nivel de prioridad"

    if (!data) return;

    // Agrupar por sitio y calcular promedio de prioridad (A=3, B=2, C=1)
    const sitesMap = {};
    data.forEach((row) => {
      const siteId = row.site_id;
      if (!sitesMap[siteId]) {
        sitesMap[siteId] = { name: row.sites.name, total: 0, count: 0 };
      }
      const value = row.selected_option === 'A' ? 3 : row.selected_option === 'B' ? 2 : 1;
      sitesMap[siteId].total += value;
      sitesMap[siteId].count += 1;
    });

    const rankingArray = Object.entries(sitesMap).map(([id, vals]) => ({
      id,
      name: vals.name,
      avgPriority: vals.count ? (vals.total / vals.count).toFixed(2) : 0,
    }));
    rankingArray.sort((a, b) => b.avgPriority - a.avgPriority);
    setRanking(rankingArray);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🏆 Ranking de sitios</h1>
      {ranking.length === 0 ? (
        <p className="text-gray-500">Aún no hay respuestas.</p>
      ) : (
        <ol className="space-y-2">
          {ranking.map((item, idx) => (
            <li
              key={item.id}
              className="flex justify-between p-3 bg-white rounded-sm shadow-sm"
            >
              <span className="font-medium">
                {idx + 1}. {item.name}
              </span>
              <span className="text-sm text-gray-500">
                Prioridad media: {item.avgPriority}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}