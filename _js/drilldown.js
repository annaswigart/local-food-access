// Top foods for each county

var sortFood = function(county_objects, key) {
    return county_objects.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}


// var getTop = function(all_counties, key){
//   top_counties = sortDesc(all_counties, key).slice(0,10);
//   return top_counties
// }
$(document).ready(function() {
	queue()
	.defer(d3.json, "_data/master_data.json")
	.await(ready);

	function ready(error, by_county) {
		county_objects = []
		$.each(by_county, function(key, object){
			county = {
				stats: {
					id: parseInt(object['fips']), 
					county: object['county'],
					state: object['state'],
					direct_farm_sales: object['DIRSALES_FARMS07'],
					farmers_markets: object['FMRKT13'],
					farmers_markets_pth: object['FMRKTPTH13']
				},
				food: {
					Artichokes: object['Artichokes'],
					Asparagus: object['Asparagus'],
					Beans: object['Beans'],
					Beets: object['Beets'],
					Broccoli: object['Broccoli'],
					BrusselsSprouts: object['Brussels Sprouts'],
					Cabbage: object['Cabbage'],
					Carrots: object['Carrots'],
					Cauliflower: object['Cauliflower'],
					Celery: object['Celery'],
					Chicory: object['Chicory'],
					Cucumbers: object['Cucumbers'],
					Daikon: object['Daikon'],
					Eggplant: object['Eggplant'],
					Escarole_Endive: object['Escarole & Endive'],
					Garlic: object['Garlic'],
					Ginseng: object['Ginseng'],
					Greens: object['Greens'],
					Herbs: object['Herbs'],
					Horseradish: object['Horseradish'],
					Lettuce: object['Lettuce'],
					Melons: object['Melons'],
					Okra: object['Okra'],
					Onions: object['Onions'],
					Parsley: object['Parsley'],
					Peas: object['Peas'],
					Peppers: object['Peppers'],
					Potatoes: object['Potatoes'],
					Pumpkins: object['Pumpkins'],
					Radishes: object['Radishes'],
					Rhubarb: object['Rhubarb'],
					Spinach: object['Spinach'],
					Squash: object['Squash'],
					SweetCorn: object['Sweet Corn'],
					SweetPotatoes: object['Sweet Potatoes'],
					Tomatoes: object['Tomatoes'],
					Turnips: object['Turnips'],
					Vegetables_Other: object['Vegetables- Other'],
					Watercress: object['Watercress'],
					Almonds: object['Almonds'],
					Macadamias: object['Macadamias'],
					Pistachios: object['Pistachios'],
					TreeNuts: object['Tree Nuts'],
					Other: object['Other'],
					Walnuts: object['Walnuts'],
					VegetableTotals: object['Vegetable Totals'],
					CitrusTotals: object['Citrus Totals'],
					NonCitrusTotals: object['Non-Citrus Totals'],
					TreeNutTotals: object['Tree Nut Totals'],
					Apples: object['Apples'],
					Apricots: object['Apricots'],
					Avocados: object['Avocados'],
					Bananas: object['Bananas'],
					Cherries: object['Cherries'],
					Chestnuts: object['Chestnuts'],
					CitrusOther: object['Citrus- Other'],
					Dates: object['Dates'],
					Figs: object['Figs'],
					Grapefruit: object['Grapefruit'],
					Grapes: object['Grapes'],
					Guavas: object['Guavas'],
					Hazelnuts: object['Hazelnuts'],
					Kiwifruit: object['Kiwifruit'],
					Kumquats: object['Kumquats'],
					Lemons: object['Lemons'],
					Limes: object['Limes'],
					Mangoes: object['Mangoes'],
					NonCitrusOther: object['Non-Citrus- Other'],
					Olives: object['Olives'],
					Oranges: object['Oranges'],
					Papayas: object['Papayas'],
					PassionFruit: object['Passion Fruit'],
					Peaches: object['Peaches'],
					Pears: object['Pears'],
					Pecans: object['Pecans'],
					Persimmons: object['Persimmons'],
					PlumApricotHybrids: object['Plum-Apricot Hybrids'],
					Plums: object['Plums'],
					Pomegranates: object['Pomegranates'],
					Prunes: object['Prunes'],
					Tangelos: object['Tangelos'],
					Tangerines: object['Tangerines'],
					Temples: object['Temples']
				}
			}
			county_objects.push(county)
		})
	console.log(county_objects)
	return county_objects
	};
});

