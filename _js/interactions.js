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
var find_county_obj = function(data, id) {
  wanted_county = {}
  data.forEach(function(d) {
    if (id == d.id){
      wanted_county = d
    }
  });
  return wanted_county
}

var county_id = function(el_id){
	id = parseInt(el_id.split('-')[1])
	return id
}

var removeable_county = function(county) {
	var icon = remove_icon()
	var el = "<span class='removeable' id='county-" + county.id + "'>" + county.County + ", " + county.State + icon + "</span>"
	return el
}

var hold_county = function(county){
	county_el = removeable_county(county)
	return $('#held-counties').append(county_el)
}

var remove_county = function(county){
	return $('#held-counties #'+id).remove()
}



