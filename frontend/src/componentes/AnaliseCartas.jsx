import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { getWinRateCartas } from "../api/api"; 

const GraficoWinRateCartas = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getWinRateCartas()
      .then((res) => setData(res))
      .catch((err) => {
        console.error("Erro ao buscar win rate das cartas:", err);
      });
  }, []);

  return (
    <div className="w-100 h-[500px] p-4 border border-purple-700 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center mr-4">
      <h2 className="text-lg font-bold text-center mb-10 mt-10">Top 10 cartas por Win Rate</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="carta" 
            angle={0} 
            textAnchor="end" 
            interval={0} 
            height={70}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="winRate" fill="#8b5cf6" name="Win Rate (%)" />
          <Bar dataKey="totalGames" fill="#BAACFF" name="Total de Partidas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoWinRateCartas;
