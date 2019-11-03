const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  provider_ID: {
    type: String,
    required: false
  },
  provider: {
    type: String,
    required: false
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;

