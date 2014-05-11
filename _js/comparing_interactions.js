// Tooltip

$('#switch-data').on('mouseover', '.more-info', function(){
	var tooltip = $(this).children('.tooltip')
	tooltip.fadeIn(100)
})

$('#switch-data').on('mouseout', '.more-info', function(){
	var tooltip = $(this).children('.tooltip')
	tooltip.fadeOut(100)
})

// Search
$('input[type=search]').on('focusin', function(){
	$(this).attr('placeholder', '')
	$($(this).next()).fadeOut(100)
})

$('input[type=search]').on('focusout', function(){
	if($(this).attr('name') == 'county-search'){
		$(this).attr('placeholder', 'Search by county')
	}
	else{
		$(this).attr('placeholder', 'Search by food')
	}
	$(this).next().fadeIn(100)
})

$('#food-search').hide()

// Autocomplete
$(function(){
	var foods = get_food_list()
	$( "#food-search-box" ).autocomplete({
      source: foods
    });
})

// ########### ADD AND REMOVE COUNTIES TO COMPARE ###########

// Create icons in top list
var check_icon = function(){
	var icon = "<i class='fa fa-check-circle'></i>"
	return icon
}

var plus_icon = function(){
	var icon = "<i class='fa fa-plus-circle'></i>"
	return icon
}

var remove_icon = function(){
	var icon = "<i class='fa fa-times-circle'></i>"
	return icon
}

var change_icon = function(county){
	el = $('#top-list #county-'+county.id)
	icon = el.children('i')

	if (icon.hasClass('fa-plus-circle')){
		icon.remove()
		el.append(check_icon())
	}
	else if(icon.hasClass('fa-check-circle')){
		icon.remove()
		el.append(plus_icon())
	}
}

// Create and move county names as nodes
var county_tag = function(county){
	var el = "<span id='county-" + county.id + "'class='tag county move-county draggable'><span>" + county.county + ", " + county.state + "</span>" + "</span>"
	return el
}

var holdable_county = function(county){
	el = $(county_tag(county)).addClass('holdable').append(plus_icon())
	return el
}

var removeable_county = function(county) {
	el = $($(county_tag(county)).addClass('removeable').append(remove_icon()))
	return el
}

// Actions of holding and removing a county

var fade = 300

var hold_county = function(county){
	held_counties = $('#held-counties').children()
	county_el = removeable_county(county)
	$('#held-counties').append(county_el)
}

var remove_county = function(county){
	$('#held-counties #county-'+county.id).remove()
}

// Signal holding and removing county

var held_status = function(county){
	top_el = $('#top-list #county-'+county.id)
	top_el.removeClass('holdable').removeClass('draggable').addClass('held').addClass('un-draggable')
	change_icon(county)

	map_html = '#map #county-'+county.id
	map_el = d3.select(map_html)
	map_el.classed({'holdable': false, 'held': true})
	map_el.style('fill', '#3498DB')

	$(".un-draggable").draggable({ disabled: true });
}

var holdable_status = function(county){
	top_el = $('#top-list #county-'+county.id)
	top_el.removeClass('held').removeClass('un-draggable').removeClass('disabled').addClass('holdable')
	change_icon(county)

	map_html = '#map #county-'+county.id
	map_el = d3.select(map_html)
	map_el.classed({'held': false, 'holdable': true})
	map_el.style ( "fill" , function (d) {return color (county.food_quant);});
	$(".holdable").draggable({ disabled: false });

}

var county_in_top = function(county){
	top_list_id = 'county-'+county.id
	var check = false
	$('#top-list .holdable').each(function(index, item){
		if ($(item).attr('id') == top_list_id){
			check = true
		}
	})
	return check
}

var county_not_in_dock = function(county){
	top_list_id = 'county-'+county.id
	var check = true
	$('#held-counties span').each(function(index, item){
		if ($(item).attr('id') == top_list_id){
			check = false
		}
	})
	return check
}

var katey = function(){

}

// Drag and Drop

var drag_and_drop = function(all_counties, food){
	// $(".holdable").draggable({ disabled: false });
	$('.draggable').draggable({ 
	  revert: 'invalid',
	  opacity: 0.7,
	  helper:"clone",
	  drag: function(event, ui){ 
	  }
	});
	$(".county-wrapper").droppable({
	  drop: function( event, ui ) {
	    var dragged = ui.draggable
	    var next = dragged.next()

	    var id = county_id(dragged.attr('id'))
	    var county = find_county_obj(all_counties, id)

	    console.log(county)
	    var drop_zone = $(this)

	    copy = ''
	    if(dragged.hasClass('holdable')){
	    	var copy = $($(county_tag(county)).addClass('held').addClass('disabled').append(check_icon()))	
	    	next.before(copy)
	    }
	    else if (dragged.hasClass('removeable')){
	    	var copy = $($(county_tag(county)).addClass('removeable').addClass('disabled').addClass('un-draggable').append(remove_icon()))
	    	var top_copy = $('#top-list #county-'+county.id).addClass('disabled')
	    	next.before(copy)
	    	$("un-draggable").draggable({ disabled: true });
	    }

	    dragged.appendTo(drop_zone)
	    dragged.remove()

	    //remove search box place holder 
	    input_form = drop_zone.find('input')
	    
	    new_placeholder = dragged.text()
	    input_form.attr('placeholder', new_placeholder)

	    // Fill in county name, state
	    drop_zone.find('h4').fadeOut(200)

	    // Find dragged county's foods
	    dragged_foods = find_county_foods(food, id)
	    dragged_food_names = get_food_names_list(id, dragged_foods)
	    dragged_food_values = get_food_values_list(id, dragged_foods)
	    
	    // Render chart based on id
	    render_zone = drop_zone.find('.drag-here')
	    draw_chart(dragged_food_names, dragged_food_values, render_zone)
	  }
	})
}


// Renders top list and contains interactions

// var top_list = function(all_counties, food_selection, food){
//    // Append top counties to DOM - interactions.js
//     var top_counties = getTop(all_counties, 'food_quant')
    
//     top_counties.forEach(function(county) {
//       $('#top-list').append(holdable_county(county));
//     });

//     $('#top-list').on('click', '.holdable', function(){
//       id = county_id($(this).attr('id'))
//       county = find_county_obj(all_counties, id)
//       hold_county(county)

//       // Make docked elements draggable
//       drag_and_drop('removeable', food)

//       // Top list
//       change_top_county_to_held(county);
//       change_icon(county);
    
//       // Map
//       change_map_county_to_held(county);
//       change_map_county_color(county).style('fill', '#3498DB')
//     })

//     // Remove County names from Dock
//     $('#county-holder').on('click', '.removeable', function(event){
//       id = county_id($(this).attr('id'));
//       county = find_county_obj(all_counties, id);
//       remove_county(county);

//       // Change list
//       change_top_county_to_holdable(county);
//       change_icon(county);

//       // Change map
//       change_map_county_to_held(county);
//       change_map_county_color(county)
//         .style ( "fill" , function (d) {return color (county.food_quant);});
//     }); 
// }
