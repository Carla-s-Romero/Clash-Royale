const express = require('express');
const router = express.Router();

const { consultaDecksVencedores, 
        consultaVitoriasRapidas,
        derrotasComCombo, 
        vitoriasDominantesValkyrie, 
        decksMaisEficientes, 
        winRateCartasPorTrophyChange,
        vitoriasComTresCoroas,
        vitoriasComTrofeusAltos} = require('../controllers/batalhaController');

router.get('/vitorias', consultaDecksVencedores);      

router.get('/rapidas', consultaVitoriasRapidas);          

router.get('/derrotas-com-combo', derrotasComCombo);


router.get('/vitorias-valkyrie', vitoriasDominantesValkyrie);

router.get('/decks-eficientes', decksMaisEficientes);

router.get('/winrate-cartas-trophychange', winRateCartasPorTrophyChange);

router.get('/vitorias-3coroas', vitoriasComTresCoroas);

router.get('/vitorias-trofeus-altos', vitoriasComTrofeusAltos);


module.exports = router;
