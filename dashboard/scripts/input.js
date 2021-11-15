function updateYearInput() {
  selectedYear = d3.select("#year-input").property("value");
  if (selectedYear > maxYear) {
    selectedYear = maxYear;
  }
  if (selectedYear < minYear) {
    selectedYear = minYear;
  }
  d3.select("#slider-input").property("value", selectedYear);

  filterDataByYear();
  updateMap();
  updateDot();
}

function updateYearSlider() {
  selectedYear = d3.select("#slider-input").property("value");
  d3.select("#year-input").property("value", selectedYear);

  filterDataByYear();
  updateMap();
  updateDot();
}

/* Attributes */

function renderAttributes() {
  let menu = d3.select("#attribute-menu");
  menu.html("");

  attributesList.forEach((attribute) => {
    if (attribute.endsWith(analysisSuffix[selectedAnalysis])) {
      menu
        .append("li")
        .append("button")
        .attr("id", `attribute-menu-item-${attribute}`)
        .attr("class", "dropdown-item")
        .attr("type", "button")
        .on("click", () => {
          selectAttribute(attribute);
        })
        .text(toReadable[attribute]);
    }
  });
}

function initAttributes() {
  d3.select(`#attribute-menu-item-${defaultAttribute}`).classed("active", true);
  attributesListAddAttribute(defaultAttribute, attributeColors[defaultAttribute]);
}

function selectAttribute(attribute) {
  let isToggled = d3
    .select(`#attribute-menu-item-${attribute}`)
    .classed("active");

  if (isToggled) {
    removeAttribute(attribute);
  } else {
    addAttribute(attribute);
  }
}

function initMapAttribute() {
  attributesListHighlightAttribute(defaultAttribute);
}

function selectMapAttribute(attribute) {
  if (attribute === mapAttribute) {
    return;
  }

  /* Highlight */
  attributesListHighlightAttribute(mapAttribute);
  attributesListHighlightAttribute(attribute);

  /* Update idioms */
  mapAttribute = attribute;
  updateIdioms();
}

/* Analysis */

function initAnalysis() {
  d3.select(`#analysis-menu-item-${defaultAnalysis}`).classed("active", true);
}

function renderAnalyses() {
  let menu = d3.select("#analysis-menu");
  menu.html("");

  analysisList.forEach((analysis) => {
    menu
      .append("li")
      .append("button")
      .attr("id", `analysis-menu-item-${analysis}`)
      .attr("class", "dropdown-item")
      .attr("type", "button")
      .on("click", () => {
        selectAnalysis(analysis);
      })
      .text(toReadable[analysis]);
  });
}

function selectAnalysis(analysis) {
  let isSelected = d3
    .select(`#analysis-menu-item-${analysis}`)
    .classed("active");

  if (!isSelected) {
    d3.select(`#analysis-menu-item-${selectedAnalysis}`).classed(
      "active",
      false
    );
    d3.select(`#analysis-menu-item-${analysis}`).classed("active", true);
    let oldAnalysis = selectedAnalysis;
    selectedAnalysis = analysis;

    /* Change attributes */
    renderAttributes();
    changeAttributeTypes(oldAnalysis, analysis);
    updateIdioms();
  }
}

function changeAttributeTypes(from, to) {
  if (from == to) {
    return;
  }

  let newAttributes = [];
  selectedAttributes.forEach((attribute) => {
    let newAttribute = attribute.replace(analysisSuffix[from], analysisSuffix[to])
    if (attributesList.includes(newAttribute)) {

      /* Update UI list */
      attributesListChangeAttribute(attribute, newAttribute);

      /* Update UI selection on menu */
      d3.select(`#attribute-menu-item-${newAttribute}`).classed("active", true);

      /* Update internal list */
      newAttributes.push(newAttribute);

      /* Update colors */
      colorChangeAttribute(attribute, newAttribute);
    } else {

      /* Update UI list */
      attributesListRemoveAttribute(attribute);

      /* Update colors */
      freeAttributeColor(attribute);
    }
  })

  /* map attribute */
  // TODO: fix edge case where list can be empty when swapping to PC
  if (!newAttributes.includes(mapAttribute.replace(analysisSuffix[from], analysisSuffix[to]))) {
    mapAttribute = newAttributes[0];
    attributesListHighlightAttribute(mapAttribute);
  }
  else {
    mapAttribute = mapAttribute.replace(analysisSuffix[from], analysisSuffix[to])
  }
  selectedAttributes = newAttributes;
}

/* States */

function renderStates() {
  let menu = d3.select("#state-menu");
  menu.html("");

  stateList.forEach((state) => {
    menu
      .append("li")
      .append("button")
      .attr("id", `state-menu-item-${state}`)
      .attr("class", "dropdown-item")
      .attr("type", "button")
      .on("click", () => {
        selectState(state);
      })
      .text(state);
  });
}

function initStates() {
  d3.select(`#state-menu-item-${defaultState}`).classed("active", true);
  d3.select("#states-list")
    .append("li")
    .attr("id", `states-list-item-${defaultState}`)
    .attr("class", "list-group-item text-light")
    .style("background-color", stateColors[defaultState])
    .style("cursor", "pointer")
    .on("click", () => { removeState(defaultState); })
    .text(defaultState);
}

function selectState(state) {
  if (selectedStates.includes(state)) {
    removeState(state);
  } else {
    addState(state);
  }
}

function addState(state) {
  if (selectedStates.length >= 5) {
    pushToast("Choropleth map", "Can only have up to 5 states selected")
    return;
  }

  d3.select(`button[id="state-menu-item-${state}"]`).classed("active", true);

  /* Add to UI list */
  let color = assignStateColor(state);
  d3.select("#states-list")
    .append("li")
    .attr("id", `states-list-item-${state}`)
    .attr("class", "list-group-item text-light")
    .style("background-color", color)
    .style("cursor", "pointer")
    .on("click", () => { removeState(state); })
    .text(state);

  /* Add highlight */
  let element = d3.select(`path[id="${state}"]`);
  element.node().parentNode.appendChild(element.node());
  element
    .style("stroke", color)
    .style("stroke-width", 3);

  /* Add to internal list */
  selectedStates.push(state);

  /* Update idioms */
  filterDataByState();
  updateLine();
  updateCoordinates();
  updateDot();
}

function removeState(state) {
  if (selectedStates.length <= 1) {
    pushToast("Choropleth map", "Must have at least one state selected")
    return;
  }

  d3.select(`button[id="state-menu-item-${state}"]`).classed("active", false);

  /* Remove from UI list */
  d3.select(`li[id="states-list-item-${state}"]`).remove();
  freeStateColor(state);

  /* Remove highlight */
  d3.select(`path[id="${state}"]`)
    .style("stroke", "white")
    .style("stroke-width", 1);

  /* Remove from internal list */
  selectedStates.splice(selectedStates.indexOf(state), 1);

  /* Recolor states */
  selectedStates.forEach((state) => {
    let element = d3.select(`path[id="${state}"]`)
    element.node().parentNode.appendChild(element.node());
    element.style("stroke", stateColors[state]);
  });

  /* Update idioms */
  filterDataByState();
  updateLine();
  updateCoordinates();
  updateDot();
}

/* Attributes list */

function startAttributesList() {
  new Sortable(d3.select("#attributes-list").node(), {
    animation: 150,
    onUpdate: function (evt) {
      reorderAttribute(evt);
    },
  });
}

function reorderAttributesList(oldIndex, newIndex) {
  attributesList = d3.select(`#attributes-list`).node();
  console.log(attributesList.childNodes);
  attributesList.insertBefore(
    attributesList.childNodes[oldIndex],
    attributesList.childNodes[newIndex]
  );
}

function reorderAttribute(evt) {
  let attribute = selectedAttributes[evt.oldDraggableIndex];
  selectedAttributes.splice(evt.oldDraggableIndex, 1);
  selectedAttributes.splice(evt.newDraggableIndex, 0, attribute);
  if (evt.newDraggableIndex == 0 || evt.oldDraggableIndex == 0) {
    mapAttribute = selectedAttributes[0];
    updateMapLegend();
    updateMap();
  }
}

function addAttribute(attribute) {
  if (selectedAttributes.length >= 5) {
    pushToast("Attribute", "Can only have up to 5 attributes selected");
    return;
  }

  d3.select(`#attribute-menu-item-${attribute}`).classed("active", true);

  /* Add to UI list */
  let color = assignAttributeColor(attribute);
  attributesListAddAttribute(attribute, color);

  /* Update text color on coordinates */
  plotAxis();

  /* Add to internal list */
  selectedAttributes.push(attribute);

  /* Update idioms */
  if (selectedAttributes.length == 1) {
    mapAttribute = selectedAttributes[0];
    updateIdioms();
  } else {
    updateLine();
  }
}

function removeAttribute(attribute) {
  if (selectedAttributes.length <= 1) {
    pushToast("Attribute", "Must have at least one attribute selected");
    return;
  }

  d3.select(`#attribute-menu-item-${attribute}`).classed("active", false);

  /* Remove from UI list */
  attributesListRemoveAttribute(attribute)
  freeAttributeColor(attribute);

  /* Update text color on coordinates */
  plotAxis();

  /* Remove from internal list */
  selectedAttributes.splice(selectedAttributes.indexOf(attribute), 1);

  /* Update idioms */
  if (attribute === mapAttribute) {
    selectMapAttribute(selectedAttributes[0]);
  } else {
    updateLine();
  }
}

function attributesListAddAttribute(attribute, color) {
  d3.select("#attributes-list")
    .append("li")
    .attr("id", `attribute-list-item-${attribute}`)
    .attr("class", "list-group-item text-light")
    .style("background-color", color)
    .style("cursor", "pointer")
    .text(toReadable[attribute])
    .on("click", () => {
      selectMapAttribute(attribute);
    });
}

function attributesListRemoveAttribute(attribute) {
  d3.select(`#attribute-list-item-${attribute}`).remove();
}

function attributesListChangeAttribute(from, to) {
  d3.select(`#attribute-list-item-${from}`)
    .attr("id", `attribute-list-item-${to}`)
    .on("click", () => {
      selectMapAttribute(to);
    });
}

function attributesListHighlightAttribute(attribute) {
  let item = d3.select(`#attribute-list-item-${attribute}`);
  if (!item.empty()) {
    item.classed("highlighted", !item.classed("highlighted"));
  }
}
