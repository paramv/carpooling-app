define([
	'jquery',
	'underscore',
	'bb',
	'app/base/view',
	'hbs!./login'
], function($, _, bb, View, tpl) {
	var Login = View.extend({
		template:tpl
	});

	return Login;
});