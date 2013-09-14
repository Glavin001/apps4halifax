
/*
Author: Glavin Wiechert
Creation Date: September 14, 2013
Description: Hfx.js library for integration with our RESTful API.
*/

;(function( hfx, $, undefined ) {
	// For easy access and minification.
	var self = hfx;

	var apiUrl = 'http://140.184.132.237:5000/api/Halifax/';

	self.apiCall = function(options) {
		return $.ajax({
			type: options.type,
			url: apiUrl+options.collection,
			data: query,
			success: function(data) {
				return callback && callback(data);
			}
		});
	};

/*
	self.where = function(query, callback) {
		return self.apiCall({
			
			var whereQuery = {'type': { $nin: [ 'crime' ] };
			
			{'where': JSON.stringify(whereQuery) })}

			callback: callback
		});
	};
*/
	
	self..transitWithGeotime(gotime, callback) {
		var query = { 'meta': 'GOTIME': gotime } };
		return $.ajax({
			type: "GET",
			url: apiUrl,
			data: { 'max_results': 100, 'where': JSON.stringify(query) },
			success: function(data) {
				return callback && callback(data);
			}
			});
		};
	}

	
	self.geoNear = function(lat, lon, side, callback, options) {
		return self.geoWithin(lat-side/2, lon-side/2, lat+side/2, lon+side/2, callback, options);
	}


	self.geoWithin = function(minLat, minLon, maxLat, maxLon, callback, options) {
		var query = options || { };
		query['latitude'] = { $gte : minLat, $lte : maxLat } ;
		query['longitude'] =  { $gte : minLon, $lte : maxLon } ;

		return $.ajax({
			type: "GET",
			url: apiUrl,
			data: { 'where': JSON.stringify(query) },
			success: function(data) {
				return callback && callback(data);
			}
			});
		};

/*
	var Query = function() {
		this.text = function() {
		};
	};
*/

}( window.hfx = window.hfx || {}, jQuery ));
