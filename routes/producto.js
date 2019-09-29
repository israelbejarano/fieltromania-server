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

module.exports = app; //con esto puedo usar este fichero en cualquier parte del server