var mongoose = require('mongoose');
var parserold = require('xml2json');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var convert = require('xml-js');
var http = require('http');
var parser = new xml2js.Parser();
var concat = require('concat-stream');
var eyes = require('eyes');



//Connect to Mongodb 
mongoose.connect('mongodb://localhost/finzDB', { useNewUrlParser: true } )
var db = mongoose.connection;
var Event = require('./models/events');
 
var eventUrl = 'http://www.linztermine.at/schnittstelle/downloads/events_xml.php'

/*
var cursor = Event.find().cursor(); 
cursor.next().then(doc => { 
    console.log(doc);
    Event.update({_id : doc._id}, {$set : {firstdate : new ISODate(doc.firstdate)}}); 
    Event.update({_id : doc._id}, {$set : {lastdate : new ISODate(doc.lastdate)}}); 
});
*/

//Update Datestring to Date format
Event.find()
          .then((events) => {
              events.forEach((doc, callback) => {
                Event.updateOne(
                  {_id: doc._id},
                  {$set: {"firstdate": new Date(doc.firstdate), "lastdate": new Date(doc.lastdate)}},
                  (err, data) => {
                      err ? console.log(err) : console.log(data);
                  }
                ); 
            });
        });


/*
http.get(eventUrl, function(res) {
    var response_data = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        response_data += chunk;
    });
    res.on('end', function() {
        parser.parseString(response_data, function(err, result) {
            if (err) {
                console.log('Got error: ' + err.message);
            } else {
                //eyes.inspect(result);
                parser.parseString(result, function(err, res){
                  console.log(res);
                })
                console.log('Done.');
            };
        });
    });
    res.on('error', function(err) {
        console.log('Got error: ' + err.message);
    });
});
*/