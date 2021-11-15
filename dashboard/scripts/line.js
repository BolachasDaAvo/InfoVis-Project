var lineChart = {
  width: 600,
  height: 400,
  top: 10,
  right: 10,
  bottom: 20,
  left: 40,
};

function initLine() {
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
    .style("pointer-events", "none")
    .style("position", "absolute");
}

function updateLine() {

  d3.select("#lineChart").select("svg").remove();

  const svg = d3
    .select("#lineChart")
    .append("svg")
    .attr("width", lineChart.width)
    .attr("height", lineChart.height);

  let x = d3
    .scaleLog()
    .domain([1992, 2015])
    .range([lineChart.left, lineChart.width - lineChart.right]);

  let xAxis = (g) =>
    g
      .attr("transform", `translate(0, ${lineChart.height - lineChart.bottom})`)
      .call(d3.axisBottom(x).tickFormat((x) => x));

  svg.append("g").call(xAxis);

  let yDomain = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
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

  let y = d3
    .scaleLinear()
    .domain(yDomain)
    .range([lineChart.height - lineChart.bottom, lineChart.top]);

  let yAxis = (g) =>
    g
      .attr("transform", `translate(${lineChart.left}, 0)`)
      .call(d3.axisLeft(y).tickFormat((x) => formatNum(x)));

  svg.append("g").call(yAxis);

  if (selectedStates.length === 1) {
    selectedAttributes.forEach((attribute) => {
      plotLine(selectedStates[0], attribute, x, y, color = "attribute");
    });
  } else {
    selectedStates.forEach((state) => {
      plotLine(state, mapAttribute, x, y, color = "state");
    });
  }
}

function plotLine(state, attribute, x, y, color = "attribute") {
  const svg = d3.select("#lineChart").select("svg");

  let line = d3
    .line()
    .x((d) => x(d.YEAR))
    .y((d) => y(d[attribute]));

  svg
    .append("path")
    .datum(stateData[state])
    .attr("fill", "none")
    .attr("stroke", () => {
      if (color === "attribute") {
        return attributeColors[attribute];
      }
      if (color === "state") {
        return stateColors[state];
      }
    })
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line)
    .attr("attribute", attribute)
    .attr("state", state)
    .attr("id", `line-${attribute}-${state}`)
    .style("cursor", "pointer")
    .on("click", lineLineHandleMouseClick)
    .on("mouseover", lineLineHandleMouseOver)
    .on("mouseleave", lineLineHandleMouseLeave);


  svg
    .append("g")
    .attr("fill", () => {
      if (color === "attribute") {
        return attributeColors[attribute];
      }
      if (color === "state") {
        return stateColors[state];
      }
    })
    .selectAll("circle")
    .data(stateData[state])
    .join("circle")
    .attr("cx", (d) => x(d.YEAR))
    .attr("cy", (d) => y(d[attribute]))
    .attr("r", 5)
    .attr("attribute", attribute)
    .attr("state", state)
    .style("cursor", "pointer")
    .on("mouseover", lineDotHandleMouseOver)
    .on("mouseleave", lineDotHandleMouseLeave)
    .on("mousemove", lineDotHandleMouseMove)
    .on("click", lineDotHandleMouseClick);
}

var lineDotHoverDelay = null;
function lineDotHandleMouseOver(event, d) {
  d3.select("#line-tooltip").style("display", "block");

  lineDotHoverDelay = setTimeout(() => { highlightState(d3.select(event.srcElement).attr("state")); }, 2000);
}

function lineDotHandleMouseLeave(event, d) {
  d3.select("#line-tooltip").style("display", "none");

  clearTimeout(lineDotHoverDelay);
  resetStateHighlight();
}

function lineDotHandleMouseMove(event, d) {
  let attribute = d3.select(event.srcElement).attr("attribute");

  d3.select("#line-tooltip")
    .html(
      `State: ${d.STATE} <br> Year: ${d.YEAR} <br> ${toReadable[attribute]}: ${numberWithSpaces(round(d[attribute], 3))}`
    )
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 10 + "px")
    .style("display", "block");
}

function lineDotHandleMouseClick(event, d) {
  if (selectedAttributes.length === 0) {
    return;
  }

  let attribute = d3.select(event.srcElement).attr("attribute");
  selectMapAttribute(attribute);
}

var lineLineHoverDelay = null;
function lineLineHandleMouseOver(event, d) {
  lineLineHoverDelay = setTimeout(() => { highlightState(d3.select(event.srcElement).attr("state")); }, 2000);
}

function lineLineHandleMouseLeave(event, d) {
  clearTimeout(lineLineHoverDelay);
  resetStateHighlight();
}

function lineLineHandleMouseClick(event, d) {
  let attribute = d3.select(event.srcElement).attr("attribute");
  selectMapAttribute(attribute);
}

function lineHighlightState(state) {
  if (selectedStates.length === 1) {
    return;
  }
  d3
    .select("#lineChart")
    .selectAll("path")
    .transition()
    .duration(200)
    .style("opacity", (d) => {
      if (d != null) {
        return d[0].STATE === state ? 1 : 0.1;
      }
    });

  d3
    .select("#lineChart")
    .selectAll("circle")
    .transition()
    .duration(200)
    .style("opacity", (d) => {
      if (d != null) {
        return d.STATE === state ? 1 : 0.1;
      }
    });
}

function lineResetStateHighlight() {
  if (selectedStates.length === 1) {
    return;
  }
  d3
    .select("#lineChart")
    .selectAll("path")
    .transition()
    .duration(300)
    .style("opacity", 1)
    .style("stroke", (d) => {
      if (d != null) {
        return stateColors[d[0].STATE];
      }
    });

  d3
    .select("#lineChart")
    .selectAll("circle")
    .transition()
    .duration(300)
    .style("opacity", 1)
    .style("fill", (d) => {
      if (d != null) {
        return stateColors[d.STATE];
      }
    });
}
