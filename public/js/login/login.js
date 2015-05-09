define([
	'jquery',
	'underscore',
	'bb',
	'app/state',
	'app/base/form',
	'app/models/user',
	'hbs!./login'
], function($, _, bb, State, View, User, tpl) {
	var state = State.getInstance();
	var Login = View.extend({
		template: tpl,
		model: new User(),
		events: {
			'submit': 'onSubmit'
		},
		onSubmit: function(e, el) {

			var self = this;
			e.preventDefault();
			this.model.authenticate().done(function(resp) {

				state.set('user',resp.user);
				self.clearStatus();
				window.location.hash='dash';
			}).fail(function(resp) {
				try {
					var res = JSON.parse(resp.responseText);
					if (res.message === 'auth-failure') {
						self.setStatus('error', 'The username or password you entered is incorrect.');
					}
				} catch (e) {
					self.setStatus('error', 'Yikes!Something\'s wrong.');
				}

			})
		}
	});

	return Login;
});