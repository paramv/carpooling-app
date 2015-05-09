// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var bcrypt = require('bcrypt');



var ConnectionSchema = new Schema({
	userId: String,

});

var Preferences = new Schema({
	visibleFields: Array
});

var VehicleSchema = new Schema({
	manufacturer: String,
	numberPlate: String,
	name: String
});

var UserSchema = new Schema({
	name: String,
	email: String,
	password: String,
	address: {
		type: [Number], // [<longitude>, <latitude>]
		index: '2d' // create the geospatial index
	},
	office: String,
	worklocation: {
		name: String,
		address: {
			type: [Number],
			index: '2d'
		}
	},
	mobilenumber: String,
	workTimings: {
		start: {
			type: String,
			default: "09:00"
		},
		end: {
			type: String,
			default: "18:00"
		}
	},
	vehicle: {
		type: Boolean,
		default: false
	},
	_isNumberVerified: {
		type: Boolean,
		default: false
	},
	connections: [ConnectionSchema]
});

UserSchema.methods.setPassword = function(pwd) {
	console.log(pwd);
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(pwd, salt);
	this.password = bcrypt.hashSync(pwd, salt);
};

UserSchema.methods.validPassword = function(pwd) {
	console.log(this.password)
	return bcrypt.compareSync(pwd, this.password);
};


mongoose.model('User', UserSchema);