// ########### Top 10 List ###########

var sortDesc = function(all_counties, key) {
    return all_counties.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

var getTop = function(all_counties, key){
  top_counties = sortDesc(all_counties, key).slice(0,10);
  return top_counties
}


var clear_top_list = function(){
  $('#top-list span').remove()
}

  // Add county from map

  // .on('click', function(){
  //   id = county_id($(this).attr('id'));
  //   county = find_county_obj(all_counties, id);
    
  //   el_html = '#map #county-'+county.id;
  //   el = $(el_html);


  //   if (el.attr('class') == 'holdable') {
  //     hold_county(county);

  //     // Make removeable elements draggable
  //     drag_and_drop('removeable', food)
      
  //     // Map
  //     change_map_county_to_held(county);

  //     console.log(change_map_county_color(county))
  //     change_map_county_color(county).style('fill', '#3498DB');

  //     // Change top list if the county clicked on is in it
  //     if(county_in_top(county)){
        
  //       // Top list
  //       change_top_county_to_held(county);
  //       change_icon(county);
  //     }
  //   }

  // })


var make_holdable = function(all_counties, food){
  $('.holdable').on('click', function(){
    el = d3.select(this)
    
    el_id = county_id($(this).attr('id'))
    county = find_county_obj(all_counties, id)

    hold_county(county)

    // Make docked elements draggable
    drag_and_drop('removeable', food)

    // Indiate held
    held_status(county);
  })
}

var make_removeable = function(all_counties, food){
  $('#held-counties').on('click', '.removeable', function(){
    id = county_id($(this).attr('id'));
    county = find_county_obj(all_counties, id);
    
    remove_county(county);

    // Indiate holdable again
    holdable_status(county);
  })
}

var top_list = function(all_counties, food_selection, food){
   // Append top counties to DOM - interactions.js
    var top_counties = getTop(all_counties, 'food_quant')
    
    top_counties.forEach(function(county) {
      $('#top-list').append(holdable_county(county));
    });
}



    // // Remove County names from Dock
    // $('#county-holder').on('click', '.removeable', function(event){
    //   id = county_id($(this).attr('id'));
    //   county = find_county_obj(all_counties, id);
    //   remove_county(county);

    //   // Change list
    //   change_top_county_to_holdable(county);
    //   change_icon(county);

    //   // Change map
    //   change_map_county_to_held(county);
    //   change_map_county_color(county)
    //     .style ( "fill" , function (d) {return color (county.food_quant);});
    // }); 
// }

// Tooltip + mousevents

// counties = d3.select('#map').selectAll('.holdable')

// console.log(counties)
// $('#map').on("mouseover", function(d) {
//   id = county_id($(this).attr('id'))
//   county = find_county_obj(all_counties, id)

//   d3.select(this)
//     .transition().duration(200)
//     .style("opacity", 1);

//   tooltip.transition().duration(200)
//   .style("opacity", 1);
//   tooltip.text(county.county + " County, " + county.state + "                 " + county.food + ": " + county.food_quant)
//   .style("background-color", "#2C3E50")
//   .style("left", (d3.event.pageX + 10) + "px")
//   .style("top", (d3.event.pageY -30) + "px");
// })

// $('.holdable').on("mouseout", function() {
//   d3.select(this)
//   .transition().duration(300)
//   .style("opacity", 0.8);
//   tooltip.transition().duration(300)
//   .style("opacity", 0);
// })







