$(document).ready(function() {

  //Reading map file and data

  queue()
  .defer(d3.json, "_json/us.json")
  .defer(d3.json, "_data/master_data.json")
  .await(ready);

  function ready(error, us, food_data) {
   food = food_data
    // ##### Initial View #####

    // *** map_setup.js ****
    food_selection = 'DIRSALES_FARMS07'
    var all_counties = make_county_objects(food, food_selection)

    // *** map.js ****
    draw_map(us, all_counties, food)
    top_list(all_counties, food_selection, food)

    // ##### CORE OF THE PAGE #####

    // make county tags draggable from the start   
    drag_and_drop(all_counties, food)

    // Make counties removeable
    // make_removeable(all_counties, food)

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
    $('#food-search').hide() // hide on load

    $('#food-search-box').on('keyup',function(e) {
      if (e.which == 13){
          food_selection = $(this).val()

          var all_counties = make_county_objects(food, food_selection)
          draw_map(us, all_counties, food)

          clear_top_list()
          top_list(all_counties, food_selection, food)
      }
    });

    // Make counties holdable
    $('.holdable').on('click', function(){
      el = d3.select(this)
      
      el_id = county_id($(this).attr('id'))
      county = find_county_obj(all_counties, id)
      
      if(county_not_in_dock(county)){
        
        hold_county(county)
        
        // Make docked elements draggable
        drag_and_drop(all_counties, food)

        // Indiate held
        held_status(county);
      }
    })
    // Make counties removeable
    $('#held-counties').on('click', '.removeable', function(){
      id = county_id($(this).attr('id'));
      county = find_county_obj(all_counties, id);
      
      remove_county(county);

      // Indiate holdable again
      holdable_status(county);
      drag_and_drop(all_counties, food)

      // clear chart box
      clear_search_box(id)

    })// end removeable

    // Search interactions
    $('input[type=search]').on('focusin', function(){
      $(this).attr('placeholder', '')
      $($(this).next()).fadeOut(100)
    }) // end focusin

    $('input[type=search]').on('focusout', function(){
      input_form = $(this)
      current_placeholder = input_form.attr('placeholder')
      if(input_form.attr('name') == 'county-search'){
        
        drag_here = input_form.parent().next()
        if(drag_here.has('.highcharts-container').length > 0){
          id = county_id(drag_here.attr('id'))
          county = find_county_obj(all_counties, id)
          new_placeholder = county.county + ', ' + county.state
          input_form.attr('placeholder', new_placeholder)

          console.log(input_form)
        }
        else{
          input_form.attr('placeholder', 'Search by county')
        }
      }
      else{
        input_form.attr('placeholder', 'Search by food')
      }
      input_form.next().fadeIn(100)
    }) // end focusout

  } 
});
