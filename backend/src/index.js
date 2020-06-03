const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv-safe').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3333
mongoose.connect(process.env.DB_URL)
// teste para evitar o CORS
app.use(cors({
    origin : '*'
}))
app.use(express.json());
app.use(routes);
app.listen(port, () => console.log('server on port:', port));

