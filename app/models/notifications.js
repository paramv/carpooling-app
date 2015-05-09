var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	from: String,
	to: String,
	status: Boolean
});

mongoose.model('Notification',NotificationSchema);