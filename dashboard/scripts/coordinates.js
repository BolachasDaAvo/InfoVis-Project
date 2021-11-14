var coordinates = {
  width: 540,
  height: 370,
  top: 20,
  right: 30,
  bottom: 10,
  left: 30,
}

function initCoordinates() {
  d3.select("#coordinates")
    .append("svg")
    .attr("width", coordinates.width + coordinates.left + coordinates.right)
    .attr("height", coordinates.height + coordinates.top + coordinates.bottom)
    .append("g")
    .attr("transform",
      "translate(" + coordinates.left + "," + coordinates.top + ")");
}

function updateCoordinates() {
  d3.select("#coordinates")
    .select("svg")
    .select("g")
    .html("");

  /* Filter attributes */
  let attributes = attributesList.filter((a) => {
    return a.endsWith(analysisSuffix[selectedAnalysis]);
  });

  /* x */
  x = d3.scalePoint()
    .range([0, coordinates.width])
    .domain(attributes);

  /* y */
  let y = {}
  attributes.forEach((attribute) => {
    let yDomain = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    selectedStates.forEach((state) => {
      let domain = d3.extent(stateData[state], (d) => parseFloat(d[attribute]));
      yDomain = [
        domain[0] < yDomain[0] ? domain[0] : yDomain[0],
        domain[1] > yDomain[1] ? domain[1] : yDomain[1],
      ];
    });
    y[attribute] = d3.scaleLinear()
      .domain(yDomain)
      .range([coordinates.height, 0]);
  });

  /* Connect axis */
  plotLines(stateData, attributes, x, y);
}

function plotLines(data, attributes, x, y) {
  let svg = d3.select("#coordinates").select("svg").select("g");

  svg
    .selectAll(`path`)
    .data([].concat.apply([], Object.values(data)))
    .enter()
    .append("path")
    .attr("d", (d) => {
      return d3.line()(attributes.map((p) => {
        return [x(p), y[p](d[p])];
      }));
    })
    .style("fill", "none")
    .style("stroke", (d) => {
      return stateColors[d.STATE];
    })
    .on("mouseover", coordinatesHandleMouseOver)
    .on("mouseleave", coordinatesHandleMouseLeave);

  svg
    .selectAll("axis")
    .data(attributes)
    .enter()
    .append("g")
    .attr("transform", (d) => { return `translate(${x(d)})`; })
    .each((d, i, n) => { d3.select(n[i]).call(d3.axisLeft().ticks(4).tickFormat((y) => formatNum(y)).scale(y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -10)
    .text((d) => { return toAbbreviated[d]; })
    .style("fill", "black")
}

var coordinatesHoverDelay = null;
function coordinatesHandleMouseOver(event, d) {
  coordinatesHoverDelay = setTimeout(() => { highlightState(d.STATE); }, 2000);
}

function coordinatesHandleMouseLeave(event, d) {
  clearTimeout(coordinatesHoverDelay);
  resetStateHighlight();
}

function coordinatesHighlightState(state) {
  d3
    .select("#coordinates")
    .selectAll("path")
    .transition()
    .duration(200)
    .style("opacity", (d) => {
      if (d != null) {
        return d.STATE === state ? 1 : 0.1;
      }
    });
}

function coordinatesResetStateHighlight() {
  d3
    .select("#coordinates")
    .selectAll("path")
    .transition()
    .duration(300)
    .style("opacity", 1);
}