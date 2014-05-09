//Some resources: http://bl.ocks.org/mbostock/4206573
// http://bl.ocks.org/mbostock/4060606
// http://synthesis.sbecker.net/articles/2012/07/18/learning-d3-part-7-choropleth-maps
// topojson: https://github.com/mbostock/topojson/wiki/API-Reference


// County Comparison Interactions

$(document).ready(function() {
  

  //Reading map file and data

  queue()
  .defer(d3.json, "_json/us.json")
  .defer(d3.json, "_data/master_data.json")
  .await(ready);

  //Start of Choropleth drawing

  function ready(error, us, food) {
    // *** Set Up - data_setup.js ****

    var veggie_list = get_veggie_list()
    var fruit_list = get_fruit_list()
    var nut_list = get_nut_list()
    var totals_list = get_totals_list()

    food_selection = 'DIRSALES_FARMS07'

    var all_counties = make_county_objects(food, food_selection)

    draw_map(us, all_counties)
    top_list(all_counties, food_selection)
  
    $('#switch-data').on('mousedown', '.radio', function(){
      food_selection = ''
      var toggle = $(this).attr('id')
      if(toggle == 'direct-farm'){

        food_selection = 'DIRSALES_FARMS07'
        var all_counties = make_county_objects(food, food_selection)
        clear_top_list()
        draw_map(us, all_counties)
        top_list(all_counties, food_selection)
      }
    })

    $('#food-search-box').on('keyup',function(e) {
      if (e.which == 13){
          food_selection = $(this).val()


          var all_counties = make_county_objects(food, food_selection)
          draw_map(us, all_counties)

          clear_top_list()
          top_list(all_counties, food_selection)
      }
    });

  //  var food_list = (get_veggie_list() + get_fruit_list() + get_nut_list()).split(',');
    var food_list = ['Artichokes', 'Asparagus', 'Beans', 'Beets', 'Broccoli', 'Brussels Sprouts', 
                      'Cabbage', 'Carrots', 'Cauliflower', 'Celery', 'Chicory', 'Cucumbers', 'Daikon', 
                      'Eggplant', 'Escarole & Endive', 'Garlic', 'Ginseng', 'Greens', 'Herbs', 'Horseradish',
                      'Lettuce', 'Melons', 'Okra', 'Onions', 'Parsley', 'Peas', 'Peppers', 'Potatoes', 
                      'Pumpkins', 'Radishes', 'Rhubarb', 'Spinach', 'Squash', 'Sweet Corn', 'Sweet Potatoes', 
                      'Tomatoes', 'Turnips', 'Watercress', 'Apples', 'Apricots', 'Avocados', 'Bananas', 'Cherries', 'Chestnuts', 
                      'Dates', 'Figs', 'Grapefruit', 'Grapes', 'Guavas', 'Hazelnuts', 'Kiwifruit', 'Kumquats', 
                      'Lemons', 'Limes', 'Mangoes', 'Olives', 'Oranges', 'Papayas', 
                      'Passion Fruit', 'Peaches', 'Pears', 'Pecans', 'Persimmons', 'Plum-Apricot Hybrids', 
                      'Plums', 'Pomegranates', 'Prunes', 'Tangelos', 'Tangerines', 'Temples', 'Almonds', 'Macadamias', 'Pistachios', 'Walnuts'];

                     
    var create_bar_chart = function(fips_value) {
      fips = fips_value

      var get_food_by_county = function() {
        foods_by_county = []
        for(var i=0; i < food_list.length; i++) { 
          var value = food[food_list[i]][fips];
          if (value > 0) {
            foods_by_county.push({'item': food_list[i], 'value' : value});
          }  
        }

        var topFoods = _.chain(foods_by_county)
          .sortBy(function(foods_by_county){return -1 * foods_by_county.value;})
          .value();  
        console.log(topFoods);
        return topFoods;
      }

      $(function() {

        var names_list = function() {
          names = []
          food_array = get_food_by_county(fips);
          for (var i=0; i < food_array.length; i++){
            names.push(food_array[i].item)
          }
          return names;
        }

        var values_list = function() {
          values = []
          food_array = get_food_by_county(fips);
          for (var i=0; i < food_array.length; i++){
            values.push(food_array[i].value)
          }

          return values;
        }

        $(".bar-chart").highcharts({
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Top Foods'
          },
           xAxis: {
            categories: names_list(fips),
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
            data: values_list(fips)
          }],
          credits: {
              enabled: false
          },
        });
      });  
    }
    create_bar_chart(1001); 

  } 
});
