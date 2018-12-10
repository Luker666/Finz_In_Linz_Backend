var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

Event = require('./models/events');
Category = require('./models/categories');
Place = require('./models/places');
Organizer = require('./models/organizers');



//Connect to mongoose 
mongoose.connect('mongodb://localhost/finzDB', { useNewUrlParser: true } )
var db = mongoose.connection;

app.get('/', function(req, res){
	res.send('Please use /api/events or api/organizers or api/places or api/categories');
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


app.listen(3000);
console.log('Running on port 3000');
