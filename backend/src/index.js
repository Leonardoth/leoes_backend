const express = require('express');
const MongoClient = require('mongodb').MongoClient
const routes = require('./routes');
require('dotenv-safe').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3333
// teste para evitar o CORS
async function _connection() {
    const client = await new MongoClient(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology : true})
    client.connect()
}
_connection()
app.use(cors({
    origin : '*'
}))
app.use(express.json());
app.use(routes);
app.listen(port, () => console.log('server on port:', port));

