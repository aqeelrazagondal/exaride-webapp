var mongoose = require('mongoose');
var Location = require('./Location');
var Routes = require('./Routes');
var User = require('./User');

var RouteLocation = new mongoose.Schema({
    
    _routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Routes', default: null },
    _userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }

}, { timestamps: true });

// Export the Mongoose model
module.exports = mongoose.model('RouteLocation', RouteLocation);