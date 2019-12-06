var NodeGeocoder = require('node-geocoder');
var mongoose = require('mongoose');
var sleep = require('system-sleep');
const opencage = require('opencage-api-client');

//Connect to Mongodb 
mongoose.connect('mongodb://localhost/finzDB', { useNewUrlParser: true } )
var db = mongoose.connection;
var Place = require('./models/places');
var Organizer = require('./models/organizers');
var OCD_API_KEY='f39562b1bbf54511985f6b076dc99d49'
 
console.log('Places insert starting!');
Place.find()
          .then((places) => {
              places.forEach((doc, callback) => {
                  let {street, postcode, city, name, _id} = doc;
                  if(street){
                    if(postcode){
                      if(city){
                        //TBD: IF Street or anything else missing select by other search criteria?! Maybe place name + city?!  
                        opencage.geocode({key: OCD_API_KEY, q: street + ' ' + postcode + ' ' + city}, callback).then(data => { 
                        if (data.status.code == 200) {
                            var place = data.results[0];
                            //console.log(place.geometry.lat);
                            //console.log(place.geometry.lng);
                            
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
                        }
                     }
                  }
                  else if(name){
                        //TBD: IF Street or anything else missing select by other search criteria?! Maybe place name + city?!  
                        opencage.geocode({key: OCD_API_KEY, q: name + ' Linz'}, callback).then(data => { 
                        if (data.status.code == 200) {
                            var place = data.results[0];
                            //console.log(place.geometry.lat);
                            //console.log(place.geometry.lng);
                            
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
                  }
                  sleep(1100);
              })// end forEach
              });

console.log('Places insert finished!\n');


