// Console log to ensure this app is being read while testing.
console.log("Hello Hello?");

// Let's init this.
function init() {

    // We need to refer to the dataset selection from the HTML.
    var selection = d3.select("#selDataset");

    // We'll pull the data using this D3.JSON function.
    d3.json("http://127.0.0.1:5000/burrito_data").then(function(data) {

        // Ensuring we got it.
        console.log(data);

        // We'll push every object's burrito in the data to an empty array.
        burrito_array = []
        // We need the data's length while looping through it.
        data_length = Object.keys(data).length;
        console.log(data_length);
        // Now we'll loop.
        for (x = 0; x < data_length; x++) {
            console.log(data[x].Burrito);
            burrito_array.push(data[x].Burrito);
        }

        // We will have to filter out the duplicates.
        // First, we'll define this function.
        function distinct(value, index, self) {
            return self.indexOf(value) === index;
        }
        // The dropdown fields will be based on the burrito
        // names we pushed to the array, but only distinct
        // names.
        every_burrito_type = burrito_array.filter(distinct);
        // It'll be far easier to use when alphabetized.
        every_burrito_type.sort();
        console.log(every_burrito_type);

        // To populate the dropdown, we'll use this forEach function.
        every_burrito_type.forEach((burrito) => {
            selection
            .append("option")
            .text(burrito)
            .property("value", burrito);
        });
        // By default, we'll choose the first option.
        var firstBurrito = every_burrito_type[0];
        // We'll plug the name of the first burrito into the chart builder.
        TopFiveBuilder(firstBurrito);
    });

};

// We need this statement so that the data changes when you select
// a different burrito.
d3.selectAll("#selDataset").on("change", optionChanged);

// This function will redo the data once a new option is chosen.
function optionChanged(newSample) {

    // Mostly the same steps here.
    var selection = d3.select("#selDataset");
    // The main different is newSet, representing the new dropdown selection.
    var newSet = selection.property("value");
    burrito_array = []
    d3.json("/burrito_data").then(function(data) {
        burrito_array = []
        data_length = Object.keys(data).length;
        for (x = 0; x < data_length; x++) {
            burrito_array.push(data[x].Burrito);
        }
        function distinct(value, index, self) {
            return self.indexOf(value) === index;
        }
        every_burrito_type = burrito_array.filter(distinct);
        every_burrito_type.sort();
        // We'll now plug the new burrito into the chart builder function.
        TopFiveBuilder(newSet);
    });

};

// Gotta have this!
init();

// And this!
function updateMenu() {
    var dropdown = d3.select("#selDataset");
    var current_burrito = dropdown.property("value");
}

// This will be the main function that produces our visualizations.
function TopFiveBuilder(burrito) {

    // We'll gather the burrito types as before.
    var dataFile = d3.json("/burrito_data").then(function(data) {
        burrito_array = []
        data_length = Object.keys(data).length;
        for (x = 0; x < data_length; x++) {
            burrito_array.push(data[x].Burrito);
        }
        function distinct(value, index, self) {
            return self.indexOf(value) === index;
        }
        every_burrito_type = burrito_array.filter(distinct);
        every_burrito_type.sort();

        // Now, we will loop through the list of distinct burritos and
        // check to see if the chosen burrito matches the one in the list.
        for (e = 0; e < every_burrito_type.length; e++) {
            if (burrito === every_burrito_type[e]) {
                console.log(every_burrito_type[e]);

                // We'll create an empty object to hold the burrito info.
                burrito_average_info = {};

                // We'll use an empty array to hold all burritos whose type
                // matches our current selection.
                matching_burritos = [];
                data_length = Object.keys(data).length;

                // We need to store the costs and restaurant names in
                // arrays for later reference.
                cost_array = [];
                restaurant_array = [];

                // This for loop will check to see if the current burrito
                // in the dataset is the correct type. If so, it will push
                // the burrito object to matching_burritos, the cost value
                // to cost_array, and restaurant name (Location) to
                // restaurant_array.

                for (d = 0; d < data_length; d++) {
                    if (burrito === data[d].Burrito) {
                        matching_burritos.push(data[d]);
                        cost_array.push(data[d].Cost);
                        restaurant_array.push(data[d].Location);
                    };
                };

                // We'll now create an array of objects that contains each
                // relevant burrito and its corresponding restaurant and cost,
                // respectively.

                All_Burritos = [];

                // Since the restaurant and cost will need to be distinct when
                // we're filtering our results later, we will create an array
                // whose values are the combination. Otherwise, we would
                // wrongfully omit cases with the same restaurant but
                // different burrito costs.

                restaurant_and_cost = [];
                for (u = 0; u < cost_array.length; u++) {
                    this_burrito = {};
                    this_burrito[restaurant_array[u]] = cost_array[u];
                    console.log(this_burrito);
                    All_Burritos.push(this_burrito);

                    // We will need to separate the restaurant and cost in the
                    // restaurant_and_cost array later, so we will divide them
                    // in the resulting string with | and ^, two characters that
                    // are extremely unlikely to appear in the restaurant names.

                    restaurant_and_cost.push(restaurant_array[u] + "|^" + cost_array[u]);
                };

                // We'll define our distinct function again.
                function distinct(value, index, self) {
                    return self.indexOf(value) === index;
                }

                // Now, when we apply the distinct filter to restaurant_and_cost,
                // it will display each possible restaurant and cost combination,
                // without any duplicates.

                All_Distinct_Burritos = restaurant_and_cost.filter(distinct);

                // Here, you can check the result of our efforts.
                console.log(All_Distinct_Burritos);
                console.log(All_Distinct_Burritos[0].length);

                // Next, we will store each of the distinct costs and restaurants
                // we obtained in restaurant_and_cost in separate arrays that are
                // appropriately ordered. For this, we'll use the substr function.

                // Since the string starts with the restaurant name, this substr
                // function will go from character 0 until the | character.
                console.log(All_Distinct_Burritos[0].substr(0, All_Distinct_Burritos[0].indexOf('|')));
    
                // Since the cost is a number, we'll need to use parseFloat to convert it from a
                // string to a float, as this will be necessary for later sorting.
                // For substr, we need to start one character after ^ and end at the length of the given string.
                console.log(parseFloat(All_Distinct_Burritos[0].substr(All_Distinct_Burritos[0].indexOf('^') + 1, All_Distinct_Burritos[0].length)));

                // Now that we have tested the substr and parseFloat functions, we
                // will loop through All_Distinct_Burritos and store everything into
                // empty arrays.

                distinct_costs = [];
                distinct_restaurants = [];

                // We will want another empty array that holds objects for this filtered set.
                Distinct_Burritos = [];

                for (q = 0; q < All_Distinct_Burritos.length; q++) {
                    this_burrito = {}
                    // The functions here will work as above, except All_Distinct_Burritos'
                    // index will correspond to q.
                    distinct_costs.push(parseFloat(All_Distinct_Burritos[q].substr(All_Distinct_Burritos[q].indexOf('^') + 1, All_Distinct_Burritos[q].length)));
                    distinct_restaurants.push(All_Distinct_Burritos[q].substr(0, All_Distinct_Burritos[q].indexOf('|')));
                    this_burrito[All_Distinct_Burritos[q].substr(0, All_Distinct_Burritos[q].indexOf('|'))] = parseFloat(All_Distinct_Burritos[q].substr(All_Distinct_Burritos[q].indexOf('^') + 1, All_Distinct_Burritos[q].length));
                    Distinct_Burritos.push(this_burrito);
                };

                console.log(distinct_costs);
                console.log(distinct_restaurants);
                console.log(Distinct_Burritos);

                // We can console log the average cost, as well.
                average_cost = 0;
                for (z = 0; z < distinct_costs.length; z++) {
                    average_cost += distinct_costs[z];
                };
                average_cost = average_cost / distinct_costs.length;
                burrito_average_info["Average Cost"] = average_cost;
                console.log(average_cost);

                // To be able to sort the list of restaurants by their corresponding
                // burrito costs, we need to use an array of objects.
                // Since there are multiple cases of the same restaurant, we have
                // to distinguish each burrito in Distinct_Burritos with extra
                // characters so they aren't dropped when we need to refer to
                // the keys later.

                Burrito_Dictionaries = {}
                for (v = 0; v < Distinct_Burritos.length; v++) {
                    Burrito_Dictionaries[v + "?" + distinct_restaurants[v]] = distinct_costs[v];
                }

                // The keys will now all be distinct.
                console.log(Burrito_Dictionaries);

                burrito_average_info["All Burritos"] = Distinct_Burritos;
                console.log(burrito_average_info);
                
                // We'll rename Burrito_Dictionaries as burrito_pairs.
                burrito_pairs = Burrito_Dictionaries;
                // burrito_pairs here is an object whose keys are all distinct.
                console.log(burrito_pairs);
                
                // This function will sort the burrito_pairs object based on the
                // cost values and return an array of the key names.
                var burrito_sorted = Object.keys(burrito_pairs).sort(function(a,b) {
                    return burrito_pairs[b] - burrito_pairs[a];
                });

                // Now, when we console.log burrito_sorted, we'll get an array of
                // restaurant names sorted from most expensive corresponding burrito
                // to cheapest.
                console.log(burrito_sorted);

                // Of course, we'll have to get rid of the numbers and ? at the start
                // of each restaurant name! This is a job for the substr function again!
                burrito_clean_sorted = [];
                for (w = 0; w < burrito_sorted.length; w++) {
                    burrito_clean_sorted.push(burrito_sorted[w].substr(burrito_sorted[w].indexOf('?') + 1, burrito_sorted[w].length));
                }

                // Much better!
                console.log(burrito_clean_sorted);

                // The two graphs we're producing will be ordered in opposite
                // directions. First off, we will have to clone burrito_clean_sorted
                // twice, one for top 5 most expensive, the other for top 5 cheapest.
                expensive_to_cheap = Array.from(burrito_clean_sorted);
                cheap_to_expensive = Array.from(burrito_clean_sorted);

                // The cheap_to_expensive array needs to be reversed.
                cheap_to_expensive.reverse();

                // Since these are top 5 lists, we should slice the sorted
                // list of scores to only include the first five values in
                // each case.
                top_five_expensive_burritos = expensive_to_cheap.slice(0,5);
                top_five_cheap_burritos = cheap_to_expensive.slice(0,5);

                // Now, these two arrays should show the names of the restaurant
                // whose burritos are most and least expensive, respectively.
                
                console.log(top_five_expensive_burritos);
                console.log(top_five_cheap_burritos);

                // We'll do the same thing with the arrays of costs.
                expensive = Array.from(distinct_costs);
                cheap = Array.from(distinct_costs);

                // distinct_costs wasn't already sorted like burrito_clean_sorted,
                // so we'll order everything now.
                expensive.sort().reverse();
                cheap.sort();

                console.log(expensive);
                console.log(cheap);

                // This either slices the distinct_costs if it's longer than 5
                // values, or simply defines the top_five arrays as what we
                // already got.
                if (distinct_costs.length > 5) {
                    top_five_expensive_costs = expensive.slice(0,5);
                    top_five_cheap_costs = cheap.slice(0,5);
                }
                else {
                    top_five_expensive_costs = expensive;
                    top_five_cheap_costs = cheap;
                }
                
                console.log(top_five_expensive_costs);
                console.log(top_five_cheap_costs);

                // We will want to combine the restaurant names and costs into a list
                // for display in the graphs. We'll start by defining empty arrays.
                expensive_list = [];
                cheap_list = [];

                // The hovertemplate text will be produced as such.
                for (p = 0; p < top_five_expensive_costs.length; p++) {
                    expensive_list.push((p + 1) + ". " + top_five_expensive_burritos[p] + ": $" + top_five_expensive_costs[p]);
                    cheap_list.push((p + 1) + ". " + top_five_cheap_burritos[p] + ": $" + top_five_cheap_costs[p]);
                }

                // Making sure it works.
                console.log("Top 5 Expensive: " + expensive_list);
                console.log("Top 5 Cheap: " + cheap_list);

                // We now need to set up the bar traces.
                var expensive_trace = {
                    x: top_five_expensive_burritos,
                    y: top_five_expensive_costs,
                    type: "bar",
                    name: "",
                    orientation: 'v',
                    hovertemplate: expensive_list,
                    marker: {
                        // Red for expensive.
                        color: '#ff0000',
                        opacity: 0.75,
                        line: {
                            color: '#800000',
                            width: 2
                        }
                    }
                };

                var cheap_trace = {
                    x: top_five_cheap_burritos,
                    y: top_five_cheap_costs,
                    type: "bar",
                    name: "",
                    orientation: 'v',
                    hovertemplate: cheap_list,
                    marker: {
                        // Green for cheap.
                        color: '#00ff55',
                        opacity: 0.75,
                        line: {
                            color: '#00802b',
                            width: 2
                        }
                    }
                };

                // Set up the data.
                var expensive_data = [expensive_trace];
                var cheap_data = [cheap_trace];

                var expensive_layout = {
                    title: "Top 5 Most Expensive Burritos by Restaurant",
                    yaxis: { title: "Cost ($)",
                    tickfont: {
                        size: 14,
                        color: '#80002d',
                        family: 'Arial Narrow'
                    }},
                    xaxis: { title: "Restaurant",
                    tickfont: {
                        size: 10,
                        color: '#80002d',
                        family: 'Arial Narrow'
                    }},
                    width: 1200,
                    height: 600,
                    margin: {
                        l: 50,
                        r: 50,
                        b: 120,
                        t: 50,
                        pad: 5
                    }
                };

                var cheap_layout = {
                    title: "Top 5 Cheapest Burritos by Restaurant",
                    yaxis: { title: "Cost ($)",
                    tickfont: {
                        size: 14,
                        color: '#80002d',
                        family: 'Arial Narrow'
                    }},
                    xaxis: { title: "Restaurant",
                    tickfont: {
                        size: 10,
                        color: '#80002d',
                        family: 'Arial Narrow'
                    }},
                    width: 1200,
                    height: 600,
                    margin: {
                        l: 50,
                        r: 50,
                        b: 120,
                        t: 50,
                        pad: 5
                    }
                };

                // We will now add these graphs, referring to the correspoinding div ids.
                Plotly.newPlot("expensive_top_five", expensive_data, expensive_layout);
                Plotly.newPlot("cheap_top_five", cheap_data, cheap_layout);


            }
        };

    });
};
