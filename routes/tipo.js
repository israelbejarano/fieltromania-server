var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Tipo = require('../models/tipo');

// ========================================
// obtener todos los tipos.
// ========================================
app.get('/', [mdAutenticacion.verificarToken], (req, res) => {

    Tipo.find({}, (err, tipos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuario de BBDD',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            tipos
        });
    });
});

// ========================================
// obtener tipo por id.
// ========================================
app.get('/:id', [mdAutenticacion.verificarToken], (req, res) => {
    var id = req.params.id;
    Tipo.findById(id, (err, tipo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando tipo de BBDD',
                errors: err
            });
        }
        if (!tipo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El tipo con id ' + id + ' no existe',
                errors: { message: 'No existe tipo con este ID' }
            });
        }
        res.status(200).json({
            ok: true,
            tipo
        });
    });
});

// ========================================
// crear tipo.
// ========================================
app.post('/', [mdAutenticacion.verificarToken, mdAutenticacion.verificarAdminRole], (req, res) => {
    var body = req.body;
    var tipo = new Tipo({
        tipo: body.tipo
    });

    tipo.save((err, tipoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando tipo en BBDD',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            tipo: tipoGuardado
        });
    });
});

// ========================================
// actualizar tipo.
// ========================================
app.put('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarAdminRole], (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Tipo.findById(id, (err, tipo) => {
        if (err) {
            return res.status(500).json({ // 500 porque si hay error es por el servidor porque o devueve usuario o null
                ok: false,
                mensaje: 'Error al buscar tipo en BBDD',
                errors: err
            });
        }
        if (!tipo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El tipo con id ' + id + ' no existe',
                errors: { message: 'No existe tipo con este ID' }
            });
        }
        tipo.tipo = body.tipo;
        tipo.save((err, tipoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar tipo en BBDD',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                tipo: tipoGuardado
            });
        });
    });
});

module.exports = app; //con esto puedo usar este fichero en cualquier parte del server