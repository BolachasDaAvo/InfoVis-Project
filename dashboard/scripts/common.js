const data_source = "data/data.csv";
const map_source = "data/states.json";
const maxYear = 2015;
const minYear = 1992;
const defaultAnalysis = "GROSS"
const defaultAttribute = "TOTAL_REVENUE_GROSS";
const defaultState = "Florida"
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
  SUPPORT_SERVICES_EXPENDITURE_GROSS: "Support Services Expenditure",
  SUPPORT_SERVICES_EXPENDITURE_PC: "Support Services Expenditure",
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
const toAbbreviated = {
  TOTAL_REVENUE_GROSS: "Revenue",
  TOTAL_REVENUE_PC: "Revenue",
  TOTAL_REVENUE_PCT: "Revenue",
  TOTAL_EXPENDITURE_GROSS: "Expenditure",
  TOTAL_EXPENDITURE_PC: "Expenditure",
  TOTAL_EXPENDITURE_PCT: "Expenditure",
  INSTRUCTION_EXPENDITURE_GROSS: "Instruction",
  INSTRUCTION_EXPENDITURE_PC: "Instruction",
  INSTRUCTION_EXPENDITURE_PCT: "Instruction",
  SUPPORT_SERVICES_EXPENDITURE_GROSS: "Support Services",
  SUPPORT_SERVICES_EXPENDITURE_PC: "Support Services",
  SUPPORT_SERVICES_EXPENDITURE_PCT: "Support Services",
  CAPITAL_OUTLAY_EXPENDITURE_GROSS: "Capital Outlay",
  CAPITAL_OUTLAY_EXPENDITURE_PC: "Capital Outlay",
  CAPITAL_OUTLAY_EXPENDITURE_PCT: "Capital Outlay",
  ENROLMENT_GROSS: "Enrolment",
  ENROLMENT_PC: "Enrolment",
  ENROLMENT_PCT: "Enrolment",
  AVERAGE_SCORE_GROSS: "NAEP Score",
  AVERAGE_SCORE_PCT: "NAEP Score",
}
const stateList = ["Alabama", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
  "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
const stateCodes = {
  "Alabama": "AL",
  "Nebraska": "NE",
  "Alaska": "AK",
  "Nevada": "NV",
  "Arizona": "AZ",
  "New Hampshire": "NH",
  "Arkansas": "AR",
  "New Jersey": "NJ",
  "California": "CA",
  "New Mexico": "NM",
  "Colorado": "CO",
  "New York": "NY",
  "Connecticut": "CT",
  "North Carolina": "NC",
  "Delaware": "DE",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Florida": "FL",
  "Oklahoma": "OK",
  "Georgia": "GA",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Idaho": "ID",
  "Illinois": "IL",
  "Rhode Island": "RI",
  "Indiana": "IN",
  "South Carolina": "SC",
  "Iowa": "IA",
  "South Dakota": "SD",
  "Kansas": "KS",
  "Tennessee": "TN",
  "Kentucky": "KY",
  "Texas": "TX",
  "Louisiana": "LA",
  "Utah": "UT",
  "Maine": "ME",
  "Vermont": "VT",
  "Maryland": "MD",
  "Virginia": "VA",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Washington": "WA",
  "Minnesota": "MN",
  "West Virginia": "WV",
  "Mississippi": "MS",
  "Wisconsin": "WI",
  "Missouri": "MO",
  "Wyoming": "WY",
  "Montana": "MT"
}
var availableAttributeColors = ["#8c564b", "#17becf", "#7f7f7f", "#9467bd"];
var availableStateColors = ["#ff7f0e", "#d62728", "#e377c2", "#bcbd22"]

var selectedYear = maxYear;
var selectedStates = [defaultState];
var selectedAnalysis = defaultAnalysis;
var selectedAttributes = [defaultAttribute];
var attributeColors = {}; attributeColors[defaultAttribute] = "#1f77b4";
var stateColors = {}; stateColors[defaultState] = "#2ca02c";
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

    /* Coordinates */
    initCoordinates();

    /* dot */
    initDot();

    updateIdioms();
    updateDot();
  });
}

/* Colors */
function assignAttributeColor(attribute) {
  let color = availableAttributeColors.pop();
  attributeColors[attribute] = color;
  return color;
}

function freeAttributeColor(attribute) {
  let color = attributeColors[attribute];
  availableAttributeColors.push(color);
  delete attributeColors[attribute];
}

function assignStateColor(state) {
  let color = availableStateColors.pop();
  stateColors[state] = color;
  return color;
}

function freeStateColor(state) {
  let color = stateColors[state];
  availableStateColors.push(color);
  delete stateColors[state];
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
  updateCoordinates();
  updateDot();
}

function highlightState(state) {
  mapHighlightState(state);
  lineHighlightState(state);
  coordinatesHighlightState(state);
  dotHighlightState(state);
}

function resetStateHighlight() {
  mapResetStateHighlight();
  lineResetStateHighlight();
  coordinatesResetStateHighlight();
  dotResetStateHighlight();
}

function round(number, decimalPlaces) {
  return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

function formatNum(number, precision = 3) {
  if (number === null) { return null; }
  if (number === 0) { return "0"; }
  precision = (!precision || precision < 0) ? 0 : precision;
  let b = (number).toPrecision(2).split("e"),
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
    c = k < 1 ? number.toFixed(0 + precision) : (number / Math.pow(10, k * 3)).toFixed(1 + precision),
    d = c < 0 ? c : Math.abs(c),
    e = d + ["", "K", "M", "B", "T"][k];
  return e;
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