var NodeGeocoder = require('node-geocoder');
var mongoose = require('mongoose');
var sleep = require('system-sleep');
const opencage = require('opencage-api-client');

//Connect to Mongodb 
mongoose.connect('mongodb://localhost/finzDB', { useNewUrlParser: true } )
var db = mongoose.connection;
var Place = require('./models/places');
var OCD_API_KEY='f39562b1bbf54511985f6b076dc99d49'



var options = {
  //provider: 'opencage',
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  //apiKey: 'f39562b1bbf54511985f6b076dc99d49', // for Mapquest, OpenCage, Google Premier
  apiKey: 'AIzaSyDZhZwNd9qqZMF23gqnAGsNbQiIJA_q-FU',
  formatter: 'json'         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);


Place.find()
          .then((places) => {
              places.forEach((doc, callback) => {
                  let {street, postcode, city, _id} = doc;
                  //console.log(street + ' ' + postcode + ' ' + city +  ' ' + _id);
                  if(street){
                    if(postcode){
                      if(city){
                        //console.log({q: street + ' ' + postcode + ' ' + city}); 
                        opencage.geocode({key: OCD_API_KEY, q: street + ' ' + postcode + ' ' + city}, callback).then(data => { 
                        //console.log(JSON.stringify(data));
                        if (data.status.code == 200) {
                          //if (data.results.length > 0) {
                            var place = data.results[0];
                            //console.log(place.formatted);
                            //console.log(place.geometry);
                            console.log(place.geometry.lat);
                            console.log(place.geometry.lng);

                            if(place.geometry.lat){
                              if(place.geometry.lng){
                                Place.updateOne(
                                  {_id: _id},
                                  {$set: {latitude: place.geometry.lat, longitude: place.geometry.lng}},
                                  (err, data) => {
                                      err ? console.log(err) : console.log(data);
                                  }
                            ); 
                              }
                            }
                            //console.log(place.annotations.timezone.name);
                        //  }
                        } else if (data.status.code == 402) {
                          console.log('hit free-trial daily limit');
                          console.log('become a customer: https://opencagedata.com/pricing'); 
                        } else {
                          // other possible response codes:
                          // https://opencagedata.com/api#codes
                          console.log('error', data.status.message);
                        }
                      }).catch(error => {
                        console.log('error', error.message);
                      });

                      /*
                        geocoder.geocode(street + ' ' + postcode + ' ' + city)
                        .then(function(res) {
                        Place.findByIdAndUpdate(_id,{$set:res.latitude}, function(err, result){
                                if(err){
                                    console.log(err);
                                }
                                console.log("RESULT: " + result);
                                res.send('Done')
                            });
                          console.log(res); 
                          var jsonObj = JSON.parse(res);
                          console.log(jsonObj["latitude"]); 
                        })
                        .catch(function(err) {
                          console.log(err);
                        });

                    */
                        }
                     }
                  }
                  sleep(1100);
              })// end forEach
              });



//function(myDoc, callback) { print( "user: " + myDoc.name ); } );
// Or using Promise
/*
geocoder.geocode('Museumstraße 7a 4020 Linz')
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });
*/
 