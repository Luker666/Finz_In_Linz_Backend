 var mongoose = require('mongoose');


 //Event Schema 
 var placeSchema = mongoose.Schema({
 	//
 	locationid:{
 		type: String,
 		required: true
 	},
 	name:{
 		type: String, //change to datetime?! 
 		required: false
 	},
 	street:{
 		type: String,
 		required: false
 	},
 	postcode:{
		type: String,
		required: false
	},
 	city:{
		type: String,
		required: false
	},
 	state:{
		type: String,
		required: false
	},
 	telephone:{
		type: String,
		required: false
	},
 	description:{
		type: String,
		required: false
	},
 	link:{
		type: String,
		required: false
	},
	latitude:{
		type: String,
		required: false
	},
	longitude:{
		type: String,
		required: false
	},
 	timestamp:{
		type: Date,
		default: Date.now
	}
 });

 var Place = module.exports = mongoose.model('Place', placeSchema);

//Get Places
module.exports.getPlaces = function(callback, limit){
	Place.find(callback).limit(limit);
}


//Get Places
module.exports.getPlaceById = function(id, callback){
	Place.findById(id, callback);
}


