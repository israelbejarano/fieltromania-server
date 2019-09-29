var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tipoSchema = Schema({
    tipo: { type: String, unique: true, required: [true, 'El tipo es obligatorio'] },
    createAt: { type: Date, required: [true, 'la fecha de creacion es obligatoria'], default: new Date() }
});

tipoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Tipo', tipoSchema);