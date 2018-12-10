var mongoose = require('mongoose');
var moment = require('moment');

var today = moment().startOf('day');
var tomorrow = moment(today).endOf('day');


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

//Get EventsbyID TBD -> Searchstring
module.exports.getEventsByFilters = function(title, firstdate, lastdate, category, location, organizer, callback){
	/*
	console.log('$gte: ' + new Date(2016,09,30));
	Event.find(
		{
		    lastdate: {
		        $lte: new Date(2016,09,30)
		    }
		}, callback
		);
	*/
	var queryCond = {}
		if(title){
		   queryCond.title=title;
		}
		if(firstdate){
		   queryCond.firstdate = '$gte: ' + moment(firstdate).toDate();
		  //queryCond.firstdate = '$gte: ' + firstdate;
		}
		if(lastdate){
		   queryCond.lastdate = '$lte: ' + moment(lastdate).toDate();
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

