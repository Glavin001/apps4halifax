
/*
Author: Glavin Wiechert
Creation Date: September 12, 2013
Description: JavaScript SDK for the Socrata API.
*/

;(function( hfk, $, undefined ) {
	// For easy access and minification.
	var self = hfx;

	var apiUrl = 'http://140.184.132.237:5000/Halifax/';

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

	self.where(query, callback) {
		return self.apiCall({
			
			var whereQuery = {'type': { $nin: [ 'crime' ] };
			
			{'where': JSON.stringify(whereQuery) })}

			callback: callback
		});
	};

	self.geoWith(minLat, minLon, maxLat, maxLon, callback, options) {
		return $.ajax({
			url: 'http://140.184.132.237:5000/Halifax/',
			data': {'where': JSON.stringify({ "" }) + '&' + JSON.stringify({ }) }

			});
		});

	var Query = function() {

		this.text = function() {

		};

	};
*/

}( window.hfx = window.hfx || {}, jQuery ));
