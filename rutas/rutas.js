// Requires librerias personalizadas
var express = require('express');


var app = express();


//RUTAS
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada'
    });
});

module.exports = app;