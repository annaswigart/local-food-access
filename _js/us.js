// http://socialinnovationsimulation.com/2013/07/11/tutorial-making-maps-on-d3/

var w = 1000;
var h = 500;
var svg = d3.select("#us").append("svg")
.attr("width", w)
.attr("height", h);

var projection = d3.geo.albersUsa()
var path = d3.geo.path()
.projection(projection);

var colour = d3.scale.linear()
.domain([0, 5000])
.range(["rgb(217,95,14)","rgb(254,196,79)",
"rgb(255,247,188)"]);

d3.json("_json/us.json", function(us) {
	console.log(us)
	svg.selectAll("append")
	.data(topojson.feature(us, us.objects.counties).features)
	.enter()
	.append("path")
	.attr("d", path)
	.attr("fill", function(d, i) { return colour(i); });
});