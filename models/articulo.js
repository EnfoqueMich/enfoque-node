var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var articuloSchema = new Schema({

    titulo: { type: String, required: false },
    sumario: { type: String, required: false },
    fecha: { type: String, required: false },
    articulo: { type: String, required: false },
    img: { type: String, required: false },
    galeria: { type: [String] },

    pata_imagen: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },

    categoria: {

        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'Tienes que seleccionar una categoría']
    }
});

module.exports = mongoose.model('Articulo', articuloSchema);