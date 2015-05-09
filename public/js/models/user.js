define([
	'bb',
	'jquery',
	'underscore'
], function(bb, $, _) {
	var Error = function(){
		return {

		};
	}
	var User = bb.Model.extend({
		url: '/signup',
		authUrl: '/auth/login',
		// validate: function() {
		// 	var model = this.toJSON();
		// 	var errors = {};

		// 	return true;
		// },
		authenticate: function() {
			var authUrl = this.authUrl;
			var model = this;
			var modelJSON = model.toJSON();
			var dfd;
			if (modelJSON.email && modelJSON.password) {
				return $.ajax({
					type: 'post',
					url: authUrl,
					data: modelJSON
				});
			} else {
				dfd = $.Deferred();
				dfd.reject('Username or password is empty');
				return dfd;
			}
		}
	});
	return User;
})