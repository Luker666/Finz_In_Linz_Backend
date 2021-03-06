var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var passport = require('passport');
var {ensureAuthenticated} = require('./config/auth');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectID;
var config  = require('./config/config');
var cors = require('cors')

User = require('./models/users');
Event = require('./models/events');
Category = require('./models/categories');
Place = require('./models/places');
Organizer = require('./models/organizers');
Comment = require('./models/comments');


//Passport config
require('./config/passport')(passport);

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


app.use(cookieParser());

/*
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
*/

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
	next();
});

app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

//Express Session middleware
/*
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
*/
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//JWT Middelware
function middleware(req, res, next) {
		//console.log(req.headers['authorization']);//.replace(/^JWT\s/, '');
		//console.log(req.cookie['Authorization']);
		console.log(req.headers);
  //var token = req.headers['Authorization'];//.replace(/^JWT\s/, '');
  var token = req.headers.authorization
  if (token) {
  	try {
  		var decoded = jwt.verify(token, config.auth.token.secret);
      //console.log(decoded);
      req.principal = {
      	isAuthenticated: true,
      	user: decoded.user
      };
      return next();

  } catch (err) { console.log('ERROR when parsing access token.', err); }
}

return res.status(401).json({ error: 'Invalid access token!' });
}


//Check for DB errors
db.on('error', function(err){
	console.log(err);
});


//Routes

//Default Route
app.get('/', function(req, res){
	res.send('Please use /api/events, api/organizers, api/places, api/categories, api/comments');
});

//app.use('/api/oauth/google', middleware);
app.use('/api/comments_post', cors(), middleware);

//Authentication routes

//Google OAUTH 2.0
app.get('/api/oauth/google', 
	passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/api/oauth/google/callback', function(req, res, next){
	passport.authenticate('google', function(err, user, info){
		if (err) return next(err);
		if (!user) {
      return res.json({error: 'Login failed'})//res.redirect('/#/login');
  }

  var userData = { name: user.name };

  var tokenData = {
  	user: userData
  };

  var token = jwt.sign(tokenData,
  	config.auth.token.secret,
  	{ expiresIn: config.auth.token.expiresIn },
  	function(err, token) {
  		if (err) {
  			console.log(err);
  		} else {
  			//res.setHeader('Cache-Control', 'private');
  			res.cookie('authorization', token, {expires: 400000});
				//res.send("done");
				res.redirect('https://linz.findz.at?token=' + token);
			}});



})(req, res, next);
});

app.get('/api/oauth/googleUserProfile', 
	passport.authenticate('google', { failureRedirect: '/api' }),
	(req, res) =>{ res.send(req.user)});


app.post('/api/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { 
			return next(err); 
		}
		if (!user) { 
			return res.status(404).json({
				error: {
					message: 'error',
					status: 'User not signed in',
				},
			}); 
		}
		req.logIn(user, function(err) {
			if (err) { 
				return next(err); 
			}
			return res.status(200).json({
				success: {
					message: 'success',
					status: 'User signed in',
				},
			});
		});
	})(req, res, next);
});


app.get('/api/logout', function(req, res, next) {
	req.logout();
	return res.status(200).json({
		success: {
			message: 'success',
			status: 'User succesfully signed out',
		},
	});
});


app.get('/api/register', (req, res) => res.send('Register'));

app.post('/api/register', (req, res) => {
	//console.log(req.body)
	const {name, email, password, password2} = req.body;
	let errors = [];

	//Check required fields
	if(!name || !email || !password || !password2){
		errors.push({msg: 'Please fill in all fields'});
	}

	//Check passwords match
	if(password !== password2) {
		errors.push({msg: 'Passwords do not match'});
	}

	//Check password length
	if(password.length < 6){
		errors.push({msg: 'Passwords should be at least 6 characters'});
	}

	if(errors.length > 0){
		res.send(errors);
	} else {
		//res.send('Validation complete');
		User.findOne({email:email})
		.then(user => {
			if(user) {
				errors.push({msg: 'Email is already registered'});
				res.send(errors);
			} else {
				const newUser = new User({
					name, 
					email,
					password
				});
			//console.log(newUser)
			//res.send('registration complete');

			//Hash Password
			bcrypt.genSalt(10, (err, salt) => 
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if(err) throw err;
					// Set passowrd to hashed
					newUser.password = hash;
					//Save User
					newUser.save()
					.then(res.send('New User Registered'))
					.catch(err => console.log(err));

				}))
		}
	});
	}
});


//Event Routes

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

//Comments Routes
app.post('/api/comments_post', (req, res) => { //ensureAuthenticated
	let comment = new Comment();
	var eventid = req.body.event_id;
	var ratingPosted = req.body.rating;
	comment.event_id = req.body.event_id;
	comment.user_name = req.body.user_name;
	comment.user_id = req.body.user_id;
	comment.published = req.body.published;
	comment.rating = req.body.rating;
	comment.text = req.body.text;
	comment.published = new Date();
	

	console.log(eventid);

	Event.findOne({id: eventid}, function(err, foundObject){
		if(err) {
			console.log(err);
			//res.status(500).send();
		} else {
			if(!foundObject){
				//res.status(404).send();
				console.log('no object found');
			} else {
				if (ratingPosted == 5) {
					foundObject.ratingsFive += 1;
					foundObject.ratingCount += 1;
					foundObject.avgRating = (foundObject.ratingsFive * 5 + foundObject.ratingsFour * 4 + foundObject.ratingsThree * 3 + foundObject.ratingsTwo * 2 + foundObject.ratingsOne * 1) / foundObject.ratingCount
					foundObject.save();
				}
				if (ratingPosted == 4) {
					foundObject.ratingsFour += 1;
					foundObject.ratingCount += 1;
					foundObject.avgRating = (foundObject.ratingsFive * 5 + foundObject.ratingsFour * 4 + foundObject.ratingsThree * 3 + foundObject.ratingsTwo * 2 + foundObject.ratingsOne * 1) / foundObject.ratingCount
					foundObject.save();
				}
				if (ratingPosted == 3) {
					foundObject.ratingsThree += 1;
					foundObject.ratingCount += 1;
					foundObject.avgRating = (foundObject.ratingsFive * 5 + foundObject.ratingsFour * 4 + foundObject.ratingsThree * 3 + foundObject.ratingsTwo * 2 + foundObject.ratingsOne * 1) / foundObject.ratingCount
					foundObject.save();
				}
				if (ratingPosted == 2) {
					foundObject.ratingsTwo += 1;
					foundObject.ratingCount += 1;
					foundObject.avgRating = (foundObject.ratingsFive * 5 + foundObject.ratingsFour * 4 + foundObject.ratingsThree * 3 + foundObject.ratingsTwo * 2 + foundObject.ratingsOne * 1) / foundObject.ratingCount
					foundObject.save();
				}
				if (ratingPosted == 1) {
					foundObject.ratingsOne += 1;
					foundObject.ratingCount += 1;
					foundObject.avgRating = (foundObject.ratingsFive * 5 + foundObject.ratingsFour * 4 + foundObject.ratingsThree * 3 + foundObject.ratingsTwo * 2 + foundObject.ratingsOne * 1) / foundObject.ratingCount
					foundObject.save();
				}
			}
		}
	})

comment.save(function(err){
	if(err){
		console.log(err);
		return;
	} else {
		res.json({
			comment
		});
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
