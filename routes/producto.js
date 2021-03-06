var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Producto = require('../models/producto');

// ========================================
// obtener todos los productos sin paginacion
// ========================================
app.get('/todos', [mdAutenticacion.verificarToken], (req, res) => {
    Producto.find({}, (err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando producto de BBDD',
                errors: err
            });
        }
        Producto.count({}, (err, total) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error contando productos de BBDD',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                productos,
                total
            });
        });
    });
});

// ========================================
// obtener todos los productos con paginacion
// ========================================
app.get('/', [mdAutenticacion.verificarToken], (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .skip(desde) // para ir paginando se salta los desde usuarios
        .limit(5) // paginacion de 5 elementos por paginas
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando producto de BBDD',
                    errors: err
                });
            }
            Producto.count({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error contando productos de BBDD',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    productos,
                    total
                });
            });
        });
});

// ========================================
// Obtener producto por id
// ========================================
app.get('/:id', [mdAutenticacion.verificarToken], (req, res) => {
    var id = req.params.id;
    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando producto de BBDD',
                errors: err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con id ' + id + ' no existe',
                errors: { message: 'No existe producto con este ID' }
            });
        }
        res.status(200).json({
            ok: true,
            producto
        });
    });
});

// ========================================
// crear un nuevo producto
// ========================================
app.post('/', [mdAutenticacion.verificarToken, mdAutenticacion.verificarAdminRole], (req, res) => {
    var body = req.body;
    var producto = new Producto({
        nombre: body.nombre,
        precio: body.precio,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        tipo: body.tipo
    });

    producto.save((err, productoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando producto en BBDD',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoGuardado
        });
    });
});

// ========================================
// actualizar producto
// ========================================
app.put('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarAdminRole], (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({ // 500 porque si hay error es por el servidor porque o devueve usuario o null
                ok: false,
                mensaje: 'Error al buscar producto en BBDD',
                errors: err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con id ' + id + ' no existe',
                errors: { message: 'No existe producto con este ID' }
            });
        }
        producto.nombre = body.nombre;
        producto.precio = body.precio;
        producto.descripcion = body.descripcion;
        producto.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar producto en BBDD',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                Producto: productoGuardado
            });
        });
    })
});

// ========================================
// borrar producto
// ========================================
app.delete('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarAdminRole], (req, res) => {
    var id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando producto en BBDD',
                errors: err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con id ' + id + ' no existe',
                errors: { message: 'No existe producto con este ID' }
            });
        }
        res.status(200).json({
            ok: true,
            producto: productoBorrado
        });
    });
});

// ========================================
// insertar infoSobreProducto en producto
// en verdad es un update (put) de ese
// ese campo de un producto
// ========================================
app.put('/info-sobre-producto/:id', [mdAutenticacion.verificarToken], (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({ // 500 porque si hay error es por el servidor porque o devueve usuario o null
                ok: false,
                mensaje: 'Error al buscar producto en BBDD',
                errors: err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con id ' + id + ' no existe',
                errors: { message: 'No existe producto con este ID' }
            });
        }
        var infoSobreProd = {
            usuario: req.usuario._id,
            comentario: body.comentario
        };
        producto.infoSobreProd.push(infoSobreProd);
        producto.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar producto en BBDD',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                Producto: productoGuardado
            });
        });
    })
});

module.exports = app; //con esto puedo usar este fichero en cualquier parte del server