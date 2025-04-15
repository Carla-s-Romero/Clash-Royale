import React, { useEffect, useState } from "react";
import { getDecksEficientes } from "../api/api"; 
import valkyrie from "../img/valquiria-clash-royale-tropa.png"; 

const CardDeckEficiente = () => {
  const [deckInfo, setDeckInfo] = useState(null);

  useEffect(() => {
    getDecksEficientes()
      .then((res) => {
        if (res && res.length > 0) {
          setDeckInfo(res[0]); // Pega o deck com maior winrate
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar deck eficiente:", err);
      });
  }, []);

  return (
    <div className="w-80 p-4 rounded-xl border border-purple-500 shadow-md text-center flex flex-col h-[512px] mb-4 mr-4">
      <div>
        <h2 className="font-bold text-lg mb-4">
          Deck mais eficiente<br />no período analisado
        </h2>

        {deckInfo ? (
         <>
        <div>

      <div className="text-4xl pt-2 text-purple-700 font-bold mb-1">
        {deckInfo.wins} vitórias
      </div>
      <div className="text-sm text-gray-600 mb-2">
        {deckInfo.total} partidas • {deckInfo.winRate.toFixed(1)}% WR
      </div>
      <ul className="text-xs text-left mb-2">
        {deckInfo.deck.map((card, index) => (
          <li key={index}>• {card}</li>
        ))}
      </ul>
    </div>
    <img
      className="w-[200px] mx-auto mt-2"
      src={valkyrie}
      alt="valkyrie"
    />
  </>
) : (
  <div className="text-sm text-gray-500">Carregando...</div>
)}

        
      </div>
    </div>
  );
};

export default CardDeckEficiente;
