var express = require('express'),
    router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var passport = require('passport');

module.exports = function(app) {
    app.use('/auth', router);
};

router.get('/', function(req, res, next) {
    // ridiculous
    if (req.session.userLoggedIn && req.session.userId) {
        User.findById(req.session.userId, function(err, user) {
            if (err) {
                return res.json({
                    _userLoggedIn: false
                });
            } else if(user){
                user.password = '';
                res.json({
                    _userLoggedIn: true,
                    user: user
                });
            }
        });
    } else {
        res.json({
            _userLoggedIn: false
        });
    }

});

router.get('/logout', function(req, res, next) {
    req.session.userLoggedIn = false;
    req.session.userId = null;
    res.send('ok')
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            next(err);
        } else if (!user) {
            res.status(500)
                .send({
                    message: 'auth-failure'
                })
        } else {
            req.session.userLoggedIn = true;
            req.session.userId = user._id;
            user.password = '';
            res.json({
                message: 'auth-success',
                user: user
            });
        }

    })(req, res, next);
});