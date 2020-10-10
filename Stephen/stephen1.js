// Initialize the variables for the svg canvas width, height, and margins

var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Set the width and height of the actual chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select the scatterplot element, append and SVG group that will contain the chart, and modify the width and height of the chart based on the attributes that we set above
var google_svg = d3
  .select("#scatter-google")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//   Append an SVG group ("g") to the above selection and assign as a new variable called "scatterGroup". Translate the location based on margin attributes assigned in the SVG variable
var scatterGroup = google_svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import the data
d3.json("/burrito_data").then(function(burritoData) {
        // // Confirm successful import
        // console.log(burritoData)
        
        // Create the scale functions for each axis that will scale input values to a particular value within the range of the axis.  
        var xLinearScale = d3.scaleLinear()
                .domain([d3.min(burritoData, burritoData => burritoData.Google) * 0.95,
                d3.max(burritoData, burritoData => burritoData.Google) * 1.05
                ])
                .range([0, width]);
        var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(burritoData, function(burritoData) {
                // console.log(burritoData.Google)
                return burritoData.Cost
        })])
        .range([height, 0]);

        // Create the axis functions using D3. The x axis will be on the bottom of the chart and the y-axis will be on the top of the chart
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale).ticks(8)

        // append a new SVG group to scatterGroup to contain each axis, transform based on the chart dimensions, and call the x- and y-axis functions

        scatterGroup.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

        scatterGroup.append('g')
        .call(yAxis);

        // Create a selection for the scatterGroup and save as a new variable circlesData. This variable will be used to add circles and text to the scatterplot
        var circlesData = scatterGroup.selectAll()
        // bind the data to the group
        .data(burritoData)
        // Create holding slots for unbound data 
        .enter()
        .append("circle")

        // var bcost = burritoData.map(price=>price.Cost)
        // var avg = math.mean(bcost);

        // Create a circlesGroup variable by selecting the circlesData group and appending circle elements for each unbound data point
        // Append a new circle element for each unbound data point  
        // var circlesGroup = circlesData.append("circle")
        // set the centers of the circles
        .attr('cx', burritoData => xLinearScale(burritoData.Google))
        .attr('cy', burritoData => yLinearScale(burritoData.Cost))
        // set the radii of the circles
        .attr('r', 5)
        // Set the circle appearance
        .attr('fill', '#e5616166')

        // Set the text within the circles by selecting the circlesData group and appending text elements for each unbound data point
        var circlesText = circlesData.append('text')
        .attr('x', burritoData => xLinearScale(burritoData.Google) - 6)
        .attr('y', burritoData => yLinearScale(burritoData.Cost) + 4)
        .attr('fill', 'black')
        .attr('font-size', '10px')
        .text(burritoData => burritoData.Location)
        
        // Initialize tool tip
         var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([100, -100])
        .html(function(d) 
        {
        return (`<h6>${d.Location}</h6><hr>Cost: ${d.Cost}<br>Google Rating: ${d.Google}<br>Yelp Rating: ${d.Yelp}`);
        });
        
        // Create tooltip in the chart
        scatterGroup.call(toolTip);
        // Create event linisters to display and hide the tooltip
        circlesText.on("mouseover", function(data) {
        toolTip.show(data, this);
        })
        circlesData.on("mouseover", function(data) {
        toolTip.show(data, this);
         })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });



        // Create the axis labels
        // y-axis
        scatterGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height / 2) - 70)
                .attr("dy", "1em")
                .attr("class", "axisText")
                .attr("font-size", "18px")
                .attr("font-family", "sans-serif")
                .text("Cost");
        // x-axis
        scatterGroup.append("text")
                .attr("transform", `translate(${(width / 2) - 55}, ${height + margin.top + 30})`)
                .attr("class", "axisText")
                .attr("font-family", "sans-serif")
                .text("Google Rating");

        


})









// Import the data
d3.json("/burrito_data").then(function(burritoData) {
        // // Confirm successful import
        // console.log(burritoData)

var yelp_svg = d3
  .select("#scatter-yelp")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var yelpscatterGroup = yelp_svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

        
        // Create the scale functions for each axis that will scale input values to a particular value within the range of the axis.  
        var xLinearScale = d3.scaleLinear()
                .domain([d3.min(burritoData, burritoData => burritoData.Yelp) * 0.95,
                d3.max(burritoData, burritoData => burritoData.Yelp) * 1.05
                ])
                .range([0, width]);
        var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(burritoData, function(burritoData) {
                // console.log(burritoData.Yelp)
                return burritoData.Cost
        })])
        .range([height, 0]);

        // Create the axis functions using D3. The x axis will be on the bottom of the chart and the y-axis will be on the top of the chart
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale).ticks(8)

        // append a new SVG group to scatterGroup to contain each axis, transform based on the chart dimensions, and call the x- and y-axis functions

        yelpscatterGroup.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

        yelpscatterGroup.append('g')
        .call(yAxis);

        // Create a selection for the scatterGroup and save as a new variable circlesData. This variable will be used to add circles and text to the scatterplot
        var circlesData = yelpscatterGroup.selectAll()
        // bind the data to the group
        .data(burritoData)
        // Create holding slots for unbound data 
        .enter()
        .append("circle")

        // Create a circlesGroup variable by selecting the circlesData group and appending circle elements for each unbound data point
        // Append a new circle element for each unbound data point  
        // var circlesGroup = circlesData.append("circle")
        // set the centers of the circles
        .attr('cx', burritoData => xLinearScale(burritoData.Yelp))
        .attr('cy', burritoData => yLinearScale(burritoData.Cost))
        // set the radii of the circles
        .attr('r', 5)
        // Set the circle appearance
        .attr('fill', '#34eb5833')

        // Set the text within the circles by selecting the circlesData group and appending text elements for each unbound data point
        var circlesText = circlesData.append('text')
        .attr('x', burritoData => xLinearScale(burritoData.Yelp) - 6)
        .attr('y', burritoData => yLinearScale(burritoData.Cost) + 4)
        .attr('fill', 'black')
        .attr('font-size', '10px')
        .text(burritoData => burritoData.Location)
        
        // Initialize tool tip
         var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([100, -100])
        .html(function(d) 
        {
        return (`<h6>${d.Location}</h6><hr>Cost: ${d.Cost}<br>Yelp Rating: ${d.Yelp}<br>Yelp Rating: ${d.Yelp}`);
        });
        
        // Create tooltip in the chart
        yelpscatterGroup.call(toolTip);
        // Create event linisters to display and hide the tooltip
        circlesText.on("mouseover", function(data) {
        toolTip.show(data, this);
        })
        circlesData.on("mouseover", function(data) {
        toolTip.show(data, this);
         })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });



        // Create the axis labels
        // y-axis
        yelpscatterGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height / 2) - 70)
                .attr("dy", "1em")
                .attr("class", "axisText")
                .attr("font-size", "18px")
                .attr("font-family", "sans-serif")
                .text("Cost");
        // x-axis
        yelpscatterGroup.append("text")
                .attr("transform", `translate(${(width / 2) - 55}, ${height + margin.top + 30})`)
                .attr("class", "axisText")
                .attr("font-family", "sans-serif")
                .text("Yelp Rating");

        


})