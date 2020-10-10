console.log("Hello Hello?");

function init() {

    var selection = d3.select("#selDataset");
    d3.json("http://127.0.0.1:5000/burrito_data").then(function(data) {
        console.log(data);

        burrito_array = []
        data_length = Object.keys(data).length;
        console.log(data_length);
        for (x = 0; x < data_length; x++) {
            console.log(data[x].Burrito);
            burrito_array.push(data[x].Burrito);
        }
        console.log(burrito_array);
        // data.forEach (burrito => console.log(burrito));
        console.log(data[1].Burrito);
        function distinct(value, index, self) {
            return self.indexOf(value) === index;
        }
        every_burrito_type = burrito_array.filter(distinct);
        every_burrito_type.sort();
        console.log(every_burrito_type);
        every_burrito_type.forEach((burrito) => {
            selection
            .append("option")
            .text(burrito)
            .property("value", burrito);
        });
        var firstBurrito = every_burrito_type[0]
        TopFiveBuilder(firstBurrito);
    });

};


d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged(newSample) {

    var selection = d3.select("#selDataset");
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
        TopFiveBuilder(newSet);
    });

};

init();

function updateMenu() {
    var dropdown = d3.select("#selDataset");
    var current_burrito = dropdown.property("value");
}


function TopFiveBuilder(burrito) {
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

        for (e = 0; e < every_burrito_type.length; e++) {
            if (burrito === every_burrito_type[e]) {
                console.log(every_burrito_type[e]);
                burrito_average_info = {};
                matching_burritos = []
                data_length = Object.keys(data).length;
                console.log(data_length);
                cost_array = [];
                restaurant_array = [];
                for (d = 0; d < data_length; d++) {
                    if (burrito === data[d].Burrito) {
                        matching_burritos.push(data[d]);
                        cost_array.push(data[d].Cost);
                        restaurant_array.push(data[d].Location);
                    };
                };
                console.log(matching_burritos);

                All_Burritos = [];
                restaurant_and_cost = [];
                for (u = 0; u < cost_array.length; u++) {
                    this_burrito = {};
                    this_burrito[restaurant_array[u]] = cost_array[u];
                    console.log(this_burrito);
                    All_Burritos.push(this_burrito);
                    restaurant_and_cost.push(restaurant_array[u] + "|^" + cost_array[u]);
                };
                console.log(All_Burritos);
                function distinct(value, index, self) {
                    return self.indexOf(value) === index;
                }
                All_Distinct_Burritos = restaurant_and_cost.filter(distinct);
                console.log(All_Distinct_Burritos);
                console.log(All_Distinct_Burritos[0].length);
                console.log(All_Distinct_Burritos[0].substr(0, All_Distinct_Burritos[0].indexOf('|')));
                console.log(parseFloat(All_Distinct_Burritos[0].substr(All_Distinct_Burritos[0].indexOf('^') + 1, All_Distinct_Burritos[0].length)));

                distinct_costs = [];
                distinct_restaurants = [];
                Distinct_Burritos = [];

                for (q = 0; q < All_Distinct_Burritos.length; q++) {
                    this_burrito = {}
                    distinct_costs.push(parseFloat(All_Distinct_Burritos[q].substr(All_Distinct_Burritos[q].indexOf('^') + 1, All_Distinct_Burritos[q].length)));
                    distinct_restaurants.push(All_Distinct_Burritos[q].substr(0, All_Distinct_Burritos[q].indexOf('|')));
                    this_burrito[All_Distinct_Burritos[q].substr(0, All_Distinct_Burritos[q].indexOf('|'))] = parseFloat(All_Distinct_Burritos[q].substr(All_Distinct_Burritos[q].indexOf('^') + 1, All_Distinct_Burritos[q].length));
                    Distinct_Burritos.push(this_burrito);
                };

                console.log(distinct_costs);
                console.log(distinct_restaurants);
                console.log(Distinct_Burritos);

                average_cost = 0;
                for (z = 0; z < distinct_costs.length; z++) {
                    average_cost += distinct_costs[z];
                };
                average_cost = average_cost / distinct_costs.length;
                burrito_average_info["Average Cost"] = average_cost;
                console.log(average_cost);

                Burrito_Dictionaries = {}
                for (v = 0; v < Distinct_Burritos.length; v++) {
                    Burrito_Dictionaries[v + "?" + distinct_restaurants[v]] = distinct_costs[v];
                }

                console.log(Burrito_Dictionaries);

                burrito_average_info["All Burritos"] = Distinct_Burritos;
                console.log(burrito_average_info);
                
                burrito_pairs = Burrito_Dictionaries;
                console.log(burrito_pairs);
                
                var burrito_sorted = Object.keys(burrito_pairs).sort(function(a,b) {
                    return burrito_pairs[b] - burrito_pairs[a];
                });

                console.log(burrito_sorted);
                burrito_clean_sorted = [];
                for (w = 0; w < burrito_sorted.length; w++) {
                    burrito_clean_sorted.push(burrito_sorted[w].substr(burrito_sorted[w].indexOf('?') + 1, burrito_sorted[w].length));
                }

                expensive_to_cheap = Array.from(burrito_clean_sorted);
                cheap_to_expensive = Array.from(burrito_clean_sorted);

                cheap_to_expensive.reverse();

                top_five_expensive_burritos = expensive_to_cheap.slice(0,5);
                top_five_cheap_burritos = cheap_to_expensive.slice(0,5);

                console.log(burrito_clean_sorted);

                expensive = Array.from(distinct_costs);
                cheap = Array.from(distinct_costs);

                expensive.sort().reverse();
                cheap.sort();

                console.log(expensive);
                console.log(cheap);

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

                expensive_list = [];
                cheap_list = [];

                for (p = 0; p < top_five_expensive_costs.length; p++) {
                    expensive_list.push((p + 1) + ". " + top_five_expensive_burritos[p] + ": $" + top_five_expensive_costs[p]);
                    cheap_list.push((p + 1) + ". " + top_five_cheap_burritos[p] + ": $" + top_five_cheap_costs[p]);
                }

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
                        color: '#00ff55',
                        opacity: 0.75,
                        line: {
                            color: '#00802b',
                            width: 2
                        }
                    }
                };

                var expensive_data = [expensive_trace];
                var cheap_data = [cheap_trace];

                var expensive_layout = {
                    title: "Top 5 Most Expensive Burritos by Restaurant",
                    yaxis: { title: "Cost",
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
                    yaxis: { title: "Cost",
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

                Plotly.newPlot("expensive_top_five", expensive_data, expensive_layout);
                Plotly.newPlot("cheap_top_five", cheap_data, cheap_layout);


            }
        };

    });
};
