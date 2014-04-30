//Some resources: http://bl.ocks.org/mbostock/4206573
// http://bl.ocks.org/mbostock/4060606
// http://synthesis.sbecker.net/articles/2012/07/18/learning-d3-part-7-choropleth-maps
// topojson: https://github.com/mbostock/topojson/wiki/API-Reference

$(document).ready(function() {

  var width = 960,
  height = 500;

  // Setting color domains(intervals of values) for our map

  var color_domain = [0, 10, 20, 50, 100, 150, 200, 350]
  var color = d3.scale.threshold()
  .domain(color_domain)
  .range(["#dcdcdc", "#d0d6cd", "#bdc9be", "#97b0a0", "#4b7e64", "#256546", "#125937", "#004d28"]);

  var fmarket_color_domain = [0, 1, 5, 10, 15, 20, 25, 30, 35]
  var fmarket_color = d3.scale.threshold()
  .domain(fmarket_color_domain)
  .range(["#dcdcdc", "#d0d6cd", "#bdc9be", "#97b0a0", "#4b7e64", "#256546", "#125937", "#004d28"]);



  var div = d3.select("body").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

  var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("margin", "10px auto");

  var path = d3.geo.path()

  //Reading map file and data

  queue()
  .defer(d3.json, "_json/us.json")
  .defer(d3.csv, "_data/food_atlas_local.csv")
  //.defer(d3.csv, "_data/food_atlas_ses.csv")
  .await(ready);

  //Start of Choropleth drawing

  function ready(error, us, data) {
    var rateById = {};
    var countyById = {};
    var stateById = {};
    var medIncomeById = {};

    var DirSaleFarms07 = []
    var Fmrkt13 = []

    data.forEach(function(d) {
      rateById[d.id] = +d.DIRSALES_FARMS07;
      countyById[d.id] = d.County;
      stateById[d.id] = d.State;
    //  medIncomeById[d.id] = +d.MEDHHINC10;

      DirSaleFarms07.push(+d.DIRSALES_FARMS07); // num farms with direct sales in 2007
      Fmrkt13.push(+d.FMRKT13); // num farmer's markets per 1,000 people
    });

    //chain is a method from the underscore.js library
    var top10Fmarkets = _.chain(data)
      .sortBy(function(data){return -1 * data.FMRKT13;})
      .map(function(data) {return countyById[data.id] + ", " + stateById[data.id] + ": " + 
          rateById[data.id] + " farmers markets";})
      .first(10)
      .value();

    var top10DirSales = _.chain(data)
      .sortBy(function(data){return -1 * data.DIRSALES_FARMS07;})
      .map(function(data) {return countyById[data.id] + ", " + stateById[data.id] + ": " + 
          rateById[data.id] + " farms";})
      .first(10)
      .value();  

    var med_DirSale07 = d3.median(DirSaleFarms07);
    
    top10DirSales.forEach(function(county) {
      console.log(county);
    });  

    console.log("median " + med_DirSale07 + " farms");

  //Drawing Choropleth
  svg.append("g")
  .attr("class", "counties")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.counties).features)
  .enter().append("path")
  .attr("d", path)
  .style ( "fill" , function (d) {return color (rateById[d.id]);})
  .style("opacity", 0.8)
  .attr("stroke-dasharray", "round")
  .attr("stroke", "black")
  .attr("stroke-width", "0.2px")

  //Adding mouseevents
  .on("mouseover", function(d) {
    d3.select(this).transition().duration(300).style("opacity", 1);
    div.transition().duration(300)
    .style("opacity", 1)
    .attr("stroke-width", "0.2px")
    div.text(countyById[d.id] + " County, " + stateById[d.id] + 
        " direct sale farms : " + rateById[d.id])
    .style("background-color", "#deebf7")
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY -30) + "px");
  })
  .on("mouseout", function() {
    d3.select(this)
    .transition().duration(300)
    .style("opacity", 0.8);

    div.transition().duration(300)
    .style("opacity", 0);
  })

  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  }; 


  // $('#autocomplete').autocomplete({
  //   lookup: counties,
  //   onSelect: function (suggestion) {
  // // some function here
  //   }
  // });


});
