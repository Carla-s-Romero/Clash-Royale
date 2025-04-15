import React, { useEffect, useState } from "react";
import { getVitoriasValkyrie } from "../api/api"; 

const CardVitoriasValkyrie = () => {
  const [vitorias, setVitorias] = useState(0);

  useEffect(() => {
    getVitoriasValkyrie()
      .then((res) => {
        if (res && res.length > 0) {
          setVitorias(res[0].qtdVitorias);
        } else {
          setVitorias(0);
        }
      })
      .catch((err) => {
        console.error(err);
        setVitorias(0);
      });
  }, []);
  

  return (
    <div className="w-80 p-4 rounded-xl border  h-[240px]  mb-4 border-purple-500 shadow-md text-center flex flex-col justify-between h-80">
      <div>
        <h2 className="font-bold text-lg">
          Vitórias com a carta Valkyrie
        </h2>
        <div className="text-5xl font-bold mt-10 mb-6text-6xl font-bold mt-10 mb-6 text-purple-700">
          {vitorias}
        </div>
      </div>
      <div className="text-xs text-left">
        <p>Carta usada: <strong>Valkyrie</strong></p>
        <p className="mt-2 text-gray-500 ">Critérios: Vitória com 3 coroas e oponente com menos de 2</p>
      </div>
    </div>
  );
};

export default CardVitoriasValkyrie;
