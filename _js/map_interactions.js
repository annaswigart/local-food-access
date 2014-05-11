// ########### Top 10 List ###########

var sortDesc = function(all_counties, key) {
    all_counties.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
    rank = 1
    all_counties.forEach(function(county){
      county['rank'] = rank
      rank += 1
    });
    console.log(all_counties)
    return all_counties
}

var getTop = function(all_counties){
  top_counties = all_counties.slice(0,10);
  return top_counties
}


var clear_top_list = function(){
  $('#top-list span').remove()
}


var top_list = function(all_counties, food_selection, food){
   // Append top counties to DOM - interactions.js
    sorted = sortDesc(all_counties, 'food_quant')
    var top_counties = getTop(all_counties)
    top_counties.forEach(function(county) {
      if($('#held-counties').has('#county-'+county.id).length > 0){
        
        a = $(county_tag(county)).addClass('held').removeClass('draggable').append(check_icon())
        $('#top-list').append(a)
        $(".draggable").draggable({ disabled: false });

        if($('.drag-here').attr('id') == 'county-'+county.id){
          $('#top-list #county-'+county.id).addClass('disabled')
          $(".disabled").draggable({ disabled: true });
        }

      }
      else{
        $('#top-list').append(holdable_county(county));
      }
    });
}

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







