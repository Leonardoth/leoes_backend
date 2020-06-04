const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv-safe').config();
const cors = require('cors');
const app = express();
console.log("Olha aqui: ", process.env.DB_URL)
// mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connect(process.env.DB_URL, () => { }, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {
        console.log(err);
    });
// teste para evitar o CORS
// app.use(cors({
//     origin : '*'
// }))
app.use(express.json());
app.use(routes);
app.listen(process.env.PORT || 3333);

