const maxYear = 2015;
const minYear = 1992;
var year = minYear;
var attributes = [
  "TOTAL_REVENUE",
  "TOTAL_REVENUE_PCT",
  "FEDERAL_REVENUE",
  "FEDERAL_REVENUE_PCT",
  "STATE_REVENUE",
  "STATE_REVENUE_PCT",
  "LOCAL_REVENUE",
  "LOCAL_REVENUE_PCT",
  "TOTAL_EXPENDITURE",
  "TOTAL_EXPENDITURE_PCT",
  "INSTRUCTION_EXPENDITURE",
  "INSTRUCTION_EXPENDITURE_PCT",
  "SUPPORT_SERVICES_EXPENDITURE",
  "SUPPORT_SERVICES_EXPENDITURE_PCT",
  "CAPITAL_OUTLAY_EXPENDITURE",
  "CAPITAL_OUTLAY_EXPENDITURE_PCT",
  "ENROLMENT",
  "ENROLMENT_PCT",
  "RULING_PARTY",
  "POPULATION",
  "AVERAGE_SCORE",
  "AM_AVERAGE_SCORE",
  "AS_AVERAGE_SCORE",
  "HI_AVERAGE_SCORE",
  "BL_AVERAGE_SCORE",
  "WH_AVERAGE_SCORE",
  "HP_AVERAGE_SCORE",
  "TR_AVERAGE_SCORE",
];
var toReadable = {
  TOTAL_REVENUE: "Total Revenue",
  TOTAL_REVENUE_PCT: "Total Revenue %",
  FEDERAL_REVENUE: "Federal Revenue",
  FEDERAL_REVENUE_PCT: "Federal Revenue %",
  STATE_REVENUE: "State Revenue",
  STATE_REVENUE_PCT: "State Revenue %",
  LOCAL_REVENUE: "Local Revenue",
  LOCAL_REVENUE_PCT: "Local Revenue %",
  TOTAL_EXPENDITURE: "Total Expenditure",
  TOTAL_EXPENDITURE_PCT: "Total Expenditure %",
  INSTRUCTION_EXPENDITURE: "Instruction Expenditure",
  INSTRUCTION_EXPENDITURE_PCT: "Instruction Expenditure %",
  SUPPORT_SERVICES_EXPENDITURE: "Suport Services Expenditure",
  SUPPORT_SERVICES_EXPENDITURE_PCT: "Support Services Expenditure %",
  CAPITAL_OUTLAY_EXPENDITURE: "Capital Outlay Expenditure",
  CAPITAL_OUTLAY_EXPENDITURE_PCT: "Capital Outlay Expenditure %",
  POPULATION: "Population",
  ENROLMENT: "Enrolment",
  ENROLMENT_PCT: "Enrolment %",
  AVERAGE_SCORE: "Average NAEP Score",
  AM_AVERAGE_SCORE: "American Indian NAEP Score",
  AS_AVERAGE_SCORE: "Asian NAEP Score",
  HI_AVERAGE_SCORE: "Hispanic NAEP Score",
  BL_AVERAGE_SCORE: "African American NAEP Score",
  WH_AVERAGE_SCORE: "White NAEP Score",
  HP_AVERAGE_SCORE: "Pacific Islander NAEP Score",
  TR_AVERAGE_SCORE: "Multi-Race NAEP Score",
};
var selectedAttributes = [];

function updateYearInput() {
  year = d3.select("#year-input").property("value");
  if (year > maxYear) {
    year = maxYear;
  }
  if (year < minYear) {
    year = minYear;
  }
  d3.select("#slider-input").property("value", year);
  updateMap(year);
}

function updateYearSlider() {
  year = d3.select("#slider-input").property("value");
  d3.select("#year-input").property("value", year);
  updateMap(year);
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
      attribute = selectedAttributes.pop(evt.oldDraggableIndex);
      selectedAttributes.splice(evt.newDraggableIndex, 0, attribute);
      if (evt.oldDraggableIndex == 0) {
        /* Update Map goes here */
      }
      /* Update coordinates goes here */
    },
  });
}

function removeAttribute(attribute) {
  d3.select(`#attribute-menu-item-${attribute}`).classed("active", false);

  d3.select(`#attribute-list-item-${attribute}`).remove();

  selectedAttributes = selectedAttributes.filter((x, i) => {
    return x != attribute;
  });
}

function addAttribute(attribute) {
  d3.select(`#attribute-menu-item-${attribute}`).classed("active", true);

  d3.select("#attributes-list")
    .append("li")
    .attr("id", `attribute-list-item-${attribute}`)
    .attr("class", "list-group-item grabbable")
    .text(toReadable[attribute]);

  selectedAttributes.push(attribute);
}
