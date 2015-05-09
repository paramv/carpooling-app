define([
	'jquery',
	'underscore',
	'bb',
	'app/base/form',
	'app/models/user',
	'app/mapview',
	'app/locations',
	'app/state',
	'hbs!./signup'
], function($, _, bb, Form, User, MapView, locations, State, tpl) {
	var Login = Form.extend({
		template: tpl,
		model: new User(),
		render: function() {
			var $markup;
			$markup = $(this._template({
				locations: locations
			})).html();
			this.$el.html($markup);
			this.$el.addClass('form');
			this.mapView = new MapView({
				el: this.$el.find('.location-picker').get(0)
			});
			this.mapView.initMaps();
		},
		events: {
			// 'afterrender'
			// 'click .pick-location': 'onLocationClick',
			'locationselected .location-picker': 'onLocationSelect',
			'submit': 'onSubmit'
		},

		// onLocationClick:function(e){
		// 	var $btn = this.$el.find('.pick-location');
		// 	var $el = this.$el.find('.location-picker');
		// 	if($el.hasClass('open')){
		// 		$btn.text('Pick Location');
		// 		$el.removeClass('open').height(0);
		// 	}else{
		// 		$btn.text('Close');
		// 		$el.addClass('open').height('400px');
		// 		this.mapView.initMaps();
		// 	}
		// 	e.preventDefault();
		// },

		onLocationSelect: function(e, latLng) {
			this.$el.find('input[name=address]').val(latLng.A + ',' + latLng.F);
			this.model.set('address', latLng.A + ',' + latLng.F);
		},

		onSubmit: function(e, el) {

			var self = this;
			var workTimings = {};

			e.preventDefault();
			this.clearErrors();
			if (this.model.get('password') !== this.model.get('password_alt')) {
				this.setErrors('Passwords don\'t match');
				return false;
			}
			this.model.unset('password_alt');
			
			workTimings.start = this.model.get('starttime') || "09:00";
			this.model.unset('starttime');
			workTimings.end = this.model.get('endtime') || "18:00";
			this.model.unset('endtime');
			this.model.set('workTimings', workTimings);
			var addr = this.model.get('address');
			if (typeof addr === 'string') {
				this.model.set('address', addr.split(','));
			}
			var worklocation = this.$el.find('select[name=worklocation]').val();
			var workLocationName = worklocation.split(':')[0];
			var workLocationLatLng = worklocation.split(':')[1];
			this.model.set('worklocation', {
				name: workLocationName,
				address: workLocationLatLng.split(',')
			});
			this.model.set('vehicle',$('[name=vehicle]').val() === 'yes' ? true : false);
			// this.$el.find('.pick-location').text('Pick Location');
			// this.$el.find('.location-picker').removeClass('open').height(0);
			this.clearErrors();
			this.model.save(null, {
				validate: false
			}).done(function(resp) {
				State.getInstance().set('user',resp.user);
				window.location.hash = 'dash';
			}).fail(function() {

			});
		},

		setErrors: function(message) {
			this.clearErrors();
			this.$el.find('.status').text(message);
		},

		clearErrors: function() {
			this.$el.find('.status').text('');
		}
	});

	return Login;
});