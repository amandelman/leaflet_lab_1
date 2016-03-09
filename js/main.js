// Javascript by Adam Mandelman, 2016

function createMap(){
//initialize the map on the "map" div with a given center aand zoom level
    var map = L.map("map").setView([32.5, -80], 4);

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
    var scaleFactor = 5;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

function createPopup(properties, attribute, layer, radius){
    
    year = attribute.split("es")[1];
    
//    build popup content string
    var popupContent = "<p><b><u>" + properties.Outbreak + ", " + year + "</p></b></u>" + "<p><b>State:</b> " + properties.Location + "</p><p><b>" + "Cases" + ":</b> " + properties[attribute] + "</p>";
    
    layer.bindPopup(popupContent);
            
};


//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    attribute = attributes[0];
    
            
    if (feature.properties.Outbreak == "Whooping Cough"){
    
    //create marker options
        var options = {
            fillColor: "#21e1f1",
            weight: 0,
            opacity: 0.6,
            fillOpacity: 0.4
        }
    
    } else if (feature.properties.Outbreak == "Measles")  {
        var options = {
            fillColor: "#bf0110",
            weight: 0,
            opacity: 0.6,
            fillOpacity: 0.6
        }
        
    } else if (feature.properties.Outbreak == "Mumps") {
        var options = {
            fillColor: "#a236ff",
            weight: 0,
            opacity: 0.6,
            fillOpacity: 0.6
        }        
        
    } else {
        var options = {
            fillColor: "#f0e823",
            weight: 0,
            opacity: 0.6,
            fillOpacity: 0.8
        }       
        
    }
    
//For each feature, determine its value for the selected attribute
//var attValue = Number(layer.feature.properties[attribute]);
    var attValue = Number(feature.properties[attribute]);
    
    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    createPopup(feature.properties, attribute, layer, options.radius);
    
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
    
    //create a new SequenceControl Leaflet class
    var SequenceControl = L.Control.extend({
        options: {
            position: "bottomleft"
        },
        
        onAdd: function(map){
            //create the control container with my control class name
            var container = L.DomUtil.create("div", "sequence-control-container");
            
            //create range slider control
            $(container).append('<input class="range-slider" type="range">');
            $(container).append('<button class="skip" id="reverse">Reverse</button>');
            $(container).append('<button class="skip" id="forward">Skip</button>');
            $(container).append('<button type="button" class="btn all">All</button>');
            $(container).append('<button type="button" class="btn whooping">Whooping Cough</button>');
            $(container).append('<button type="button" class="btn measles">Measles</button>');
            $(container).append('<button type="button" class="btn mumps">Mumps</button>');
            $(container).append('<button type="button" class="btn pox">Chicken Pox</button>');
           
            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            
            return container;
        }
    
    });
    
    map.addControl(new SequenceControl());
    
    //set slider attributes
    $('.range-slider').attr({
        max: 7,
        min: 0,
        value: 0,
        step: 1
    });

    $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="img/forward.png">');
    
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //if past the last attribute, wrap around to first attribute
            index = index > 7 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //if past the first attribute, wrap around to last attribute
            index = index < 0 ? 7 : index;
        }

        //update slider
        $('.range-slider').val(index);
       
        //pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
    
    //input listener for slider
    $('.range-slider').on('input', function(){
        
        //get the new index value
        var index = $(this).val();
        
        //pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
};

//resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    
    map.eachLayer(function(layer){
        if (layer.feature && String(layer.feature.properties[attribute])){
        
            //access feature properties
            var props = layer.feature.properties;
            
            //update the layer style and popup
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
 
    createPopup(props, attribute, layer, radius);
            
        }
    });
    
    $('.btn').click(function(layer){
        //Set a disease variable to equal whatever button is clicked
        var disease = $(this).html();    
    });
    
    updateLegend(map, attribute);
    
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
        }  
    }
        
    return attributes;
    
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
            createFilterButtons(map, response);
            createLegend(map, attributes);
            createContextContainer(map, attributes)
        }
    });
};


//Fifth interaction operator
function createFilterButtons(map, data){    
    
    //Create a layergroup container for layers we're going to remove.
    var filterHolder = L.layerGroup();
        
    //Listen for button clicks
    $('.btn').click(function(layer){
        //Set a disease variable to equal whatever button is clicked
        var disease = $(this).html();
    
        //Add each layer from the removed layers layergroup to the map
        filterHolder.eachLayer(function(layer){
           map.addLayer(layer); 
        });
        
        //Run through each layer to see what kind of Outbreak
        map.eachLayer(function(layer){
            //select layers with outbreak property and set variable outbreak to equal that property
            if (layer.feature && String(layer.feature.properties.Outbreak)){      
                var outbreak = layer.feature.properties.Outbreak;
                
                //if the "all" button is clicked, add ALL layers to the removed layer layergroup
                if (disease === "All") {
                    filterHolder.eachLayer(function(layer){
                        map.addLayer(layer);
                    });
                
                //otherwise, if specific disease button is clicked, remove all *other* layers and add them to the removed layer layergroup
                } else if (outbreak != disease){
                    filterHolder.addLayer(layer);
                    map.removeLayer(layer);
                }               
            }
        });
    
    });
}

//function to create legend
function createLegend(map, attributes){
    
    attribute = attributes[0];
    
    var LegendControl = L.Control.extend({
        options: {
            position: "bottomright"
        },
        
        onAdd: function(map){
            //create legened control container with it's own class name
            var container = L.DomUtil.create("div", "legend-control-container");
            
            //add temporal legand div to container
            $(container).append('<div id = "temporal-legend">');
            
            //create variable to hold svg code--with its own class--as a string
            var svg = '<svg id="attribute-legend" width="350px" height="280px">';
            
            //Object to base loop on
            var circles = {
                Maximum: 218,
                Mean: 248,
                Minimum: 278
            };
            
            //loop to add each circle and text to svg string
            for (var circle in circles){
                //update circle string
                svg += '<circle class="legend-circle" id="' + circle + '" circle opacity="0.3" fill="#808080" cx="140"/>';
            
                //create text id in attribute legend
                svg += '<text id="' + circle + '-text" x="200" y="' + circles[circle] + '"></text>';
            };
                
            //close svg string
            svg += "</svg>";
            
            //add attribute legend svg to container
            $(container).append(svg);
            
            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            
        return container;          
        }
    });
    
    map.addControl(new LegendControl());
    
    //create temporal legend text
    var year = attribute.split("es")[1];
    
    var content = "<h3><b>" + "Vaccine-Preventable Disease Outbreaks, " + year + "</b></h3>";
            
    //add temporal legened to temporal div in container
    $('#temporal-legend').append(content);  
    
    updateLegend(map, attributes[0]);
};

//calculate max, Mean, min values for attrubute legend circles
function getCircleValues(map, attribute){
    //start with min as highest and max as lowest
    var Minimum = Infinity;
    var Maximum = -Infinity;
          
    map.eachLayer(function(layer){

        //get the attribute value
        if(layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);
            
            //test for Minimum
            if (attributeValue < Minimum && attributeValue > 0){
                Minimum = attributeValue;
            }
            
            //test for Maximum
            if(attributeValue > Maximum){
                Maximum = attributeValue;
            } 
        }
        
    });
    
    //set Mean
    var Mean = (Maximum + Minimum) / 2;
    
    //return values as an object
    return {
        Maximum: Maximum,
        Mean: Mean,
        Minimum: Minimum
    };
    
};

//update temporal legend. Need to fix first index value.
function updateLegend(map, attribute){
    
    //create dynamically updating legend content
    var year = attribute.split("es")[1];
    var content = "<h3><b>" + "Vaccine-Preventable Disease Outbreaks, " + year + "</b></h3>" + "<br>";
    
    //replace legend content
    $('#temporal-legend').html(content);
        
    var circleValues = getCircleValues(map, attribute);
    
    for (var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        //Step 3: assign the cy and r attributes
        $('#'+key).attr({
            cy: 279 - radius,
            r: radius
        });
    
        //Add legend text to text id in attribute legend
        $('#'+key+'-text').text(key + ": " + Math.round(circleValues[key]*100)/100 + " Cases");
    }
    
};

function createContextContainer(map, attributes){
    
    //create a new SequenceControl Leaflet class
    var ContextContainer = L.Control.extend({
        options: {
            position: "topright"
        },
        
        onAdd: function(map){
            //create the context container with my context container class name
            var container = L.DomUtil.create("div", "context-container");
          
            $(container).html($("#context"));
            
            $(container).on('mousedown dblclick', function(e){
            L.DomEvent.stopPropagation(e);
            });
            
        return container;          
        }
    });
    
    map.addControl(new ContextContainer());
};

$(document).ready(createMap);


