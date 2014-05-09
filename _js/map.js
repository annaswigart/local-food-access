
// Setting color domains(intervals of values) for our map
var color_domain = [0, 1, 100, 500, 1000, 3000, 5000, 9000, 18000];
var color = d3.scale.threshold()
.domain(color_domain)
// .range(["#dcdcdc", "#d0d6cd", "#bdc9be", "#97b0a0", "#4b7e64", "#256546", "#125937", "#004d28"]);
.range(['#F1F9F7', '#BAE2DA', '#83CCBE', '#4CB6A1', '#16A085', '#127A66', '#0F5447', '#0C2F28'])

// Map
var width = $('#map-container').width();
var height = 490;

var viewBoxX = width - 67,
    viewBoxY = height - 8;

var svg = d3.select("#map-container").append("svg")
.attr('id', 'map')
.attr("width", width)
.attr("height", height)
.attr("viewBox", "110 10 " + viewBoxX + " " + viewBoxY)

var path = d3.geo.path();

// Tooltip

var tooltip = d3.select("#map-container").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

//Zoom
function zoomed() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  svg.select(".state-border").style("stroke-width", 1.5 / d3.event.scale + "px");
  svg.select(".county-border").style("stroke-width", .5 / d3.event.scale + "px");
}

var zoom = d3.behavior.zoom()
  .translate([0, 0])
  .scale(1)
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

var draw_map = function(us, all_counties){
  //Drawing Choropleth + map interactions

  svg.append("g")
  .attr("class", "counties")
  .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("d", path)
    .style ( "fill" , function (d) {return color (colorRating(all_counties, d.id))}) // colorRating function is from data_setup.js
    .style("opacity", 0.8)
    .attr("stroke-dasharray", "round")
    .attr("stroke", "black")
    .attr("stroke-width", "0.1px")
    .attr('class', 'holdable')
    .attr("id", function(d, i){ 
        return 'county-' + d.id;
    })

  // Add county from map

  .on('click', function(){
    id = county_id($(this).attr('id'));
    county = find_county_obj(all_counties, id);
    
    el_html = '#map #county-'+county.id;
    el = $(el_html);
    if (el.attr('class') == 'holdable') {
      hold_county(county);
      change_map_county_status(county);
      change_map_county_color(county).style('fill', '#3498DB');
    }

    // Change top list if the county clicked on is in it
    if(county_in_top(county)){
      change_top_county_status(county);
      change_icon(county);
    }

  })

  //Tooltip + mousevents
  .on("mouseover", function(d) {
    id = county_id($(this).attr('id'))
    county = find_county_obj(all_counties, id)
    d3.select(this)
      .transition().duration(200)
      .style("opacity", 1);

    tooltip.transition().duration(200)
    .style("opacity", 1);
    tooltip.text(county.county + " County, " + county.state + "                 " + county.food + ": " + county.food_quant)
    .style("background-color", "#2C3E50")
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY -30) + "px");

  })
  .on("mouseout", function() {
    d3.select(this)
    .transition().duration(300)
    .style("opacity", 0.8);
    tooltip.transition().duration(300)
    .style("opacity", 0);

    // Un-highlight top list
    // id = county_id($(this).attr('id'))
    // top_county = $('#top-list #county-' + id)
    // if(top_county.hasClass('held')){
    //   // top_county.css('background-color', '#3498db')
    // }
    // else if{
    //   top_county.css('background-color', '#1abc9c')
    // }
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
  }
// $.widget( "custom.catcomplete", $.ui.autocomplete, {
//     _renderMenu: function( ul, items ) {
//       var self = this,
//         currentCategory = "";
//       $.each( items, function( index, item ) {
//         if ( item.category != currentCategory ) {
//           ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
//           currentCategory = item.category;
//         }
//         self._renderItem( ul, item );
//       });
//     }
// });

// $(function() {
//   $( "#search" ).catcomplete({
//     delay: 0,
//     source: get_food_search_obj(),
//     minLength: 1,

//     select: function(event, ui) {
//       console.log(ui)
//       // $("#search").val(ui.item.label);
//     }

//   });
// }); 
 

  // $('#autocomplete').autocomplete({
  //   lookup: counties,
  //   onSelect: function (suggestion) {
  // // some function here
  //   }
  // });

var top_list = function(all_counties, food_selection){
   // Append top counties to DOM - interactions.js
    var top_counties = getTop(all_counties, 'food_quant')
    
    top_counties.forEach(function(county) {
      $('#top-list').append(holdable_county(county));
    });

    $('#top-list').on('click', '.hold-county', function(){
      id = county_id($(this).parent().attr('id'))
      county = find_county_obj(all_counties, id)
      hold_county(county)
      // Top list
      change_top_county_status(county);
      change_icon(county);
    
      // Map
      change_map_county_status(county);
      change_map_county_color(county).style('fill', '#3498DB')
    })

    // Remove County names from Dock
    $('#county-holder').on('click', '.remove-county', function(){
      id = county_id($(this).parent().attr('id'));
      county = find_county_obj(all_counties, id);
      remove_county(county);

      // Change list
      change_top_county_status(county);
      change_icon(county);

      // Change map
      change_map_county_status(county);
      change_map_county_color(county)
        .style ( "fill" , function (d) {return color (county.food_quant);});
    }); 
}
 