// Javascript by Adam Mandelman & Leaflet, 2016

//Leaflet Quick-Start Tutoral

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

////////////////// ----- ///////////////////

//Leaflet GeoJSOn Tutorial

//initialize the map on the "map2" div with a given center aand zoom level
var map2 = L.map('map2').setView([43.74739, -105], 4);

//load and display a tile layer on the map
var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'png'
}).addTo(map2);

//Create a variable for two line features on the map
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];
    
//Create a styling variable
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

//Add the two lines——with the style variable applied——to the map.
L.geoJson(myLines, { 
          style: myStyle}).addTo(map2);

//Create a variable for two polygon features
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

//Apply a style to the two polygons depending on whether their "part" property is "Republican" or "Democrat."
L.geoJson(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
//Add the styled polygons to the map.
}).addTo(map2);


//Create a function that passes two parameters: feature and layer.
function onEachFeature(feature, layer) {

//If a feature passed through the function has the property "popupContent," then add pop up displaying the contents of that property.
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

//Create a new feature for "Blah Blah Town" called geojsonFeature with the below properties and coordinates
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Blah Blah Town",
        "amenity": "Boring Town",
        "popupContent": "This is a boring town"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-106.99404, 39.75621]
    }
};

//Create a variable for a new style of marker for geoJSON point features
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//For our feature "Blah Blah Town"...
L.geoJson(geojsonFeature, {
//Apply the pop-up function defined above
    onEachFeature: onEachFeature,
//Transform the geoJSON point into a layer that returns a circular marker styled per our new geoJSON point style, also defined above.
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
//Add this new marked to the map.
}).addTo(map2);


//Create another new feature for "Coors Field"
var geojsonFeature2 = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

//Apply the pop up function defined above to "Coors Field"
L.geoJson(geojsonFeature2, {
    onEachFeature: onEachFeature
//Add "Coors Field" to the map
}).addTo(map2);


//Create an array of new features.
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "The Jerk Store",
        "popupContent": "George, the ocean called....",
//Define a property for showing the feature on the map and set it to true.
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-102.99404, 37.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "The Drake",
        "popupContent": "Love the Drake!",
//Define a property for showing the feature on the map and set it to false.
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-108.98404, 44.74621]
    }
}];

//For the array of new features
L.geoJson(someFeatures, {
//Apply the pop up function
    onEachFeature: onEachFeature,
//And apply an anonymous function that filters the features according to whether the property "show_on_map" is true or false.
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
//Add the filtered array of features to the map.
}).addTo(map2);
