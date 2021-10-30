var map = "data/states.json";
var data_source = "data/data.csv";

var topology;
var dataset;
var tooltip;

var year;
var property = "TOTAL_REVENUE"

margin = { top: 20, right: 20, bottom: 20, left: 40 };
width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom, 

Promise.all([d3.json(map), d3.csv(data_source)]).then(function ([map, data]) {
    topology = map;
    dataset = data;

    gen_map(dataset);
    //addZoom();
});

function gen_map(dataset) {

    var projection = d3
      .geoAlbers()
      .scale(height*2)
      .translate([width/2,height/2])
  
    var path = d3.geoPath().projection(projection);

    year = d3.select("#slider-input").property("value");
  
    filtered_data = filter_by_year(dataset, year)
  
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
        colour = "silver";
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
      });

    d3.select("#color_legend")
      .node()
      .appendChild(
        Legend(
          d3.scaleSequential([attr_min, attr_max], d3.interpolateBlues),
          {
            title: property,
            ticks: 10,
          }
        )
    );

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

function updateMapLegend() {
    
    d3.select("#color_legend")
      .select("svg")
      .remove()

    d3.select("#color_legend")
    .node()
    .appendChild(
      Legend(
        d3.scaleSequential([attr_min, attr_max], d3.interpolateBlues),
        {
          title: toReadable[property],
          ticks: 10,
        }
      )
  );  
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

  property = selectedAttributes[0] != null ? selectedAttributes[0] : defaultAttr
  filtered_data = filter_by_year(dataset, year)

  attr_max = d3.max(filtered_data, (d) => parseInt(d[property]));
  attr_min = d3.min(filtered_data, (d) => parseInt(d[property]));

  d3.select("#map")
      .selectAll("path")
      .attr("fill", (d) => {
      colour = "silver";
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

  updateMapLegend()
}

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
function Legend(
  color,
  {
    title,
    tickSize = 6,
    width = 600,
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues,
  } = {}
) {
  function ramp(color, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("overflow", "visible")
    .style("display", "block");

  let tickAdjust = (g) =>
    g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color
      .copy()
      .rangeRound(
        d3.quantize(d3.interpolate(marginLeft, width - marginRight), n)
      );

    svg
      .append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr(
        "xlink:href",
        ramp(
          color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))
        ).toDataURL()
      );
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(
      color
        .copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
      {
        range() {
          return [marginLeft, width - marginRight];
        },
      }
    );

    svg
      .append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3
          .range(n)
          .map((i) => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds = color.thresholds
      ? color.thresholds() // scaleQuantize
      : color.quantiles
      ? color.quantiles() // scaleQuantile
      : color.domain(); // scaleThreshold

    const thresholdFormat =
      tickFormat === undefined
        ? (d) => d
        : typeof tickFormat === "string"
        ? d3.format(tickFormat)
        : tickFormat;

    x = d3
      .scaleLinear()
      .domain([-1, color.range().length - 1])
      .rangeRound([marginLeft, width - marginRight]);

    svg
      .append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
      .attr("x", (d, i) => x(i - 1))
      .attr("y", marginTop)
      .attr("width", (d, i) => x(i) - x(i - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", (d) => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = (i) => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3
      .scaleBand()
      .domain(color.domain())
      .rangeRound([marginLeft, width - marginRight]);

    svg
      .append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
      .attr("x", x)
      .attr("y", marginTop)
      .attr("width", Math.max(0, x.bandwidth() - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", color);

    tickAdjust = () => {};
  }

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues)
    )
    .call(tickAdjust)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("class", "title")
        .text(title)
    );

  return svg.node();
}
