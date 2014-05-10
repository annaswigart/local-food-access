// ########### GENERAL CODE ###########

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


// ########### Top 10 List ###########

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


var clear_top_list = function(){
  $('#top-list span').remove()
}

// Renders top list and contains interactions

var top_list = function(all_counties, food_selection, food){
   // Append top counties to DOM - interactions.js
    var top_counties = getTop(all_counties, 'food_quant')
    
    top_counties.forEach(function(county) {
      $('#top-list').append(holdable_county(county));
    });

    $('#top-list').on('click', '.holdable', function(){
      id = county_id($(this).attr('id'))
      county = find_county_obj(all_counties, id)
      hold_county(county)

      // Make docked elements draggable
      make_drag('removeable')

      // Top list
      change_top_county_to_held(county);
      change_icon(county);
    
      // Map
      change_map_county_status(county);
      change_map_county_color(county).style('fill', '#3498DB')
    })

    // $('#top-list').on('mousedown', '.held', function(){
      // $(".held").draggable({ disabled: true });
    // });

    // Remove County names from Dock
    $('#county-holder').on('click', '.removeable', function(event){
      id = county_id($(this).attr('id'));
      county = find_county_obj(all_counties, id);
      remove_county(county);

      // Change list
      change_top_county_to_holdable(county);
      change_icon(county);

      // Change map
      change_map_county_status(county);
      change_map_county_color(county)
        .style ( "fill" , function (d) {return color (county.food_quant);});
    }); 
}

// ########### FOOD DATA ###########

var get_food_search_obj = function(){ 
  obj = [
      { label :'Artichokes', category: 'Vegetables' }, { label : 'Asparagus', category: 'Vegetables' }, 
      { label : 'Beans', category: 'Vegetables' }, { label : 'Beets', category: 'Vegetables' }, 
      { label : 'Broccoli', category: 'Vegetables' }, { label : 'Brussels Sprouts', category: 'Vegetables' }, 
      { label : 'Cabbage', category: 'Vegetables' }, { label : 'Carrots', category: 'Vegetables' }, 
      { label : 'Cauliflower', category: 'Vegetables' }, { label : 'Celery', category: 'Vegetables' }, 
      { label : 'Chicory', category: 'Vegetables' }, { label : 'Cucumbers', category: 'Vegetables' }, 
      { label : 'Daikon', category: 'Vegetables' }, { label : 'Eggplant', category: 'Vegetables' }, 
      { label : 'Escarole & Endive', category: 'Vegetables' }, { label : 'Garlic', category: 'Vegetables' }, 
      { label : 'Ginseng', category: 'Vegetables' }, { label : 'Greens', category: 'Vegetables' }, 
      { label : 'Herbs', category: 'Vegetables' }, { label : 'Horseradish', category: 'Vegetables' }, 
      { label : 'Lettuce', category: 'Vegetables' }, { label : 'Melons', category: 'Vegetables' }, 
      { label : 'Okra', category: 'Vegetables' }, { label : 'Onions', category: 'Vegetables' }, 
      { label : 'Parsley', category: 'Vegetables' }, { label : 'Peas', category: 'Vegetables' }, 
      { label : 'Peppers', category: 'Vegetables' }, { label : 'Potatoes', category: 'Vegetables' }, 
      { label : 'Pumpkins', category: 'Vegetables' }, { label : 'Radishes', category: 'Vegetables' }, 
      { label : 'Rhubarb', category: 'Vegetables' }, { label : 'Spinach', category: 'Vegetables' }, 
      { label : 'Squash', category: 'Vegetables' }, { label : 'Sweet Corn', category: 'Vegetables' }, 
      { label : 'Sweet Potatoes', category: 'Vegetables' }, { label : 'Tomatoes', category: 'Vegetables' }, 
      { label : 'Turnips', category: 'Vegetables' }, { label : 'Vegetables- Other', category: 'Vegetables' }, 
      { label : 'Watercress', category: 'Vegetables' }, { label :'Apples', category: 'Fruit'}, 
      { label : 'Apricots', category: 'Fruit' }, { label : 'Avocados', category: 'Fruit' }, 
      { label : 'Bananas', category: 'Fruit' }, { label : 'Cherries', category: 'Fruit' }, 
      { label : 'Chestnuts', category: 'Fruit' }, { label : 'Citrus- Other', category: 'Fruit' }, 
      { label : 'Dates', category: 'Fruit' }, { label : 'Figs', category: 'Fruit' }, 
      { label : 'Grapefruit', category: 'Fruit' }, { label : 'Grapes', category: 'Fruit' }, 
      { label : 'Guavas', category: 'Fruit' }, { label : 'Hazelnuts', category: 'Fruit' }, 
      { label : 'Kiwifruit', category: 'Fruit' }, { label : 'Kumquats', category: 'Fruit' }, 
      { label : 'Lemons', category: 'Fruit' }, { label : 'Limes', category: 'Fruit' }, 
      { label : 'Mangoes', category: 'Fruit' }, { label : 'Non-Citrus- Other', category: 'Fruit' }, 
      { label : 'Olives', category: 'Fruit' }, { label : 'Oranges', category: 'Fruit' }, 
      { label : 'Papayas', category: 'Fruit' }, { label : 'Passion Fruit', category: 'Fruit' }, 
      { label : 'Peaches', category: 'Fruit' }, { label : 'Pears', category: 'Fruit' }, 
      { label : 'Pecans', category: 'Fruit' }, { label : 'Persimmons', category: 'Fruit' }, 
      { label : 'Plum-Apricot Hybrids', category: 'Fruit' }, { label : 'Plums', category: 'Fruit' }, 
      { label : 'Pomegranates', category: 'Fruit' }, { label : 'Prunes', category: 'Fruit' }, 
      { label : 'Tangelos', category: 'Fruit' }, { label : 'Tangerines', category: 'Fruit' }, 
      { label : 'Temples', category: 'Fruit' }, { label :'Blackberries', category: 'Berries' }, 
      { label : 'Blueberries', category: 'Berries' }, { label : 'Boysenberries', category: 'Berries' }, 
      { label : 'Cranberries', category: 'Berries' }, { label : 'Currants', category: 'Berries' }, 
      { label : 'Loganberries', category: 'Berries' }, { label : 'Raspberries', category: 'Berries' }, 
      { label : 'Strawberries', category: 'Berries' }, { label :'Almonds', category: 'Tree Nuts' }, 
      { label : 'Macadamias', category: 'Tree Nuts' }, { label : 'Pistachios', category: 'Tree Nuts' }, 
      { label : 'Tree Nuts- Other', category: 'Tree Nuts' }, { label : 'Walnuts', category: 'Tree Nuts' }];
    return obj;
}

var make_county_objects = function(food, food_selection){
    var master_counties = food['County']
    var master_states = food['State']

    var selected_counties = food[food_selection]

    county_objects = []

    $.each(selected_counties, function(key, value){
      county = {id: key, county: master_counties[key], state: master_states[key], food: food_selection, food_quant: value}
      county_objects.push(county)
    })

    return county_objects
}