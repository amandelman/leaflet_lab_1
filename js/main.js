// Javascript by Adam Mandelman, 2016


//initialize the map on the "map" div with a given center aand zoom level
var map = L.map("map").setView([39.8282, -98.5795], 4);

//load and display a tile layer on the map
var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> and <a href="http://www.cfr.org/interactives/GH_Vaccine_Map/#introduction">Council on Foreign Relations</a>, "Vaccine-Preventable Outbreaks," 2015',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);


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


////call vaccine-preventable outbreaks data
//$.ajax("data/vaccine-preventable-disease-outbreaks.geojson", {
//        dataType: "json",
//        success: function(response){
//            //create a variable for a custome marker
//            var geojsonMarkerOptions = {
//                radius: 15,
//                fillColor: "#f121b1",
//                color: "#09ef7c",
//                weight: 3,
//                opacity: 0.6,
//                fillOpacity: 0.4
//                };
////create a Leaflet GeoJSON layer and add the custom markers with clickable popups to the map
//            L.geoJson(response, {
//                onEachFeature: onEachFeature,
//                pointToLayer: function (feature, latlng) {
//                return L.circleMarker(latlng, geojsonMarkerOptions);
//                }
//            }).addTo(map);
//        }
//});

//Step 3: Add circle markers for point features to the map
function createPropSymbols(data, map){
    
    //determine which attribute to visualize with proportional symbols
    var attribute = "Cases2008";
    
    //create marker options
    var geojsonMarkerOptions = {
        radius: 15,
        fillColor: "#f121b1",
        color: "#09ef7c",
        weight: 3,
        opacity: 0.6,
        fillOpacity: 0.4
    };

    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //for each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties.Cases2015);
//            var attValue2009 = Number(feature.properties.Cases2009);
//            var attValue2010 = Number(feature.properties.Cases2010);
//            var attValue2011 = Number(feature.properties.Cases2011);
//            var attValue2012 = Number(feature.properties.Cases2012);
//            var attValue2013 = Number(feature.properties.Cases2013);
//            var attValue2014 = Number(feature.properties.Cases2014);
//            var attValue2015 = Number(feature.properties.Cases2015);

            
            //give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//Step 2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/vaccine-preventable-disease-outbreaks.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
            
        }
       
    });
};

getData(map);

//////    //Step 4: Determine which attribute to visualize with proportional symbols
////  
