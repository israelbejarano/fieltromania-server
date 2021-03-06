var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var InfoSobreProdSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    comentario: { type: String, required: [true, 'El comentario es obligatorio'] },
    createAt: { type: Date, required: [true, 'la fecha de creacion es obligatoria'], default: new Date() }
});

var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    precio: { type: Number, required: [true, 'El precio es obligatorio'] },
    descripcion: { type: String, required: [true, 'La descripción es obligatoria'] },
    img: { type: String, required: [false] },
    tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    createAt: { type: Date, required: [true, 'la fecha de creacion es obligatoria'], default: new Date() },
    infoSobreProd: { type: [InfoSobreProdSchema], required: false }
});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Producto', productoSchema);