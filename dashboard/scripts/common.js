const data_source = "data/data.csv";
const map_source = "data/states.json";
const maxYear = 2015;
const minYear = 1992;
const defaultAnalysis = "GROSS"
const defaultAttribute = "TOTAL_REVENUE_GROSS";
const analysisList = [
  "GROSS",
  "PER_CAPITA",
  "PERCENTUAL_CHANGE"
]
const analysisSuffix = {
  GROSS: "_GROSS",
  PER_CAPITA: "_PC",
  PERCENTUAL_CHANGE: "_PCT"
}
const attributesList = [
  "TOTAL_REVENUE_GROSS",
  "TOTAL_REVENUE_PC",
  "TOTAL_REVENUE_PCT",
  "FEDERAL_REVENUE_GROSS",
  "FEDERAL_REVENUE_PC",
  "FEDERAL_REVENUE_PCT",
  "STATE_REVENUE_GROSS",
  "STATE_REVENUE_PC",
  "STATE_REVENUE_PCT",
  "LOCAL_REVENUE_GROSS",
  "LOCAL_REVENUE_PC",
  "LOCAL_REVENUE_PCT",
  "TOTAL_EXPENDITURE_GROSS",
  "TOTAL_EXPENDITURE_PC",
  "TOTAL_EXPENDITURE_PCT",
  "INSTRUCTION_EXPENDITURE_GROSS",
  "INSTRUCTION_EXPENDITURE_PC",
  "INSTRUCTION_EXPENDITURE_PCT",
  "SUPPORT_SERVICES_EXPENDITURE_GROSS",
  "SUPPORT_SERVICES_EXPENDITURE_PC",
  "SUPPORT_SERVICES_EXPENDITURE_PCT",
  "CAPITAL_OUTLAY_EXPENDITURE_GROSS",
  "CAPITAL_OUTLAY_EXPENDITURE_PC",
  "CAPITAL_OUTLAY_EXPENDITURE_PCT",
  "ENROLMENT_GROSS",
  "ENROLMENT_PC",
  "ENROLMENT_PCT",
  "AVERAGE_SCORE_GROSS",
  "AVERAGE_SCORE_PCT",
  "AM_AVERAGE_SCORE_GROSS",
  "AM_AVERAGE_SCORE_PCT",
  "AS_AVERAGE_SCORE_GROSS",
  "AS_AVERAGE_SCORE_PCT",
  "HI_AVERAGE_SCORE_GROSS",
  "HI_AVERAGE_SCORE_PCT",
  "BL_AVERAGE_SCORE_GROSS",
  "BL_AVERAGE_SCORE_PCT",
  "WH_AVERAGE_SCORE_GROSS",
  "WH_AVERAGE_SCORE_PCT",
  "TR_AVERAGE_SCORE_GROSS",
  "TR_AVERAGE_SCORE_PCT",
];
const toReadable = {
  GROSS: "Gross",
  PER_CAPITA: "Per capita",
  PERCENTUAL_CHANGE: "Percentual change",
  TOTAL_REVENUE_GROSS: "Total Revenue",
  TOTAL_REVENUE_PC: "Total Revenue",
  TOTAL_REVENUE_PCT: "Total Revenue",
  FEDERAL_REVENUE_GROSS: "Federal Revenue",
  FEDERAL_REVENUE_PC: "Federal Revenue",
  FEDERAL_REVENUE_PCT: "Federal Revenue",
  STATE_REVENUE_GROSS: "State Revenue",
  STATE_REVENUE_PC: "State Revenue",
  STATE_REVENUE_PCT: "State Revenue",
  LOCAL_REVENUE_GROSS: "Local Revenue",
  LOCAL_REVENUE_PC: "Local Revenue",
  LOCAL_REVENUE_PCT: "Local Revenue",
  TOTAL_EXPENDITURE_GROSS: "Total Expenditure",
  TOTAL_EXPENDITURE_PC: "Total Expenditure",
  TOTAL_EXPENDITURE_PCT: "Total Expenditure",
  INSTRUCTION_EXPENDITURE_GROSS: "Instruction Expenditure",
  INSTRUCTION_EXPENDITURE_PC: "Instruction Expenditure",
  INSTRUCTION_EXPENDITURE_PCT: "Instruction Expenditure",
  SUPPORT_SERVICES_EXPENDITURE_GROSS: "Suport Services Expenditure",
  SUPPORT_SERVICES_EXPENDITURE_PC: "Suport Services Expenditure",
  SUPPORT_SERVICES_EXPENDITURE_PCT: "Support Services Expenditure",
  CAPITAL_OUTLAY_EXPENDITURE_GROSS: "Capital Outlay Expenditure",
  CAPITAL_OUTLAY_EXPENDITURE_PC: "Capital Outlay Expenditure",
  CAPITAL_OUTLAY_EXPENDITURE_PCT: "Capital Outlay Expenditure",
  ENROLMENT_GROSS: "Enrolment",
  ENROLMENT_PC: "Enrolment",
  ENROLMENT_PCT: "Enrolment",
  AVERAGE_SCORE_GROSS: "Average NAEP Score",
  AVERAGE_SCORE_PCT: "Average NAEP Score",
  AM_AVERAGE_SCORE_GROSS: "American Indian NAEP Score",
  AM_AVERAGE_SCORE_PCT: "American Indian NAEP Score",
  AS_AVERAGE_SCORE_GROSS: "Asian NAEP Score",
  AS_AVERAGE_SCORE_PCT: "Asian NAEP Score",
  HI_AVERAGE_SCORE_GROSS: "Hispanic NAEP Score",
  HI_AVERAGE_SCORE_PCT: "Hispanic NAEP Score",
  BL_AVERAGE_SCORE_GROSS: "African American NAEP Score",
  BL_AVERAGE_SCORE_PCT: "African American NAEP Score",
  WH_AVERAGE_SCORE_GROSS: "White NAEP Score",
  WH_AVERAGE_SCORE_PCT: "White NAEP Score",
  TR_AVERAGE_SCORE_GROSS: "Multi-Race NAEP Score",
  TR_AVERAGE_SCORE_PCT: "Multi-Race NAEP Score",
};
var availableColors = ["#27aeef", "#87bc45", "#ef9b20", "#b33dc6"];

var selectedYear = minYear;
var selectedStates = ["Alabama"];
var selectedAnalysis = defaultAnalysis;
var selectedAttributes = [defaultAttribute];
var attributeColors = {}; attributeColors[defaultAttribute] = "#e60049";
var mapAttribute = defaultAttribute;

var data;
var yearData;
var stateData = {};
var topology;

function init() {
  Promise.all([d3.csv(data_source), d3.json(map_source)]).then(([d, t]) => {
    renderAnalyses();
    initAnalysis();
    renderAttributes();
    initAttributes();
    initMapAttribute();
    // startAttributesList();

    data = d;
    topology = t;
    filterDataByYear();
    filterDataByState();

    /* Map */
    initMap();

    /* Line */
    initLine();

    updateIdioms();
  });
}

/* Colors */
function assignColor(attribute) {
  let color = availableColors.pop();
  attributeColors[attribute] = color;
  return color;
}

function freeColor(attribute) {
  let color = attributeColors[attribute];
  availableColors.push(color);
  delete attributeColors[attribute];
}

function colorChangeAttribute(from, to) {
  attributeColors[to] = attributeColors[from];
  delete attributeColors[from];
}

function getRandomColor() {
  let o = Math.round;
  let r = Math.random;
  let s = 255;
  return `rgb(${o(r() * s)}, ${o(r() * s)}, ${o(r() * s)})`;
}

/* Utils */
function filterDataByYear() {
  yearData = data.filter((row) => {
    return row["YEAR"] == selectedYear;
  });
}

function filterDataByState() {
  stateData = {}
  selectedStates.forEach(state => {
    stateData[state] = data.filter((row) => {
      return row["STATE"] == state;
    });
  });
}

function updateIdioms() {
  updateMapLegend();
  updateMap();
  updateLine();
}

function round(number, decimalPlaces) {
  return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

var toastCounter = 0;
function pushToast(header, message) {

  let toastId = `toast-${toastCounter}`
  let newToast = d3.select("#toast-list")
    .append("div")
    .attr("id", toastId)
    .attr("class", "toast")
    .attr("role", "alert")
    .attr("aria-live", "assertive")
    .attr("aria-atomic", "true")
    .style("display", "block")
    .style("opacity", 0)
    .style("z-index", 10)
    .html(`
        <div class="toast-header">
          <strong class="me-auto">${header}</strong>
          <button type="button" class="btn-close" onclick="deleteToast('${toastId}')"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
    `);
  newToast.transition().duration(250).style("opacity", 1);
  setTimeout(fadeOutToast, 5 * 1000, toastId)
  toastCounter += 1;
}

function deleteToast(id) {
  let toastToRemove = d3.select(`#${id}`)
  if (!toastToRemove.empty()) {
    toastToRemove.remove();
  }
}

function fadeOutToast(id) {
  let toastToRemove = d3.select(`#${id}`)
  if (!toastToRemove.empty()) {
    toastToRemove.transition().duration(1000).style("opacity", 0).on("end", () => toastToRemove.remove());
  }
}