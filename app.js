require('./config/config');
// Requires librerias personalizadas
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



//iniciamos las variables
var app = express();

//CORS
app.use(function(req, res, next) {


    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');


    next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Importar rutas para poder usarlas
var appRutas = require('./rutas/rutas');
var usuarioRutas = require('./rutas/usuario');
var loginRutas = require('./rutas/login');
var categoriaRutas = require('./rutas/categoria');
var articuloRutas = require('./rutas/articulo');
var busquedaRutas = require('./rutas/busqueda');
var cargarRutas = require('./rutas/cargar');
var uruapanRutas = require('./rutas/uruapan');
var imagenesRutas = require('./rutas/imagenes');
var uploadRutas = require('./rutas/upload');


//coneccion a base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;
    console.log(' Base de datos: \x1b[32m%s\x1b[0m ', ' online');

});

// RUTAS
app.use('/usuario', usuarioRutas);
app.use('/categoria', categoriaRutas);
app.use('/articulo', articuloRutas);
app.use('/login', loginRutas);
app.use('/busqueda', busquedaRutas);
app.use('/cargar', cargarRutas);

app.use('/img', imagenesRutas);
app.use('/uruapan', uruapanRutas);
app.use('/upload', uploadRutas);


app.use('/', appRutas);

//Escuchamos las peticiones
app.listen(process.env.PORT, () => {
    console.log('Expres Server puerto: \x1b[32m%s\x1b[0m ', process.env.PORT, ' online');
})