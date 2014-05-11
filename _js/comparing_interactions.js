// Tooltip

$('#switch-data').on('mouseover', '.more-info', function(){
	var tooltip = $(this).children('.tooltip')
	tooltip.fadeIn(100)
})

$('#switch-data').on('mouseout', '.more-info', function(){
	var tooltip = $(this).children('.tooltip')
	tooltip.fadeOut(100)
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
	    var origin = dragged.parent().attr('id')
	    var next = dragged.next()

	    var id = county_id(dragged.attr('id'))
	    var county = find_county_obj(all_counties, id)

	    var drop_zone = $(this)

	    var top_copy = $($(county_tag(county)).addClass('held').addClass('disabled').append(check_icon()))	
	    var dock_copy = $($(county_tag(county)).addClass('removeable').addClass('disabled').append(remove_icon()))	
	    if(origin == 'top-list'){
	    	next.before(top_copy) // keep in top list
	    	$('#held-counties').append(dock_copy) // put copy in dock
	    }
	    else if(origin == 'held-counties'){
	    	$('#top-list #county-'+county.id).addClass('disabled')
	    	next.before(dock_copy) // put copy in dock
	    }

	    dragged.appendTo(drop_zone)
	    dragged.remove()

	    //remove search box place holder 
	    input_form = drop_zone.find('input')
	    
	    new_placeholder = dragged.text()
	    input_form.attr('placeholder', new_placeholder)

	    // Fill in county name, state
	    drop_zone.find('h4').fadeOut(100)

	    // Find dragged county's foods
	    dragged_foods = find_county_foods(food, id)
	    dragged_food_names = get_food_names_list(id, dragged_foods)
	    dragged_food_values = get_food_values_list(id, dragged_foods)
	    
	    // Render chart based on id
	    render_zone = drop_zone.find('.drag-here')
	    render_zone.attr('id', 'county-'+id)
	    draw_chart(dragged_food_names, dragged_food_values, render_zone)

	  }
	})
}

// Search

var clear_search_box = function(id){
	el = $('.drag-here#county-'+id)
	el.removeAttr('id')
	el.children().remove()
	el.prev().children('input').attr('placeholder', 'Search by county')
	el.append($('<h4>Or drag county from the left</h4>'))
}

// Autocomplete
$(function(){
	var foods = get_food_list()
	$( "#food-search-box" ).autocomplete({
      source: foods
    });
})
















