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
				'radius': 2,
				'searchType': 'near'
			});
			// this.listenTo(this.filterModel, "change", this.filter);
			this.render();
		},
		render: function() {
			var $markup;
			var user = State.getInstance().get('user');
			var self = this;
			var state = State.getInstance();
			state.set('isPassenger', !user.vehicle);
			$markup = $(this._template({
				user: user,
				isPassenger: State.getInstance().get('isPassenger')
			})).html();

			// set the state before doing anything else
			
			this.$el.html($markup);
			this.$el.find('.filters-wrapper').html(filterTpl({
				isPassenger: State.getInstance().get('isPassenger'),
				user: user
			}));
			this.$el.addClass('dash-view');

			// $('.search-type-btn').children().removeClass('active');
			// if (State.getInstance().get('isPassenger')) {
			// 	$('.rides').addClass('active');
			// } else {
			// 	$('.passengers').addClass('active');
			// }
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
							filterModel.set($thisEl.attr('data-bind'), $thisEl.is(':checked'));
						} else if ($thisEl.attr('name') === 'radius') {
							filterModel.set($thisEl.attr('data-bind'), parseInt($thisEl.val()));
						} else {
							filterModel.set($thisEl.attr('data-bind'), $thisEl.val());
						}

						if ($thisEl.attr('name') === 'searchType') {
							if ($thisEl.val() === 'near') {
								self.$el.find('[name=radius]').removeAttr('disabled');
							} else {
								self.$el.find('[name=radius]').attr('disabled', true);
							}
						}
					});
				}
			});
		},

		events: {
			// 'afterrender'
			'click .search-type-btn .btn': 'onButtonClick',
			'click .search-btn ': 'search',
			'click .logout': 'logout',
			'click span.glyphicon': 'focusOnPosition'

		},


		focusOnPosition: function(e) {
			var $el = $(e.currentTarget);
			var $parent = $el.parents('.user');
			var id = $parent.attr('data-id');
			var userRef = $.grep(this.results, function(user) {
				return user._id === id;
			})[0];
			this.mapView.focusOnPosition(userRef.address[1], userRef.address[0]);
		},

		onButtonClick: function(e) {
			var $el = $(e.currentTarget);
			State.getInstance().set('isPassenger', $el.hasClass('rides'));
			$('.search-type-btn').children().removeClass('active');
			$el.addClass('active');
			this.search();
		},

		search: function() {
			var $filterEl = this.$el.find('.filters-wrapper');
			var bounds = this.mapView.directionResult.bounds;
			var legs = this.mapView.directionResult.legs[0];
			var filterModel = this.filterModel;
			var user = State.getInstance().get('user');
			var self = this;


			filterModel.set('isPassenger', State.getInstance().get('isPassenger'));
			filterModel.set('userId', user._id);

			filterModel.set('bounds', {
				'sw': [bounds.getSouthWest().F, bounds.getSouthWest().A],
				'ne': [bounds.getNorthEast().F, bounds.getNorthEast().A]
			});
			filterModel.set('startPoint', [legs.start_location.F, legs.start_location.A]);
			var filter = this.filterModel.toJSON();
			// t = this.mapView.directionResult;
			$.ajax({
				type: 'POST',
				dataType: "json",
				url: '/search',
				data: filter
			}).done(function(resp) {
				self.mapView.plotUsers(resp);
				self.results = resp;
				self.$el.find('.results-wrapper').html(resultsTpl({
					users: resp || [],
					user: user
				}));
				if (resp && resp.length) {
					self.$el.find('.no-users').hide();
					if (State.getInstance().get('isPassenger') || filterModel.get('searchType') === 'near') {
						self.mapView.drawRadius(user.address[1], user.address[0], filterModel.get('radius'));
					} else {
						self.mapView.clearRadius();
					}
				} else {
					self.$el.find('.no-users').show();
					self.mapView.clearRadius();
				}

				if (filterModel.get('searchType') === 'near') {
					self.mapView.focusOnOrigin();
				}


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