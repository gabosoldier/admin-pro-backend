const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

//crea el servidor express
const app = express();

//configurar cors
app.use(cors());

//lectura body
app.use(express.json());

/*
mean_user
july2803
*/
//base de datos
dbConnection();

//rutas
app.use('/api/usuarios', require('./routes/usuarios') );
app.use('/api/login', require('./routes/auth') );


app.listen(process.env.PORT, () => {
    console.log('servidor ocrriendo en puerto: ' + process.env.PORT)
} );