//  =======================================
//  Requires librerias personalizadas
//  =======================================
var express = require('express');
//libreria para encriptar el password
var bcrypt = require('bcryptjs');
//libreria para crear un TOKEN
var jwt = require('jsonwebtoken');
//importamos la autentificacion para usar la función "verificaToken"
var mdAutentificacion = require('../middlewares/auntentificacion');

var app = express();
//importamos el la variable "Usuario" para sacar los datos del formulario
var Usuario = require('../models/usuario');

//  =======================================
//  OBTENER TODOS LOS USUARIOS
//  =======================================
app.get('/', (req, res, next) => {

    //DESDE tiene que ser variable numerica
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')

    //Skip se salta los primeros 5 y nuestra los que siguen
    .skip(desde)

    //mostramos el ultimo articulo publicado primero en la lista
    .sort({ _id: -1 })

    //limit es para mostrar 5 articulos o los que se ocupen
    .limit(20)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Get de usuarios',
                        errors: err
                    });
                }

                //hacemos referencial modelo Usuario
                Usuario.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });
            });
});




//  =======================================
//  ACTUALIZAR USUARIO
//  =======================================
app.put('/:id', [mdAutentificacion.verificaToken, mdAutentificacion.verificaADMIN_USUARIO_MISMO], (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usario no existe',
                errors: { message: 'No eexiste un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});






//  =======================================
//  CREAR NUEVO USUARIO
//  =======================================
//al intenter crear un usuario pasara el parametro a verifica 
//de verificar el token
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });
});





//  =======================================
//  BORRAR UN USUARIO POR EL ID
//  =======================================
app.delete('/:id', [mdAutentificacion.verificaToken, mdAutentificacion.verificaADMIN_ROLE], (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al borrar usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;