var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var schema = new Schema({
  email: {type: String, required: true, trim: true},
  title:{type: String, unique: true, required: true},
  content:{type: String, required: true},
  content2:{type: String, required: true},
  city:{type: String, required: true},
  bigAddress: {type: String, required: true},
  smallAddress: {type: String, required: true},
  postcode: {type: String, required: true},
  roomstyle:{type: String, required: true},
  cost:{type: Number, default: 0},
  capacity:{type: Number, default: 0},
  state:{type: String, required: true, default: "예약가능"},
  read:{type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var Room = mongoose.model('Room', schema);

module.exports = Room;
