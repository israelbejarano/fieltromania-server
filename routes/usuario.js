var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Usuario = require('../models/usuario');

// ========================================
// obtener todos los usuarios. El listado
// siempre se muestra aun no teniendo token
// ========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    // Usuario.find({}, (err, usuarios) => {    // devuelve todo el objeto usuario sin mas
    Usuario.find({}, 'nombre apellidos email img role google')
        .skip(desde) // para ir paginando se salta los desde usuarios
        .limit(5) // paginacion de 5 elementos por paginas
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario de BBDD',
                    errors: err
                });
            }
            Usuario.count({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error contando usuarios de BBDD',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios, //segun EM6 esto es redundante y se puede hacer solo usuarios, pero asi queda mas claro
                    total: total
                });
            });
        });
});

// ========================================
// crear un nuevo usuario
// ========================================
app.post('/', (req, res) => {
    var body = req.body;
    // declaro el usuario a guardar con los datos que trae el body que son los datos del usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        avatar: body.avatar,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => { // moongose
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuario en BBDD',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

module.exports = app; //con esto puedo usar este fichero en cualquier parte del server