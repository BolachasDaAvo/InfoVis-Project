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

function renderAttributes() {
  var menu = d3.select("#attribute-menu");

  attributes.forEach((attribute) => {
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
  });
}

function selectAttribute(attribute) {
  isToggled = d3.select(`#attribute-menu-item-${attribute}`).classed("active");

  if (isToggled) {
    removeAttribute(attribute);
  } else {
    addAttribute(attribute);
  }
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

function reorderAttribute(evt) {
  attribute = selectedAttributes[evt.oldDraggableIndex];
  selectedAttributes.splice(evt.oldDraggableIndex, 1);
  selectedAttributes.splice(evt.newDraggableIndex, 0, attribute);
  if (evt.newDraggableIndex == 0 || evt.oldDraggableIndex == 0) {
    mapAttribute = selectedAttributes[0];
    updateMapLegend();
    updateMap();
  }

  /* Update coordinates goes here */
}

function removeAttribute(attribute) {
  d3.select(`#attribute-menu-item-${attribute}`).classed("active", false);

  d3.select(`#attribute-list-item-${attribute}`).remove();

  attributeIndex = selectedAttributes.indexOf(attribute);
  selectedAttributes.splice(attributeIndex, 1);

  if (attributeIndex == 0) {
    if (selectedAttributes.length == 0) {
      mapAttribute = defaultAttribute;
    } else {
      mapAttribute = selectedAttributes[0];
    }
    updateMapLegend();
    updateMap();
  }

  updateLine();
}

function addAttribute(attribute) {
  d3.select(`#attribute-menu-item-${attribute}`).classed("active", true);

  if (!(attribute in attributeColors)) {
    attributeColors[attribute] = getRandomColor();
  }

  d3.select("#attributes-list")
    .append("li")
    .attr("id", `attribute-list-item-${attribute}`)
    .attr("class", "list-group-item text-light grabbable")
		.style("background-color", attributeColors[attribute])
    .text(toReadable[attribute]);

  selectedAttributes.push(attribute);

  if (selectedAttributes.length == 1) {
    mapAttribute = selectedAttributes[0];
    updateMapLegend();
    updateMap();
  }
  updateLine();
}
