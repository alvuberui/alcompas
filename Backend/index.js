const express = require('express'); // Importar express
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config()


// Crear servidor de express
const app = express();

// Base de datos 
dbConnection();

// CORS
app.use(cors());

// Directorio público
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

/*
*    ---------------------Rutas--------------------
* 1) Usuarios
* 2) Bandas
* 3) Directivos
* 4) Músicos
* 5) Archiveros
* 6) Peticiones
* 7) Comentarios
* 8) Instrumentos
* 9) Estudios
*/
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bandas', require('./routes/bandas'));
app.use('/api/directivos', require('./routes/directivos'));
app.use('/api/musicos', require('./routes/musicos'));
app.use('/api/archiveros', require('./routes/archiveros'));
app.use('/api/peticiones', require('./routes/peticiones'));
app.use('/api/comentarios', require('./routes/comentarios'));
app.use('/api/instrumentos', require('./routes/instrumentos'));
app.use('/api/estudios', require('./routes/estudios'));

// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`)
})