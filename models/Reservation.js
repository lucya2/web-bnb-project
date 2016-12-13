var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title:{type: String, required: true},
  name: {type: String, required: true, trim: true},
  requesterEmail: {type: String, required: true, trim: true},
  hostEmail: {type: String, required: true, trim: true},
  cost:{type: Number, default: 0},
  bigAddress: {type: String, required: true},
  state:{type: String, required: true},
  fromDate:{type: Date},
  toDate:{type: Date},
  capacity:{type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var Reservation = mongoose.model('Reservation', schema);

module.exports = Reservation;
