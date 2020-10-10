// import mean from 'mathjs'

var result = [];

function init(){
    // var selection = d3.select("#sample-metadata");

    var selection = d3.select("#selDataset");
    d3.json("http://127.0.0.1:5000/burrito_data").then(function(data) {
        console.log(data);
        result = data;
        neighborhood_array = []
        data_length = Object.keys(data).length;
        console.log(data_length);
        for (x = 0; x < data_length; x++) {
            console.log(data[x].Neighborhood);
            neighborhood_array.push(data[x].Neighborhood);
        }
        console.log(neighborhood_array);
        // data.forEach (burrito => console.log(burrito));
        console.log(data[1].Neighborhood);
        function distinct(value, index, self) {
            return self.indexOf(value) === index;
        }
        every_neighborhood_type = neighborhood_array.filter(distinct);
        every_neighborhood_type.sort();
        console.log(every_neighborhood_type);
        every_neighborhood_type.forEach((neighborhood) => {
            selection
            .append("option")
            .text(neighborhood)
            .property("value", neighborhood);
        });
        var firstneighborhood = every_neighborhood_type[0];
        console.log("First Neighborhood: " + firstneighborhood);
        populateGoogleRating(firstneighborhood);
        populateYelpRating(firstneighborhood);
    });

};


d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged(newSample) {

    var selection = d3.select("#selDataset");
    var newSet = selection.property("value");
    neighborhood_array = []
    d3.json("/burrito_data").then(function(data) {
        neighborhood_array = []
        data_length = Object.keys(data).length;
        for (x = 0; x < data_length; x++) {
            neighborhood_array.push(data[x].Neighborhood);
        }
        function distinct(value, index, self) {
            return self.indexOf(value) === index;
        }
        every_neighborhood_type = neighborhood_array.filter(distinct);
        every_neighborhood_type.sort();
        console.log("being passed to new set")
        console.log(newSet)
        populateGoogleRating(newSet);
        populateYelpRating(newSet);
    });
};   

function updateMenu() {
    var dropdown = d3.select("#selDataset");
    var current_burrito = dropdown.property("value");
}    


d3.json('/burrito_data').then( function(data) {
    result = data;
    console.log(data);
    
});

function populateGoogleRating(Neighborhood) {
    
    var data = result;
    var filteredData = data.filter(hood => hood.Neighborhood === Neighborhood);
    var uniqueAddresses = Array.from(new Set(filteredData.map(s=>s.Address)))
        .map(address=>{
            return {
                address: address,
                rating: filteredData.find(s => s.Address === address).Google,
            };
        });
    var sum = 0;
    uniqueAddresses.forEach(value => {
        sum+=value.rating;
    }); 
    var googleRating = (sum / uniqueAddresses.length) ;

    // Create gauge
    var level = googleRating;
    var degrees = 180 - (level * 36),
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
    
        { values: [1,1,1,1,1,5],
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
        title: { text: "<b>Average Google Rating</b><br>(from " + uniqueAddresses.length +" restaurants)" },
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
            color: '850000'
            }
        }],
        height: 350,
        width: 350,
        xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot('google-gauge', googleGaugeData, layout);

};

function populateYelpRating(Neighborhood) {
    
    var data = result;
    console.log(data)
    var filteredData = data.filter(hood => hood.Neighborhood === Neighborhood);
    var uniqueAddresses = Array.from(new Set(filteredData.map(s=>s.Address)))
        .map(address=>{
            return {
                address: address,
                rating: filteredData.find(s => s.Address === address).Yelp,
            };
        });
    var sum = 0;
    uniqueAddresses.forEach(value => {
        sum+=value.rating;
    }); 
    var yelpRating = (sum / uniqueAddresses.length) ;
    console.log(yelpRating)
    //// Set variable to pull metadata result using the ID of the sample
    // var chosenRating = result.Google.filter(function (data) {
    //     return Google.id === parseInt(id)
    // })[0];

    // Create gauge
    var level = yelpRating;
    var degrees = 180 - (level * 36),
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

    // Yelp gauge
    var yelpGaugeData = [{
        type: 'scatter',
        
        x: [0], 
        y:[0],
        marker: {size:18, color:'850000'},
        showlegend: false,
        name: 'yelp-gauge',
        text: level,
        hoverinfo: 'text+name'},
    
        { values: [1,1,1,1,1,5],
        rotation: 90,
        text: ['4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {colors:[
            'rgba (255, 0, 0, 1.0)',
            'rgba (255, 255, 255, 1.00)',
            'rgba (0, 0, 0, 1.0)', 
            'rgba (255, 255, 255, 1.00)',   
            'rgba(0, 0, 0, 1.0)',
            'rgba (255, 255, 255, 0)']},
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

        var layout = {
        title: { text: "<b>Average Yelp Rating</b><br>(from " + uniqueAddresses.length +" restaurants)" },
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
            color: '850000'
            }
        }],
        height: 350,
        width: 350,
        xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot('yelp-gauge', yelpGaugeData, layout);

};

    //     Update all of the plots any time that a new sample is selected.
    init();
    
        
    //     Select ID name value from the dropdown menu
        // var inputId = d3.select("#selDataset").property("value");
        // optionChanged(inputId);