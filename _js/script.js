//Some resources: http://bl.ocks.org/mbostock/4206573
// http://bl.ocks.org/mbostock/4060606
// http://synthesis.sbecker.net/articles/2012/07/18/learning-d3-part-7-choropleth-maps
// topojson: https://github.com/mbostock/topojson/wiki/API-Reference

$(document).ready(function() {

  var width = 960,
    height = 500;

  var fill = d3.scale.log()
    .domain([10, 500])
    .range(["brown", "steelblue"]);

  var path = d3.geo.path();

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.csv("_data/food_atlas_local.csv", function(error, us) {
    var local = d3.nest()
      .key(function(d) {return d.FIPS})
      .sortKeys(d3.ascending)
      .entries(us);

    console.log(local);

    svg.append("g")
        .attr("class", "counties")
      .selectAll("path")
        .data(topojson.feature(us, us.objects.Counties).features)
      .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return fill(path.area(d)); });

  svg.append("path")
    .datum(topojson.mesh(us, us.objects.States, function(a, b) { return a.id !== b.id; }))
    .attr("class", "states")
    .attr("d", path);
});


});


//   var width = 800,
//     height = 700,
//     r1 = height / 2.3,
//     r0 = r1 - 80;

//   var svg = d3.select("#viz")
//           .append("svg")
//           .attr("width", width)
//           .attr("height", height)
//           .append("g")
//           .attr("transform", "translate(" + width / 2 + "," + (height)/ 2 + ")");        

//   // DATA
//   d3.csv("_data/food_atlas_local.csv", function(data) {

//     var local = d3.nest()
//         .key(function(d) {return d.State})
//         .sortKeys(d3.ascending)
//         .entries(data);

//     // Initialize square matrix
//     var ktons = [];

//     // Create array of states
//     var states = [];
//     for (var state in trades) {
//       states.push(trades[state].key);
//     }

//     for (var state in trades) {
//       dest_states = [];
//       // makes list of accounted-for destination states for each origin
//       for (destNum in trades[state].values) {
//         dest_states.push(trades[state].values[destNum].destination);
//       }  
//       dest_states.sort();

//      // identifes destinations that are not accounted for
//       for (var i = 0; i < states.length; i++) {
//         // creates an entry with value of zero if states do not trade
//         if (dest_states.indexOf(states[i]) < 0) {
//           var noTradeState = new Object({
//             origin: trades[state].values[destNum].origin,
//             destination: states[i],
//             Total_Ktons_2011: 0
//           });
//           trades[state].values.push(noTradeState);
//         } 
//       } 
//       //Region data as defined by the Bureau of Economic Analysis: http://en.wikipedia.org/wiki/List_of_regions_of_the_United_States#Bureau_of_Economic_Analysis_regions
//       var New_England = ["Connecticut", "Maine", "Massachusetts", "New Hampshire", "Rhode Island", "Vermont"];
//       var Mideast = ["Delaware", "District of Columbia", "Maryland", "New Jersey", "New York", "Pennsylvania"];
//       var Great_Lakes =["Illinois", "Indiana", "Michigan", "Ohio", "Wisconsin"];
//       var Plains = ["Iowa", "Kansas", "Minnesota", "Missouri", "Nebraska", "North Dakota", "South Dakota"];
//       var Southeast = ["Alabama", "Arkansas", "Florida", "Georgia", "Kentucky", "Louisiana", "Mississippi", "North Carolina", "South Carolina", "Tennessee", "Virginia", "West Virginia"];
//       var Southwest = ["Arizona", "New Mexico", "Oklahoma", "Texas"];
//       var Rocky_Mountain = ["Colorado", "Idaho", "Montana", "Utah", "Wyoming"];
//       var Far_West = ["Alaska", "California", "Hawaii", "Nevada", "Oregon", "Washington"];

//       for (i in trades[state].values) {
//         if (_.contains(New_England, trades[state].key)) {
//           trades[state].region = "New England";

//         } else if (_.contains(Mideast, trades[state].key)) {
//           trades[state].region = "Mideast";

//         } else if (_.contains(Great_Lakes, trades[state].key)) {
//           trades[state].region = "Great Lakes";

//         } else if (_.contains(Plains, trades[state].key)) {
//           trades[state].region = "Plains";

//         } else if (_.contains(Southeast, trades[state].key)) {
//           trades[state].region = "Southeast";

//         } else if (_.contains(Southwest, trades[state].key)) {
//           trades[state].region = "Southwest";

//         } else if (_.contains(Rocky_Mountain, trades[state].key)) {
//           trades[state].region = "Rocky Mountain";

//         } else if (_.contains(Far_West, trades[state].key)) {
//           trades[state].region = "Far West";
//         }
//         //filter out many values of less than 1 kilo ton traded
//         if (parseFloat(trades[state].values[i].Total_Ktons_2011) < 1) {
//           trades[state].values[i].Total_Ktons_2011 = 0;
//         }
//       }
//       //sorts by destination within each state
//       trades[state].values.sort(function(a, b) {
//         if(a.destination < b.destination) // sort string ascending
//           return -1
//         if (a.destination > b.destination)
//           return 1
//         return 0 // default return value (no sorting)
//       });
//     }
    

//     // data is in usable form now
//     console.log(trades);
      
//     // populate matrix
//     for (var i = 0; i < states.length; i++) {
//       ktons[i] = [];
//       for (var j = 0; j < states.length; j++) {
//         ktons[i][j] = parseFloat(trades[i].values[j].Total_Ktons_2011)
//       }
//     }

//     console.log(ktons);


//   var range5 = ["#d4ea8c", "#a27cb0", "#689de3", "#1c086d", "#8ebc4e"];
//   var fill = d3.scale.ordinal()
//     .domain(d3.range(range5.length))
//     .range(range5);
  
//   var arc = d3.svg.arc()
//     .innerRadius(r0)
//     .outerRadius(r0 + 20)

//    // The chord layout, for computing the angles of chords and groups.
//   var chord = d3.layout.chord()
//     .sortGroups(d3.descending)
//     .sortSubgroups(d3.descending)
//     .sortChords(d3.ascending)
//     .padding(.03)
//     .matrix(ktons);
  
//   var g = svg.selectAll("g.group")
//       .data(chord.groups)
//     .enter().append("svg:g")
//       .attr("class", "group")
//       .on("mouseover", fade(.02))
//       .on("mouseout", fade(.90));

//   // Returns an event handler for fading a given chord group.
// function fade(opacity) {
//   return function(d, i) {
//     svg.selectAll("path.chord")
//         .filter(function(d) { return d.source.index != i && d.target.index != i; })
//       .transition()
//         .style("stroke-opacity", opacity)
//         .style("fill-opacity", opacity);
//   };
// }

//   g.append("svg:path")
//       .style("stroke", "black")
//       .style("fill", function(d, i) { return fill(d.index); })
//       .attr("d", arc);

// var textLabel = d3.scale.ordinal().range(states);

//   g.append("svg:text")
//       .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
//       .attr("dy", ".35em")
//       .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
//       .attr("transform", function(d) {
//         return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
//             + "translate(" + (r0 + 26) + ")"
//             + (d.angle > Math.PI ? "rotate(180)" : "");
//       })
//       .text(function(d,i) {return textLabel(i+1);});

//   svg.selectAll("path.chord")
//       .data(chord.chords)
//     .enter().append("svg:path")
//       .attr("class", "chord")
//       .style("fill", function(d) { return fill(d.source.index); })
//       .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
//       .attr("d", d3.svg.chord().radius(r0))
//       .on("mouseover", highlightChord)
//       .on("mouseout", unHighlightChord);

//   function highlightChord() {
//     selected_chord = d3.select(this);
//     selected_chord
//       .style("fill", "black")
//       .style("fill-opacity", 100)
//       .style("stroke", "orange");
//   }    

//   function unHighlightChord() {
//     selected_chord = d3.select(this);
//     selected_chord
//       .style("fill", function(d) { return fill(d.source.index); })
//       .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); });
//   }  

//   });

// });