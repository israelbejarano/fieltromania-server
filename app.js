// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    next();
});

// body parser
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var tipoRoutes = require('./routes/tipo');
var productoRoutes = require('./routes/producto');
var itemPedidoRoutes = require('./routes/itemPedido');
var pedidoRoutes = require('./routes/pedido');

// Conexion a BBDD
mongoose.connection.openUri('mongodb://localhost:27017/fieltroManiaDB', (err, res) => {
    if (err) throw err;
    console.log('BBDD en puerto 27017: \x1b[32m%s\x1b[0m', 'online');
});


// Rutas

app.use('/pedido', pedidoRoutes);
app.use('/itemPedido', itemPedidoRoutes);
app.use('/producto', productoRoutes);
app.use('/tipo', tipoRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes); // esta ruta siempre tiene que ser la ultima si no no haria distinciones

// Escuchas
app.listen(3000, () => {
    console.log('Node/Express en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});