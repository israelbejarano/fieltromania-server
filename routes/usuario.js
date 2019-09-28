var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Usuario = require('../models/usuario');

// ========================================
// obtener todos los usuarios sin paginacion
// ========================================
app.get('/todos', [mdAutenticacion.verificarToken], (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, (err, usuarios) => { // devuelve todo el objeto usuario sin mas
        /* Usuario.find({}, 'nombre apellidos email avatar role google')
            .skip(desde) // para ir paginando se salta los desde usuarios
            .limit(5) // paginacion de 5 elementos por paginas
            .exec((err, usuarios) => { */
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
// obtener todos los usuarios con paginacion
// ========================================
app.get('/', [mdAutenticacion.verificarToken], (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre apellidos email avatar role google')
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
// Obtener usuario por id
// ========================================
app.get('/:id', [mdAutenticacion.verificarToken], (req, res) => {
    var id = req.params.id;
    Usuario.findById(id, 'nombre apellidos email avatar role google', (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuario de BBDD',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id ' + id + ' no existe',
                errors: { message: 'No existe usuario con este ID' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario
        });
    });
});

// ========================================
// crear un nuevo usuario. No necesito token
// porque será el registro de una nueva cuenta
// el encargado de eso. Este método es para
// crear usuario rapidamente desde el postman
// TODO en un futuro habra una ruta register.
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

// ========================================
// actualizar usuario
// ========================================
app.put('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarAdminOrMismoUsuario], (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => { // mongoose
        if (err) {
            return res.status(500).json({ // 500 porque si hay error es por el servidor porque o devueve usuario o null
                ok: false,
                mensaje: 'Error al buscar usuario en BBDD',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id ' + id + ' no existe',
                errors: { message: 'No existe usario con este ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.apellidos = body.apellidos;
        usuario.email = body.email;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario en BBDD',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)'; // esto es para no mostrar el password en el json pero no afecta a BBDD
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ========================================
// borrar usuario
// ========================================
app.delete('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarAdminOrMismoUsuario], (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando usuario en BBDD',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id ' + id + ' no existe',
                errors: { message: 'No existe usario con este ID' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app; //con esto puedo usar este fichero en cualquier parte del server