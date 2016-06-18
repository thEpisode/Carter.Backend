 // TuGrua.co
 // V0.1.0

console.log('== Carter.Backend ==');

// =======================
// libraries =========
// =======================
var express 	= require("express");
var app 		= express();
var path 		= require('path');
var http 		= require('http').Server(app);
var io 			= require("socket.io")(http);
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt   		= require('jsonwebtoken'); // used to create, sign, and verify tokens
var checkInternet = require('is-online');


var config 			= require('./config'); // get our config file
var User   			= require('./app/models/user');
var DetailedUser 	= require('./app/models/detailedUser');
var Crane 			= require('./app/models/crane');
var globals 		= require('./app/controllers/global');
var frontend 		= require('./app/controllers/frontend');
var intervals 		= require('./app/controllers/intervals');
var routes 			= require('./app/controllers/routes');
var socketController = require('./app/controllers/socket');

console.log('\nLibs imported');

// =======================
// configuration =========
// =======================
var port = 3000;
//mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

var isOnline = true;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

console.log('app configurated');

// =======================
// initialize modules =========
// =======================
frontend.initialize(app, express, path);
routes.initialize(app, express, jwt, mongoose, User, DetailedUser, Crane, globals);
socketController.initialize(io, globals, mongoose, User, DetailedUser, Crane);
intervals.initialize();

console.log('modules initialized');

// =======================
// listening app =========
// =======================
io.listen(app.listen(port));
console.log('Listening on port 3000');