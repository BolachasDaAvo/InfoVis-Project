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
    .style("display", "none")
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

  var yDomain = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
  if (selectedStates.length === 1) {
    /* plot all attributes */
    selectedAttributes.forEach((attribute) => {
      var domain = d3.extent(stateData[selectedStates[0]], (d) => parseFloat(d[attribute]));
      yDomain = [
        domain[0] < yDomain[0] ? domain[0] : yDomain[0],
        domain[1] > yDomain[1] ? domain[1] : yDomain[1],
      ];
    });
  }
  else {
    /* plot all states */
    selectedStates.forEach((state) => {
      var domain = d3.extent(stateData[state], (d) => parseFloat(d[mapAttribute]));
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

  if (selectedStates.length === 1) {
    selectedAttributes.forEach((attribute) => {
      plotLine(selectedStates[0], attribute, x, y);
    });
  } else {
    selectedStates.forEach((state) => {
      plotLine(state, mapAttribute, x, y);
    });
  }
}

function plotLine(state, attribute, x, y) {
  const svg = d3.select("#lineChart").select("svg");

  line = d3
    .line()
    .x((d) => x(d.YEAR))
    .y((d) => y(d[attribute]));

  svg
    .append("path")
    .datum(stateData[state])
    .attr("fill", "none")
    .attr("stroke", attributeColors[attribute])
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line)
    .attr("attribute", attribute)
    .attr("id", `line-${attribute}`)
    .style("cursor", "pointer")
    .on("click", lineHandleMouseClick)
    .on("mouseover", lineHandleMouseOver)
    .on("mouseleave", lineHandleMouseLeave)

  svg
    .append("g")
    .attr("fill", attributeColors[attribute])
    .selectAll("circle")
    .data(stateData[state])
    .join("circle")
    .attr("cx", (d) => x(d.YEAR))
    .attr("cy", (d) => y(d[attribute]))
    .attr("r", 5)
    .attr("attribute", attribute)
    .style("cursor", "pointer")
    .on("mouseover", dotHandleMouseOver)
    .on("mouseleave", dotHandleMouseLeave)
    .on("mousemove", dotHandleMouseMove)
    .on("click", dotHandleMouseClick);
}

function dotHandleMouseOver(event, d) {
  d3.select("#line-tooltip").style("display", "block");

  d3
    .select(`#line-${d3.select(event.path[0]).attr("attribute")}`)
    .attr("stroke-width", 4)
}

function dotHandleMouseLeave(event, d) {
  d3.select("#line-tooltip").style("display", "none");

  d3
    .select(`#line-${d3.select(event.path[0]).attr("attribute")}`)
    .attr("stroke-width", 3)
}

function dotHandleMouseMove(event, d) {
  attribute = event.path[0].attributes.attribute.nodeValue;

  d3.select("#line-tooltip")
    .html(
      `Year: ${d.YEAR} <br> ${toReadable[attribute]}: ${numberWithSpaces(round(d[attribute], 3))}`
    )
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 10 + "px")
    .style("display", "block");
}

function dotHandleMouseClick(event, d) {
  if (selectedAttributes.length === 0) {
    return;
  }

  attribute = d3.select(event.path[0]).attr("attribute");
  oldIndex = selectedAttributes.indexOf(attribute);
  newIndex = 0;

  reorderAttribute({ oldDraggableIndex: oldIndex, newDraggableIndex: newIndex });
  reorderAttributesList(oldIndex, newIndex);
}

function lineHandleMouseOver(event, d) {
  d3
    .select(event.path[0])
    .attr("stroke-width", 4)
}

function lineHandleMouseLeave(event, d) {
  d3
    .select(event.path[0])
    .attr("stroke-width", 3)
}

function lineHandleMouseClick(event, d) {
  if (selectedAttributes.length === 0) {
    return;
  }

  attribute = d3.select(event.path[0]).attr("attribute");
  oldIndex = selectedAttributes.indexOf(attribute);
  newIndex = 0;

  reorderAttribute({ oldDraggableIndex: oldIndex, newDraggableIndex: newIndex });
  reorderAttributesList(oldIndex, newIndex);
}
