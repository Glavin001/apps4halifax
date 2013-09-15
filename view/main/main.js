usersPosition = [44.64844, -63.57582];

console.log(usersPosition);
var map = L.map('map').setView(usersPosition, 13);

L.tileLayer('http://a.tiles.mapbox.com/v3/oogalaboogala.map-eh6b4ikh/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: ''
}).addTo(map);
new OSMBuildings(map).loadData(); // OSM Buildings


function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  }
 function showPosition(position)
  {
  		usersPosition = [position.coords.latitude, position.coords.longitude];
  		map.setView(usersPosition, map.zoom());
  }


/*
L.marker(usersPosition).addTo(map)
	.bindPopup("Recent Updates<br/>More..").openPopup();

L.circle(usersPosition, 200, {
	color: 'red',
	fillColor: '#f03',
	fillOpacity: 0.5
}).addTo(map).bindPopup("I am a circle.");
*/
var markers = { };
var popup = L.popup();
var popupContents = "";
var radius = 0.01;

function onMapClick(e) {
	
	console.log('Mapclick', e.latlng);
	var lat = e.latlng.lat, lng = e.latlng.lng
	hfx.geoNear(lat, lng, radius, function(data) { 

		if (data._items.length <= 0) {
			popupContents = "Loading data";
			console.log('Loading data', data); 
			radius *= 2.0;
			onMapClick(e); // Retry
		} else {
			radius = 0.01;
			popupContents = "We have data!"; // JSON.stringify(data._items);
			console.log('We have data!', data._items);
		}
		var html = '<div class="popup-contents">'+popupContents+'</div>';
		popup
			.setLatLng(e.latlng)
			.setContent(html)
			.openOn(map);

	});

}

function moveMap(){
	var lat = map.getCenter().lat;
	var lng = map.getCenter().lng;

	hfx.geoNear(lat, lng, 0.01, function(data) {
		var items = data["_items"];
		for (var i = items.length - 1; i >= 0; i--) {
			renderNode(items[i]);
		}
	});

}

map.on('click', onMapClick);
map.on('moveend', moveMap);

function renderNode(node) {
	if (markers[node._id]) {
		return;
	}
	var meta = node["meta"];
	var item_position = [node["latitude"], node["longitude"]];
	switch (node.type) {
		case 'bus_stops': {
			var myIcon = L.icon({
			    iconUrl: 'images/svg/bus-24.svg',
			});
			var marker = L.marker(item_position, {icon: myIcon, riseOnHover: true }).addTo(map)
				.bindPopup("<b>"+meta["LOCATION"]+"</b><br/><br/>").openPopup();
			markers[node._id] = { 'node': node, 'marker': marker };
			break;
		}
		case 'zoning_boundaries': {
			var myIcon = L.icon({
			    iconUrl: 'images/trail.png',
			});
			L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+meta["LOCATION"]+"</b><br/><br/>").openPopup();
			var lats = [];
			for (var j = items[i]["loc"]["coordinates"].length - 1; j >= 0; j--) {
				lats.push(new L.LatLng(items[i]["loc"]["coordinates"][j][0], items[i]["loc"]["coordinates"][j][1]));
			};
			var polyline = L.polyline(lats, {color: 'red',weight: 3, opacity: 1, smoothFactor: 1}).addTo(map);
			markers[node._id] = { 'node': node, 'marker': polyline };			
			break;
		}
		case 'park_recreation_features': {
			var myIcon = L.icon({
			    iconUrl: 'images/trail.png',
			});
			L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+meta["LOCATION"]+"</b><br/><br/>").openPopup();
			var lats = [];
			for (var j = items[i]["loc"]["coordinates"].length - 1; j >= 0; j--) {
				lats.push(new L.LatLng(items[i]["loc"]["coordinates"][j][0], items[i]["loc"]["coordinates"][j][1]));
			};
			var polyline = L.polyline(lats, {color: 'red',weight: 3, opacity: 1, smoothFactor: 1}).addTo(map);
			markers[node._id] = { 'node': node, 'marker': polyline };			
			break;
		}
		default: {
			console.warn('Unsupported format', node);
			break;
		}
	}
};



/*
function checkNewThings(){
	hfx.geoNear(usersPosition[0],usersPosition[1],50,function(data){
		var items = data["_items"];
		for (var i = items.length - 1; i >= 0; i--) {
			var meta = items[i]["meta"];
			var item_position = [items[i]["latitude"],items[i]["longitude"]];
			
			var myIcon = L.icon({
			    iconUrl: 'images/bus.png',
			});
			L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+meta["LOCATION"]+"</b><br/><br/>").openPopup();

		};
	},{'type':'bus_stops'});


	hfx.geoNear(usersPosition[0],usersPosition[1],50,function(data){
		var items = data["_items"];
		console.log(data);
		for (var i = items.length - 1; i >= 0; i--) {
			var meta = items[i]["meta"];
			var item_position = [items[i]["latitude"],items[i]["longitude"]];
			
			var myIcon = L.icon({
			    iconUrl: 'images/trail.png',
			});
			L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+meta["LOCATION"]+"</b><br/><br/>").openPopup();

			var lats = [];
			for (var j = items[i]["loc"]["coordinates"].length - 1; j >= 0; j--) {
				lats.push(new L.LatLng(items[i]["loc"]["coordinates"][j][0], items[i]["loc"]["coordinates"][j][1]));
			};
			var polyline = L.polyline(lats, {color: 'red',weight: 3, opacity: 1, smoothFactor: 1}).addTo(map);
		};
	},{'type':'zoning_boundaries'});


	hfx.geoNear(usersPosition[0],usersPosition[1],100,function(data){
		console.log(data);
		var items = data["_items"];
		console.log(data);
		for (var i = items.length - 1; i >= 0; i--) {
			var meta = items[i]["meta"];
			var item_position = [items[i]["latitude"],items[i]["longitude"]];
			
			var myIcon = L.icon({
			    iconUrl: 'images/trail.png',
			});
			L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+meta["LOCATION"]+"</b><br/><br/>").openPopup();

			var lats = [];
			for (var j = items[i]["loc"]["coordinates"].length - 1; j >= 0; j--) {
				lats.push(new L.LatLng(items[i]["loc"]["coordinates"][j][0], items[i]["loc"]["coordinates"][j][1]));
			};
			var polyline = L.polyline(lats, {color: 'red',weight: 3, opacity: 1, smoothFactor: 1}).addTo(map);
		};
	},{'type':'park_recreation_features'});

};
*/

$(document).ready(function() {
	$( ".comment_box" ).each(function (i) {
		$(this).height($(this).parent().height()-$(this).next(".current_comment").height()-25);
  		//setInterval ( "checkNewThings()", 10000 );
  		// checkNewThings();
  	});
});

if ( navigator.geolocation ) {
	function success(pos) {
		// Location found, show map with these coordinates
		console.log([pos.coords.latitude, pos.coords.longitude]);
	}
	
	function pressRate(element){
		$(".ratepanel").show();
		$(".current_comment").hide();
	}

	function fail(error) {
		
	}
	
	// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
	navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
}

