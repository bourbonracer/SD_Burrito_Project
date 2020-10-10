//     Read in json data using D3 library
var url = "https://raw.githubusercontent.com/bourbonracer/San-Diego-Burrito-Project/master/Burrito_JSON.json"

//     Create empty array for data pull result from json file
var result = {};

//     Display the sample metadata, i.e., an individual's demographic information.
    // Update and populate the metadata section titled demographic info 
function populateGoogleRating(id) {
    d3.select("#sample-metadata")
        .selectAll("*")
        .remove();

    // Set variable to pull metadata result using the ID of the sample
    var chosenRating = result.metadata.filter(function (metadata) {
        return metadata.id === parseInt(id)
    })[0];

    // Create gauge
    var level = chosenRating.Google;
    var degrees = 180 - (level * 20),
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // Google gauge
    var googleGaugeData = [{
        type: 'scatter',
        
        x: [0], 
        y:[0],
        marker: {size:18, color:'850000'},
        showlegend: false,
        name: 'google-gauge',
        text: level,
        hoverinfo: 'text+name'},
    
        { values: [1,1,1,1,1,9],
        rotation: 90,
        text: ['4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {colors:[
            'rgba (0, 127, 255, 0.5)',
            'rgba (0, 191, 0, 0.5)',
            'rgba (255, 127, 0, 0.5)', 
            'rgba (255, 0, 0, .5)',   
            'rgba(0, 0, 0, 0.5)',
            'rgba (255, 255, 255, 0)']},
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

        var layout = {
        title: { text: "<b>Google Rating</b><br>(from " + x.toString() +" rating/s)" },
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
            color: '850000'
            }
        }],
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot('google-gauge', googleGaugeData, layout);

function populateYelpRating(id) {
    d3.select("#sample-metadata")
        .selectAll("*")
        .remove();

    // Set variable to pull metadata result using the ID of the sample
    var chosenRating = result.metadata.filter(function (metadata) {
        return metadata.id === parseInt(id)
    })[0];

    // Create Yelp gauge
    var level = chosenRating.Yelp;
    var degrees = 180 - (level * 20),
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // Yelp gaugeData
    var yelpGaugeData = [{
        type: 'scatter',
        
        x: [0], 
        y:[0],
        marker: {size:18, color:'850000'},
        showlegend: false,
        name: 'yelp-gauge',
        text: level,
        hoverinfo: 'text+name'},
    
        { values: [1,1,1,1,1,9],
        rotation: 90,
        text: ['4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {colors:[
            'rgba (0, 127, 255, 0.5)',
            'rgba (0, 191, 0, 0.5)',
            'rgba (255, 127, 0, 0.5)', 
            'rgba (255, 0, 0, .5)',   
            'rgba(0, 0, 0, 0.5)',
            'rgba (255, 255, 255, 0)']},
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];
    
        var x = 1;
        var layout = {
        title: { text: "<b>Yelp Rating</b><br>(from " + x.toString() +" rating/s)" },
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
            color: '850000'
            }
        }],
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
        };
    
    Plotly.newPlot('yelp-gauge', yelpGaugeData, layout);

    d3.json(url).then( function(data) {
        result = data;
    
    //     Update all of the plots any time that a new sample is selected.
        populateDropdown();
        
    //     Select ID name value from the dropdown menu
        var inputId = d3.select("#selDataset").property("value");
        optionChanged(inputId);
    });