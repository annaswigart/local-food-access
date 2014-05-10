$(document).ready(function() {

  //Reading map file and data

  queue()
  .defer(d3.json, "_json/us.json")
  .defer(d3.json, "_data/master_data.json")
  .await(ready);

  function ready(error, us, food) {
   
    // ##### Initial View #####

    // *** map_setup.js ****
    food_selection = 'DIRSALES_FARMS07'
    var all_counties = make_county_objects(food, food_selection)

    // *** map.js ****
    draw_map(us, all_counties, food)
    top_list(all_counties, food_selection, food)

    // ##### CORE OF THE PAGE #####

    // make county tags draggable from the start
    make_drag('holdable')

    // Toggle map
    $('#switch-data').on('mousedown', '.radio', function(){
      food_selection = ''
      var toggle = $(this).attr('id')
      if(toggle == 'direct-farm'){
        food_selection = 'DIRSALES_FARMS07'
        var all_counties = make_county_objects(food, food_selection)
        $('#food-search').slideUp(200)
        clear_top_list()
        draw_map(us, all_counties, food)
        top_list(all_counties, food_selection, food)
      }
      else if(toggle == 'food-switch'){
        $('#food-search').slideDown(200)
      }
    })

    // Search for food
    $('#food-search-box').on('keyup',function(e) {
      if (e.which == 13){
          food_selection = $(this).val()


          var all_counties = make_county_objects(food, food_selection)
          draw_map(us, all_counties, food)

          clear_top_list()
          top_list(all_counties, food_selection, food)
      }
    });

    

  } 
});
