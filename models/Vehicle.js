var mongoose = require('mongoose');

// Define our schema
var VehicleSchema = new mongoose.Schema({
    //comment

    _userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,default:null },
    regNumber: String,
    type: String,
    seatingCapacity: Number

}, { timestamps: true });
//VehicleSchema.index({_userId})
// Export the Mongoose model
module.exports = mongoose.model('Vehicle', VehicleSchema);