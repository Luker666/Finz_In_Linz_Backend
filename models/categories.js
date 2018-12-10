 var mongoose = require('mongoose');


 //Event Schema 
 var categorySchema = mongoose.Schema({
 	//category id, name -> subcategories [...] names [...] AUch für stadteile -> categoryID = ""
 	categoryid:{
 		type: String,
 		required: true
 	},
 	name:{
 		type: String, 
 		required :false
 	},
 	nested:{
 		subcategory:{
 			type: {String, String}
 		}
 	},
 	timestamp:{
	type: Date,
	default: Date.now
	}
 });

 var Category = module.exports = mongoose.model('Category', categorySchema);

//Get Categories
module.exports.getCategories = function(callback, limit){
	Category.find(callback).limit(limit);
}

module.exports.getCategoryById= function(id, callback){
	Category.findById(id, callback);
}