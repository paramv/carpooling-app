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
        if (!user.vehicle) {
            console.log(user.address,body.radius/6371)
            query = User.find({
                'worklocation.name': user.worklocation.name,
                vehicle: true,
                address: {
                    $near: user.address,
                    $maxDistance: body.radius/6371
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
                console.log('near');
                query = User.find({
                    'worklocation.name': user.worklocation.name,
                    address: {
                        $near: user.address,
                        $maxDistance: body.radius/6371
                    }
                });
            } else {
                console.log(user.worklocation.name);
                query = User.find({
                    'worklocation.name': user.worklocation.name,
                    // address: {
                    //     $within: {
                    //         $box: [
                    //             [body.bounds.sw[0], body.bounds.sw[0]],
                    //             [body.bounds.ne[0], body.bounds.ne[0]]
                    //         ],
                    //         $maxDistance: 500
                    //     }
                    // }
                });
            }
            if (body.startTime) {
                query.where('workTimings.start').equals(user.workTimings.start);
            }
            if (body.endTime) {
                query.where('workTimings.end').equals(user.workTimings.end);
            }
            query
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