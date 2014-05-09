//Some resources: http://bl.ocks.org/mbostock/4206573
// http://bl.ocks.org/mbostock/4060606
// http://synthesis.sbecker.net/articles/2012/07/18/learning-d3-part-7-choropleth-maps
// topojson: https://github.com/mbostock/topojson/wiki/API-Reference


// County Comparison Interactions

$(document).ready(function() {
  

  //Reading map file and data

  queue()
  .defer(d3.json, "_json/us.json")
  .defer(d3.json, "_data/master_data.json")
  .await(ready);

  //Start of Choropleth drawing

  function ready(error, us, food, mine) {
    // *** Set Up - data_setup.js ****

    var veggie_list = get_veggie_list()
    var fruit_list = get_fruit_list()
    var nut_list = get_nut_list()
    var totals_list = get_totals_list()

    food_selection = 'DIRSALES_FARMS07'

    var all_counties = make_county_objects(food, food_selection)

    draw_map(us, all_counties)
    top_list(all_counties, food_selection)
  
    $('#switch-data').on('mousedown', '.radio', function(){
      food_selection = ''
      var toggle = $(this).attr('id')
      if(toggle == 'direct-farm'){

        food_selection = 'DIRSALES_FARMS07'
        var all_counties = make_county_objects(food, food_selection)
        clear_top_list()
        draw_map(us, all_counties)
        top_list(all_counties, food_selection)
      }
    })

    $('#food-search-box').on('keyup',function(e) {
      if (e.which == 13){
          food_selection = $(this).val()


          var all_counties = make_county_objects(food, food_selection)
          draw_map(us, all_counties)

          clear_top_list()
          top_list(all_counties, food_selection)
      }
    });
  }
});
