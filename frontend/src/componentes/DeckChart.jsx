import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { getVitoriasRapidas } from '../api/api';

const COLORS = ['#A020F0', '#5B2C6F', '#7D3C98', '#6C3483', '#884EA0', '#512E5F', '#76448A', '#4A235A'];

const DeckBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getVitoriasRapidas()
      .then((res) => {
        const formatado = res.map((item, index) => ({
          name: `Deck ${index + 1}`,
          winRate: item.winRate,
          totalBattles: item.totalBattles,
          fullDeck: item.deck[0].join(', ')
        }));
        setData(formatado);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="relative border border-purple-700 w-full md:w-[700px]  h-[510px]  bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-bold mb-6 text-center">
      Análise de decks que produziram mais de 50% de vitórias
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value, name) =>
              name === 'winRate'
                ? [`${value}%`, 'Win Rate']
                : [value, 'Total Battles']
            }
          />
          <Bar dataKey="winRate" barSize={70}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda com total de partidas e deck completo */}
      <div className="mt-6 text-xs">
        {data.map((entry, index) => (
          <div key={index} className="flex items-start gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full mt-1"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div>
              <span className="font-medium text-sm mb-2">{entry.name}: {entry.fullDeck}</span>{' '}
              <br />
              <span className="text-[12px]">Total de partidas: ({entry.totalBattles})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckBarChart;
