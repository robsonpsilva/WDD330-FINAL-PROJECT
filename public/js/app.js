const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const apiRoutes = require('./routes/api');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
