var express = require('express');
var fs = require('fs');

var app = express();


app.get('/:tipo/:galeria', (req, res, next) => {

    var tipo = req.params.tipo;
    var galeria = req.params.galeria;

    var path = `./cargas/${ tipo }/${ galeria }`;

    fs.exists(path, existe => {

        if (!existe) {
            path = './assets/no-img.png';
        }
        res.sendfile(path);
    });
});

module.exports = app;