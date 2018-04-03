var mongoose = require('mongoose');
var Routes = require('./Routes');
// var Driver = require('./Driver');
// var Passenger = require('./Passenger');
var User = require('./User');

var ShiftSchema = new mongoose.Schema({
    
    _driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, required: true},
    _routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Routes', default: null },
    // passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', default: null, required: true},
    starting_time: Date,
    ending_time: Date,
    shift_title: String,
    // vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }
    vehicle: String,
    shift_status: Boolean

}, { timestamps: true });

module.exports = mongoose.model('Shift', ShiftSchema);