var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemPedidoSchema = new Schema({
    cantidad: { type: Number, required: [true, 'la cantidad es obligatoria'] },
    precio: { type: Number, required: [true, 'El precio es obligatorio'] },
    detalle: { type: String, required: [true, 'el detalle es obligatorio'] },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true }
});

module.exports = mongoose.model('ItemPedido', itemPedidoSchema);