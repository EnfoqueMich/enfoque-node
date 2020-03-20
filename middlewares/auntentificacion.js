//libreria para crear un TOKEN
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


//  =======================================
//  VERIFICAR TOKEN 
//  =======================================
exports.verificaToken = function(req, res, next) {

    //aquí tenemos ya el token para usarlo
    var token = req.query.token;

    //1.- recibimos el TOKEN  2.- recibimos el SEED  3.- decoded, contiene la info del usuario
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'TOKEN incorrecto',
                errors: err
            });
        }

        //del DECODED extraemos el usuario
        req.usuario = decoded.usuario;

        //esto es muy importante porque si no esta NEXT(); deja de funcionar todo lo de abajo
        next();


    });

}




//  =======================================
//  VERIFICAR QUE SEA ADMINISTRADOR
//  =======================================
exports.verificaADMIN_ROLE = function(req, res, next) {

    //aquí tenemos ya el token para usarlo
    var usuario = req.usuario;

    if (usuario.role === 'ADMINISTRADOR') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tienes autorización a esta sección',
            errors: { message: 'No puedes accesar' }
        });

    }



}




//  =======================================
//  VERIFICAR ADMIN O MISMO USUARIO LOGUEADO
//  =======================================
exports.verificaADMIN_USUARIO_MISMO = function(req, res, next) {

    //aquí tenemos ya el token para usarlo
    var usuario = req.usuario;

    //obtenemos el ID del usuario que esta logueado
    var id = req.params.id;


    if (usuario.role === 'ADMINISTRADOR' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tienes autorización a esta sección',
            errors: { message: 'No puedes accesar' }
        });

    }



}