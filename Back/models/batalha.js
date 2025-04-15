// models/Batalha.js
const mongoose = require('mongoose');

const BatalhaSchema = new mongoose.Schema({}, { strict: false }); 

module.exports = mongoose.model('Batalha', BatalhaSchema, 'jogadas_royale'); 

