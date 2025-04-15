import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { getVitoriasTresCoroas } from "../api/api";

const GraficoVitoriasTresCoroas = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getVitoriasTresCoroas()
      .then((res) => {
        // Adiciona rótulo genérico: Deck 1, Deck 2...
        const formatado = res.slice(0, 10).map((item, index) => ({
          ...item,
          label: `Deck ${index + 1}`,
        }));
        setData(formatado);
      })
      .catch((err) => console.error("Erro ao buscar vitórias por 3 coroas:", err));
  }, []);

  return (
    <div className="w-full max-w-4xl p-4 rounded-xl border border-purple-500 shadow-md  bg-white">
      <h2 className="text-xl font-bold text-center mb-4 mt-5">
        Decks com mais vitórias por 3 coroas
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 50, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="label" width={100} />
          <Tooltip
            formatter={(value, name, props) => {
              const fullDeck = props.payload.deck;
              return [
                `${value} vitórias`,
                `Cartas: ${fullDeck}`
              ];
            }}
          />
          <Bar dataKey="winsWithThreeCrowns" fill="#8b5cf6" name="Vitórias por 3 coroas" barSize={50}>
            <LabelList dataKey="winsWithThreeCrowns" position="right" /> 
            
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoVitoriasTresCoroas;
