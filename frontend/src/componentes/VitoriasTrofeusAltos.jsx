import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { getVitoriasTrofeusAltos } from "../api/api";

const GraficoVitoriasComTrofeusAltos = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getVitoriasTrofeusAltos()
      .then((res) => {
        const topDecks = res.slice(0, 5).map((item, index) => ({
          nome: `Deck ${index + 1}`,
          wins: item.wins,
          losses: item.losses,
          deckCompleto: item.deck,
        }));
        setData(topDecks);
      })
      .catch((err) => {
        console.error("Erro ao buscar vitórias com troféus altos:", err);
      });
  }, []);

  return (
    <div className="w-full max-w-5xl p-4 rounded-xl border border-purple-500 shadow-md bg-white">
      <h2 className="text-xl font-bold text-center mb-6 mt-5">
        Desempenho dos decks com troféus
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip
            formatter={(value, name) =>
              name === "wins"
                ? [`${value}`, "Vitórias"]
                : [`${value}`, "Derrotas"]
            }
            labelFormatter={(label) => {
              const deck = data.find((d) => d.nome === label);
              return `Cartas: ${deck?.deckCompleto || label}`;
            }}
          />
          <Legend />
         
          <Bar dataKey="wins" stackId="a" fill="#a855f7" name="Vitórias" barSize={70} />
          <Bar dataKey="losses" stackId="a" fill="#c4b5fd" name="Derrotas"  barSize={70}  />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoVitoriasComTrofeusAltos;
