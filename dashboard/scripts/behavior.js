var map = "data/states.json";
var data_source = "data/data.csv";

var topology;
var dataset;
var tooltip;

var width = 1000;
var height = 400;

var year;
var property = "TOTAL_REVENUE"

margin = { top: 20, right: 20, bottom: 20, left: 40 };

Promise.all([d3.json(map), d3.csv(data_source)]).then(function ([map, data]) {
    topology = map;
    dataset = data;

    gen_map(dataset);
    //addZoom();
});

function gen_map(dataset) {

    var projection = d3
      .geoMercator()
      .scale(height/2)
      .rotate([0, 0])
      .center([0, 0])
      .translate([width / 2, height / 2]);
  
    var path = d3.geoPath().projection(projection);

    year = d3.select("#slider-input").property("value");
    console.log(year)
  
    filtered_data = filter_by_year(dataset, year)
    console.log(filtered_data)
  
    attr_max = d3.max(filtered_data, (d) => parseInt(d[property]));
    attr_min = d3.min(filtered_data, (d) => parseInt(d[property]));

    d3.select("#map")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .selectAll("path")
      .data(topojson.feature(topology, topology.objects.states).features)
      .join("path")
      .attr("class", "state")
      .attr("d", path)
      .attr(`${property}`, (d) => {
        var attribute;
        filtered_data.forEach((element) => {
          if (element["STATE"] === d.properties.name && element["YEAR"] == year) {
            attribute = element[property]
            return
          }
        });
        return attribute;
      })
      .on("mouseover", handleMouseOver)
      .on("mouseleave", handleMouseLeave)
      .on("mousemove", handleMouseMove)
      .attr("id", function (d, i) {
        return d.properties.name;
      })
      .attr("fill", (d) => {
        colour = "black";
        filtered_data.forEach((element) => {
          if (element.STATE === d.properties.name) {
            colour = d3.interpolateBlues(
              (parseInt(element[property]) - attr_min) /
                (attr_max - attr_min)
            );
            console.log(element)
            console.log(colour)
            return;
          }
        });
        return colour;
      });

    tooltip = d3
    .select("#tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("padding", "10px")
    .style("position", "absolute")
    .attr("pointer-events", "none");
}

function addZoom() {
    d3.select("#geo_map")
      .selectAll("svg")
      .call(d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed));
  }
  
function zoomed({ transform }) {
    d3.select("#geo_map")
      .selectAll("svg")
      .selectAll("path")
      .attr("transform", transform);
}

function handleMouseOver(event, d) {
    tooltip.style("opacity", 1);
}

function handleMouseLeave(event, d) {
    tooltip.style("opacity", 0);
}

function handleMouseMove(event, d) {
    party = "";

    e = d3.select(`path[id='${d.properties.name}']`).attr(property);

    tooltip
      .html(`State: ${d.properties.name} <br> Property: ${e}`)
      .style("left", event.clientX + 10 + "px")
      .style("top", event.clientY + 10 + "px")
      .style("opacity", 1);
}

function filter_by_year(dataset, year) {
  filtered_data = dataset.filter( (d) => {
    return d["YEAR"] == year;
  })

  return filtered_data
}

function updateMap(year) {

  filtered_data = filter_by_year(dataset, year)

  attr_max = d3.max(filtered_data, (d) => parseInt(d[property]));
  attr_min = d3.min(filtered_data, (d) => parseInt(d[property]));

  d3.select("#map")
      .selectAll("path")
      .attr("fill", (d) => {
      colour = "black";
      filtered_data.forEach((element) => {
          if (element.STATE === d.properties.name) {
          colour = d3.interpolateBlues(
              (parseInt(element[property]) - attr_min) /
              (attr_max - attr_min)
          );
          return;
          }
      });
      return colour;

  })
}