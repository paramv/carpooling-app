define([
	'bb',
	'jquery',
	'app/mapview'
], function(bb, $, MapView) {
	var MapView = MapView.extend({
		template: '<div class="map-canvas"></div>',
		defaults: {
			mapOpts: {
				center: {
					lat: 13.0475604,
					lng: 80.2089535,
				},
				zoom: 14
			}
		},

		initMaps: function(force) {
			var user = this.user;
			var destination;
			var origin;
			this.rendered = $.Deferred();
			if (force || !this._mapInitialized) {
				destination = {
					lat: user.worklocation.address[1],
					lng: user.worklocation.address[0]
				};
				origin = {
					lat: user.address[1],
					lng: user.address[0]
				};
				this.maps = new google.maps.Map(this.el, this.mapOpts);
				this.markers = [];
				this.marker = new google.maps.Marker({
					position: new google.maps.LatLng(0,0),
					map: this.maps,
					title: 'Custom Position'
				});
				/*this.destinationMarker = new google.maps.Marker({
					position: new google.maps.LatLng(destination.lat, destination.lng),
					map: this.maps,
					title:'Destination'
				});
				this.originMarker = new google.maps.Marker({
					position: new google.maps.LatLng(origin.lat, origin.lng),
					map: this.maps,
					title:'Origin'
				});*/
				// if(user.vehicle){
				this.calcRoute(origin, destination);
				// }

				this._bindMapEvents();
				this._mapInitialized = true;
				return this.rendered;
			}
		},

		calcRoute: function(origin, destination) {
			var directionsService = new google.maps.DirectionsService();
			var disp = this.directionsDisplay = new google.maps.DirectionsRenderer();

			var request = {
				origin: new google.maps.LatLng(origin.lat, origin.lng),
				destination: new google.maps.LatLng(destination.lat, destination.lng),
				travelMode: google.maps.TravelMode.DRIVING
			};
			var self = this;
			this.directionsDisplay.setMap(this.maps);
			directionsService.route(request, function(response, status) {
				var center;
				if (status == google.maps.DirectionsStatus.OK) {
					self.directionResult = response.routes[0];
					disp.setDirections(response);
					center = response.routes[0].bounds.getCenter()
					self.maps.setCenter(center);
					self.rendered.resolve();
				}
			});
		},

		_bindMapEvents: function() {
			var maps = this.maps;
			var marker = this.marker;
			var self = this;
			// google.maps.event.addListener(maps, 'click', function(event) {
			// 	marker.setMap(maps);
			// 	marker.setPosition(event.latLng);
			// });
			// google.maps.event.addListener(marker, 'click', function(event) {
			// 	marker.setMap(null);
			// });
		},

		clearMarker:function(){
			this.marker.setMap(null);
		},

		plotUsers: function(users) {
			var self = this;
			this.clearUsers();
			this.clearMarker();
			$.each(users, function(idx, user) {
				if (user._id === self.user._id) return true;
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(user.address[1], user.address[0]),
					map: self.maps,
					title: user.name
				});
				self.markers.push(marker);
			});
		},

		clearUsers: function() {
			this.markers.forEach(function(marker) {
				marker.setMap(null);
			});
			this.markers.length = 0;
		},

		focusOnOrigin: function() {
			this.maps.setCenter(
				new google.maps.LatLng(this.user.address[1], this.user.address[0])
			);
		},

		focusOnPosition: function(lat, lng) {
			this.maps.setCenter(
				new google.maps.LatLng(lat, lng)
			);
		},

		drawRadius: function(lat, lng, radius) {
			var options = {
				strokeColor: "#D74545",
				strokeOpacity: 0.35,
				strokeWeight: 1,
				fillColor: "#D74545",
				fillOpacity: 0.25,
				map: this.maps,
				center: new google.maps.LatLng(lat, lng),
				radius: radius * 1000
			};
			this.clearRadius();
			this.circle = new google.maps.Circle(options);
		},

		clearRadius: function() {
			if (this.circle) {
				this.circle.setMap(null);
				this.circle = null;
			}
		}


	});

	return MapView;
});