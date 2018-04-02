var mongoose = require('mongoose');
var Location = require('./Location');

var RouteSchema = new mongoose.Schema({
    //comment//comment

    routeManager: String,
    _beginLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null },
    _endLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null }


}, { timestamps: true });

// Export the Mongoose model
module.exports = mongoose.model('Route', RouteSchema);