//Cargamos Mongoose para poder utlizarlo
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');



//variable para definir esquemas
var Schema = mongoose.Schema;


var rolesValidos = {

    values: ['ADMINISTRADOR', 'PUBLICADOR'],
    message: '{VALUE} No es un rol permitido '

}



//primero el nombre de la "coleccion/Schema"  para buenas prácticas
var usuarioSchema = Schema({
    //el ID no se coloca aquí ese se genera automaticamente

    // REQUIRED para que sea obligatorio y luego mandamos el mensaje si no colocan la información
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    // UNIQUE es una condición
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    // REQUIRED: FALSE , esto es por si no quieren poner imagen
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'PUBLICADOR', enum: rolesValidos }



});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} deve ser único' });

// para poder usar nuestro esquema lo tenemos que exportar
// 'Usuario' ES EL NOMBRE DE NUESTRO ESQUEMA y lo exportamos a -> RUTAS -> usuario.js
// "usuarioSchema" , Es el nombre del esquema que queremos relacionar
module.exports = mongoose.model('Usuario', usuarioSchema);