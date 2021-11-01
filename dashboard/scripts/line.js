var lineChart;

function initLine() {
  lineChart = {
    width: 600,
    height: 400,
    top: 10,
    right: 10,
    bottom: 20,
    left: 50,
  };

  const svg = d3
    .select("#lineChart")
    .append("svg")
    .attr("width", lineChart.width)
    .attr("height", lineChart.height);

  /* Tooltip */
  d3.select("#line-tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute")
    .attr("pointer-events", "none");

  updateLine();
}

function updateLine() {
  d3.select("#lineChart").select("svg").remove();

  const svg = d3
    .select("#lineChart")
    .append("svg")
    .attr("width", lineChart.width)
    .attr("height", lineChart.height);

  var x = d3
    .scaleLog()
    .domain([1992, 2015])
    .range([lineChart.left, lineChart.width - lineChart.right]);

  var xAxis = (g) =>
    g
      .attr("transform", `translate(0, ${lineChart.height - lineChart.bottom})`)
      .call(d3.axisBottom(x).tickFormat((x) => x));

  svg.append("g").call(xAxis);

  var yDomain;
  if (selectedAttributes.length == 0) {
    yDomain = d3.extent(stateData, (d) => parseFloat(d[defaultAttribute]));
  } else {
    yDomain = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    selectedAttributes.forEach((attribute) => {
      var domain = d3.extent(stateData, (d) => parseFloat(d[attribute]));
      yDomain = [
        domain[0] < yDomain[0] ? domain[0] : yDomain[0],
        domain[1] > yDomain[1] ? domain[1] : yDomain[1],
      ];
    });
  }

  var y = d3
    .scaleLinear()
    .domain(yDomain)
    .range([lineChart.height - lineChart.bottom, lineChart.top]);

  var yAxis = (g) =>
    g
      .attr("transform", `translate(${lineChart.left}, 0)`)
      .call(d3.axisLeft(y).tickFormat((x) => x));

  svg.append("g").call(yAxis);

  if (selectedAttributes.length == 0) {
    plotLine(defaultAttribute, x, y);
  } else {
    selectedAttributes.forEach((attribute) => {
      plotLine(attribute, x, y);
    });
  }
}

function plotLine(attribute, x, y) {
  const svg = d3.select("#lineChart").select("svg");

  line = d3
    .line()
    .x((d) => x(d.YEAR))
    .y((d) => y(d[attribute]));

  svg
    .append("path")
    .datum(stateData)
    .attr("fill", "none")
    .attr("stroke", attributeColors[attribute] || "steelblue")
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

  svg
    .append("g")
    .attr("fill", attributeColors[attribute] || "steelblue")
    .selectAll("circle")
    .data(stateData)
    .join("circle")
    .attr("cx", (d) => x(d.YEAR))
    .attr("cy", (d) => y(d[attribute]))
    .attr("r", 5)
    .attr("attribute", attribute)
    .on("mouseover", lineHandleMouseOver)
    .on("mouseleave", lineHandleMouseLeave)
    .on("mousemove", lineHandleMouseMove);
}

function lineHandleMouseOver(event, d) {
  d3.select("#line-tooltip").style("opacity", 1);
}

function lineHandleMouseLeave(event, d) {
  d3.select("#line-tooltip").style("opacity", 0);
}

function lineHandleMouseMove(event, d) {
  attribute = event.path[0].attributes.attribute.nodeValue;

  d3.select("#line-tooltip")
    .html(
      `Year: ${d.YEAR} <br> ${toReadable[attribute]}: ${numberWithSpaces(round(d[attribute], 3))}`
    )
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 10 + "px")
    .style("opacity", 1);
}
