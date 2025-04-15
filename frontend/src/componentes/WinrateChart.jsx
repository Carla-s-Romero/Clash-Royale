import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getWinrate } from '../api/api';
import BalloonImg from '../img/Ballon.png';

const COLORS = ['#B2F5BB', '#FFA3A3']; // verde claro e vermelho pastel

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const color = index === 0 ? '#4CAF50' : '#E53935';

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const WinrateChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWinrate()
    .then((res) => {
      const normalized = res.map((item) => ({
        ...item,
        resultado: item.resultado.toLowerCase(), 
      }));
    
      const ordered = [
        normalized.find((item) => item.resultado.includes('vit')),
        normalized.find((item) => item.resultado.includes('der')),
      ].filter(Boolean); 
    
      setData(ordered);
      setLoading(false);
    })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Carregando gráfico...</p>;

  return (
    <div className="relative border border-purple-700 w-full md:w-[400px] h-[510px] bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">
        Porcentagem de vitórias e derrotas
      </h2>

      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            dataKey="percentual"
            nameKey="resultado"
            cx="50%"
            cy="50%"
            outerRadius={100}
            labelLine={false}
            label={CustomLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda manual */}
      <div className="flex justify-between mt-5 text-sm px-2">
        <div className='ml-20'>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-[#B2F5BB]" />
            <span>Vitória</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFA3A3]" />
            <span>Derrota</span>
          </div>
        </div>
        <div className="text-right text-xs">
          <p className='mb-2'>Data início: 10 de abril</p>
          <p>Data Final: 12 de julho</p>
        </div>
      </div>

      {/* Imagem no canto inferior esquerdo */}
      <img
        src={BalloonImg}
        alt="Balloon"
        className="absolute bottom-2 left-2 w-50 h-auto"
      />
    </div>
  );
};

export default WinrateChart;
