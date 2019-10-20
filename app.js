var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


Event = require('./models/events');
Category = require('./models/categories');
Place = require('./models/places');
Organizer = require('./models/organizers');
Comment = require('./models/comments');



//Connect to mongoose 
mongoose.connect('mongodb://localhost/finzDB', { useNewUrlParser: true } )
var db = mongoose.connection;


//Check connection
db.once('open', function(){
	console.log('Connected to MongoDB');
});

// create application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Check for DB errors
db.on('error', function(err){
	console.log(err);
});

app.get('/', function(req, res){
	res.send('Please use /api/events, api/organizers, api/places, api/categories, api/comments');
});

app.get('/api/events', function(req, res){
	Event.getEvents(function(err, events){
		if(err){
			throw err;
		}
		res.json(events);
	});
});

app.get('/api/events/:eventID', function(req, res){
	Event.getEventById(req.params.eventID, function(err, events){
		if(err){
			throw err;
		}
		res.json(events);
	});
});

// /:firstdate?/:lastdate?/:category?/:location?/:organizer?
app.get('/api/eventsFiltered', function(req, res){
	Event.getEventsByFilters(req.query.title, req.query.firstdate, req.query.lastdate, req.query.category, req.query.location, req.query.organizer, function(err, events){
		if(err){
			throw err;
		}
		//console.log('title: ' + req.query.title + ' firstd: ' + req.query.firstdate + ' lastd: ' + req.query.lastdate + ' category: ' + req.query.category + ' location: ' + req.query.location + ' organizer: ' + req.query.organizer);
		res.json(events);
	});
});

app.get('/api/categories', function(req, res){
	Category.getCategories(function(err, categories){
		if(err){
			throw err;
		}
		res.json(categories);
	});
});

app.get('/api/categories/:categoryID', function(req, res){
	Category.getCategoryById(req.params.categoryID, function(err, categories){
		if(err){
			throw err;
		}
		res.json(categories);
	});
});

app.get('/api/places', function(req, res){
	Place.getPlaces(function(err, places){
		if(err){
			throw err;
		}
		res.json(places);
	});
});

app.get('/api/places/:placeID', function(req, res){
	Place.getPlaceById(req.params.placeID, function(err, places){
		if(err){
			throw err;
		}
		res.json(places);
	});
});

app.get('/api/organizers', function(req, res){
	Organizer.getOrganizers(function(err, organizers){
		if(err){
			throw err;
		}
		res.json(organizers);
	});
});

app.post('/api/comments', function(req, res){
	let comment = new Comment();
	comment.event_id = req.body.event_id;
	comment.user_name = req.body.user_name;
	comment.user_id = req.body.user_id;
	comment.published = req.body.published;
	comment.rating = req.body.rating;
	comment.text = req.body.text;
	console.log(req.body);

	comment.save(function(err){
		if(err){
			console.log(err);
			return;
		} else {
			res.redirect('/');
		}
	});
});

app.get('/api/comments', function(req, res){
	Comment.getComments(function(err, comments){
		if(err){
			throw err;
		}
		res.json(comments);
	});
});

app.get('/api/comments/:eventID', function(req, res){
	Comment.getCommentsByEventID(req.params.eventID, function(err, comments){
		if(err){
			throw err;
		}
		res.json(comments);
	});
});

app.listen(3000);
console.log('Running on port 3000');
