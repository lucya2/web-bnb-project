var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, trim: true},
  title:{type: String, required: true},
  content:{type: String, required: true},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var Ccomment = mongoose.model('Ccomment', schema);

module.exports = Ccomment;
