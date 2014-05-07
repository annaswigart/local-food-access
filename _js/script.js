//Some resources: http://bl.ocks.org/mbostock/4206573
// http://bl.ocks.org/mbostock/4060606
// http://synthesis.sbecker.net/articles/2012/07/18/learning-d3-part-7-choropleth-maps
// topojson: https://github.com/mbostock/topojson/wiki/API-Reference


// County Comparison Interactions

$(document).ready(function() {

  // Setting color domains(intervals of values) for our map

  var color_domain = [0, 1, 100, 500, 1000, 3000, 5000, 9000, 18000]
  var color = d3.scale.threshold()
  .domain(color_domain)
  .range(["#dcdcdc", "#d0d6cd", "#bdc9be", "#97b0a0", "#4b7e64", "#256546", "#125937", "#004d28"]);

  // Tooltip

  var tooltip = d3.select("#map-container").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

  //Zoom

  var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .size([width, height])
    .on("zoom", zoomed);
  
  // Map
  var width = $('#map-container').width();
  var height = 490;

  var path = d3.geo.path()

  var svg = d3.select("#map-container").append("svg")
  .attr('id', 'map')
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", "90 10 " + width + " " + height)

  var features = svg.append("g");

  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);
  
  function zoomed() {
    features.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
  //Reading map file and data

  queue()
  .defer(d3.json, "_json/us.json")
  .defer(d3.csv, "_data/food_atlas_local.csv")
  .await(ready);

  //Start of Choropleth drawing

  function ready(error, us, data) {
    // Data to sortable form
    var rateById = {};
    var countyById = {};
    var stateById = {};

    var DirSale07 = []
    var FmrktPTh13 = []

    data.forEach(function(d) {
      rateById[d.id] = +d.DIRSALES07;
      countyById[d.id] = d.County;
      stateById[d.id] = d.State;

      DirSale07.push(+d.DIRSALES07); // num farms with direct sales in 2007
      FmrktPTh13.push(+d.FMRKTPTH13); // num farmer's markets per 1,000 people
    });

    // Remove County names from Dock
    $('#county-holder').on('click', '.removeable', function(){
      id = county_id($(this).attr('id'))
      county = find_county_obj(data, id)
      remove_county(county)

      // Change list
      change_top_county_status(county);
      change_icon(county);

      // Change map
      change_map_county_status(county);
      change_map_county_color(county).style ( "fill" , function (d) {return color (rateById[d.id]);})
    })
    
    //Get Top County Objects
    var top_list = _.chain(data)
      .sortBy(function(data){return -1 * data.DIRSALES07;})
      .first(10)
      .value(); 

    var med_DirSale07 = d3.median(DirSale07);

    // Append top counties to DOM
    top_list.forEach(function(county) {
      $('#top-list ul').append("<li class='holdable' id='county-" + county.id + "'>" + county.County +", " + county.State + plus_icon() + "</li>");
    });

    $('#top-list').on('click', '.holdable', function(){
      id = county_id($(this).attr('id'))
      county = find_county_obj(data, id)
      hold_county(county);
      
      // Top list
      change_top_county_status(county);
      change_icon(county);
      
      // Map
      change_map_county_status(county);
      change_map_county_color(county).style('fill', 'blue')
    })

    $('#top-list').on('mouseover', '.holdable', function(){
      id = county_id($(this).attr('id'))
      county = find_county_obj(data, id)
      change_map_county_color(county).style('fill', 'blue')
    })

    $('#top-list').on('mouseout', '.holdable', function(){
      id = county_id($(this).attr('id'))
      county = find_county_obj(data, id)
      change_map_county_color(county).style ( "fill" , function (d) {return color (rateById[d.id]);})
    })

    console.log("median " + med_DirSale07 + " farms");

  //Drawing Choropleth

  features
  .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .style ( "fill" , function (d) {return color (rateById[d.id]);})
    .style("opacity", 0.8)
    .attr("stroke-dasharray", "round")
    .attr("stroke", "black")
    .attr("stroke-width", "0.1px")
    .attr('class', 'holdable')
    .attr("id", function(d, i){ return 'county-' + d.id })

  // Add county from map

  .on('click', function(){
    id = county_id($(this).attr('id'))
    county = find_county_obj(data, id)
    
    el_html = '#map #county-'+county.id
    el = $(el_html)
    if (el.attr('class') == 'holdable') {
      hold_county(county);
      change_map_county_status(county);
      change_map_county_color(county).style('fill', 'blue');
    }

    // Change top list if the county clicked on is in it
    if(county_in_top(county)){
      change_top_county_status(county);
      change_icon(county);
    }

  })


  //Tooltip + mousevents
  .on("mouseover", function(d) {
    d3.select(this)
      .transition().duration(300)
      .style("opacity", 1);

    tooltip.transition().duration(300)
    .style("opacity", 1)
    tooltip.text(countyById[d.id] + " County, " + stateById[d.id] + "Direct Sale Farms : " + rateById[d.id])
    .style("background-color", "#deebf7")
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY -30) + "px");
  })
  .on("mouseout", function() {
    d3.select(this)
    .transition().duration(300)
    .style("opacity", 0.8);
    tooltip.transition().duration(300)
    .style("opacity", 0);
  })

  features
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
