//  =======================================
//  Requires librerias personalizadas
//  =======================================
var express = require('express');

//importamos la autentificacion para usar la función "verificaToken"
var mdAutentificacion = require('../middlewares/auntentificacion');

var app = express();

// Creamos la varialbe "Articulo" para importar los datos del formulario
var Articulo = require('../models/articulo');

//  =========================================
//  OBTENEMOS LOS ARTICULOS DE UNA CATEGORIA
//  =========================================
app.get('/:id', (req, res, next) => {
    var id = req.params.id;

    //DESDE tiene que ser variable numerica
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Articulo.find({ 'categoria': id })
        .skip(desde)
        //limit es para mostrar 5 articulos o los que se ocupen
        .limit(6)
        //mostramos el ultimo articulo publicado primero en la lista
        .sort({ _id: -1 })
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec(
            (err, articulos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }
                Articulo.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        articulos: articulos,
                        total: conteo
                    });
                })
            });
});

module.exports = app;