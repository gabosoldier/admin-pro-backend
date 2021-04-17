const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

//crea el servidor express
const app = express();

//configurar cors
app.use(cors());

/*
mean_user
july2803
*/
//base de datos
dbConnection();

//rutas
app.get( '/', (req, resp) => {
    resp.json({
        ok: true,
        msg: 'hola mundo'
    })
});

app.listen(process.env.PORT, () => {
    console.log('servidor ocrriendo en puerto: ' + process.env.PORT)
} );