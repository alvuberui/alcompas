const express = require('express'); // Importar express
const cors = require('cors');
const { dbConnection } = require('./database/config');
const fileUpload = require('express-fileupload');
require('dotenv').config()
const mongoose = require("mongoose");

// Crear servidor de express
const app = express();
mongoose.set("strictQuery", false);
// Base de datos 
dbConnection();

// CORS
app.use(cors());

// Directorio público
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Fileupload - Carga de archivos
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

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
* 10) Foto
* 11) Redes Sociales
* 12) Noticias
* 13) Transacciones
* 14) Eventos
* 15) Likes
* 16) Asistencias
* 17) Contratados
* 18) Vestimentas
* 19) Préstamos
* 20) Repertorios
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
app.use('/api/fotos', require('./routes/uploads'));
app.use('/api/redes', require('./routes/redesSociales'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/transacciones', require('./routes/transacciones'));
app.use('/api/eventos', require('./routes/eventos'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/estadisticas', require('./routes/estadisticas'));
app.use('/api/asistencias', require('./routes/asistencias'));
app.use('/api/contratados', require('./routes/contratados'));
app.use('/api/vestimentas', require('./routes/vestimentas'));
app.use('/api/prestamos', require('./routes/prestamos'));
app.use('/api/repertorios', require('./routes/repertorios'));

// Escuchar peticiones
if (process.env.NODE_ENV !== 'test') {
    app.listen( process.env.PORT, () => {
        console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`)
    })
}

module.exports = {
    app
}