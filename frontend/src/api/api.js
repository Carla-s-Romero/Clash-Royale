const API_BASE = 'http://localhost:3000/api/batalhas';

export const getWinrate = async () => {
  const res = await fetch(`${API_BASE}/vitorias`);
  return res.json();
};

export const getVitoriasRapidas = async () => {
  const res = await fetch(`${API_BASE}/rapidas`);
  return res.json();
};

export const getDerrotasPorCombo = async () => {
  const res = await fetch(`${API_BASE}/derrotas-com-combo`);
  return res.json();
};

export const getVitoriasValkyrie = async () => {
  const res = await fetch(`${API_BASE}/vitorias-valkyrie`);
  return res.json();
};

export const getDecksEficientes = async () => {
  const res = await fetch(`${API_BASE}/decks-eficientes`);
  return res.json();
};

export const getWinRateCartas = async () => {
  const res = await fetch(`${API_BASE}/winrate-cartas-trophychange`);
  return res.json();
};

export const getVitoriasTresCoroas  = async () => {
  const res = await fetch(`${API_BASE}/vitorias-3coroas`);
  return res.json();
};

export const getVitoriasTrofeusAltos  = async () => {
  const res = await fetch(`${API_BASE}/vitorias-trofeus-altos`);
  return res.json();
};