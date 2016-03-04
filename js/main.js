// Javascript by Adam Mandelman, 2016

//var attType = "Cases";

function createMap(){
//initialize the map on the "map" div with a given center aand zoom level
    var map = L.map("map").setView([39.8282,        -98.5795], 4);

//load and display a tile layer on the map
    var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	       attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> and <a href="http://www.cfr.org/interactives/GH_Vaccine_Map/#introduction">Council on Foreign Relations</a>, "Vaccine-Preventable Outbreaks," 2015. Sequencer buttons courtesy of Clockwise.',
	       subdomains: 'abcd',
	       minZoom: 4,
	       maxZoom: 5,
	       ext: 'png'
    }).addTo(map);

    getData(map);
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 7;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    attribute = attributes[0];
    
    console.log(feature);
        
    if (feature.properties.Outbreak == "Whooping Cough"){
    
    //create marker options
        var options = {
            fillColor: "#21e1f1",
            weight: 0,
            opacity: 0.6,
            fillOpacity: 0.4
        };
    
    } else if (feature.properties.Outbreak == "Measles")  {
        var options = {
            fillColor: "#bf0110",
            weight: 0,
            opacity: 0.6,
            fillOpacity: 0.6
        };
        
    } else if (feature.properties.Outbreak == "Mumps") {
        var options = {
            fillColor: "#a236ff",
            weight: 0,
            opacity: 0.6,
            fillOpacity: 0.6
        };        
        
    } else {
        var options = {
            fillColor: "#f0e823",
            weight: 0,
            opacity: 0.6,
            fillOpacity: 0.8
        };        
        
    };
    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    
    var year = attribute.split("es")[1];
//    build popup content string
    var popupContent = "<p><b><u>" + feature.properties.Outbreak + ", " + year + "</p></b></u>" + "<p><b>State:</b> " + feature.properties.Location + "</p><p><b>" + "Cases" + ":</b> " + feature.properties[attribute] + "</p>";
        
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //sort circle layer order for 2015 to address California pop-up problem
    data.features.sort(function(a,b) {
        b.properties.Cases2015 - a.properties.Cases2015;    
    });
    
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//Step 1: Create new sequence controls
function createSequenceControls(map, attributes){
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
    
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 7 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 7 : index;
        };

        //Step 8: update slider
        $('.range-slider').val(index);
        //pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
    
//     input listener for slider
    $('.range-slider').on('input', function(){
        //get the new index value
        var index = $(this).val();
        //Step pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    
//    attribute = attType+attribute;
    attribute = attribute;
    
    map.eachLayer(function(layer){
        if (layer.feature && String(layer.feature.properties[attribute])){
            //update the layer style and popup
            //access feature properties
            
            var props = layer.feature.properties;
            
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            
            //add formatted attribute to panel content string
            var year = attribute.split("es")[1];
            
            var popupContent = "<p><b><u>" + layer.feature.properties.Outbreak + ", " + year + "</p></b></u>" + "<p><b>State:</b> " + layer.feature.properties.Location + "</p><p><b>" + "Cases" + ":</b> " + layer.feature.properties[attribute]  + "</p>";
//            

            //replace the layer popup
            layer.bindPopup(popupContent, {
            });
        }
        });
    };


 //build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    
    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Cases") > -1){
            attributes.push(attribute);
        };  
    };
        
    return attributes;
    
};

//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/vaccine-preventable-disease-outbreaks.geojson", {
        dataType: "json",
        success: function(response){
            var attributes = processData(response);

//            attributes = ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'];
            
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            createFilterButtons(map, response);
        }
    });
};

//Pseudocode for filter operator
//Step 2: Create filters for each disease
//Step 3: Listen for user events
//Step 4: Update the map based on toggled buttons


function createFilterButtons(map, data){    
    //Create buttons for 4 diseases
    $('#panel').append('<button type="button" class="btn whooping">Whooping Cough</button>');
    $('#panel').append('<button type="button" class="btn measles">Measles</button>');
    $('#panel').append('<button type="button" class="btn mumps">Mumps</button>');
    $('#panel').append('<button type="button" class="btn pox">Chicken Pox</button>');
    
    console.log(data.features);
    
    
    //look at processdata for clues???
    
    var diseaseAttributes = [];
    
    var disease = data.features[0].properties;
    
    console.log(disease);
//    
//    for (var diseaseAttribute in disease){
//        //only take attributes with population values
//        if (diseaseAttribute.indexOf("Outbreak") > -1){
//            diseaseAttributes.push(diseaseAttribute);
//        };
//    console.log(disease);    
//    };
    
    

//    
//    console.log(data.features);
//    $('.whooping').click(L.geoJson(data.feature){
//        alert("Hello! I am an alert box!");
//    });
    
    $('.measles').click(function(){
        alert("Hello! You have the measles!");
    });
    
    $('.mumps').click(function(){
        alert("Hello! MUMPS!");
    });
    
    $('.pox').click(function(){
        alert("Hello! A pox on you!");
    });


};


$(document).ready(createMap);

