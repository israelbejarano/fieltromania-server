var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido.'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    apellidos: { type: String, required: [true, 'Los apellidos son obligatorios'] },
    email: { type: String, unique: true, required: [true, 'El correo es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    avatar: { type: String, required: [false] },
    role: { type: String, required: [true], default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false },
    createAt: { type: Date, required: [true, 'la fecha de creacion es obligatoria'], default: new Date() }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);