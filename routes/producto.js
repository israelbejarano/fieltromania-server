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
module.exports = app; //con esto puedo usar este fichero en cualquier parte del server