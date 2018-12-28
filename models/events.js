var mongoose = require('mongoose');
var moment = require('moment');


 //Event Schema 
 var eventSchema = mongoose.Schema({
 	//event id, firstdate, lastdate, title description, organizer id -> link -> url, categories -> category id [...], links -> links [...] -> url, datefrom [...], dateto [...]
 	id:{
 		type: String,
 		required: true
 	},
 	firstdate:{
 		type: Date, 
 		required :true
 	},
 	lastdate:{
 		type: Date,
 		required :true
 	}, 
 	title:{
 		type: String,
 		required :true
 	}, 
 	description:{
 		type: String,
 		required :false
 	},
 	category:{
 		type: String,
 		required :false
 	}
 });

var Event = module.exports = mongoose.model('Event', eventSchema);

//Get Events
module.exports.getEvents = function(callback, limit){
	Event.find(callback).limit(limit);
}

//Get EventsbyID
module.exports.getEventById = function(id, callback){
	Event.findById(id, callback);
}


module.exports.getEventsByFilters = function(title, firstdate, lastdate, category, location, organizer, callback){
	var queryCond = {}
		if(title){
		   queryCond.title= new RegExp(title, 'i');
		}
		if(firstdate){ 
		   queryCond.firstdate = {$gte: firstdate};
		}
		if(lastdate){
		   queryCond.lastdate = {$lte: lastdate};
		}
		if(category){
		   queryCond.category=category;
		}
		if(location){
		   queryCond.location=location;
		}
		if(organizer){
		   queryCond.organizer=organizer;
		}
	console.log(queryCond)
	Event.find(queryCond, callback);
}
