var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var InfoSobreProdSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    comentario: { type: String }
});

var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    precio: { type: Number, required: [true, 'El precio es obligatorio'] },
    descripcion: { type: String, required: [true, 'La descripción es obligatoria'] },
    img: { type: String, required: [false] },
    tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    infoSobreProd: { type: [InfoSobreProdSchema], required: false }
});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Producto', productoSchema);