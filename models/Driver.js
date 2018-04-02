var mongoose = require('mongoose');
var User = require('./User');

// Define our schema
var DriverSchema = new mongoose.Schema({
    //comment
    _userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    password: String,
    active: { type: Boolean, default: false },

}, { timestamps: true });

// Export the Mongoose model
module.exports = mongoose.model('Driver', DriverSchema);