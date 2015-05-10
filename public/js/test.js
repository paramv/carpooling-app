define([
	'jquery',
	'app/locations',
	'app/models/user'
], function($, locations, User) {
	var rand = function(val) {
		return Math.floor(Math.random() * val);
	};

	var randName = function(num) {
		var alpha = 'abcdefgdgdglpoqh';
		var count = rand(num);
		var name = '';
		for (var i = 1; i < count; i++) {
			name += alpha.substring(rand(i * 10), rand(count * 10));
		}
		return name;
	};

	var randEmail = function(num) {
		var name = randName(num);
		return name + '@gmail.com';
	};

	var pass = 'tardis';

	var companyName = function(num) {
		var name = randName(3);
		return name.toUpperCase();
	};

	var randLocation = function() {
		var loc = locations[rand(locations.length)];
		loc.address = loc.location.slice().reverse();
		// delete loc.location;
		return loc;
	};

	var phone = function() {
		return rand(100000000);
	};

	var coordinates = function() {
		// var lat = 13.0760374,
		// 	lng = 80.2469604;
		// var lat = 12.9735372,
		// 	lng = 80.1301019;
		var lat = 12.9920836,
			lng = 80.2436989;
		var x = rand(75) / 6371;
		var y = rand(75) / 6371;
		return [lng + (y * (rand(99) % 2 ? 1 : -1)), lat + (x * (rand(99) % 2 ? 1 : -1))];
	};

	var vehicle = function() {
		var num = rand(500000);
		return !!(num % 2);
	};

	var workTimings = function() {
		var start = '0900',
			end = '1800';
		if (vehicle()) {
			return {
				start: start,
				end: end
			}
		} else {
			return {
				start: '0800',
				end: '1700'
			}
		};
	};
	var i = 0;
	var saveModel = function() {
		var user = new User();
		user.set('name', randName(7));
		user.set('email', randEmail(5));
		user.set('password', pass);
		user.set('office', companyName(5));
		user.set('mobilenumber', phone());
		user.set('address', coordinates());
		user.set('vehicle', vehicle());
		user.set('worklocation', randLocation())
		user.set('workTimings', workTimings());
		user.save().done(function() {

		}).always(function() {
			if (i < 20) {
				i++;
				saveModel();
			}
		});
	}
	return function() {
		saveModel();
	}


});