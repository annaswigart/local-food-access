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
var removeable_county = function(county) {
	var icon = remove_icon()
	var el = "<span class='removeable' id='county-" + county.id + "'>" + county.County + ", " + county.State + icon + "</span>"
	return el
}

var dock_has = function(county){
	id = '#county-'+county.id
	held_counties = $('#held-counties .removeable')
	return held_counties
	// held_counties.each(function(index, item){
	// 	console.log($(item).attr('id'))
	// })
}

var hold_county = function(county){
	county_el = removeable_county(county)
	$('#held-counties').append(county_el)
}

var remove_county = function(county){
	console.log(county)
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

var change_icon = function(county){
	el = $('#top-list #county-'+county.id)
	icon = el.children().children()
	console.log(icon)
	if (icon.hasClass('fa-plus-circle')){
		el.children().remove()
		el.append(check_icon())
	}
	else if(icon.hasClass('fa-check-circle')){
		el.children().remove()
		el.append(plus_icon())
	}
}


