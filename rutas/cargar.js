// Requires librerias personalizadas
var express = require('express');

//Libreria para cargar imagenes
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

//  =====================================================================
//  Importamos los modelos para poder buscar en ellos
//  =====================================================================
var Categoria = require('../models/categoria');
var Articulo = require('../models/articulo');
var Usuario = require('../models/usuario');


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
    var archivo = req.files.imagen;
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
//  ACTUALIZAMOS LAS IMAGENES DE USUARIOS, ARTICULOS Y CATEGORIAS
//  =====================================================================
function subirPorTipo(tipo, id, nombreArchivo, res) {

    //  =====================================================================
    //  ACTUALIZAR IMAGEN USUARIOS
    //  =====================================================================
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './cargas/usuarios/' + usuario.img;

            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            })
        });
    }


    //  =====================================================================
    //  ACTUALIZAR IMAGEN CATEGORÍAS
    //  =====================================================================
    if (tipo === 'categorias') {
        Categoria.findById(id, (err, categoria) => {
            var pathViejo = './cargas/categorias/' + categoria.img;

            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            categoria.img = nombreArchivo;
            categoria.save((err, categoriaActualizada) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de la Categoría actualizada',
                    usuario: categoriaActualizada
                });
            })
        });
    }



    //  =====================================================================
    //  ACTUALIZAR IMAGEN ARTICULOS
    //  =====================================================================
    if (tipo === 'articulos') {
        Articulo.findById(id, (err, articulo) => {

            if (!articulo) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Articulo no existe',
                    errors: { message: 'Articulo no existe' }
                });
            }

            var pathViejo = './cargas/articulos/' + articulo.img;

            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            articulo.img = nombreArchivo;
            articulo.save((err, articuloActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Artículo actualizada',
                    usuario: articuloActualizado
                });
            })
        });
    }



}

module.exports = app;