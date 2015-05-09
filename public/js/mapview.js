define([
	'bb',
	'jquery'
], function(bb, $) {
	var $mapsLoadedDfd = $.Deferred();
	// var LoadMaps = function() {
	// 	if ($mapsLoadedDfd.state() === 'resolved') {
	// 		return $mapsLoadedDfd;
	// 	}
	// 	var src = 'https://maps.googleapis.com/maps/api/js?key=';
	// 	var apiKey = 'AIzaSyCrz1e0FPlFtlaHQYeEmhsBqdpNxl69xvE'
	// 	var $script = $('<script></script>');
	// 	$script.on('load', function() {
	// 		$mapsLoadedDfd.resolve();
	// 	});
	// 	$script.attr('src', src + apiKey);
	// 	$script.appendTo('head');
	// 	return $mapsLoadedDfd;
	// };
	var MapView = bb.View.extend({
		template: '<div class="map-canvas"></div>',
		showSearch: true,
		defaults: {
			mapOpts: {
				center: {
					lat: 13.0475604,
					lng: 80.2089535,
				},
				zoom: 14
			}
		},
		initialize: function() {
			var self = this;
			this.render();
		},
		render: function() {
			this.mapOpts = $.extend({}, this.defaults.mapOpts, this.mapOpts);
			this.$el.html(this.template);
		},

		initMaps: function(force) {
			if (force || !this._mapInitialized) {
				this.maps = new google.maps.Map(this.el, this.mapOpts);
				this.marker = new google.maps.Marker({
					position: new google.maps.LatLng([this.mapOpts.center.lat, this.mapOpts.center.lng]),
					map: this.maps
				});
				this._bindMapEvents();
				this._mapInitialized = true;
				return this;
			}
		},

		_bindMapEvents: function() {
			var maps = this.maps;
			var marker = this.marker;
			var self = this;
			google.maps.event.addListener(maps, 'click', function(event) {
				marker.setPosition(event.latLng);
				self.$el.trigger('locationselected', [event.latLng]);
			});
		},

		showSearchPane: function() {
			var $el = this.$el;
			var self = this;
			var $search = $('<input>')
				.attr('name', 'map-search')
				.addClass('mapsearch form-control')
				.attr('placeholder', 'Type in a location');
			$search.on('change', function(e) {
				var map = self.maps;
				var location = $search.val();
				var geocoder = new google.maps.Geocoder();
				var marker = self.marker;
				geocoder.geocode({
					'address': location
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						map.setCenter(results[0].geometry.location);
						marker.setPosition(results[0].geometry.location);
						self.$el.trigger('locationselected', [results[0].geometry.location]);
					} else {
						alert('Geocode was not successful for the following reason: ' + status);
					}
				});
			});
			$el.append($search);
		}
	});

	return MapView;
});