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
        if (body.isPassenger) {
            query = User.find({
                'worklocation.name': user.worklocation.name,
                vehicle: true,
                address: {
                    $near: user.address,
                    $maxDistance: parseInt(body.radius)
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
                    vehicle: false,
                    address: {
                        $near: user.address,
                        $maxDistance: parseInt(body.radius)
                    }
                });
            } else {
                query = User.find({
                    'worklocation.name': user.worklocation.name,
                    vehicle: false,
                    address: {
                        $within: {
                            $box: [
                                [body.bounds.sw[0], body.bounds.sw[0]],
                                [body.bounds.ne[0], body.bounds.ne[0]]
                            ],
                            $maxDistance: parseInt(body.radius)
                        }
                    }
                });
            }
            if (body.startTime) {
                query.where('workTimings.start').equals(user.workTimings.start);
            }
            if (body.endTime) {
                query.where('workTimings.end').equals(user.workTimings.end);
            }
            query.select('_id name org email workTimings address vehicle')
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