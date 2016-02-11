//GeoJSON.js for MegaCities exercise in module 4



//function to instantiate the Leaflet map
var map3 = L.map("map3").setView([20, -45], 1);

//add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map3);

//add popup that instructs user to interact with circles
var popup = L.popup()
    .setLatLng([20, -45])
    .setContent("Click the circles!")
    .openOn(map3);

//Create a function that passes two parameters: feature and layer.
function onEachFeature(feature, layer) {
//since there's no property named popupContent, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string and append them to a popup
        for (var property in feature.properties){
            popupContent += "<p>" + "property" + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};


//call megacities data
$.ajax("data/megacities.geojson", {
        dataType: "json",
        success: function(response){
            //create a variable for a custome marker
            var geojsonMarkerOptions = {
                radius: 15,
                fillColor: "#f121b1",
                color: "#09ef7c",
                weight: 3,
                opacity: 0.6,
                fillOpacity: 0.4
                };
//create a Leaflet GeoJSON layer and add the custome markers with clickable popups to the map
            L.geoJson(response, {
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map3);
        }
});



