// take care of dependencies

/**
 * exports of express module
 * @type {Object}
 */
var express = require('express');

/**
 * exports of path module
 * @type {Object}
 */
var path = require('path');

/**
 * instance of express
 * @type {Function}
 */
var app = express();



// setting up route variables

/**
 * backend index functionality
 * @type {Object}
 */
const route_index = require('./routes/index');

/**
 * backend board functionality
 * @type {Object}
 */
const route_board = require('./routes/board');



/**
 * port to allow connections on
 * @type {Number}
 */
const port = 3002;



// setting up view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// setting up static folder
app.use(express.static(path.join(__dirname, 'public')));

// assigning routes to app
app.use('/', route_index);
app.use('/index', route_index);
app.use('/board', route_board);

// expose public port
app.listen(port);

console.log("minesweeper has started on port " + port);
