define([
	'jquery',
	'underscore',
	'bb',
	'app/state',
	'app/base/view',
	'./mapsearchview',
	'hbs!./dash',
	'hbs!./filters',
	'hbs!./results'
], function($, _, bb, State, View, MapSearchView, tpl, filterTpl, resultsTpl) {
	// var filterCategories = ['startTime', 'endTime', 'radius'];
	var Dash = View.extend({
		template: tpl,
		initialize: function() {
			this.filterModel = new bb.Model({
				'startTime': true,
				'endTime': true,
				'radius': 10,
			});
			// this.listenTo(this.filterModel, "change", this.filter);
			this.render();
		},
		render: function() {
			var $markup;
			var user = State.getInstance().get('user');
			var self = this;
			$markup = $(this._template(user)).html();

			this.$el.html($markup);
			this.$el.find('.filters-wrapper').html(filterTpl());
			this.$el.addClass('dash-view');
			this.mapView = new MapSearchView({
				el: this.$el.find('.map-canvas-wrapper').get(0)
			});
			this.mapView.user = user;
			this._bindEvents();
			this.mapView.initMaps().done(function() {
				self.search();
			});
		},

		_bindEvents: function() {
			var self = this;
			var filterModel = this.filterModel;
			this.$el.find('.filters-wrapper').find('input').each(function(el) {
				var $this = $(this);
				if ($this.attr('data-bind')) {
					$this.on('change', function() {
						var $thisEl = $(this);
						if ($thisEl.is('input[type=checkbox]')) {
							filterModel.set($thisEl.attr('data-bind'), ($thisEl.is(':selected') === 'on' ? true : false));
						} else {
							filterModel.set($thisEl.attr('data-bind'), parseInt($thisEl.val()));
						}
					});
				}
			});
		},

		events: {
			// 'afterrender'
			'click .search-btn ': 'search',
			'click .logout': 'logout'

		},

		search: function() {
			var $filterEl = this.$el.find('.filters-wrapper');
			var bounds = this.mapView.directionResult.bounds;
			var legs = this.mapView.directionResult.legs[0];
			var filterModel = this.filterModel;
			var user = State.getInstance().get('user');
			var self = this;


			filterModel.set('isPassenger', !user.vehicle);
			filterModel.set('userId', user._id);

			filterModel.set('bounds', {
				'sw': [bounds.getSouthWest().A, bounds.getSouthWest().F],
				'ne': [bounds.getNorthEast().A, bounds.getNorthEast().F]
			});
			filterModel.set('startPoint', [legs.start_location.A, legs.start_location.F]);
			var filter = this.filterModel.toJSON();
			// t = this.mapView.directionResult;
			$.ajax({
				type: 'POST',
				dataType: "json",
				url: '/search',
				data: filter
			}).done(function(resp){
				self.mapView.plotUsers(resp);
				self.$el.find('.results-wrapper').html(resultsTpl({users:resp,user:user}));
			});
		},

		logout: function() {
			$.get('/auth/logout').done(function() {
				window.location.hash = 'login';
			});
		}


	});

	return Dash;
});