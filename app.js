// dependencies
var express = require('express');
var path = require('path');
var app = express();

// setting up view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// setting up route variables
const route_index = require('./routes/index');
const route_board = require('./routes/board');

// setting up static folder
app.use(express.static(path.join(__dirname, 'public')));

// assigning routes to app
app.use('/', route_index);
app.use('/index', route_index);
app.use('/board', route_board);

// expose public port
const port = 3000;
app.listen(port);
console.log("minesweeper has started on port " + port);
