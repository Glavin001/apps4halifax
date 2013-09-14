

var d = null; 
$.get('BusStops.kml', function(data) { 
	console.log(data); 
	d = data; 

	var $placemarks = $(d).find('Placemark')
	var geo = [ ];
	for (var i=0, len=$placemarks.length; i<len; i++) {
		var $LookAt = $($placemarks[i]).children('LookAt');
		var $placemark = {
		'longitude': parseFloat( $( $(LookAt).children('longitude') ).text() ),
		'latitude': parseFloat( $( $(LookAt).children('latitude') ).text() ),
		'altitude': parseFloat( $( $(LookAt).children('altitude') ).text() ),
		'range': parseFloat( $( $(LookAt).children('range') ).text() ),
		'tilt': parseFloat( $( $(LookAt).children('tilt') ).text() ),
		'heading': parseFloat( $( $(LookAt).children('heading') ).text() ),
		'altitudeMode': parseFloat( $( $(LookAt).children('altitudeMode') ).text() ),
		};
		geo.push($placemark);
	}

});

