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
	if (county.rank > 10){
		console.log(county.rank)
		var el = "<span id='county-" + county.id + "'class='tag county move-county draggable'><span>" + county.county + ", " + county.state + "</span>" + "</span>"	
	}
	else if (county.rank <= 10){
		var el = "<span id='county-" + county.id + "'class='tag top county move-county draggable'><span>" + county.rank + ') ' + county.county + ", " + county.state + "</span>" + "</span>"	
	}
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
	held_counties = $('#held-counties')
	county_el = removeable_county(county)
	$('#held-counties').append(county_el)
}

var remove_county = function(county){
	$('#held-counties #county-'+county.id).remove()
}

// Signal holding and removing county

var held_status = function(county){
	top_el = $('#top-list #county-'+county.id)
	top_el.removeClass('holdable').removeClass('draggable').addClass('held')
	change_icon(county)
}

var holdable_status = function(county){
	top_el = $('#top-list #county-'+county.id)
	top_el.removeClass('held').removeClass('disabled').addClass('holdable').addClass('draggable')
	change_icon(county)
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
	$('.draggable').draggable({ 
	  revert: 'invalid',
	  stack: '.draggable',
	  opacity: 0.7,
	  helper:"clone",
	  start: function(event, ui){ 
	  	$('.drag-here').addClass('drop-zone', 100)
	  },
	  stop: function(event, ui){
	  	$('.drag-here').removeClass('drop-zone', 100)
	  }
	});
	$(".county-wrapper").droppable({
		over: function(event, ui){
			$('.drag-here').addClass('over-drop', 100)
		},
	  drop: function( event, ui ) {
	    var dragged = ui.draggable
	    var origin = dragged.parent().attr('id')
	    var next = dragged.next()

	    var id = county_id(dragged.attr('id'))
	    var county = find_county_obj(all_counties, id)

	    var drop_zone = $(this)

	    var top_copy = $($(county_tag(county)).addClass('held').addClass('disabled').removeClass('draggable').append(check_icon()))	
	    var dock_copy = $($(county_tag(county)).addClass('removeable').addClass('disabled').append(remove_icon()))	
	    if(origin == 'top-list'){
	    	// Add copy to the top
	    	next.before(top_copy)

	    	// Add copy to the dock
	    	$('#held-counties').append(dock_copy)

	    	// Make it undraggable
	    	$(".disabled").draggable({ disabled: true, stack: '.draggable' });

	    }
	    else if(origin == 'held-counties'){
	    	// Change status of top list
	    	$('#top-list #county-'+county.id).addClass('disabled')

	    	// Make undraggable
	    	$(".disabled").draggable({ disabled: true, stack: '.draggable' });

	    	// Put copy in dock
	    	if($('#held-counties').children('span').length == 1){
	    		console.log($('#held-counties').children().length)
	    		$('#held-counties').append(dock_copy)
	    	}
	    	else{
	    		console.log($('#held-counties').children().length)
	    		next.before(dock_copy) 
	    	}
	    }

    	chart_area = drop_zone.children().children('.drag-here')
    	if(chart_area.has('.highcharts-container').length > 0){
    		already_there_id = chart_area.attr('id')

    		// Change status of top list
    		$('#top-list #'+already_there_id).removeClass('disabled')

    		$('#held-counties #'+already_there_id).removeClass('disabled').addClass('draggable')
    		$(".draggable").draggable({ disabled: false, stack: '.draggable' });

    	}

	    dragged.appendTo(drop_zone)
	    dragged.remove()

	    //remove search box place holder 
	    input_form = drop_zone.find('input')
	    icon = input_form.next().children('i')

	    icon.removeClass('fa-search').addClass('fa-times-circle')

	    new_placeholder = dragged.text()
	    input_form.val(new_placeholder)
	    // input_form.attr('placeholder', new_placeholder)

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

	    $('.drag-here').removeClass('over-drop', 100)
	    $('.drag-here').removeClass('drop-zone', 100)
	  }
	})
}

// Search

var clear_search_box = function(el){
	el.removeAttr('id')
	el.removeAttr('placeholder')
}

var reset_search_box = function(el){
	el.attr('placeholder', 'Search by county')
}

var clear_chart_area = function(el){
	el.children().remove()
}
var reset_chart_area = function(el){
	el.append($('<h4>Drag county here for more info.</h4>'))
}

var clear_chart_area = function(el){
	el.children().remove()
}
var reset_chart_area = function(el){
	el.append($('<h4>Drag county here for more info.</h4>'))
}
















