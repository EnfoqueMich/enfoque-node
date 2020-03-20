//  =======================================
//  Requires librerias personalizadas
//  =======================================
var express = require('express');


//importamos la autentificacion para usar la función "verificaToken"
var mdAutentificacion = require('../middlewares/auntentificacion');

var app = express();
//importamos el la variable "Usuario" para sacar los datos del formulario
var Categoria = require('../models/categoria');

//  =======================================
//  OBTENER TODOS LOS CATEGORIA
//  =======================================
app.get('/', (req, res, next) => {
    //DESDE tiene que ser variable numerica
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Categoria.find({})

    //Skip se salta los primeros 5 y nuestra los que siguen
    .skip(desde)

    //mostramos el ultimo articulo publicado primero en la lista
    .sort({ _id: -1 })
        //limit es para mostrar 5 articulos o los que se ocupen
        .limit(20)
        .populate('usuario', 'nombre email')
        .exec(
            (err, categorias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar Categoría',
                        errors: err
                    });
                }
                //hacemos referencial modelo Usuario
                Categoria.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        categorias: categorias,
                        total: conteo
                    });
                });

            });
});











//  =======================================
//  OBTENER CATEGORIAS POR EL ID
//  =======================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Categoria.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar categoria',
                    errors: err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La Categoría con el id' + id + 'no existe',
                    errors: { message: 'No existe una Categoría' }

                });
            }
            res.status(200).json({
                ok: true,
                categoria: categoria
            });

        });
});













//  =======================================
//  ACTUALIZAR CATEGORIA
//  =======================================
app.put('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar categoría',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoría no existe',
                errors: { message: 'No existe una Categoría con ese ID' }
            });
        }

        categoria.nombre = body.nombre;
        categoria.usuario = req.usuario._id;


        categoria.save((err, categoriaGuardada) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al actualizar Categoria',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                categoria: categoriaGuardada
            });
        });
    });
});






//  =======================================
//  CREAR NUEVA CATEGORIA
//  =======================================
//al intenter crear un categoria pasara el parametro a verifica 
//de verificar el token
app.post('/', mdAutentificacion.verificaToken, (req, res) => {

    var body = req.body;

    var categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear una Categoría',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaGuardada
        });
    });
});





//  =======================================
//  BORRAR UNA CATEGORIA POR EL ID
//  =======================================
app.delete('/:id', mdAutentificacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al borrar Categoría',
                errors: err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una Categoría con ese id',
                errors: { message: 'No existe una Categoria' }
            });
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;