var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tipoSchema = Schema({
    tipo: { type: string, unique: true, required: [true, 'El tipo es obligatorio'] }
});

tipoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Tipo', tipoSchema);