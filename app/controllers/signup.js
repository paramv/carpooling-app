var express = require('express'),
    router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(app) {
    app.use('/signup', router);
};

router.post('/', function(req, res, next) {
    var body = req.body;
    var keys = Object.keys(body);
    console.log(keys,body);
    var user = new User();
    keys.forEach(function(key) {
        if(key === 'password'){
            user.setPassword(body[key]);
            return true;
        }
        user[key] = body[key];
    });

    user.save(function(err, user) {
        if (err) {
            return next(err);
        } else if(user._id){
            req.session.userLoggedIn = true;
            req.session.userId = user._id;
            user.password = '';
            res.json({
                user: user
            });
        }
    });
});