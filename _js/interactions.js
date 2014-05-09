// Create icons in top list
var check_icon = function(){
	var icon = "<span><i class='fa fa-check-circle move-county'></i></span>"
	return icon
}

var plus_icon = function(){
	var icon = "<span><i class='fa fa-plus-circle move-county'></i></span>"
	return icon
}

var remove_icon = function(){
	var icon = "<span><i class='fa fa-times-circle move-county'></i></span>"
	return icon
}

// Add county from top list

// Create and move county names as nodes
var removeable_county = function(county) {
	var icon = remove_icon()
	var el = "<span class='removeable' id='county-" + county.id + "'>" + county.county + ", " + county.state + icon + "</span>"
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
	if (el.attr('class')=='holdable'){
		el.attr('class', 'held')
	}
	else if(el.attr('class') == 'held'){
		el.attr('class', 'holdable')
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
	icon = el.children().children()
	if (icon.hasClass('fa-plus-circle')){
		el.children().remove()
		el.append(check_icon())
	}
	else if(icon.hasClass('fa-check-circle')){
		el.children().remove()
		el.append(plus_icon())
	}
}


