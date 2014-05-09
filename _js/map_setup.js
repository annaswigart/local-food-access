$('#food-search').hide()
$('.radio').on('click', function(){
  if ($(this).attr('id') == 'direct-farm'){
    $('#food-search').slideUp(300)
  }
  else if($(this).attr('id') == 'food'){
    $('#food-search').slideDown(300)
  }
})

// County objects to render map

var make_county_objects = function(food, food_selection){
    var county_names = food['County']
    var state_names = food['State']

    var selected_counties = food[food_selection]

    county_objects = []

    $.each(selected_counties, function(key, value){
      county = {id: key, county: county_names[key], state: state_names[key], food: food_selection, food_quant: value}
      county_objects.push(county)
    })
    return county_objects
}

// Top List
var sortDesc = function(all_counties, key) {
    return all_counties.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

var getTop = function(all_counties, key){
  top_counties = sortDesc(all_counties, key).slice(0,10);
  return top_counties
}

// Get county object from id
var county_id = function(el_id){
  id = parseInt(el_id.split('-')[1])
  return id
}

var find_county_obj = function(all_counties, id) {
  wanted = {}
  $.each(all_counties, function(index, county) {
    if(county.id == id){
      wanted = county
    }
  });
  return wanted
}

// Get color rating
var colorRating = function(all_counties, id){
  county = find_county_obj(all_counties, id)
  rating = county.food_quant
  return rating
}

// Data selection

// $('.form-group').on('', '.form-control', function(){

// })



var get_county_description = function(){
  list = ['fips', 'state', 'county', 'dirsales_farms07', 'fmrkt13', 'fmrktpth13', 'foodhub12', 'csa07', 'agritrsm_ops07', 'agritrsm_rct07', 'farm_to_school', 'population_2010', 'rucc_2013', 'description']
  return list
}

var get_veggie_list = function(){
  list = ['Artichokes', 'Asparagus', 'Beans', 'Beets', 'Broccoli', 'Brussels Sprouts', 
                      'Cabbage', 'Carrots', 'Cauliflower', 'Celery', 'Chicory', 'Cucumbers', 'Daikon', 
                      'Eggplant', 'Escarole & Endive', 'Garlic', 'Ginseng', 'Greens', 'Herbs', 'Horseradish',
                      'Lettuce', 'Melons', 'Okra', 'Onions', 'Parsley', 'Peas', 'Peppers', 'Potatoes', 
                      'Pumpkins', 'Radishes', 'Rhubarb', 'Spinach', 'Squash', 'Sweet Corn', 'Sweet Potatoes', 
                      'Tomatoes', 'Turnips', 'Vegetables- Other', 'Watercress']
  return list
}

var get_fruit_list = function(){
  list = ['Apples', 'Apricots', 'Avocados', 'Bananas', 'Cherries', 'Chestnuts', 'Citrus- Other', 
                      'Dates', 'Figs', 'Grapefruit', 'Grapes', 'Guavas', 'Hazelnuts', 'Kiwifruit', 'Kumquats', 
                      'Lemons', 'Limes', 'Mangoes', 'Non-Citrus- Other', 'Olives', 'Oranges', 'Papayas', 
                      'Passion Fruit', 'Peaches', 'Pears', 'Pecans', 'Persimmons', 'Plum-Apricot Hybrids', 
                      'Plums', 'Pomegranates', 'Prunes', 'Tangelos', 'Tangerines', 'Temples']
  return list
}

var get_nut_list = function(){
  list = ['Almonds', 'Macadamias', 'Pistachios', 'Tree Nuts, Other', 'Walnuts'];
  return list
}

var get_totals_list = function(){
  list = ['Vegetable Totals', 'Citrus Totals', 'Non-Citrus Totals', 'Tree Nut Totals'];
  return list
}

var get_food_names = function(){
  names = get_veggie_list() + get_fruit_list() + get_nut_list() + get_totals_list()
  return names.split(',')
}
