// ######### FIND FOOD DATA BASED ON ID

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

var get_names_list = function(fips, sorted_foods) {
  names = []
  food_array = sorted_foods;
  for (var i=0; i < food_array.length; i++){
    names.push(food_array[i].item)
  }
  return names;
}

var get_values_list = function(fips, sorted_foods) {
  values = []
  food_array = sorted_foods;
  for (var i=0; i < food_array.length; i++){
    values.push(food_array[i].value)
  }
  return values;
}

var draw_chart = function(food_names, food_values){
  $(".bar-chart").highcharts({
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


var create_bar_chart = function(food, id){
  var food_list = get_food_list()
  var food_by_county = get_food_by_county(id, food, food_list)
  var sorted_foods = sort_foods(food_by_county) 
  
  var food_names = get_names_list(id, sorted_foods)
  var food_values = get_values_list(id, sorted_foods)


  draw_chart(food_names, food_values)
  // console.log(food_list)
  // console.log(food_by_county)
  // console.log(sorted_foods)
  // console.log(food_names)
  // console.log(food_values)
}