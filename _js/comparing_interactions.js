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
	$($(this).next()).fadeOut(100)
})

$('input[type=search]').on('focusout', function(){
	$(this).next().fadeIn(100)
})

$('#food-search').hide()

$('#county-drilldown input[type=search]').focus(function(){
	$(this).removeAttr('placeholder')
});


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
	var el = "<span id='county-" + county.id + "'class='tag move-county'><span>" + county.county + ", " + county.state + "</span>" + "</span>"
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
	county_el = removeable_county(county)
	$('#held-counties').append(county_el)
}

var remove_county = function(county){
	$('#held-counties #county-'+county.id).remove()
}

var change_top_county_to_held = function(county){
	el_id = "#county-"+county.id
	el = $('#top-list '+el_id)
	if (el.hasClass('holdable')){
		el.removeClass('holdable', fade)
		el.addClass('held', fade)

	}
	else if(el.hasClass('held')){
		$('.held').removeClass('ui-draggable')
		make_drag(class_name)
	}
}

var change_top_county_to_holdable = function(county){
	el_id = "#county-"+county.id
	el = $('#top-list '+el_id)
	if (el.hasClass('held')){
		el.removeClass('held', fade)
		el.addClass('holdable', fade)

	}
}

// Signal holding and removing county

var change_map_county_status = function(county){
	el = $('#map #county-'+county.id)
	if (el.attr('class') == 'holdable') {
		el.attr('class', 'held')
	}
	else if (el.attr('class') == 'held') {
		make_drag('held')
		el.attr('class', 'holdable')
	}
	$(".held").draggable({ disabled: true });
}

var change_map_county_color = function(county){
      el_html = '#map #county-'+county.id
      el = $(el_html)
      return d3.select(el_html)
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

// Drag and Drop

var make_drag = function(class_name){
	$('.'+class_name).draggable({ 
	  revert: 'invalid',
	  helper:"clone",
	  drag: function(event, ui){ 
	  }
	});
}
// var make_drop = function(food)
// 	$(".county-wrapper").droppable({
// 	  drop: function( event, ui ) {
// 	    var dragged = ui.draggable.detach()
// 	    var drop_zone = $(this)

// 	    dragged.appendTo(drop_zone)
// 	    dragged_id = drop_zone.find( "span" ).attr('id')
// 	    id = county_id(dragged_id);
	    
// 	    //remove search box place holder 
// 	    input_form = drop_zone.find('input')
// 	    new_placeholder = dragged.text()
// 	    input_form.attr('placeholder', new_placeholder)

// 	    // Fill in county name, state
// 	    drop_zone.find('h4').fadeOut(200)
// 	    dragged.remove()

// 	    // Find dragged county's foods
// 	    dragged_foods = find_county_foods(food, id)
// 	    dragged_food_names = get_food_names_list(id, dragged_foods)
// 	    dragged_food_values = get_food_values_list(id, dragged_foods)
	    
// 	    // Render chart based on id
// 	    render_zone = drop_zone.find('.drag-here')
// 	    draw_chart(dragged_food_names, dragged_food_values, render_zone)
	    
// 	  }
// 	})
// }
