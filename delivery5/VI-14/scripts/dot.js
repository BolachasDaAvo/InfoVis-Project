var dot = {
  width: 600,
  height: 400,
  top: 10,
  right: 10,
  bottom: 10,
  left: 30,
}

function initDot() {
  let svg = d3.select("#dotPlot")
    .append("svg")
    .attr("width", dot.width)
    .attr("height", dot.height);

  svg.append("circle").attr("cx", 40).attr("cy", 20).attr("r", 3.5).style("fill", "orange")
  svg.append("circle").attr("cx", 100).attr("cy", 20).attr("r", 3.5).style("fill", "blue")
  svg.append("circle").attr("cx", 160).attr("cy", 20).attr("r", 3.5).style("fill", "brown")
  svg.append("circle").attr("cx", 230).attr("cy", 20).attr("r", 3.5).style("fill", "black")
  svg.append("text").attr("x", 50).attr("y", 21).text("Asian").style("font-size", "11px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", 110).attr("y", 21).text("White").style("font-size", "11px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", 170).attr("y", 21).text("Hispanic").style("font-size", "11px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", 240).attr("y", 21).text("African American").style("font-size", "11px").attr("alignment-baseline", "middle")

  svg.append("g");

  /* Tooltip */
  d3.select("#dot-tooltip")
    .style("display", "none")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("pointer-events", "none")
    .style("position", "absolute");
}

function updateDot() {
  let svg = d3.select("#dotPlot").select("svg").select("g");
  let attributes = ["BL_AVERAGE_SCORE", "HI_AVERAGE_SCORE", "WH_AVERAGE_SCORE", "AS_AVERAGE_SCORE"].map((e) => selectedAnalysis === "GROSS" ? e + "_GROSS" : e + "_PCT");
  let ethicityColors = ["black", "brown", "blue", "orange"]

  svg.html("");

  if (selectedAnalysis === "PER_CAPITA") {
    let x = d3
      .scaleBand()
      .range([dot.left, dot.width - dot.right])
      .domain(stateList);
    svg.append("g")
      .attr("transform", `translate(0, ${dot.height - dot.bottom})`)
      .call(d3.axisBottom(x).tickFormat(""))
    let y = d3
      .scaleLinear()
      .range([dot.height - dot.bottom, dot.top])
      .domain([0, 0]);
    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("transform", `translate(${dot.left}, 0)`);
    svg
      .append("g")
      .attr("id", "dotCircles")
      .append("text")
      .attr("x", 170)
      .attr("y", 200)
      .text("Data not available for per capita analysis")
    return;
  }

  /* x axis */
  let x = d3
    .scaleBand()
    .range([dot.left, dot.width - dot.right])
    .domain(stateList);

  svg.append("g")
    .attr("transform", `translate(0, ${dot.height - dot.bottom})`)
    .call(d3.axisBottom(x).tickFormat(""))

  /* y axis */
  let yDomain;
  if (selectedAnalysis === "GROSS") {
    yDomain = [201, 268];
  } else {
    yDomain = [-5, 5];
  }
  let y = d3
    .scaleLinear()
    .range([dot.height - dot.bottom, dot.top])
    .domain(yDomain);
  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("transform", `translate(${dot.left}, 0)`);

  svg.append("g")
    .attr("id", "dotCircles");

  /* lines */
  for (let i = 1; i < attributes.length; i++) {
    svg.select("#dotCircles")
      .selectAll("lines")
      .data(yearData)
      .enter()
      .append("line")
      .attr("x1", (d) => {
        return x(d.STATE);
      })
      .attr("x2", (d) => {
        return x(d.STATE)
      })
      .attr("y1", (d) => {
        return y(d[attributes[i - 1]]);
      })
      .attr("y2", (d) => {
        return y(d[attributes[i]]);
      })
      .attr("attribute1", attributes[i - 1])
      .attr("attribute2", attributes[i])
      .attr("state", (d) => { return d.STATE })
      .style("stroke", (d) => { return selectedStates.includes(d.STATE) ? stateColors[d.STATE] : "lightgrey"; })
      .style("stroke-width", (d) => { return selectedStates.includes(d.STATE) ? 2 : 1; })
      .style("opacity", (d) => {
        return selectedStates.includes(d.STATE) ? 1 : 0.2;
      });
  }

  if (selectedYear >= 2011) {
    /* circles */
    for (let i = 0; i < attributes.length; i++) {
      svg.select("#dotCircles")
        .selectAll("circles")
        .data(yearData)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
          return x(d.STATE);
        })
        .attr("cy", (d) => {
          return y(d[attributes[i]]);
        })
        .attr("r", (d) => {
          return selectedStates.includes(d.STATE) ? 5 : 3;
        })
        .style("cursor", "pointer")
        .attr("attribute", attributes[i])
        .attr("state", (d) => { return d.STATE })
        .on("mouseover", dotHandleMouseOver)
        .on("mouseleave", dotHandleMouseLeave)
        .on("mousemove", dotHandleMouseMove)
        .on("click", dotHandleMouseClick)
        .style("fill", ethicityColors[i])
        .style("opacity", (d) => {
          return selectedStates.includes(d.STATE) ? 1 : 0.2;
        });
    }


  } else {
    svg
      .select("#dotCircles")
      .append("text")
      .attr("x", 200)
      .attr("y", 200)
      .text("Data not available before 2011")
  }
}

var dotHoverDelay = null;
function dotHandleMouseOver(event, d) {
  d3.select("#dot-tooltip").style("display", "block");

  if (selectedStates.includes(d.STATE)) {
    dotHoverDelay = setTimeout(() => { highlightState(d.STATE); }, 2000);
  }
}

function dotHandleMouseLeave(event, d) {
  d3.select("#dot-tooltip").style("display", "none");

  clearTimeout(dotHoverDelay);
  if (selectedStates.includes(d.STATE)) {
    resetStateHighlight();
  }
}

function dotHandleMouseMove(event, d) {
  let attribute = d3.select(event.srcElement).attr("attribute");

  d3.select("#dot-tooltip")
    .html(
      `State: ${d.STATE} <br> ${toReadable[attribute]}: ${numberWithSpaces(round(d[attribute], 3))}`
    )
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 10 + "px")
    .style("display", "block");
}

function dotHandleMouseClick(event, d) {
  if (selectedStates.includes(d.STATE)) {
    removeState(d.STATE);
  } else {
    addState(d.STATE);
  }
}

function dotHighlightState(state) {
  d3
    .select("#dotCircles")
    .selectAll("circle")
    .transition()
    .duration(200)
    .style("opacity", (d) => {
      return d.STATE === state ? 1 : 0.2;
    });

  d3
    .select("#dotCircles")
    .selectAll("line")
    .transition()
    .duration(200)
    .style("opacity", (d) => {
      return d.STATE === state ? 1 : 0.2;
    });
}

function dotResetStateHighlight() {
  d3
    .select("#dotCircles")
    .selectAll("circle")
    .transition()
    .duration(200)
    .style("opacity", (d) => {
      return selectedStates.includes(d.STATE) ? 1 : 0.2;
    });

  d3
    .select("#dotCircles")
    .selectAll("line")
    .transition()
    .duration(200)
    .style("opacity", (d) => {
      return selectedStates.includes(d.STATE) ? 1 : 0.2;
    });
}