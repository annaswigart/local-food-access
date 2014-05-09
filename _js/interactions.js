// Tooltip

$('#switch-data').on('mouseover', '.more-info', function(){
	var tooltip = $(this).children('.tooltip')
	tooltip.fadeIn(100)
})

$('#switch-data').on('mouseout', '.more-info', function(){
	var tooltip = $(this).children('.tooltip')
	tooltip.fadeOut(100)
})

// Data toggle
$('#food-search').hide()
$('.radio').on('click', function(){
  if ($(this).attr('id') == 'direct-farm'){
    $('#food-search').slideUp(300)
  }
  else if($(this).attr('id') == 'food-switch'){
    $('#food-search').slideDown(300)
  }
})

// Search
$('input[type=search]').on('focusin', function(){
	$($(this).next()).fadeOut(100)
})

$('input[type=search]').on('focusout', function(){
	$(this).next().fadeIn(100)
})


// Autocomplete
$(function(){
	var foods = (get_veggie_list() + get_fruit_list() + get_nut_list() + get_totals_list()).split(',');
	$( "#food-search-box" ).autocomplete({
      source: foods
    });
})


// $.widget( "custom.catcomplete", $.ui.autocomplete, {
//     _renderMenu: function( ul, items ) {
//       var self = this,
//         currentCategory = "";
//       $.each( items, function( index, item ) {
//         if ( item.category != currentCategory ) {
//           ul.append( "<li>" + item.category + "</li>" );
//           currentCategory = item.category;
//         }
//         self._renderItem( ul, item );
//       });
//     }
// });

// $(function() {
//   $( "#search" ).catcomplete({
//     delay: 0,
//     source: get_food_search_obj(),
//     minLength: 1,

//     select: function(event, ui) {
//       // $("#search").val(ui.item.label);
//       // console.log($(event.target).val())
//     }
//   });
// }); 

// background-color: #3498DB;
//Zoom
function zoomed() {
	svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	svg.select(".state-border").style("stroke-width", 1.5 / d3.event.scale + "px");
	svg.select(".county-border").style("stroke-width", .5 / d3.event.scale + "px");
}

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

// Add county from top list

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
