// Requires librerias personalizadas
var express = require('express');
//libreria para encriptar el password
var bcrypt = require('bcryptjs');
//libreria para crear un TOKEN
var jwt = require('jsonwebtoken');

//importamos la variable SEED de la carpeta CONFIG
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');




// =============================================================
// AUTENTICACIÓN NORMAL
// =============================================================
app.post('/', (req, res) => {

    var body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        //CREAR UN TOKEN!!!

        //quitamos el password de la pantalla
        usuarioDB.password = ':)';

        //SEED esta es la variable importada de la carpeta CONFIG
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 94400 }) //4horas



        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });


    });


});



function obtenerMenu(ROLE) {
    var menu = [
        //CREAMOS EL PRIMER MENU IZQUIERDO
        {
            titulo: 'ENFOQUE',
            icono: 'mdi mdi-home',
            submenu: [
                { titulo: 'Inicio', url: '/portada' },
                { titulo: 'Capasu', url: '/capasu' },
                { titulo: 'Uruapan', url: '/uruapan' }
            ]
        },
        //CREAMOS OTRO MENU IZQUIERDO
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                //{ titulo: 'Usuarios', url: '/usuarios' },

            ]
        }
    ];

    if (ROLE === 'ADMINISTRADOR') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' }, { titulo: 'Categorias', url: '/categorias' }, { titulo: 'Artículos', url: '/articulos' }

        );
    }
    return menu;
}







module.exports = app;