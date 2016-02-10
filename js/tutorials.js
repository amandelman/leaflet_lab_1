// Javascript by Adam Mandelman & Leaflet, 2016

//initialize the map on the "map" div with a given center aand zoom level
var map = L.map("map").setView([51.505, -0.09], 13);

//load and display a tile layer on the map
var Hydda_Full = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
maxZoom: 24,
}).addTo(map);

//set a marker on the map with lat/long
var marker = L.marker([51.5, -0.09]).addTo(map);

//set a circle on the map with lat/long, diameter, stroke & fill color, and fill opacity
var circle = L.circle([51.5, -0.09], 600, {
    color: "pink",
    fillColor: "green",
    fillOpacity: 0.3,
}).addTo(map);

//set a polygon on the map with lat/long for each point
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

//add a popup for the marker
marker.bindPopup("<b>Hello Robin!</b><br>Derpderpderp.").openPopup();

//add a popup for the circle
circle.bindPopup("I am a confused pentagon.");

//add a popup for the polygon
polygon.bindPopup("I am a confused square.");

//add a popup as a separate later directly on the map with lat/long
var popup = L.popup()
    .setLatLng([51.505, -0.115])
    .setContent("I am a pop up, standing over here, alone.")
    .openOn(map);

//add a second popup as a separate layer
var popup2 = L.popup();

//assign click event to that second popup layer that tells the user they clicked the map at a certain lat/long
function onMapClick(e) {
    popup2
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

//activate that popup when the map is click
map.on('click', onMapClick);