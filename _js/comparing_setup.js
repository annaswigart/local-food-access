// ######### FIND FOOD DATA BASED ON ID


// Set up methods that rearrange the data
var get_food_list = function(){
  var food_list = ['Artichokes', 'Asparagus', 'Beans', 'Beets', 'Broccoli', 'Brussels Sprouts', 'Cabbage', 'Carrots', 'Cauliflower', 'Celery', 'Chicory', 'Cucumbers', 'Daikon', 'Eggplant', 'Escarole & Endive', 'Garlic', 'Ginseng', 'Greens', 'Herbs', 'Horseradish','Lettuce', 'Melons', 'Okra', 'Onions', 'Parsley', 'Peas', 'Peppers', 'Potatoes', 'Pumpkins', 'Radishes', 'Rhubarb', 'Spinach', 'Squash', 'Sweet Corn', 'Sweet Potatoes', 'Tomatoes', 'Turnips', 'Watercress', 'Apples', 'Apricots', 'Avocados', 'Bananas', 'Cherries', 'Chestnuts', 'Dates', 'Figs', 'Grapefruit', 'Grapes', 'Guavas', 'Hazelnuts', 'Kiwifruit', 'Kumquats', 'Lemons', 'Limes', 'Mangoes', 'Olives', 'Oranges', 'Papayas', 'Passion Fruit', 'Peaches', 'Pears', 'Pecans', 'Persimmons', 'Plum-Apricot Hybrids', 'Plums', 'Pomegranates', 'Prunes', 'Tangelos', 'Tangerines', 'Temples', 'Almonds', 'Macadamias', 'Pistachios', 'Walnuts']
  return food_list
}

var get_food_by_county = function(fips, food, food_list){
    foods_by_county = []
    
    for( var i=0; i < food_list.length; i++){
      var value = food[food_list[i]][fips];

      if(value > 0){ // All non-zero foods
        foods_by_county.push({'item': food_list[i], 'value' : value});
      }

    }
  return foods_by_county
}

var sort_foods = function(foods_by_county) {
  var sorted = _.chain(foods_by_county)
    .sortBy(function(foods_by_county){return -1 * foods_by_county.value;})
    .value();  
  return sorted;
}

// Methods that use the setup methods. Retrieve data to be used by chart.
var get_food_names_list = function(fips, sorted_foods) {
  names = []
  food_array = sorted_foods;
  for (var i=0; i < food_array.length; i++){
    names.push(food_array[i].item)
  }
  return names;
}

var get_food_values_list = function(fips, sorted_foods) {
  values = []
  food_array = sorted_foods;
  for (var i=0; i < food_array.length; i++){
    values.push(food_array[i].value)
  }
  return values;
}

// Methods used by the page: on_drag() - comparing_interactions.js
var find_county_foods = function(food, id){
  var food_list = get_food_list()
  var food_by_county = get_food_by_county(id, food, food_list)
  var sorted_foods = sort_foods(food_by_county) 
  return sorted_foods
}


var draw_chart = function(food_names, food_values, where){
  where.highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Top Foods'
    },
     xAxis: {
      categories: food_names,
    },
    yAxis: {
      min: 0,
      title: {
          text: 'Number of Farms'
      }
    },
    legend: {
      enabled: false
    },

    series: [{
      data: food_values
    }],
    credits: {
        enabled: false
    },
  });
}

