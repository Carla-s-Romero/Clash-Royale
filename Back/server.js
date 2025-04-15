// server.js
const express = require('express');
const mongoose = require('mongoose');
const batalhaRoutes = require('./routes/batalhaRoutes');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());


require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('Mongo conectado'))
.catch(err => console.error('Erro ao conectar no Mongo:', err));

app.use('/api/batalhas', batalhaRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
