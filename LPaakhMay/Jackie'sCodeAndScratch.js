// Loop through all of the filters and keep any data that  
// matches the filter values  
Object.entries(filters).forEach(([key, value]) => {    
    filteredData = filteredData.filter(row => row[key] === value);  
});

var filters = {};
function updateFilters() {  
// Save the element, value, and id of the filter that was changed
  var changedElement = d3.select(this).select("input");
  var elementValue = changedElement.property("value");
  var filterId = changedElement.attr("id");  
  // If a filter value was entered then add that filterId and value
  // to the filters list. Otherwise, clear that filter from the filters object
  if (elementValue) {
    filters[filterId] = elementValue;
  }
  else {
    delete filters[filterId];
  }  // Call function to apply all filters and rebuild the table
  filterTable();}



  //  JACKIE'S CODE
  function init() {    
      var selection = d3.select("#selDataset");    
      d3.json("/burrito_data").then(function(data) {
    console.log(data);        
    region_array = []
    data_length = Object.keys(data).length;
    console.log(data_length);
    for (x = 0; x < data_length; x++) {
        console.log(data[x].Neighborhood);
        region_array.push(data[x].Neighborhood);
    }
    console.log(region_array);
    // data.forEach (burrito => console.log(burrito));
    console.log(data[1].Neighborhood);
    function distinct(value, index, self) {
        return self.indexOf(value) === index;
    }
    every_region = region_array.filter(distinct);
    every_region.sort();
    console.log(every_region);
    every_region.forEach((region) => {
        selection
        .append("option")
        .text(region)
        .property("value", region);
    });
    var firstRegion = every_region[0]
    // TopFiveBuilder(firstRegion);
});};
d3.selectAll("#selDataset").on("change", optionChanged);
function optionChanged(newSample) {    
    var selection = d3.select("#selDataset");
var newSet = selection.property("value");
region_array = []
d3.json("/burrito_data").then(function(data) {
    region_array = []
    data_length = Object.keys(data).length;
    for (x = 0; x < data_length; x++) {
        region_array.push(data[x].Neighborhood);
    }
    function distinct(value, index, self) {
        return self.indexOf(value) === index;
    }
    every_region = region_array.filter(distinct);
    every_region.sort();
    // TopFiveBuilder(newSet);
});};init();