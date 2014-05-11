// $(window).load(function() {
//   $(".loader").fadeOut("slow");
// })

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
        $(".draggable").draggable({ disabled: false, stack: '.draggable'});
      }
      else if(toggle == 'food-switch'){
        $('#food-search').slideDown(200)
      }
    })

    // Tooltip + mousevents

    // More info tooltips
    $('#switch-data').on('mouseover', '.more-info', function(){
      var tooltip = $(this).children('.tooltip')
      tooltip.fadeIn(100)
    })

    $('#switch-data').on('mouseout', '.more-info', function(){
      var tooltip = $(this).children('.tooltip')
      tooltip.fadeOut(100)
    })

    // County tag tooltips

    var top_tooltip = d3.select("#top-list").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

    $('#top-list').on('mouseover', '.tag', function(d){
      id = county_id($(this).attr('id'))
      county = find_county_obj(all_counties, id)

      d3.select(this)
        .transition().duration(200)
        .style("opacity", 1);

      top_tooltip.transition().duration(200)
      .style("opacity", 1);
      top_tooltip.text(county.county + " County, " + county.state + "                 " + county.food + ": " + county.food_quant)
      .style("background-color", "#2C3E50")
      .style("left", (d.pageX + -30) + "px")
      .style("top", (d.pageY + 20) + "px");
    })

    $('#top-list').on('mouseout', '.tag', function(d){
        top_tooltip.transition().duration(300)
        .style("opacity", 0);
    })

    // Dock tooltips
    var dock_tooltip = d3.select("#held-counties").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

    $('#county-drilldown').on('mouseover', '.tag', function(d){
      id = county_id($(this).attr('id'))
      county = find_county_obj(all_counties, id)

      d3.select(this)
        .transition().duration(200)
        .style("opacity", 1);

      dock_tooltip.transition().duration(200)
      .style("opacity", 1);
      dock_tooltip.text(county.county + " County, " + county.state + "                 " + county.food + ": " + county.food_quant)
      .style("background-color", "#2C3E50")
      .style("left", (d.pageX + -30) + "px")
      .style("top", (d.pageY + -60) + "px");
    })

    $('#county-drilldown').on('mouseout', '.tag', function(d){
        dock_tooltip.transition().duration(300)
        .style("opacity", 0);
    })


    // Make counties holdable
    $('#top-list').on('click', '.holdable', function(){
      el_id = $(this).attr('id')
      el = d3.select('#'+el_id)

      id = county_id(el_id)
      county = find_county_obj(all_counties, id)
      if(county_not_in_dock(county)){
        hold_county(county)

        // Indiate held
        held_status(county);
        $(".held").draggable({ disabled: true, stack: '.draggable' });

        // Change Map color
        map_html = '#map #county-'+county.id
        map_el = d3.select(map_html)
        map_el.classed({'holdable': false, 'held': true})
        map_el.style('fill', '#3498DB')

        // Make docked elements draggable
        $(".draggable").draggable({ disabled: false, stack: '.draggable'});
      }
    })

    $('#map-container').on('click', '.holdable', function(){
      el_id = $(this).attr('id')
      el = d3.select('#'+el_id)

      id = county_id(el_id)
      county = find_county_obj(all_counties, id)
      if(county_not_in_dock(county)){
        hold_county(county)

        // Indiate held
        held_status(county);
        $(".held").draggable({ disabled: true, stack: '.draggable' });

        // Change Map color
        map_html = '#map #county-'+county.id
        map_el = d3.select(map_html)
        map_el.classed({'holdable': false, 'held': true})
        map_el.style('fill', '#3498DB')

        // Make docked elements draggable
        $(".draggable").draggable({ disabled: false, stack: '.draggable'});
      }
    })
    // Make counties removeable
    $('#held-counties').on('click', '.removeable', function(){
      id = county_id($(this).attr('id'));
      county = find_county_obj(all_counties, id);
      
      // Remove county
      remove_county(county);
      $('#held-counties').find('.tooltip').remove()

      // clear chart box
      chart_area = $('.drag-here#county-'+county.id)
      input_form = chart_area.prev().children('input')
      input_form.val('')
      reset_search_box(input_form)
      clear_chart_area($(chart_area))
      reset_chart_area($(chart_area))

      // Indiate holdable and draggable again
      holdable_status(county);
      $(".holdable").draggable({ disabled: false, stack: '.draggable'});

      // Change map color and status
      map_html = '#map #county-'+county.id
      map_el = d3.select(map_html)
      map_el.classed({'held': false, 'holdable': true})
      map_el.style ( "fill" , function (d) {return colorRating (all_counties, county.food_quant);});

    })// end removeable

    // Search interactions

    $('#food-search').hide() // hide on load

    $('#food-search-box').on('keyup',function(e) {
      if (e.which == 13){
          food_selection = $(this).val()

          var all_counties = make_county_objects(food, food_selection)

          clear_top_list()
          top_list(all_counties, food_selection, food)

          draw_map(us, all_counties, food)
          $(".draggable").draggable({ disabled: false, stack: '.draggable'});
      }
    });
    $('.county-wrapper').on('keyup','input[type=search]',function(e) {
      if (e.which == 13){
        var chart_area = $(this).parent().next()

        // //remove search box place holder 
        input_form = $(this)

        // Change icon
        icon = input_form.next().children('i')
        icon.removeClass('fa-search').addClass('fa-times-circle')

        // Take out message in chart area
        chart_area.find('h4').fadeOut(100)

        // Put county name in search box
        new_placeholder = input_form.val()
        input_form.attr('placeholder', new_placeholder)

        wanted = {}
        all_counties.forEach(function(county){
          if(county.county + ', ' + county.state == new_placeholder){
            wanted = county
          }
          return wanted
        })
        // Find dragged county's foods
        dragged_foods = find_county_foods(food, wanted.id)
        dragged_food_names = get_food_names_list(wanted.id, dragged_foods)
        dragged_food_values = get_food_values_list(wanted.id, dragged_foods)

        // // Render chart based on id
        chart_area.attr('id', 'county-'+wanted.id)
        draw_chart(dragged_food_names, dragged_food_values, chart_area)

        // indicate held county
        docked = $(removeable_county(wanted).addClass('disabled').removeClass('draggable'))
        $('#held-counties').append(docked)
        $(".disabled").draggable({ disabled: true, stack: '.draggable' });
      }
    });

    // Food Autocomplete
    var foods = get_food_list()
    $( "#food-search-box" ).autocomplete({
        source: foods
      });

    // County Autocomplete
    var county_search = []
    all_counties.forEach(function(county){
      county_search.push(county.county + ", " + county.state)
    }); 
    $( "#left-search-box" ).autocomplete({
        source: county_search
    });

    $( "#right-search-box" ).autocomplete({
        source: county_search
    });
    // Search Interactions
    $('input[type=search]').on('focusin', function(){
      $(this).attr('placeholder', '')
      $(this).attr('value', '')
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

    $('.input-icon i').on('click', function(){
      $(this).removeClass('fa-times-circle').addClass('fa-search')
      chart_area = $(this).parent().parent().next()
      
      input_form = $(this).parent().prev()
      input_form.val('')
      reset_search_box(input_form)

      icon = $(this)
      icon.removeClass('fa-times-circle').addClass('fa-search')
      
      // Clear chart area and reset area
      clear_chart_area($(chart_area))
      reset_chart_area($(chart_area))

      var tag_id = $(this).parent().parent().next().attr('id')
      console.log(tag_id)
      // Indicate disabled for dock
      $('#held-counties #'+tag_id).removeClass('disabled').addClass('draggable')
      
      // Indicate holdable and draggable in top list
      $('#top-list #'+tag_id).removeClass('disabled').removeClass('held').addClass('draggable').addClass('holdable')
      $(".draggable").draggable({ disabled: false, stack: '.draggable'});

    })

  } 
});
