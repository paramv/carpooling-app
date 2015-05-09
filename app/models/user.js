// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
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
	mobilenumber: String,
	workTimings: {
		start: String,
		end: String
	},
	vehicle: {
		type: Boolean,
		default: false
	},
	_isNumberVerified:{
		type: Boolean,
		default:false
	}
});

UserSchema.methods.setPassword = function(pwd){
	this.password = bcrypt.hashSync(pwd);
};

UserSchema.methods.validPassword = function(pwd) {
	return bcrypt.compareSync(pwd, this.password); 
};


mongoose.model('User', UserSchema);