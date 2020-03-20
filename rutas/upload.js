// Requires librerias personalizadas
var express = require('express');

//Libreria para cargar imagenes
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

//  =====================================================================
//  Importamos el modelo
//  =====================================================================
var Articulo = require('../models/articulo');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {



    //variables para obtener el tipo y el id
    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de secciones
    var tiposValidos = ['categorias', 'articulos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de sección no válida',
            errors: { message: 'Tipo de sección no válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionaste nada',
            errors: { message: 'Tienes que seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.galerias;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'JPG', 'JPEG', 'PNG', 'GIF'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }
        });
    }

    //Nombre del archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extensionArchivo}`;

    // Movemos el archivo de Temporal a un carpeta en específico
    var path = `./cargas/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error, no se pudo mover el archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    })
});

//  =====================================================================
//  CARGAR GALERIA
//  =====================================================================
function subirPorTipo(tipo, id, nombreArchivo, res) {

    //  =====================================================================
    //  GALERIA MEDICO
    //  =====================================================================
    if (tipo === 'articulos') {
        Articulo.findById(id, (err, articulo) => {

            articulo.galeria = nombreArchivo;
            articulo.save({ galeria: ['', ''] })

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen cargada',

            });

        });
    }
}

module.exports = app;