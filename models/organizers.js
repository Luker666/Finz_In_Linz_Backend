 var mongoose = require('mongoose');


 //Event Schema 
 var organizerSchema = mongoose.Schema({
 	//
 	organizerid:{
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
 	link:{
		type: String,
		required: false
	}
 });

 var Organizers = module.exports = mongoose.model('Organizers', organizerSchema);

//Get Events
module.exports.getOrganizers = function(callback){
	Organizer.find(callback);
}

