var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PedidoSchema = new Schema({
    descripcion: { type: String, required: [true, 'La descripcion es obligatoria'] },
    observacion: { type: String },
    itemsPedidos: { type: [Schema.Types.ObjectId], ref: 'ItemPedido', required: [true, 'Es obligatorio al menos un Item de pedido'] },
    total: { type: Number, required: [true, 'El precio total es obligatorio'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    createAt: { type: Date, required: [true, 'la fecha de creacion es obligatoria'], default: new Date() },
    updateAt: { type: Date, required: [true, 'la fecha de actualizacion es obligatoria'], default: new Date() }
});
module.exports = mongoose.model('Pedido', PedidoSchema);