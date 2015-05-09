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
				zoom: 15
			}
		},

		initMaps: function(force) {
			var user = this.user;
			var destination;
			var origin;
			this.rendered = $.Deferred();
			if (force || !this._mapInitialized) {
				destination = {
					lat: user.worklocation.address[0],
					lng: user.worklocation.address[1]
				};
				origin = {
					lat: user.address[0],
					lng: user.address[1]
				};
				this.maps = new google.maps.Map(this.el, this.mapOpts);
				this.destinationMarker = new google.maps.Marker({
					position: new google.maps.LatLng(destination.lat, destination.lng),
					map: this.maps
				});
				this.originMarker = new google.maps.Marker({
					position: new google.maps.LatLng(origin.lat, origin.lng),
					map: this.maps
				});
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
				if (status == google.maps.DirectionsStatus.OK) {
					self.directionResult = response.routes[0];
					disp.setDirections(response);
					self.rendered.resolve();
					/*var rectangle = new google.maps.Rectangle({
						strokeColor: '#FF0000',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: '#FF0000',
						fillOpacity: 0.35,
						map: self.maps,
						bounds: new google.maps.LatLngBounds(
							self.directionResult.bounds.getSouthWest(),
							self.directionResult.bounds.getNorthEast()
							)
					});*/
				}
			});
		},

		_bindMapEvents: function() {
			var maps = this.maps;
			var marker = this.marker;
			var self = this;
			google.maps.event.addListener(maps, 'click', function(event) {
				marker.setPosition(event.latLng);
			});

			google.maps.event.addListener(this.originMarker, 'click', function(e) {
				if (self.directionResult) {

				}
			});
		}
	});

	return MapView;
});