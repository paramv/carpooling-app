var express = require('express'),
    router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var passport = require('passport');

module.exports = function(app) {
    app.use('/search', router);
};

router.post('/', function(req, res, next) {
    // ridiculous
    var body = req.body;
    var userId = body.userId;
    var query;
    User.findById(userId, function(err, user) {
        if (err) {
            return next(err);
        }
        if (body.isPassenger === "true") {
            console.log(user.address, body.radius / 6371)
            query = User.find({
                'worklocation.name': user.worklocation.name,
                vehicle: true,
                address: {
                    $geoWithin: {
                        $centerSphere: [user.address, body.radius / 6371]
                    }
                }
            });
            if (body.startTime) {
                query.where('workTimings.start').equals(user.workTimings.start);
            }
            if (body.endTime) {
                query.where('workTimings.end').equals(user.workTimings.end);
            }
            query.where('_id').ne(user._id)
                .select('_id name org email workTimings address vehicle')
                .limit(10)
                .exec(function(err, users) {
                    if (err) {
                        return next(err);
                    }
                    res.json(users);
                });
        } else {
            if (body.searchType === 'near') {
                query = User.find({
                    'worklocation.name': user.worklocation.name,

                    address: {
                        $geoWithin: {
                            $centerSphere: [user.address, body.radius / 6371]
                        }
                        // $near: user.address,
                        // $maxDistance: body.radius/6371
                    }
                });
            } else {
                query = User.find({
                    'worklocation.name': user.worklocation.name,
                    address: {
                        $within: {
                            $box: [
                                [body.bounds.sw[0], body.bounds.sw[1]],
                                [body.bounds.ne[0], body.bounds.ne[1]]
                            ],
                            $maxDistance: 500/6371
                        }
                    }
                });
            }
            if (body.startTime === 'true') {
                query.where('workTimings.start').equals(user.workTimings.start);
            }
            if (body.endTime === 'true') {
                query.where('workTimings.end').equals(user.workTimings.end);
            }
            query.where('_id').ne(user._id)
                .where('vehicle').equals(false)
                .select('_id name org email workTimings address vehicle')
                .limit(10)
                .exec(function(err, users) {
                    if (err) {
                        return next(err);
                    }
                    res.json(users);
                });
        }
        if (req.startTime) {

        }
    });

});