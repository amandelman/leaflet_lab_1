// Javascript by Adam Mandelman, 2016


//initialize the map on the "map" div with a given center aand zoom level
var map = L.map("map").setView([39.8282, -98.5795], 4);

//load and display a tile layer on the map
var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> and <a href="http://www.cfr.org/interactives/GH_Vaccine_Map/#introduction">Council on Foreign Relations</a>, "Vaccine-Preventable Outbreaks," 2015. Sequencer buttons courtesy of Clockwise.',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);


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

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[7];
    
     //check
//    console.log(attribute);

    //create marker options
    var options = {
        radius: 15,
        fillColor: "#f121b1",
        color: "#09ef7c",
        weight: 3,
        opacity: 0.6,
        fillOpacity: 0.4
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties.Cases2015);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    var year = attribute.split("es")[1];
    console.log(year);
//    popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " million</p>";
    
    //build popup content string
    var popupContent = "<p><b><u>" + feature.properties.Outbreak + ", " + year + "</p></b></u>" + "<p><b>City:</b> " + feature.properties.Location + "</p><p><b>" + "Cases" + ":</b> " + feature.properties.Cases2015 + "</p><p><b>" + "Fatalities" + ":</b> " + feature.properties.Fatalities2015 + "</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};



//GOAL: Allow the user to sequence through the attributes and resymbolize the map
//   according to each attribute
//STEPS:
//4. Assign the current attribute based on the index of the attributes array
//5. Listen for user input via affordances
//6. For a forward step through the sequence, increment the attributes array index;
//   for a reverse step, decrement the attributes array index
//7. At either end of the sequence, return to the opposite end of the seqence on the next step
//   (wrap around)
//8. Update the slider position based on the new index
//9. Reassign the current attribute based on the new attributes array index
//10. Resize proportional symbols according to each feature's value for the new attribute

//Step 1: Create new sequence controls
function createSequenceControls(map){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
    
    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');

    //set slider attributes
    $('.range-slider').attr({
        max: 7,
        min: 0,
        value: 0,
        step: 1
    });

    $('#panel').append('<button class="skip" id="forward">Skip</button>');

 $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="img/forward.png">');

    
};



//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/vaccine-preventable-disease-outbreaks.geojson", {
        dataType: "json",
        success: function(response){
            var attributes = processData(response);

            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);

        }
    });
    
    //build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    
    console.log(typeof data);

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Cases") > -1){
            attributes.push(attribute);
        };
    };

    //check result
//    console.log(attributes);

    return attributes;
    
};


};



getData(map);
