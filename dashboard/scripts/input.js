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
}

function updateYearSlider() {
  selectedYear = d3.select("#slider-input").property("value");
  d3.select("#year-input").property("value", selectedYear);

  filterDataByYear();
  updateMap();
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
      freeColor(attribute);
    }
  })
  selectedAttributes = newAttributes;
  mapAttribute = selectedAttributes[0];
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

  /* Update coordinates goes here */
}

function addAttribute(attribute) {
  if (selectedAttributes.length >= 5) {
    pushToast("Attribute", "Can only have up to 5 attributes selected");
    return;
  }

  d3.select(`#attribute-menu-item-${attribute}`).classed("active", true);

  /* Add to UI list */
  let color = assignColor(attribute);
  attributesListAddAttribute(attribute, color);

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
  freeColor(attribute);

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
  d3.select(`#attribute-list-item-${from}`).attr("id", `attribute-list-item-${to}`);
}

function attributesListHighlightAttribute(attribute) {
  let item = d3.select(`#attribute-list-item-${attribute}`);
  if (!item.empty()) {
    item.classed("highlighted", !item.classed("highlighted"));
  }
}
