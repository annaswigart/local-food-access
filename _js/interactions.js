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

// Get county object from id
var county_id = function(el_id){
	id = parseInt(el_id.split('-')[1])
	return id
}

var find_county_obj = function(data, id) {
  wanted_county = {}
  data.forEach(function(d) {
    if (id == d.id){
      wanted_county = d
    }
  });
  return wanted_county
}

// Create and move county names as nodes
var county_tag = function(county){
	var el = "<span id='county-" + county.id + "'class='tag'><span>" + county.County + ", " + county.State + "</span>" + "</span>"
	return el
}

var holdable_county = function(county){
	el = $(county_tag(county)).addClass('holdable').append(plus_icon())
	return el
}

var removeable_county = function(county) {
	el = $(county_tag(county)).addClass('removeable').append(remove_icon())
	return el
}

var hold_county = function(county){
	county_el = removeable_county(county)
	$('#held-counties').append(county_el)
}

var remove_county = function(county){
	return $('#held-counties #county-'+county.id).remove()
}

var change_top_county_status = function(county){
	el = $('#top-list #county-'+county.id)
	if (el.hasClass('holdable')){
		el.removeClass('holdable')
		el.addClass('held')
	}
	else if(el.hasClass('held')){
		el.removeClass('held')
		el.addClass('holdable')
	}
}

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


