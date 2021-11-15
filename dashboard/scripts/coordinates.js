// TODO: implement tooltip between axis

var coordinates = {
  width: 600,
  height: 400,
  top: 20,
  right: 40,
  bottom: 10,
  left: 40,
  x: null,
  y: null,
  attributes: [],
  analysis: null,
  dragging: {},
}

function initCoordinates() {
  let svg = d3.select("#coordinates")
    .append("svg")
    .attr("width", coordinates.width)
    .attr("height", coordinates.height);

  svg
    .append("g")
    .attr("id", "coordinates-lines");

  svg
    .append("g")
    .attr("id", "coordinates-groups");

  coordinates.analysis = defaultAnalysis;
  coordinates.attributes = attributesList.filter((a) => {
    return a.endsWith(analysisSuffix[defaultAnalysis]);
  });
}

function updateCoordinates() {

  /* Update attributes */
  if (selectedAnalysis != coordinates.analysis) {
    coordinates.attributes = coordinates.attributes.map(d => d.replace(analysisSuffix[coordinates.analysis], analysisSuffix[selectedAnalysis]))
    if (selectedAnalysis === "PER_CAPITA") {
      coordinates.attributes.splice(coordinates.attributes.indexOf("AVERAGE_SCORE" + analysisSuffix[selectedAnalysis]), 1)
    }
    if (coordinates.analysis === "PER_CAPITA") {
      coordinates.attributes.push("AVERAGE_SCORE" + analysisSuffix[selectedAnalysis])
    }
  }
  coordinates.analysis = selectedAnalysis;

  /* x */
  coordinates.x = d3
    .scalePoint()
    .range([coordinates.left, coordinates.width - coordinates.right])
    .domain(coordinates.attributes);

  /* y */
  coordinates.y = {}
  coordinates.attributes.forEach((attribute) => {
    let yDomain = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    selectedStates.forEach((state) => {
      let domain = d3.extent(stateData[state], (d) => parseFloat(d[attribute]));
      yDomain = [
        domain[0] < yDomain[0] ? domain[0] : yDomain[0],
        domain[1] > yDomain[1] ? domain[1] : yDomain[1],
      ];
    });
    coordinates.y[attribute] = d3.scaleLinear()
      .domain(yDomain)
      .range([coordinates.height - coordinates.bottom, coordinates.top]);
  });

  /* Connect axis */
  plotLines();
  plotAxis();
}

function plotLines() {
  let lines = d3.select("#coordinates-lines").html("");

  /* lines */
  lines
    .selectAll("path")
    .data([].concat.apply([], Object.values(stateData)))
    .enter()
    .append("path")
    .style("fill", "none")
    .style("stroke", (d) => {
      return stateColors[d.STATE];
    })
    .attr("d", (d) => {
      return d3.line()(coordinates.attributes.map((p) => {
        return [position(p), coordinates.y[p](d[p])];
      }));
    })
    .on("mouseover", coordinatesHandleMouseOver)
    .on("mouseleave", coordinatesHandleMouseLeave);
}

function updateLines(delay) {
  let lines = d3.select("#coordinates-lines");

  /* lines */
  lines
    .selectAll("path")
    .transition()
    .duration(delay)
    .attr("d", (d) => {
      return d3.line()(coordinates.attributes.map((p) => {
        return [position(p), coordinates.y[p](d[p])];
      }));
    });
}

function plotAxis() {
  let groups = d3.select("#coordinates-groups").html("");

  /* groups */
  let axis = groups
    .selectAll(".group")
    .data(coordinates.attributes)
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", (d) => { return `translate(${coordinates.x(d)})`; })
    .call(d3.drag()
      .on("start", coordinatesHandleDragStart)
      .on("drag", coordinatesHandleDrag)
      .on("end", coordinatesHandleDragEnd))
    .on("click", coordinatesHandleClick);

  axis
    .append("g")
    .attr("class", "axis")
    .each((d, i, n) => { d3.select(n[i]).call(d3.axisLeft().ticks(4).tickFormat((y) => formatNum(y)).scale(coordinates.y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", 10)
    .attr("class", "heavy")
    .text((d) => { return toAbbreviated[d]; })
    .style("fill", (d) => attributeColors[d] || "black")
    .style("font-weight", "bolder")
    .style("font-size", "10px")
    .style("cursor", "move")
    .style("cursor", "grab");
}

function position(d) {
  let v = coordinates.dragging[d];
  return v === undefined ? coordinates.x(d) : v;
}

function coordinatesHandleDragStart(event, d) {
  coordinates.dragging[d] = coordinates.x(d);
}

function coordinatesHandleDrag(event, d) {
  if (event.x >= coordinates.width) {
    coordinates.dragging[d] = coordinates.width;
  } else if (event.x <= 0) {
    coordinates.dragging[d] = 0;
  } else {
    coordinates.dragging[d] = event.x;
  }

  coordinates.attributes.sort((a, b) => position(a) - position(b));
  coordinates.x = d3
    .scalePoint()
    .range([coordinates.left, coordinates.width - coordinates.right])
    .domain(coordinates.attributes);
  d3.select("#coordinates-groups").selectAll(".group").attr("transform", (d) => `translate(${position(d)})`);
  plotLines();
}

function coordinatesHandleDragEnd(event, d) {
  delete coordinates.dragging[d];
  d3
    .select("#coordinates-groups")
    .selectAll(".group")
    .filter((group) => group === d)
    .attr("transform", `translate(${coordinates.x(d)})`);
  plotLines();
}

var coordinatesHoverDelay = null;
function coordinatesHandleMouseOver(event, d) {
  console.log("mouse enter");
  coordinatesHoverDelay = setTimeout(() => { highlightState(d.STATE); }, 2000);
}

function coordinatesHandleMouseLeave(event, d) {
  console.log("mouse leave");
  clearTimeout(coordinatesHoverDelay);
  resetStateHighlight();
}

function coordinatesHandleClick(event, d) {
  selectAttribute(d);
}

function coordinatesHighlightState(state) {
  d3
    .select("#coordinates-lines")
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
    .select("#coordinates-lines")
    .selectAll("path")
    .transition()
    .duration(300)
    .style("opacity", 1);
}