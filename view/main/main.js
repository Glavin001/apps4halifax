usersPosition = [44.64844, -63.57582];

console.log(usersPosition);
var map = L.map('map').setView(usersPosition, 13);

L.tileLayer('http://a.tiles.mapbox.com/v3/oogalaboogala.map-eh6b4ikh/{z}/{x}/{y}.png', {
	maxZoom: 18,
	zoom: 13,
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
var poiMarker = L.marker(map.getCenter(), { icon: L.icon({
			    iconUrl: 'images/svg/marker-24.svg',
			    popupAnchor: [10, 10],
			}) 
}).addTo(map);
var popup = poiMarker.bindPopup("", {autoPan: false})//.openPopup().closePopup(); /// L.popup();
var popupContents = "";
var radius = 0.0001;
var $wikiModal = $(".wiki-modal"), 
$wikiModalTitle = $(".modal-title", $wikiModal), 
$wikiModalBody = $('.modal-body', $wikiModal);

$(".leaflet-popup-pane").delegate(".leaflet-popup", "click", function( event ) {
  console.log( event );
  var $target = $(event.target), $parent = $target.parent('.leaflet-popup');
  if ( $target.hasClass('more-info-btn') ) {
  	console.log($parent);
  	//$parent.closeOn(map);
  	var $header = $("<p>Info Near Here</p>");
  	var $body = $("<div>Test</div>");
  	renderWiki($header, $body);
	popup.closePopup();
	$wikiModal.modal('show');
  }
  else if ( $target.hasClass('gotime-info-btn') ) {
  	console.log($parent);
  	var gotime = $target.attr("data-gotime");
  	//$parent.closeOn(map);
  	console.log(gotime);
  	
	popup.closePopup();
	$wikiModal.modal('show');
  	
  	$.ajax({
		type:"GET",
		url:"http://140.184.132.237:5000/gotime/"+gotime,
		success: function(data) {
			console.log(data);
  	var $header = $("<p>GoTime for Stop #"+gotime+"</p>");
  	var $body = $(data);
  	
  	renderWiki($header, $body)
			
		}
	});
   }
});

function renderWiki($header, $body) {
	$wikiModalTitle.html('').append($header);
	$wikiModalBody.html('').append($body);
}
function changeClass (elementID, newClass) {
	var element = document.getElementById(elementID);
	
	element.setAttribute("class", newClass); //For Most Browsers
	element.setAttribute("className", newClass); //For IE; harmless to other browsers.
}
function onMapClick(e) {
	
	console.log('Mapclick', e.latlng);
	var lat = e.latlng.lat, lng = e.latlng.lng;
	popupContents = "Loading data";
	poiMarker.setLatLng(e.latlng);
	popup.setPopupContent("Loading data",null).openPopup();
	/*
		.setLatLng(e.latlng)
		.setContent(popupContents)
		.openPopup();
	*/
	hfx.geoNear(lat, lng, radius, function(data) { 
		var items = data["_items"];
		for (var i = items.length - 1; i >= 0; i--) {
			renderNode(items[i]);
		}

		if (data._items.length <= 0) {
			popupContents = "Loading data";
			console.log('Loading data', data); 
			radius *= 2.0;
			onMapClick(e); // Retry
			/*
			popup
				.setLatLng(e.latlng)
				.setContent(popupContents)
				.openOn(map);
			*/
			console.log(radius);
		} else {
			radius = 0.01;
			popupContents = "We have data!"; // JSON.stringify(data._items);
			console.log('We have data!', data._items);

			var allTypes = { };
			for (var i =0, len=data._items.length; i<len; i++) {
				var node = data._items[i];
				if ( ! allTypes[node.type] ) {
					 allTypes[node.type] = [ ];
				} 
				allTypes[node.type].push(node);
			}
			popupContents = "<div class=\"popop-contents\">";
//			popupContents += "<strong>We have collected more than "+Object.keys(allTypes).length+" types of data.</strong><br>";
			popupContents += "<strong>We have collected "+data._items.length+" result"+(data._items.length>1?"s":"")+".</strong><br>";
			popupContents += '<button class="btn btn-primary more-info-btn">Click here for more info!</a>'
			popupContents += "</div>";
		}
		var html = '<div class="popup-contents">'+popupContents+'</div>';
		/*
		popup
			.setLatLng(e.latlng)
			.setContent(html)
			.openPopup();
		*/
		popup.setPopupContent(html);

	});

}

function moveMap(){
	var lat = map.getCenter().lat;
	var lng = map.getCenter().lng;

	hfx.geoNear(lat, lng, radius, function(data) {
		var items = data["_items"];
		for (var i = items.length - 1; i >= 0; i--) {
			renderNode(items[i]);
		}
	});

}

// Fix found here: https://github.com/Leaflet/Leaflet/issues/1041
function preventGhostClick(evt) {
    var lastEventTimestamp = window.lastEventTimestamp || 1;
    var currentEventTimestamp = new Date().getTime();
    var msDifference = currentEventTimestamp - lastEventTimestamp;
    if (msDifference < 20) {
        console.log('We decided not to fire the mouse (event): ' + msDifference + '.');
        evt.stopImmediatePropagation();
        return false;
    } 
    window.lastEventTimestamp = currentEventTimestamp;    
    return true;
}

L.Map.prototype._originalFireMouseEvent = L.Map.prototype._fireMouseEvent;
L.Map.prototype._fireMouseEvent = function(evt) {
    return preventGhostClick(evt) ? this._originalFireMouseEvent(evt) : null;
}

map.on('click', onMapClick);
map.on('moveend', moveMap);

function renderNode(node) {
	if (markers[node._id]) {
		return;
	}
	var meta = node["meta"];
	var item_position = [node["latitude"], node["longitude"]];
	console.log(node.type);
	switch (node.type) {
		case 'bus_stops': {
			var myIcon = L.icon({
			    iconUrl: 'images/svg/bus-24.svg',
			});
			var marker = L.marker(item_position, {icon: myIcon, riseOnHover: true }).addTo(map)
				.bindPopup("<h1>"+meta["LOCATION"]+"</h1><br/><h2>GoTime: <a class=\"gotime-info-btn\" data-gotime=\""+meta["GOTIME"]+"\">480-"+meta["GOTIME"]+"</a></h2><br/>",{autoPan:false});
			markers[node._id] = { 'node': node, 'marker': marker };
			break;
		}
		case 'bus_routes': {
			var myIcon = L.icon({
			    iconUrl: 'images/svg/bus-24.svg',
			});
			console.log(node);
			var marker = L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+JSON.stringify(meta)+"</b><br/><br/>",{autoPan:false});
			var coordinates = node["loc"]["coordinates"];
			var polyline = coordinatesToPolyline(coordinates).addTo(map);
			markers[node._id] = { 'node': node, 'marker': marker };			
			break;
		}
		case 'zoning_boundaries': {
			var myIcon = L.icon({
			    iconUrl: 'images/trail.png',
			});
			var marker = L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+JSON.stringify(meta)+"</b><br/><br/>",{autoPan:false});
			var coordinates = node["loc"]["coordinates"];
			var polyline = coordinatesToPolyline(coordinates).addTo(map);
			markers[node._id] = { 'node': node, 'marker': marker };			
			break;
		}
		case 'bylaw_areas': {
			var myIcon = L.icon({
			    iconUrl: 'images/trail.png',
			});
			var marker = L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+JSON.stringify(meta)+"</b><br/><br/>",{autoPan:false});
			var coordinates = node["loc"]["coordinates"];
			var polyline = coordinatesToPolyline(coordinates).addTo(map);
			markers[node._id] = { 'node': node, 'marker': marker };			
			break;
		}
		case 'park_recreation_features': {
			var myIcon = L.icon({
			    iconUrl: 'images/trail.png',
			});
			var marker = L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+JSON.stringify(meta)+"</b><br/><br/>",{autoPan:false});
			var coordinates = node["loc"]["coordinates"];
			var polyline = coordinatesToPolyline(coordinates).addTo(map);
			markers[node._id] = { 'node': node, 'marker': marker };			
			break;
		}
		case 'waste_collection': {
			var myIcon = L.icon({
			    iconUrl: 'images/trail.png',
			});
			var marker = L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+JSON.stringify(meta)+"</b><br/><br/>");
			var coordinates = node["loc"]["coordinates"];
			var polyline = coordinatesToPolyline(coordinates).addTo(map);
			markers[node._id] = { 'node': node, 'marker': marker };			
			break;
		}
		case 'trails': {
			var myIcon = L.icon({
			    iconUrl: 'images/trail.png',
			});
			var marker = L.marker(item_position, {icon: myIcon}).addTo(map)
				.bindPopup("<b>"+JSON.stringify(meta)+"</b><br/><br/>",{autoPan:false});
			
			var coordinates = node["loc"]["coordinates"];
			var polyline = coordinatesToPolyline(coordinates).addTo(map);
			markers[node._id] = { 'node': node, 'marker': marker };			
			break;
		}
		case 'building_symbols': {
			var myIcon = L.icon({
			    iconUrl: 'images/svg/building-24.svg',
			});
			var marker = L.marker(item_position, {icon: myIcon, riseOnHover: true }).addTo(map)
				.bindPopup("<h1>"+meta["LABEL"]+"</h1><br/>",{autoPan:false});


			markers[node._id] = { 'node': node, 'marker': marker };
			break;
		}
		default: {
			console.warn('Unsupported format', node.type, node);
			break;
		}
	}
};


function coordinatesToPolyline(coordinates) {
	var points = [];
	for (var j = coordinates.length - 1; j >= 0; j--) {
		points.push(new L.LatLng(coordinates[j][1], coordinates[j][0]));
	};
	var polyline = L.polyline(points, {color: 'brown',weight: 3, opacity: 1, smoothFactor: 1});
	return polyline;
}


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
