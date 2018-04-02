var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Location = require('../models/Location');
var Passenger = require('../models/Passenger');
var Shift = require('../models/Shift');
var User = require('../models/User');
var Vehicle = require('../models/Vehicle');


router.post('/register', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({ status: 'failure', message: 'Please pass username and password.' });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });

        // save the user
        newUser.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created User Succesfully',
                user: {
                    username: result.username,
                    password: result.password,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3100/api/register/'
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

                    userResponseObject = new User({
                        username: req.body.username,
                        password: req.body.password
                    });
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
                status: 'Added Location Succesfully',
                locationDetail: {
                    title: result.title,
                    location: result.loc,
                    request: {
                        type: 'POST',
                        url: ''
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

router.get('/getAllLocations', (req, res, next) => {
    Location.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
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
    const shift = new Shift({
        _userId: new mongoose.Types.ObjectId(),
        shift_title: req.body.shift_title,
        vehicle: req.body.vehicle
    })
    shift.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            status: 'Created shift Succesfully',
            shiftDetail: {
                _userId: result._userId,
                shift_title: result.shift_title,
                vehicle: result.vehicle,
                request: {
                    type: 'POST',
                    url: 'https://damp-sierra-13906.herokuapp.com/api/' + result._userId
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

router.get('/getAllShift', (req, res, next) => {
    Shift.find()
        .select('_userId shift_title vehicle')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                shift: docs.map(doc => {
                    return {
                        vehicle: doc.vehicle,
                        shift_title: doc.shift_title,
                        _userId: doc._userId,
                        request: {
                            type: 'GET',
                            url: 'https://damp-sierra-13906.herokuapp.com/api/getAllShift/' + doc._userId
                        }
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
                    url: 'https://damp-sierra-13906.herokuapp.com/api/addVehicle' + result._userId
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


module.exports = router;
