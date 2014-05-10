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
	var icon = "<i class='fa fa-check-circle move-county'></i>"
	return icon
}

var plus_icon = function(){
	var icon = "<i class='fa fa-plus-circle hold-county move-county'></i>"
	return icon
}

var remove_icon = function(){
	var icon = "<i class='fa fa-times-circle remove-county move-county'></i>"
	return icon
}

// Create and move county names as nodes
var county_tag = function(county){
	var el = "<span id='county-" + county.id + "'class='tag'><span>" + county.county + ", " + county.state + "</span>" + "</span>"
	return el
}

var holdable_county = function(county){
	el = $(county_tag(county)).addClass('holdable').append(plus_icon())
	return el
}

var removeable_county = function(county) {
	el = $($(county_tag(county)).addClass('removeable').addClass('draggable').addClass('ui-widget-content draggable').append(remove_icon()))
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

var change_top_county_status = function(county){
	el = $('#top-list #county-'+county.id)
	if (el.hasClass('holdable')){
		el.removeClass('holdable', fade)
		el.addClass('held', fade)
	}
	else if(el.hasClass('held')){
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
		el.attr('class', 'holdable')
	}
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

// Drag and Drop

var on_drag = function(food){
	$(".draggable").draggable({ 
	  revert: 'invalid',
	  // helper:"clone",
	  drag: function(event, ui){
	    
	  }
	});
	$(".county-wrapper").droppable({
	  drop: function( event, ui ) {
	    var dragged = ui.draggable.detach()
	    
	    var drop_zone = $(this)

	    dragged.appendTo(drop_zone)
	    dragged_id = drop_zone.find( "span" ).attr('id')

	    id = county_id(dragged_id);
	    console.log(id)


	    //remove search box place holder 
	    input_form = $(this).parent().children('.form-group').children()
	    new_placeholder = dragged.text()
	    input_form.attr('placeholder', new_placeholder)

	    // Fill in county name, state

	    $(this).find('h4').fadeOut(200)
	    dragged.fadeOut(200)

	    // Render chart here.
	    create_bar_chart(food, id)
	    // please(id)
	    
	  }
	})
}
