 var mongoose = require('mongoose');


 //Event Schema 
 var commentSchema = mongoose.Schema({
 	event_id:{
 		type: Number,
 		required: true
 	},
 	user_name:{
 		type: String, 
 		required: true
 	},
 	user_id:{
 		type: Number,
 		required: true
 	},
 	published:{
 		type: Date,
 		default: Date.now
 	},
 	rating:{
 		type: Number,
 		min: 0, max: 5,
 		required: false
 	},
 	text:{
 		type: String,
 		required: false
 	}
 });

 var Comment = module.exports = mongoose.model('Comment', commentSchema);

//Get All Comments
module.exports.getComments = function(callback, limit){
	Comment.find(callback).limit(limit);
}


//Get Comments By Event ID
module.exports.getCommentsByEventID = function(event_id, callback){
	var queryCond = {}
	if(event_id){
		queryCond.event_id=event_id;
	}
	console.log(queryCond)
	Comment.find(queryCond, callback);
}


