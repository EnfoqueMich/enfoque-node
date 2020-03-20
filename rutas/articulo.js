//  =======================================
//  Requires librerias personalizadas
//  =======================================
var express = require('express');


//importamos la autentificacion para usar la función "verificaToken"
var mdAutentificacion = require('../middlewares/auntentificacion');

var app = express();
//importamos el la variable "Usuario" para sacar los datos del formulario
var Articulo = require('../models/articulo');




var Uruapan = require('../models/articulo');






//  =======================================
//  OBTENER TODOS LOS ARTICULOS
//  =======================================
app.get('/', (req, res, next) => {

    //DESDE tiene que ser variable numerica
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Articulo.find({})

    //Skip se salta los primeros 5 y nuestra los que siguen
    .skip(desde)
        //limit es para mostrar 5 articulos o los que se ocupen
        .limit(15)
        //mostramos el ultimo articulo publicado primero en la lista
        .sort({ _id: -1 })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre img')
        .exec(
            (err, articulos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar Articulos',
                        errors: err
                    });
                }

                //hacemos referencial modelo Artículo
                Articulo.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        articulos: articulos,
                        total: conteo
                    });
                });
            });
});


//  =======================================
//  OBTENER UN ARTICULO
//  =======================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Articulo.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('categoria')
        .exec((err, articulo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al buscar Artículo',
                    errors: err
                });
            }

            if (!articulo) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Artículo no existe',
                    errors: { message: 'No existe un Artículo con ese ID' }
                });
            }

            //si todo es correcto recibimos un artículo
            res.status(200).json({
                ok: true,
                articulo: articulo
            });


        });

});








//  =======================================
//  ACTUALIZAR ARTICULOS
//  =======================================
app.put('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Articulo.findById(id, (err, articulo) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar Artículo',
                errors: err
            });
        }

        if (!articulo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Artículo no existe',
                errors: { message: 'No existe un Artículo con ese ID' }
            });
        }

        //Obtenemos el titulo
        articulo.titulo = body.titulo;

        //Obtenemos el Sumario
        articulo.sumario = body.sumario;

        //Obtenemos la fecha de publicación
        articulo.fecha = body.fecha;

        //Obtenemos la pata de la imagen
        articulo.pata_imagen = body.pata_imagen;

        //Obtenemos el Artículo
        articulo.articulo = body.articulo;
        //Obtenemos el usuario que lo creó o modificó
        articulo.usuario = req.usuario._id;

        articulo.categoria = body.categoria;


        articulo.save((err, articuloGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al actualizar Artículo',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                articulo: articuloGuardado
            });
        });
    });
});






//  =======================================
//  CREAR NUEVO ARTICULOS
//  =======================================
//al intentar crear un Artículo pasará el parametro
//de verificar el token
app.post('/', mdAutentificacion.verificaToken, (req, res) => {

    var body = req.body;

    var articulo = new Articulo({
        titulo: body.titulo,
        sumario: body.sumario,
        fecha: body.fecha,
        pata_imagen: body.pata_imagen,
        articulo: body.articulo,

        usuario: req.usuario._id,
        categoria: body.categoria
    });

    articulo.save((err, articuloGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear un Artículo',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            articulo: articuloGuardado
        });
    });
});





//  =======================================
//  BORRAR UN ARTICULOS POR EL ID
//  =======================================
app.delete('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Articulo.findByIdAndRemove(id, (err, articuloBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al borrar el Artículo',
                errors: err
            });
        }

        if (!articuloBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un Artículo con ese id',
                errors: { message: 'No existe un Artículo' }
            });
        }
        res.status(201).json({
            ok: true,
            articulo: articuloBorrado
        });
    });
});

module.exports = app;