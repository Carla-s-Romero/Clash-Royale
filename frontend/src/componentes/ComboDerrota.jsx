import React, { useEffect, useState } from "react";
import { getDerrotasPorCombo } from "../api/api";

const CardDerrotasCombo = () => {
  const [dados, setDados] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const resultado = await getDerrotasPorCombo();
      setDados(resultado);

    };
    fetchData();
  }, []);

  return (
    <div className="w-80 p-4 rounded-xl border  h-[250px]  mb-4 border-purple-500 shadow-md text-center flex flex-col justify-between h-80">
      <div>
        <h2 className="font-bold text-lg">
          Quantidade de derrotas<br />utilizando o combo de cartas
        </h2>
        <div className="text-6xl font-bold mt-10 mb-6 text-purple-700">
          {dados ? dados.qtdDerrotasComCombo : 0}
        </div>
      </div>
      <div className="text-xs text-left">
        <p>Combo: Barbarian Barrel,
              Boss Bandit,
              Electro Giant,
              Executioner,
              Goblin Cage,
              Guards,
              Ice Wizard,
              Tornado</p>
      </div>
    </div>
  );
};

export default CardDerrotasCombo;
