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

        // We'll push every obtained region (neighborhood) into an empty array.
        region_array = []

        // We need data_length for later reference.
        data_length = Object.keys(data).length;

        // Let's loop through it.
        for (x = 0; x < data_length; x++) {
            console.log(data[x].Neighborhood);
            region_array.push(data[x].Neighborhood);
        }

        // We need to filter the region_array to only include distinct values.
        function distinct(value, index, self) {
            return self.indexOf(value) === index;
        }
        every_region = region_array.filter(distinct);

        // Alphabetize it.
        every_region.sort();
        console.log(every_region);

        // Populating the dropdown.
        every_region.forEach((region) => {
            selection
            .append("option")
            .text(region)
            .property("value", region);
        });
        // Use the first region by defaut.
        var firstRegion = every_region[0];
        // Plug it into the chart builder.
        TopFiveBuilder(firstRegion);
    });

};

// We need this when a new option is chosen.
d3.selectAll("#selDataset").on("change", optionChanged);

// The function that handles changed options.
function optionChanged(newSample) {

    // Mostly the same, except we're using newSet.
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
        TopFiveBuilder(newSet);
    });

};

// We'll need this!
init();

// And this!
function updateMenu() {
    var dropdown = d3.select("#selDataset");
    var current_burrito = dropdown.property("value");
}

// Here is the main function that produces the actual visualizations.
function TopFiveBuilder(region) {
    // Get the data from the app.py path.
    var dataFile = d3.json("/burrito_data").then(function(data) {
        // Creating a list of regions the same as before.
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
        for (e = 0; e < every_region.length; e++) {
            // Checks to see it the parameter region matches the region looped
            // in the every_region array.
            if (region === every_region[e]) {
                console.log(every_region[e]);
                // We'll hold the burrito data in empty arrays.
                // matching_burritos stores every relevant burrito in one array.
                matching_burritos = []
                data_length = Object.keys(data).length;
                console.log(data_length);
                // The specific restaurant will be identified by its address.
                restaurant_array = [];
                // We will also want an array that holds the address, as well as the
                // restaurant name.
                restaurant_name_array = [];
                // We need an array that contains the burrito type.
                burrito_array = [];
                for (d = 0; d < data_length; d++) {
                    if (region === data[d].Neighborhood) {
                        matching_burritos.push(data[d]);
                        restaurant_array.push(data[d].Address)
                        restaurant_name_array.push(data[d].Location + " (" + data[d].Address + ")");
                        burrito_array.push(data[d].Burrito);
                    }
                }
                console.log(matching_burritos);
                // We now need to filter the list of restaurants
                // we got to avoid duplicates.
                function distinct(value, index, self) {
                    return self.indexOf(value) === index;
                }
                every_restaurant = restaurant_array.filter(distinct);
                every_restaurant_name = restaurant_name_array.filter(distinct);
                every_burrito = burrito_array.filter(distinct);

                console.log(every_restaurant);
                console.log(every_burrito);

                // We'll now create empty objects that store the restaurant scores.
                // The first object uses the restaurant name as its key and an object
                // containing all scores as its value.
                var restaurant_scores = {};

                // Simultaneously, we'll create objects that store only the
                // corresponding scores as values.
                var google_pairs = {}
                var yelp_pairs = {}
                var overall_pairs = {}

                // We'll loop through the filtered data and store everything.
                for (a = 0; a < every_restaurant.length; a++) {
                    // We should define the current restaurant to refer to in the key.
                    current_restaurant = every_restaurant[a];
                    // We'll store the specific restaurant name and address, too.
                    current_restaurant_name = every_restaurant_name[a];

                    // We will now loop through matching_burritos and check to see if
                    // the address of the current restaurant matches the Address value
                    // stored in the matching_burritos object.

                    for (b = 0; b < matching_burritos.length; b++) {
                        if (current_restaurant === matching_burritos[b].Address) {
                            // Once we find a match, we'll define the scores from matching_burritos.
                            var current_restaurant_scores = {
                                google: matching_burritos[b].Google,
                                yelp: matching_burritos[b].Yelp,
                                // Overall score is just the average of the Google and Yelp scores.
                                overall: (matching_burritos[b].Google + matching_burritos[b].Yelp) / 2
                            };
                            console.log(current_restaurant);
                            // We will now define the object values, with the restaurant name as the
                            // key and object of restaurant scores as the value.
                            restaurant_scores[current_restaurant_name] = current_restaurant_scores;

                            // The three "pairs" objects will just use the corresponding scores as the value.
                            google_pairs[current_restaurant_name] = restaurant_scores[current_restaurant_name].google;
                            yelp_pairs[current_restaurant_name] = restaurant_scores[current_restaurant_name].yelp;
                            overall_pairs[current_restaurant_name] = restaurant_scores[current_restaurant_name].overall;
                            
                            // We now need to break the b loop, since we got what we wanted.
                            break;
                        }
                    }
                    console.log(restaurant_scores);
                }

                // We will now need to define empty arrays that will contain all of the
                // google, yelp, and overall scores that we obtained.
                var all_googles = [];
                var all_yelps = [];
                var all_overalls = [];

                // We will loop through the restaurant addresses and push the
                // corresponding scores into their respective arrays, using
                // the restaurant_scores object as reference.
                for (h = 0; h < every_restaurant.length; h++) {
                    current_name = every_restaurant_name[h];
                    console.log(current_name);
                    console.log(restaurant_scores[current_name].google);
                    all_googles.push(restaurant_scores[current_name].google);
                    all_yelps.push(restaurant_scores[current_name].yelp);
                    all_overalls.push(restaurant_scores[current_name].overall);

                }
                // We will need to sort the ratings from highest to lowest.
                // Since the values have to be in descending order, we need to
                // use .reverse() in addition to .sort().
                all_googles.sort().reverse();
                all_yelps.sort().reverse();
                all_overalls.sort().reverse();

                console.log(all_googles);

                // We need to slice these arrays to only include the first 5 values.
                if (all_googles.length > 5) {
                    top_five_google = all_googles.slice(0,5);
                    top_five_yelp = all_yelps.slice(0,5);
                    top_five_overall = all_overalls.slice(0,5);
                }
                else {
                    top_five_google = all_googles;
                    top_five_yelp = all_yelps;
                    top_five_overall = all_overalls;
                }
                
                console.log(top_five_google);
                console.log(top_five_yelp);
                console.log(top_five_overall);

                console.log(google_pairs);
                console.log(yelp_pairs);
                console.log(overall_pairs);

                // To sort the list of restaurants by their corresponding ratings,
                // we have to use a .sort function.
                var google_sorted = Object.keys(google_pairs).sort(function(a,b) {
                    return google_pairs[b] - google_pairs[a];
                });
                var yelp_sorted = Object.keys(yelp_pairs).sort(function(a,b) {
                    return yelp_pairs[b] - yelp_pairs[a];
                });
                var overall_sorted = Object.keys(overall_pairs).sort(function(a,b) {
                    return overall_pairs[b] - overall_pairs[a];
                });

                // The names will now be sliced to only include the top 5.
                top_five_google_names = google_sorted.slice(0,5);
                top_five_yelp_names = yelp_sorted.slice(0,5);
                top_five_overall_names = overall_sorted.slice(0,5);

                // We will want to format our top 5's as lists that contain both the
                // restaurant name and address, as well as its corresponding rating.
                google_list = [];
                yelp_list = [];
                overall_list = [];

                // This loops through the top five list, and produces the list. These
                // lists will come in handy when we create our hovertemplate.
                for (p = 0; p < top_five_google_names.length; p++) {
                    google_list.push((p + 1) + ". " + top_five_google_names[p] + ": " + top_five_google[p]);
                    yelp_list.push((p + 1) + ". " + top_five_yelp_names[p] + ": " + top_five_yelp[p]);
                    overall_list.push((p + 1) + ". " + top_five_overall_names[p] + ": " + top_five_overall[p]);
                }

                console.log("Top 5 Google: " + google_list);
                console.log("Top 5 Yelp: " + yelp_list);
                console.log("Top 5 Overall: " + overall_list);

                // We now need to set up the bar traces.
                var google_trace = {
                    x: top_five_google_names,
                    y: top_five_google,
                    type: "bar",
                    // We don't want "trace 0" to appear!
                    name: "",
                    orientation: 'v',
                    hovertemplate: google_list,
                    marker: {
                        // The colors will be distinct for each.
                        color: '#fc035a',
                        opacity: 0.75,
                        line: {
                            color: '#80002d',
                            width: 2
                        }
                    }
                };

                var yelp_trace = {
                    x: top_five_yelp_names,
                    y: top_five_yelp,
                    type: "bar",
                    name: "",
                    orientation: 'v',
                    hovertemplate: yelp_list,
                    marker: {
                        color: '#004cff',
                        opacity: 0.75,
                        line: {
                            color: '#002680',
                            width: 2
                        }
                    }
                };

                var overall_trace = {
                    x: top_five_overall_names,
                    y: top_five_overall,
                    type: "bar",
                    name: "",
                    orientation: 'v',
                    hovertemplate: overall_list,
                    marker: {
                        color: '#00ff78',
                        opacity: 0.75,
                        line: {
                            color: '#00803c',
                            width: 2
                        }
                    }
                };

                // Now the data.
                var google_data = [google_trace];
                var yelp_data = [yelp_trace];
                var overall_data = [overall_trace];

                // And the layout.
                var google_layout = {
                    title: "Top 5 Restaurants by Google Score",
                    yaxis: { title: "Score",
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
                var yelp_layout = {
                    title: "Top 5 Restaurants by Yelp Score",
                    yaxis: { title: "Score",
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
                var overall_layout = {
                    title: "Top 5 Restaurants by Overall Score",
                    yaxis: { title: "Score",
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

                // Now we'll add these charts with Plotly.
                Plotly.newPlot("google_top_five", google_data, google_layout);
                Plotly.newPlot("yelp_top_five", yelp_data, yelp_layout);
                Plotly.newPlot("overall_top_five", overall_data, overall_layout);


            }
        }

    });
}