//Some resources: http://bl.ocks.org/mbostock/4206573
// http://bl.ocks.org/mbostock/4060606
// http://synthesis.sbecker.net/articles/2012/07/18/learning-d3-part-7-choropleth-maps
// topojson: https://github.com/mbostock/topojson/wiki/API-Reference


// County Comparison Interactions

$(document).ready(function() {
  // ******** START D3 **********
  var width = $('#map-container').width(),
  height = 490;

  // Setting color domains(intervals of values) for our map

  var color_domain = [0, 1, 100, 500, 1000, 3000, 5000, 9000, 18000];
  var color = d3.scale.threshold()
  .domain(color_domain)
  .range(["#dcdcdc", "#d0d6cd", "#bdc9be", "#97b0a0", "#4b7e64", "#256546", "#125937", "#004d28"]);

  var div = d3.select("#map-container").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

  var svg = d3.select("#map-container").append("svg")
  .attr('id', 'map')
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", "90 10 " + width + " " + height);

  var path = d3.geo.path();

  //Reading map file and data

  queue()
  .defer(d3.json, "_json/us.json")
  .defer(d3.json, "_data/master_data.json")
  .await(ready);

  //Start of Choropleth drawing

  function ready(error, us, data) {

    //console.log(Object.keys(data.County));
    console.log(data.County['1001']);

    // var countyById = {};
    // var stateById = {};

    // var DirSaleFarms07 = []
    // var FmrktPTh13 = []

    var veggie_list = ['Artichokes', 'Asparagus', 'Beans', 'Beets', 'Broccoli', 'Brussels Sprouts', 
                      'Cabbage', 'Carrots', 'Cauliflower', 'Celery', 'Chicory', 'Cucumbers', 'Daikon', 
                      'Eggplant', 'Escarole & Endive', 'Garlic', 'Ginseng', 'Greens', 'Herbs', 'Horseradish',
                      'Lettuce', 'Melons', 'Okra', 'Onions', 'Parsley', 'Peas', 'Peppers', 'Potatoes', 
                      'Pumpkins', 'Radishes', 'Rhubarb', 'Spinach', 'Squash', 'Sweet Corn', 'Sweet Potatoes', 
                      'Tomatoes', 'Turnips', 'Vegetables- Other', 'Watercress'];

    var fruit_list = ['Apples', 'Apricots', 'Avocados', 'Bananas', 'Cherries', 'Chestnuts', 'Citrus- Other', 
                      'Dates', 'Figs', 'Grapefruit', 'Grapes', 'Guavas', 'Hazelnuts', 'Kiwifruit', 'Kumquats', 
                      'Lemons', 'Limes', 'Mangoes', 'Non-Citrus- Other', 'Olives', 'Oranges', 'Papayas', 
                      'Passion Fruit', 'Peaches', 'Pears', 'Pecans', 'Persimmons', 'Plum-Apricot Hybrids', 
                      'Plums', 'Pomegranates', 'Prunes', 'Tangelos', 'Tangerines', 'Temples'];

    var nut_list = ['Almonds', 'Macadamias', 'Pistachios', 'Tree Nuts, Other', 'Walnuts'];

    var totals_list = ['Vegetable Totals', 'Citrus Totals', 'Non-Citrus Totals', 'Tree Nut Totals'];


    var current_selection = 'DIRSALES_FARMS07';

    console.log(data[current_selection]);
    // data.forEach(function(d) {
    //   countyById[d] = d.County;
    //   stateById[d] = d.State;

    //   DirSaleFarms07.push(+d.DIRSALES_FARMS07); // num farms with direct sales in 2007
    //   FmrktPTh13.push(+d.FMRKTPTH13); // num farmer's markets per 1,000 people
    // });

    // Remove County names from Dock
    $('#county-holder').on('click', '.removeable', function(){
      id = county_id($(this).attr('id'));
      county = find_county_obj(data, id);
      remove_county(county);

      // Change list
      change_top_county_status(county);
      change_icon(county);

      // Change map
      change_map_county_status(county);
      change_map_county_color(county).style ( "fill" , function (d) {return color (d[current_selection]);});
    });

    console.log(_.values(data[current_selection]));

  //  var med_current_selection = d3.median(data[current_selection]);

  //  console.log(med_current_selection);
    
   //  //Get Top County Objects
   //  var top_list = _.chain(data)
   //    .sortBy(function(data){return -1 * _.values(data[current_selection]);})
   //    .first(10)
   //    .value(); 

   //  console.log(top_list);

   //  // Append top counties to DOM
   //  top_list.forEach(function(county) {
   //    $('#top-list ul').append("<li class='holdable' id='county-" + county.id + "'>" + county.County +", " + county.State + plus_icon() + "</li>");
   //  });

   //  $('#top-list').on('click', '.holdable', function(){
   //    id = county_id($(this).attr('id'));
   //    county = find_county_obj(data, id);
   //    hold_county(county);
      
   //    // Top list
   //    change_top_county_status(county);
   //    change_icon(county);
    
   //    // Map
   //    change_map_county_status(county);
   //    change_map_county_color(county).style('fill', 'blue');
   //  });

   //  $('#top-list').on('mouseover', '.holdable', function(){
   //    id = county_id($(this).attr('id'));
   //    county = find_county_obj(data, id);
   //    change_map_county_color(county).style('fill', 'blue');
   //  });

   //  $('#top-list').on('mouseout', '.holdable', function(){
   //    id = county_id($(this).attr('id'));
   //    county = find_county_obj(data, id);
   //    change_map_county_color(county).style ( "fill" , function (d) {return color (d[current_selection]);});
   //  });

   // console.log("median " + med_current_selection + " farms");

  //Drawing Choropleth
  svg.append("g")
  .attr("class", "counties")
  .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("d", path)
    .style ( "fill" , function (d) {return color (d[current_selection]);})
    .style("opacity", 0.8)
    .attr("stroke-dasharray", "round")
    .attr("stroke", "black")
    .attr("stroke-width", "0.1px")
    .attr('class', 'holdable')
    .attr("id", function(d, i){ return 'county-' + Object.keys(data.County);})

  // Add county from map

  .on('click', function(){
    id = county_id($(this).attr('id'));
    county = find_county_obj(data, id);
    
    el_html = '#map #county-'+county.id;
    el = $(el_html);
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

    div.transition().duration(300)
    .style("opacity", 1);
    div.text(d.County + " County, " + d.State + "Direct Sale Farms : " + d[current_selection])
    .style("background-color", "#deebf7")
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY -30) + "px");
  })
  .on("mouseout", function() {
    d3.select(this)
    .transition().duration(300)
    .style("opacity", 0.8);
    div.transition().duration(300)
    .style("opacity", 0);
  });

  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-linejoin", "round")
    .attr("d", path);
  }

  // $('#autocomplete').autocomplete({
  //   lookup: counties,
  //   onSelect: function (suggestion) {
  // // some function here
  //   }
  // });


});
