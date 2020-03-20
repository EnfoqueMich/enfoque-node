// Requires librerias personalizadas
var express = require('express');


var app = express();


//  =====================================================================
//  Importamos los modelos para poder buscar en ellos
//  =====================================================================
var Categoria = require('../models/categoria');
var Articulo = require('../models/articulo');
var Usuario = require('../models/usuario');








//  =====================================================================
//  RUTA PARA BUSCAR EN UNA SOLA CATEGORÍA
//  =====================================================================
app.get('/seccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var buscarloquesea = RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, buscarloquesea);
            break;

        case 'categorias':
            promesa = buscarCategorias(busqueda, buscarloquesea);
            break;

        case 'articulos':
            promesa = buscarArticulos(busqueda, buscarloquesea);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: Usuarios, Categorías y Artículos',
                error: { message: 'Tipo de tabla/Categoría no válido' }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    });


});








//  =====================================================================
//  RUTA PARA BUSCAR TODO
//  =====================================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    //Creamos una expresión regular y la colocamos abajo
    var buscarloquesea = new RegExp(busqueda, 'i');

    // "Promise.all" es una nueva función interesante 
    //.all nos permite enviar un arreglo de promesas, ejecutarlas
    // y si todas responden podemos ejecutar un ".then"
    // y si una falla menejariamos el "catch"

    Promise.all([
            //Promesa [0] - enviamos un arreglo y recibe 2 parámetros BUSQUEDA Y BUSCARLOQUESEA
            buscarCategorias(busqueda, buscarloquesea),
            //Promesa [1]
            buscarArticulos(busqueda, buscarloquesea),
            //Promesa [2]
            buscarUsuarios(busqueda, buscarloquesea)
        ])
        //.then es un ARREGLO, y ahi estarán las respuetas de las promesas en la misma posición
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                categorias: respuestas[0], //categorias esta en RESPUESTAS en la posicion [0]
                articulos: respuestas[1], //articulos  esta en RESPUESTAS en la posicion [1]
                usuarios: respuestas[2] //usuarios  esta en RESPUESTAS en la posicion [2]
            });
        });
});



//  =====================================================================
//  FUNCIÓN PARA BUSCAR CATEGORÍAS
//  =====================================================================
//como parámetros de busqueda vamos a recibir BUSQUEDA y la expresión regular BUSCARLOQUESEA
function buscarCategorias(busqueda, buscarloquesea) {
    return new Promise((resolve, reject) => {
        Categoria.find({ nombre: buscarloquesea })
            .populate('usuario', 'nombre email img')
            .exec((err, categorias) => {
                if (err) {
                    reject('Error al cargar categorias', err);
                } else {
                    resolve(categorias)
                }
            });
    });
}


//  =====================================================================
//  FUNCIÓN PARA BUSCAR ARTÍCULOS
//  =====================================================================
//como parámetros de busqueda vamos a recibir BUSQUEDA y la expresión regular BUSCARLOQUESEA
function buscarArticulos(busqueda, buscarloquesea) {
    return new Promise((resolve, reject) => {
        Articulo.find({ titulo: buscarloquesea })
            .populate('usuario', 'titulo img')
            .populate('categoria')
            .exec((err, articulos) => {
                if (err) {
                    reject('Error al cargar Articulos', err);
                } else {
                    resolve(articulos)
                }
            });
    });
}



//  =====================================================================
//  FUNCIÓN PARA BUSCAR DOS CAMPOS DE USUARIOS -> email y nombre
//  =====================================================================
//como parámetros de busqueda vamos a recibir BUSQUEDA y la expresión regular BUSCARLOQUESEA
function buscarUsuarios(busqueda, buscarloquesea) {
    //creamos una promesa y la retornamos
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img') //mandamos NOMBRE EMAIL para que solo salga eso en la busqueda
            .or([{ 'nombre': buscarloquesea }, { 'email': buscarloquesea }]) //dos datos a buscar NOMBRE: y EMAIL:
            .exec((err, usuarios) => {

                if (err) {
                    //si hay un error, ejecutamos el REJECT
                    reject('Error al cargar usuarios', err);
                } else {
                    //si NO hay error, ejecutamos el RESOLVE y enviamos la data USUARIOS
                    resolve(usuarios);
                }
            })
    });
}

module.exports = app;