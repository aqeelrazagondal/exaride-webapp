var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var moment = require('moment-timezone');
var m = moment().tz("America/Los_Angeles").format();

var Location = require('../models/Location');
var Passenger = require('../models/Passenger');
var Shift = require('../models/Shift');
var User = require('../models/User');
var Vehicle = require('../models/Vehicle');
var Routes = require('../models/Routes');
var RouteLocation = require('../models/RouteLocation');


router.post('/register', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({ status: 'failure', message: 'Please pass username and password.' });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            user_type: req.body.user_type,
            email: req.body.email
        });

        // save the user
        newUser.save().then(result => {
            console.log(result);
            res.status(201).json({
                status: 'success',
                message: 'Created User Succesfully',
                object: {
                    result
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
            });
        });
    }
});

router.post('/login', function (req, res) {
    var userResponseObject;
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user, config.secret);
                    console.log("isMatch" + isMatch);

                    userResponseObject = new User({
                        username: user.username,
                        user_type: user.user_type,
                        email: user.email,
                        last_shared_loc_time: user.last_shared_loc_time,
                        share_loc_flag_time: user.share_loc_flag_time,
                        deactivate_user: user.deactivate_user,
                        profile_photo_url: user.profile_photo_url,
                        share_location: user.share_location
                    });
                    console.log(userResponseObject);
                    // return the information including token as JSON
                    res.json({
                        status: "success",
                        message: "Successfully Logged In",
                        object: userResponseObject
                    });
                } else {
                    res.status(401).send({
                        status: "failure",
                        message: 'Authentication failed. Wrong password.'
                    });
                }
            });
        }
    });
});

router.post('/addLocation', (req, res, next) => {
    const location = new Location();
    location.title = req.body.title;
    location.loc = [req.body.lat, req.body.lng];

    location.save()
        .then(result => {
            // console.log(result.location);
            console.log(result);
            res.status(201).json({
                status: 'success',
                message: 'Added Location Succesfully',
                object: {
                    title: result.title,
                    location: result.loc
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getAllLocations', (req, res, next) => {
    Location.find()
        .exec()
        .then(docs => {
            const response = {
                status: 'Success',
                message: 'List of Locations',
                object: [docs]
            }
            console.log(docs);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/addPassenger', (req, res) => {
    if (!req.body.full_name || !req.body.email) {
        res.json({ status: 'failure', message: 'Please enter full name and password.' });
    } else {
        var passenger = new Passenger({
            phone: req.body.phone,
            full_name: req.body.full_name,
            email: req.body.email,
            address: req.body.address
            // profile_photo_url: req.body.profile_photo_url
            // city: req.body.address.city
        });

        // save the user
        passenger.save(function (err) {
            if (err) {
                return res.json({
                    status: "failure",
                    message: 'Paassenger already exists.'
                });
            }
            res.json({
                status: 'success',
                message: 'Successful created new user.',
                object: passenger
            });
        });
    }
});


router.post('/addShift', (req, res, next) => {
   
    // moment().valueOf();
    // moment().unix()
    // let m = moment(); 
    // var starting_time = m.format("h: mm: ss a");
    // var ending_time = m.format("h: mm: ss a");
 
    const shift = new Shift({
        _driverId: req.body._driverId,
        _routeId: req.body._routeId,
        shift_title: req.body.shift_title,
        vehicle: req.body.vehicle,
        shift_status: req.body.shift_status,
        starting_time: req.body.starting_time,
        ending_time: req.body.ending_time
    });
    console.log(shift);

    shift.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            status: 'success',
            message: 'Created shift Succesfully',
            shiftDetail: {
                _driverId: result._driverId,
                _routeId: result._routeId,
                shift_title: result.shift_title,
                vehicle: result.vehicle,
                shift_status: result.shift_status,
                starting_time: result.starting_time,
                ending_time: result.ending_time
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
        error: err
        });
    });
});

router.get('/getAllShift', (req, res, next) => {
    
    // User.find({}, function (err, users) {
    //     if (err) throw err;

    //     console.log(users);        
    // });    

    Shift.find()
        .exec()
        .then(docs => {
            const response = {
                status: 'success',
                message: 'List of shifts',
                object: docs.map(doc => {                     

                    return {
                        _driverId: doc._driverId,
                        // driverName: userObj,
                        _routeId: doc._routeId,
                        shift_title: doc.shift_title,
                        vehicle: doc.vehicle,
                        shift_status: doc.shift_status,
                        starting_time: doc.starting_time,
                        ending_time: doc.ending_time
                    }
                    })
                }
                // console.log(docs);
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                error: err
                });
            });
});

router.post('/addVehicle', (req, res, next) => {
    const vehicle = new Vehicle({
        _userId: new mongoose.Types.ObjectId(),
        regNumber: req.body.regNumber,
        type: req.body.type,
        seatingCapacity: req.body.seatingCapacity
    })
    vehicle.save().then(result => {
        console.log(result);
        res.status(201).json({
            status: 'Successful',
            message: 'Vehicle added Succesfully',
            object: {
                _userId: result._userId,
                regNumber: result.regNumber,
                type: result.type,
                seatingCapacity: result.seatingCapacity,
                request: {
                    type: 'POST',
                    url: 'https://safe-savannah-80688.herokuapp.com/api/addVehicle' + result._userId
                }
            }
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/addRoute', (req, res, next) => {
    const routes = new Routes({
        routeManager: req.body.routeManager,
        _routeId: mongoose.Types.ObjectId(),
        _beginLocationId: new mongoose.Types.ObjectId(),
        _endLocationId: new mongoose.Types.ObjectId()
    })
    routes.save().then(result => {
        console.log(result);
        res.status(201).json({
            status: 'Successful',
            message: 'Routes added Succesfully',
            object: {
                _routeId: result._routeId,
                routeManager: result.routeManager,
                _beginLocationId: result._beginLocationId,
                _endLocationId: result._endLocationId
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/getRoutes', (req, res, next) => {
    Shift.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                shift: docs.map(doc => {
                    return {
                        vehicle: doc.vehicle,
                        shift_title: doc.shift_title,
                        _driverId: doc._driverId,
                        shift_status: doc.shift_status,
                        starting_time: doc.starting_time,
                        ending_time: doc.ending_time
                    }
                })
            }
            console.log(docs);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.post('/addRoutLocations', (req, res, next) => {
    Location.findById(req.body._id)
        .exec()
        .then(docs => {
            const locationResponse = {
                count: docs.length,
                locations: docs.map(doc => {
                    return {
                        
                    }
                })
            }
            console.log(locationResponse);

            res.status(200).json(locationResponse);
        })
    const routelocation = new RouteLocation({
        _routeId: new mongoose.Types.ObjectId(),
        _userId: new mongoose.Types.ObjectId()
    });
    
    routelocation.save().then(result => {
        console.log(result);
        res.status(201).json({
            status: 'Successful',
            message: 'Routes route location Succesfully',
            object: {
                _routeId: result._routeId,
                _userId: result._userId
            }
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getAllRouteLocations', (req, res, next) => {

    Shift.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: 'success',
                message: 'Route locations',
                routeLocations: docs.map(doc => {
                    return {
                            _routeId: doc._routeId,
                        // _userId: doc._userId,
                            locationResponse: doc.locationResponse
                        }
                    })
                }
            console.log(docs);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
        });
    });

    
});
module.exports = router;
