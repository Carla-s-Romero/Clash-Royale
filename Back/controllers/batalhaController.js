const mongoose = require('mongoose');

// Consulta 1: Winrate usando carta específica (ex: Balloon)
const consultaDecksVencedores = async (req, res) => {
  try {
    const resultado = await mongoose.connection.db.collection('jogadas_royale').aggregate([
        { 
            "$match": { 
              "battleTime": { 
                "$gte": "20250410T000000.000Z", 
                "$lte": "20250712T235959.000Z" 
              }, 
              "team.cards.name": "Balloon" 
            }
          }, 
          { 
            "$addFields": { 
              "isWin": { 
                "$gt": [ 
                  { "$arrayElemAt": ["$team.trophyChange", 0] }, 
                  0 
                ] 
              } 
            } 
          }, 
          { 
            "$group": { 
              "_id": "$isWin", 
              "count": { "$sum": 1 } 
            } 
          }, 
          { 
            "$group": { 
              "_id": null, 
              "total": { "$sum": "$count" }, 
              "results": { 
                "$push": { 
                  "win": "$_id", 
                  "count": "$count" 
                } 
              } 
            } 
          }, 
          { 
            "$unwind": "$results" 
          }, 
          { 
            "$project": { 
              "_id": 0, 
              "resultado": { 
                "$cond": { 
                  "if": "$results.win", 
                  "then": "Vitórias", 
                  "else": "Derrotas" 
                } 
              }, 
              "percentual": { 
                "$round": [ 
                  { 
                    "$multiply": [ 
                      { "$divide": ["$results.count", "$total"] }, 
                      100 
                    ] 
                  }, 
                  2 
                ] 
              },
              "inicio_periodo": { "$literal": "20250410T000000.000Z" },
              "fim_periodo": { "$literal": "20250712T235959.000Z" }
            } 
          } 
    ]).toArray();

    res.json(resultado);

  } catch (err) {
    console.error("Erro na consulta de decks vencedores:", err);
    res.status(500).json({ erro: "Erro na consulta" });
  }
};

// Liste os decks completos que produziram mais de X% (parâmetro) de vitórias ocorridas em um intervalo de timestamps (parâmetro).
const consultaVitoriasRapidas = async (req, res) => {
    try {
      // Pega os parâmetros de data do query string ou usa padrão
      const { inicio, fim, minWinRate } = req.query;
  
      const dataInicio = new Date(inicio || "2025-04-11T00:00:00Z");
      const dataFim = new Date(fim || "2025-12-12T23:59:59Z");
      const winRateMinima = parseFloat(minWinRate) || 50;
  
      const resultado = await mongoose.connection.db.collection('jogadas_royale').aggregate([
        {
          $addFields: {
            battleISO: {
              $dateFromString: {
                dateString: "$battleTime",
                format: "%Y%m%dT%H%M%S.%LZ"
              }
            }
          }
        },
        {
          $match: {
            battleISO: {
              $gte: dataInicio,
              $lte: dataFim
            }
          }
        },
        {
          $project: {
            deck: "$team.cards.name",
            isVictory: { $gt: ["$team.0.trophyChange", 0] }
          }
        },
        {
          $group: {
            _id: "$deck",
            totalBattles: { $sum: 1 },
            victories: { $sum: { $cond: ["$isVictory", 1, 0] } }
          }
        },
        {
          $project: {
            winRate: { $multiply: [{ $divide: ["$victories", "$totalBattles"] }, 100] },
            deck: "$_id",
            totalBattles: 1
          }
        },
        {
          $match: {
            winRate: { $gt: winRateMinima }
          }
        },
        {
          $sort: { winRate: -1 }
        },
        {
          $project: {
            _id: 0,
            winRate: { $round: ["$winRate", 2] },
            deck: ["$deck"],
            totalBattles: 1,
            dataInicio: { $literal: dataInicio },
            dataFim: { $literal: dataFim }
          }
        }
      ]).toArray();
  
      res.json(resultado);
    } catch (err) {
      console.error("Erro na consulta de vitórias rápidas:", err);
      res.status(500).json({ erro: "Erro na consulta" });
    }
  };
  
 
// Consulta: Derrotas com um combo específico
const derrotasComCombo = async (req, res) => {
  try {
    const resultado = await mongoose.connection.db.collection('jogadas_royale').aggregate([
      // Converte a string battleTime para data real
      {
        $addFields: {
          battleDate: {
            $dateFromString: {
              dateString: "$battleTime",
              format: "%Y%m%dT%H%M%S.%LZ"
            }
          }
        }
      },

      // Filtra pelo intervalo de datas desejado
      {
        $match: {
          battleDate: {
            $gte: new Date("2025-04-11T00:00:00Z"),
            $lte: new Date("2025-04-20T23:59:59Z")
          }
        }
      },

      // Extrai team e opponent
      {
        $project: {
          team: { $arrayElemAt: ["$team", 0] },
          opponent: { $arrayElemAt: ["$opponent", 0] },
          battleDate: 1
        }
      },

      // Identifica vencedor e perdedor
      {
        $addFields: {
          winner: {
            $cond: {
              if: { $gt: ["$team.crowns", "$opponent.crowns"] },
              then: "$team",
              else: "$opponent"
            }
          },
          loser: {
            $cond: {
              if: { $gt: ["$team.crowns", "$opponent.crowns"] },
              then: "$opponent",
              else: "$team"
            }
          }
        }
      },

      // Extrai nomes das cartas do perdedor
      {
        $addFields: {
          loserCardNames: {
            $map: {
              input: "$loser.cards",
              as: "card",
              in: "$$card.name"
            }
          }
        }
      },

      // Filtra se o perdedor usou todas as cartas do combo
      {
        $match: {
          loserCardNames: {
            $all: [
              "Barbarian Barrel",
              "Boss Bandit",
              "Electro Giant",
              "Executioner",
              "Goblin Cage",
              "Guards",
              "Ice Wizard",
              "Tornado"
            ]
          }
        }
      },

      // Agrupa resultado geral: total de derrotas, data mínima e máxima
      {
        $group: {
          _id: null,
          qtdDerrotasComCombo: { $sum: 1 },
          dataInicio: { $min: "$battleDate" },
          dataFinal: { $max: "$battleDate" }
        }
      },

      // Formata datas como string
      {
        $project: {
          _id: 0,
          qtdDerrotasComCombo: 1,
          dataInicio: {
            $dateToString: { format: "%Y-%m-%d", date: "$dataInicio" }
          },
          dataFinal: {
            $dateToString: { format: "%Y-%m-%d", date: "$dataFinal" }
          }
        }
      }
    ]).toArray();

    res.json(resultado[0] || {
      qtdDerrotasComCombo: 0,
      dataInicio: null,
      dataFinal: null
    });

  } catch (error) {
    console.error("Erro na consulta de derrotas com combo:", error);
    res.status(500).json({ error: "Erro ao processar a consulta." });
  }
};


// Consulta: Vitórias dominantes com Valkyrie
const vitoriasDominantesValkyrie = async (req, res) => {
  try {
    const resultado = await mongoose.connection.db.collection('jogadas_royale').aggregate([
      {
        $project: {
          team: { $arrayElemAt: ["$team", 0] },
          opponent: { $arrayElemAt: ["$opponent", 0] }
        }
      },
      {
        $addFields: {
          winner: {
            $cond: {
              if: { $gt: ["$team.crowns", "$opponent.crowns"] },
              then: "$team",
              else: "$opponent"
            }
          },
          loser: {
            $cond: {
              if: { $gt: ["$team.crowns", "$opponent.crowns"] },
              then: "$opponent",
              else: "$team"
            }
          }
        }
      },
      {
        $match: {
          "winner.startingTrophies": { $gt: 0 },
          "loser.startingTrophies": { $gt: 0 }
        }
      },
      {
        $addFields: {
          trophyDiffPercent: {
            $divide: ["$winner.startingTrophies", "$loser.startingTrophies"]
          },
          winnerCards: {
            $map: {
              input: "$winner.cards",
              as: "card",
              in: "$$card.name"
            }
          }
        }
      },
      {
        $match: {
          "winner.crowns": 3,
          "loser.crowns": { $lt: 2 },
          winnerCards: { $in: ["Valkyrie"] }
        }
      },
      {
        $count: "qtdVitorias"
      }
    ]).toArray();

    res.json(resultado);
  } catch (err) {
    console.error("Erro ao buscar vitórias dominantes com Valkyrie:", err);
    res.status(500).json({ erro: "Erro na consulta" });
  }
};

// Consulta: Decks mais eficientes no período
const decksMaisEficientes = async (req, res) => {
  try {
    const resultado = await mongoose.connection.db.collection('jogadas_royale').aggregate([
      {
        $addFields: {
          battleDate: {
            $dateFromString: {
              dateString: "$battleTime",
              format: "%Y%m%dT%H%M%S.%LZ"
            }
          }
        }
      },
      {
        $match: {
          battleDate: {
            $gte: new Date("2025-04-10T00:00:00Z"),
            $lte: new Date("2025-04-12T23:59:59Z")
          }
        }
      },
      {
        $project: {
          isWin: {
            $gt: [{ $arrayElemAt: ["$team.trophyChange", 0] }, 0]
          },
          deck: {
            $map: {
              input: { $arrayElemAt: ["$team.cards", 0] },
              as: "card",
              in: "$$card.name"
            }
          }
        }
      },
      {
        $match: {
          $expr: { $eq: [{ $size: "$deck" }, 8] } // ← Tamanho do deck (ex: 8)
        }
      },
      {
        $group: {
          _id: "$deck",
          total: { $sum: 1 },
          wins: {
            $sum: { $cond: ["$isWin", 1, 0] }
          }
        }
      },
      {
        $project: {
          deck: "$_id",
          total: 1,
          wins: 1,
          winRate: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $multiply: [{ $divide: ["$wins", "$total"] }, 100] }
            ]
          },
          _id: 0
        }
      },
      {
        $match: {
          winRate: { $gt: 20 } // ← Taxa mínima de vitória (ex: 60%)
        }
      },
      {
        $sort: { winRate: -1 }
      }
    ]).toArray();

    res.json(resultado);
  } catch (err) {
    console.error("Erro ao buscar decks mais eficientes:", err);
    res.status(500).json({ erro: "Erro na consulta" });
  }
};

// Consulta: Taxa de vitória por carta (baseada em trophyChange)
const winRateCartasPorTrophyChange = async (req, res) => {
  try {
    const resultado = await mongoose.connection.db.collection('jogadas_royale').aggregate([
      {
        $project: {
          team: { $arrayElemAt: ["$team", 0] },
          isWin: {
            $gt: [{ $arrayElemAt: ["$team.trophyChange", 0] }, 0]
          }
        }
      },
      {
        $project: {
          isWin: 1,
          cardNames: { $map: { input: "$team.cards", as: "c", in: "$$c.name" } }
        }
      },
      { $unwind: "$cardNames" },
      {
        $group: {
          _id: "$cardNames",
          totalGames: { $sum: 1 },
          wins: { $sum: { $cond: ["$isWin", 1, 0] } }
        }
      },
      {
        $project: {
          carta: "$_id",
          totalGames: 1,
          wins: 1,
          winRate: {
            $cond: [
              { $eq: ["$totalGames", 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$wins", "$totalGames"] }, 100] }, 1] }
            ]
          },
          _id: 0
        }
      },
      { $sort: { winRate: -1, totalGames: -1 } },
      { $limit: 10 }
    ]).toArray();

    res.json(resultado);
  } catch (err) {
    console.error("Erro ao calcular winRate baseado em trophyChange:", err);
    res.status(500).json({ erro: "Erro na consulta" });
  }
};

// Consulta: Decks com mais vitórias por 3 coroas
const vitoriasComTresCoroas = async (req, res) => {
  try {
    const resultado = await mongoose.connection.db.collection('jogadas_royale').aggregate([
      {
        $project: {
          team: { $arrayElemAt: ["$team", 0] },
          opponent: { $arrayElemAt: ["$opponent", 0] }
        }
      },
      {
        $addFields: {
          winner: {
            $cond: {
              if: { $gt: ["$team.crowns", "$opponent.crowns"] },
              then: "$team",
              else: "$opponent"
            }
          },
          loser: {
            $cond: {
              if: { $gt: ["$team.crowns", "$opponent.crowns"] },
              then: "$opponent",
              else: "$team"
            }
          }
        }
      },
      {
        $match: {
          "winner.crowns": 3
        }
      },
      {
        $addFields: {
          winnerDeck: {
            $reduce: {
              input: {
                $sortArray: {
                  input: {
                    $map: {
                      input: "$winner.cards",
                      as: "c",
                      in: "$$c.name"
                    }
                  },
                  sortBy: 1
                }
              },
              initialValue: "",
              in: {
                $cond: [
                  { $eq: ["$$value", ""] },
                  "$$this",
                  { $concat: ["$$value", ",", "$$this"] }
                ]
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$winnerDeck",
          winsWithThreeCrowns: { $sum: 1 }
        }
      },
      {
        $project: {
          deck: "$_id",
          winsWithThreeCrowns: 1,
          _id: 0
        }
      },
      {
        $sort: { winsWithThreeCrowns: -1 }
      }
    ]).toArray();

    res.json(resultado);
  } catch (err) {
    console.error("Erro ao analisar vitórias com 3 coroas:", err);
    res.status(500).json({ erro: "Erro na consulta" });
  }
};

// Consulta: Análise de vitórias com troféus altos
const vitoriasComTrofeusAltos = async (req, res) => {
  try {
    const resultado = await mongoose.connection.db.collection('jogadas_royale').aggregate([
      {
        $project: {
          team: { $arrayElemAt: ["$team", 0] },
          opponent: { $arrayElemAt: ["$opponent", 0] }
        }
      },
      {
        $addFields: {
          winner: {
            $cond: {
              if: { $gt: ["$team.crowns", "$opponent.crowns"] },
              then: "$team",
              else: "$opponent"
            }
          },
          loser: {
            $cond: {
              if: { $gt: ["$team.crowns", "$opponent.crowns"] },
              then: "$opponent",
              else: "$team"
            }
          }
        }
      },
      {
        $match: {
          "winner.startingTrophies": { $gte: 6000 }
        }
      },
      {
        $addFields: {
          winnerDeck: {
            $reduce: {
              input: {
                $sortArray: {
                  input: { $map: { input: "$winner.cards", as: "c", in: "$$c.name" } },
                  sortBy: 1
                }
              },
              initialValue: "",
              in: {
                $cond: [
                  { $eq: ["$$value", ""] },
                  "$$this",
                  { $concat: ["$$value", ",", "$$this"] }
                ]
              }
            }
          },
          loserDeck: {
            $reduce: {
              input: {
                $sortArray: {
                  input: { $map: { input: "$loser.cards", as: "c", in: "$$c.name" } },
                  sortBy: 1
                }
              },
              initialValue: "",
              in: {
                $cond: [
                  { $eq: ["$$value", ""] },
                  "$$this",
                  { $concat: ["$$value", ",", "$$this"] }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          allDecks: [
            { deck: "$winnerDeck", result: "win" },
            { deck: "$loserDeck", result: "loss" }
          ]
        }
      },
      { $unwind: "$allDecks" },
      {
        $group: {
          _id: "$allDecks.deck",
          wins: {
            $sum: { $cond: [{ $eq: ["$allDecks.result", "win"] }, 1, 0] }
          },
          losses: {
            $sum: { $cond: [{ $eq: ["$allDecks.result", "loss"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          deck: "$_id",
          wins: 1,
          losses: 1,
          total: { $add: ["$wins", "$losses"] },
          winRate: {
            $cond: [
              { $eq: [{ $add: ["$wins", "$losses"] }, 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$wins", { $add: ["$wins", "$losses"] }] }, 100] }, 2] }
            ]
          },
          _id: 0
        }
      },
      { $sort: { winRate: -1, wins: -1 } }
    ]).toArray();

    res.json(resultado);
  } catch (err) {
    console.error("Erro na análise de vitórias com troféus altos:", err);
    res.status(500).json({ erro: "Erro na consulta" });
  }
};



module.exports = {
  consultaDecksVencedores,
  consultaVitoriasRapidas,
  derrotasComCombo,
  vitoriasDominantesValkyrie,
  decksMaisEficientes,
  winRateCartasPorTrophyChange,
  vitoriasComTresCoroas,
  vitoriasComTrofeusAltos
};
