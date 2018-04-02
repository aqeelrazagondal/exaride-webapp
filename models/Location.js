var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    //comment
    title: String,
    // latitude: String,
    // longitude: String
    loc: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
    }
}, { timestamps: true });


module.exports = mongoose.model('Location', LocationSchema);