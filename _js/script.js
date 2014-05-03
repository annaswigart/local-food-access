//Some resources: http://bl.ocks.org/mbostock/4206573
// http://bl.ocks.org/mbostock/4060606
// http://synthesis.sbecker.net/articles/2012/07/18/learning-d3-part-7-choropleth-maps
// topojson: https://github.com/mbostock/topojson/wiki/API-Reference


// County Comparison Interactions

var holdable_county = function(county) {
  var icon = "<i class='fa fa-plus-circle move-county'></i>"
  var el = "<span class='holdable' id=" + county.id + ">" + county.County + ", " + county.State + icon + "</span>"
  return el
}

var check_icon = function() {
  var icon = "<i class='fa fa-check-circle move-county'></i>"
  return icon
}
var held_county = function(county) {
  icon = check_icon()
  var el = "<span class='held' id=" + county.id + ">" + county.County + ", " + county.State + icon + "</span>"
  return el
}

var removeable_county = function(county) {
  var icon = "<i class='fa fa-times-circle move-county'></i>"
  var el = "<span class='removeable' id=" + county.id + ">" + county.County + ", " + county.State + icon + "</span>"
  return el
}

var not_duplicate = function(el) {
  if (!el.hasClass('held')) {
    return true
  }
  else {
    return false
  }
}

var hold_county = function(county, el) {
  $('#held-counties').append(removeable_county(county)); // Add to held box
  el.removeClass('holdable').addClass('held').children().remove(); // Change status to held
  el.append(check_icon()); // Change icon to checked
}

var remove_county = function(el, id) {
  el.remove(); // Remove from box
  $("#" + id + ".held")
    .removeClass('held')
    .addClass('holdable')
    .children().removeClass('fa-check-circle').addClass('fa-plus-circle') // Change checkbox to plus sign
}

var find_county = function(data, id) {
  wanted_county = {}
  data.forEach(function(d) {
    if (id == d.id){
      wanted_county = d
    }
  });
  return wanted_county
}

$(document).ready(function() {

  // ******** START D3 **********
  var width = $('#map-container').width(),
  height = 490;

  // Setting color domains(intervals of values) for our map

  var color_domain = [0, 1, 100, 500, 1000, 3000, 5000, 9000, 18000]
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

  var path = d3.geo.path()

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
    
    //Get Top County Objects
    var top_list = _.chain(data)
      .sortBy(function(data){return -1 * data.DIRSALES07;})
      // .map(function(data) {return countyById[data.id] + ", " + stateById[data.id] + ": " + 
      //     rateById[data.id] + " farms";})
      .first(5)
      .value(); 

    var med_DirSale07 = d3.median(DirSale07);

    // Append top counties to DOM
    top_list.forEach(function(county) {
      $('#top-list ul').append("<li>" + holdable_county(county) + "</li>");
    });

    // Click to add top counties to save box
    $('#top-list ul li span.holdable').on('click', function(){
      id = $(this).attr('id')
      county = find_county(data, id)

      if(not_duplicate($(this))) {
        hold_county(county, $(this))
      }
      
      $('.removeable').on('click', function(){
        remove_county($(this), id)
      })

    })

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
  .attr("stroke-width", "0.1px")

  // Saving counties for comparison

  
  .on('click', function(clicked_county) { 
    
    // Find clicked county from data set
    wanted_county = {}
    data.forEach(function(d) {
      if (clicked_county.id == d.id){
        wanted_county = d
      }
    });

    // Add county to save box
    // var remove = "<span class='remove-county'><i class='fa fa-times-circle'></i></span>"
    // $('#county-saver').append(held_county(wanted_county).append(remove_county));

    // if($('#left-county-content').text() == "") {
    //   $.each(wanted_county, function(i, val) {
    //     $('#left-county-content').append(i + ": " + val + "<br>")
    //   });
    // }
    // else {

    // }
      

  })

  //Tooltip + mousevents
  .on("mouseover", function(d) {
    d3.select(this)
      .transition().duration(300)
      .style("opacity", 1);

    div.transition().duration(300)
    .style("opacity", 1)
    div.text(countyById[d.id] + " County, " + stateById[d.id] + 
        " Direct Sale Farms : " + rateById[d.id])
    .style("background-color", "#deebf7")
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY -30) + "px");

    // var county_name = countyById[d.id] + " County, " + stateById[d.id]
    // $('#left-county input').val(county_name);
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
