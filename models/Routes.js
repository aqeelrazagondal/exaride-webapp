var mongoose = require('mongoose');
var Location = require('./Location');

var RouteSchema = new mongoose.Schema({
    
    routeManager: String,
    _beginLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null },
    _endLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null }

}, { timestamps: true });

// Export the Mongoose model
module.exports = mongoose.model('Route', RouteSchema);