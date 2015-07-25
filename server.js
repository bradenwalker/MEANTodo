// set up =======================
var express = require('express');
var app = express(); 							//create our app w/ express
var mongoose = require('mongoose'); 			//mongoose for mongodb
var morgan = require('morgan');					//log requests to the console (express4)
var bodyParser = require('body-parser');		//pull information from HTML POST (express4)
var methodOverride = require('method-override')	//simulate DELETE and PUT (express4)

// configuration =======================
mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uw03mypu')	//connect to mongoDB database on modulus.io
app.use(express.static(__dirname + '/public'));					//set the static files location
app.use(morgan('dev'));											//log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));			//parse application/x-www-form-urlencoded
app.use(bodyParser.json());										//parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));	//parse application/vnd.api+json as json

// define model =======================
var Todo = mongoose.model('Todo', {
	text: String
});

// listen (start app with node server.js) =======================
app.listen(8080);
console.log("App listening on port 8080");

// routes =======================

// get all todos
app.get('/api/todos', function(req, res) {
	//use mongoose to get all todos in the database
	Todo.find(function(err, todos) {
		//if there is an error retrieving, send the error
		if (err) {
			res.send(err);
		}
		//else, send the response as json
		else {
			res.json(todos);
		}
	});
});


// create a todo and send back updated list of all todos
app.post('/api/todos', function(req, res) {
	// create a todo, info comes from Ajax request from Angular
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after a new one is created
		Todo.find(function(err, todos) {
			if(err) {
				res.send(err);
			} else {
				res.json(todos);
			}
		});
	});
});


// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after deleting
		Todo.find(function(err, todos) {
			if(err) {
				res.send(err)
			} else {
				res.json(todos);
			}

		});
	});
});









