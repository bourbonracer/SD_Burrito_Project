// var url = "https://raw.githubusercontent.com/bourbonracer/San-Diego-Burrito-Project/master/Burrito_JSON.json"

console.log("Hello Hello?");

function init() {

    var selection = d3.select("#selDataset");
    d3.json("http://127.0.0.1:5000/burrito_data").then(function(data) {
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
        TopFiveBuilder(firstRegion);
    });

};


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
        TopFiveBuilder(newSet);
    });

};

init();

function updateMenu() {
    var dropdown = d3.select("#selDataset");
    var current_burrito = dropdown.property("value");
}


function TopFiveBuilder(region) {
    var dataFile = d3.json("/burrito_data").then(function(data) {
        region_array = []
        data_length = Object.keys(data).length;
        for (x = 0; x < data_length; x++) {
            region_array.push(data[x].Neighborhood);
        }
        // data.forEach (burrito => console.log(burrito));
        function distinct(value, index, self) {
            return self.indexOf(value) === index;
        }
        every_region = region_array.filter(distinct);
        every_region.sort();
        for (e = 0; e < every_region.length; e++) {
            if (region === every_region[e]) {
                console.log(every_region[e]);
                matching_burritos = []
                data_length = Object.keys(data).length;
                console.log(data_length);
                restaurant_array = [];
                restaurant_name_array = [];
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
                function distinct(value, index, self) {
                    return self.indexOf(value) === index;
                }
                every_restaurant = restaurant_array.filter(distinct);
                every_restaurant_name = restaurant_name_array.filter(distinct);
                every_burrito = burrito_array.filter(distinct);
                console.log(every_restaurant);
                console.log(every_burrito);

                var restaurant_scores = {};

                var google_pairs = {}
                var yelp_pairs = {}
                var overall_pairs = {}

                for (a = 0; a < every_restaurant.length; a++) {
                    current_restaurant = every_restaurant[a];
                    current_restaurant_name = every_restaurant_name[a];
                    console.log(current_restaurant);
                    // var google_scores = {};
                    // var yelp_scores = {};

                    for (b = 0; b < matching_burritos.length; b++) {
                        if (current_restaurant === matching_burritos[b].Address) {
                            // current_google_scores.push(matching_burritos[b].Google);
                            // current_yelp_scores.push(matching_burritos[b].Yelp);
                            var current_restaurant_scores = {
                                google: matching_burritos[b].Google,
                                yelp: matching_burritos[b].Yelp,
                                overall: (matching_burritos[b].Google + matching_burritos[b].Yelp) / 2
                            };
                            console.log(current_restaurant);
                            restaurant_scores[current_restaurant_name] = current_restaurant_scores;

                            google_pairs[current_restaurant_name] = restaurant_scores[current_restaurant_name].google;
                            yelp_pairs[current_restaurant_name] = restaurant_scores[current_restaurant_name].yelp;
                            overall_pairs[current_restaurant_name] = restaurant_scores[current_restaurant_name].overall;


                            break;
                        }
                    }
                    console.log(restaurant_scores);
                }
                var all_googles = [];
                var all_yelps = [];
                var all_overalls = [];

                for (h = 0; h < every_restaurant.length; h++) {
                    current_name = every_restaurant_name[h];
                    console.log(current_name);
                    console.log(restaurant_scores[current_name].google);
                    all_googles.push(restaurant_scores[current_name].google);
                    all_yelps.push(restaurant_scores[current_name].yelp);
                    all_overalls.push(restaurant_scores[current_name].overall);

                }
                all_googles.sort().reverse();
                all_yelps.sort().reverse();
                all_overalls.sort().reverse();
                console.log(all_googles);
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

                var google_sorted = Object.keys(google_pairs).sort(function(a,b) {
                    return google_pairs[b] - google_pairs[a];
                });
                var yelp_sorted = Object.keys(yelp_pairs).sort(function(a,b) {
                    return yelp_pairs[b] - yelp_pairs[a];
                });
                var overall_sorted = Object.keys(overall_pairs).sort(function(a,b) {
                    return overall_pairs[b] - overall_pairs[a];
                });

                top_five_google_names = google_sorted.slice(0,5);
                top_five_yelp_names = yelp_sorted.slice(0,5);
                top_five_overall_names = overall_sorted.slice(0,5);

                google_list = [];
                yelp_list = [];
                overall_list = [];

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
                    orientation: 'v',
                    hovertemplate: google_list,
                    marker: {
                        color: '#fc035a',
                        opacity: 0.75,
                        line: {
                            color: '#80002d',
                            width: 2
                        }
                    }
                };

                var yelp_trace = {
                    x: top_five_yelp.reverse(),
                    y: top_five_yelp_names.reverse(),
                    type: "bar",
                    orientation: 'h',
                    hovertemplate: yelp_list.reverse()
                };

                var overall_trace = {
                    x: top_five_overall.reverse(),
                    y: top_five_overall_names.reverse(),
                    type: "bar",
                    orientation: 'h',
                    hovertemplate: overall_list.reverse()
                };

                var google_data = [google_trace];
                var yelp_data = [yelp_trace];
                var overall_data = [overall_trace];

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
                    xaxis: { title: "Score" },
                    yaxis: { title: "Restaurant" }
                };
                var overall_layout = {
                    title: "Top 5 Restaurants by Overall Score",
                    xaxis: { title: "Score" },
                    yaxis: { title: "Restaurant" }
                };

                Plotly.newPlot("google_top_five", google_data, google_layout);
                Plotly.newPlot("yelp_top_five", yelp_data, yelp_layout);
                Plotly.newPlot("overall_top_five", overall_data, overall_layout);


            }
        }

    });
}