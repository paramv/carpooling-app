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
    User.findById(userId, function(err, user) {
        if (err) {
            return next(err);
        }
        if (body.isPassenger) {
            User.find({
                    'worklocation.name': user.worklocation.name,
                    vehicle: true,
                    address: {
                        $near: user.address,
                        $maxDistance: parseInt(body.radius)
                    }
                })
                .select('name email workTimings address vehicle')
                .exec(function(err, users) {
                    if (err) {
                        return next(err);
                    }
                    res.json(users);
                });
        } else {
            User.find({
                    'worklocation.name': user.worklocation.name,
                    vehicle: true,
                    address: {
                        $within: {
                            $box: [
                                [user.bounds.sw[0], user.bounds.sw[0]],
                                [user.bounds.ne[0], user.bounds.ne[0]]
                            ],
                            $maxDistance: parseInt(body.radius)
                        }
                    }
                })
                .select('name email workTimings')
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