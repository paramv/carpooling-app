var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
	},
	function(email, password, done) {
		console.log(email);
		User.findOne({
			email: email
		}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: 'Incorrect username.'
				});
			}
			if (!user.validPassword(password)) {
				return done(null, false, {
					message: 'Incorrect password.'
				});
			}
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
	console.log('ggg',user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log(id);
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

module.exports = function(app, config) {
	app.engine('handlebars', exphbs({
		layoutsDir: config.root + '/app/views/layouts/',
		defaultLayout: 'main',
		partialsDir: [config.root + '/app/views/partials/']
	}));
	app.set('views', config.root + '/app/views');
	app.set('view engine', 'handlebars');

	var env = process.env.NODE_ENV || 'development';
	app.locals.ENV = env;
	app.locals.ENV_DEVELOPMENT = env == 'development';

	// app.use(favicon(config.root + '/public/img/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(cookieParser());
	app.use(session({
		secret: 'trippie-app',
		cookie: {
			maxAge: 60000*60*5
		},
		saveUninitialized: true,
		resave: false
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(compress());
	app.use(express.static(config.root + '/public'));
	app.use(methodOverride());



	var controllers = glob.sync(config.root + '/app/controllers/*.js');
	controllers.forEach(function(controller) {
		require(controller)(app);
	});

	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err,
				title: 'error'
			});
		});
	}

	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {},
			title: 'error'
		});
	});

};