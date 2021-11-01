const data_source = "data/data.csv";
const map_source = "data/states.json";
const maxYear = 2015;
const minYear = 1992;
const defaultAttribute = "TOTAL_EXPENDITURE";
const attributes = [
  "TOTAL_REVENUE",
  "TOTAL_REVENUE_PC",
  "TOTAL_REVENUE_PCT",
  "FEDERAL_REVENUE",
  "FEDERAL_REVENUE_PC",
  "FEDERAL_REVENUE_PCT",
  "STATE_REVENUE",
  "STATE_REVENUE_PC",
  "STATE_REVENUE_PCT",
  "LOCAL_REVENUE",
  "LOCAL_REVENUE_PC",
  "LOCAL_REVENUE_PCT",
  "TOTAL_EXPENDITURE",
  "TOTAL_EXPENDITURE_PC",
  "TOTAL_EXPENDITURE_PCT",
  "INSTRUCTION_EXPENDITURE",
  "INSTRUCTION_EXPENDITURE_PC",
  "INSTRUCTION_EXPENDITURE_PCT",
  "SUPPORT_SERVICES_EXPENDITURE",
  "SUPPORT_SERVICES_EXPENDITURE_PC",
  "SUPPORT_SERVICES_EXPENDITURE_PCT",
  "CAPITAL_OUTLAY_EXPENDITURE",
  "CAPITAL_OUTLAY_EXPENDITURE_PC",
  "CAPITAL_OUTLAY_EXPENDITURE_PCT",
  "ENROLMENT",
  "ENROLMENT_PC",
  "ENROLMENT_PCT",
  "RULING_PARTY",
  "POPULATION",
  "AVERAGE_SCORE",
  "AVERAGE_SCORE_PCT",
  "AM_AVERAGE_SCORE",
  "AM_AVERAGE_SCORE_PCT",
  "AS_AVERAGE_SCORE",
  "AS_AVERAGE_SCORE_PCT",
  "HI_AVERAGE_SCORE",
  "HI_AVERAGE_SCORE_PCT",
  "BL_AVERAGE_SCORE",
  "BL_AVERAGE_SCORE_PCT",
  "WH_AVERAGE_SCORE",
  "WH_AVERAGE_SCORE_PCT",
  "HP_AVERAGE_SCORE",
  "HP_AVERAGE_SCORE_PCT",
  "TR_AVERAGE_SCORE",
  "TR_AVERAGE_SCORE_PCT",
];
const toReadable = {
  TOTAL_REVENUE: "Total Revenue",
  TOTAL_REVENUE_PC: "Total Revenue pc",
  TOTAL_REVENUE_PCT: "Total Revenue %",
  FEDERAL_REVENUE: "Federal Revenue",
  FEDERAL_REVENUE_PC: "Federal Revenue pc",
  FEDERAL_REVENUE_PCT: "Federal Revenue %",
  STATE_REVENUE: "State Revenue",
  STATE_REVENUE_PC: "State Revenue pc",
  STATE_REVENUE_PCT: "State Revenue %",
  LOCAL_REVENUE: "Local Revenue",
  LOCAL_REVENUE_PC: "Local Revenue pc",
  LOCAL_REVENUE_PCT: "Local Revenue %",
  TOTAL_EXPENDITURE: "Total Expenditure",
  TOTAL_EXPENDITURE_PC: "Total Expenditure pc",
  TOTAL_EXPENDITURE_PCT: "Total Expenditure %",
  INSTRUCTION_EXPENDITURE: "Instruction Expenditure",
  INSTRUCTION_EXPENDITURE_PC: "Instruction Expenditure pc",
  INSTRUCTION_EXPENDITURE_PCT: "Instruction Expenditure %",
  SUPPORT_SERVICES_EXPENDITURE: "Suport Services Expenditure",
  SUPPORT_SERVICES_EXPENDITURE_PC: "Suport Services Expenditure pc",
  SUPPORT_SERVICES_EXPENDITURE_PCT: "Support Services Expenditure %",
  CAPITAL_OUTLAY_EXPENDITURE: "Capital Outlay Expenditure",
  CAPITAL_OUTLAY_EXPENDITURE_PC: "Capital Outlay Expenditure pc",
  CAPITAL_OUTLAY_EXPENDITURE_PCT: "Capital Outlay Expenditure %",
  POPULATION: "Population",
  ENROLMENT: "Enrolment",
  ENROLMENT_PC: "Enrolment pc",
  ENROLMENT_PCT: "Enrolment %",
  AVERAGE_SCORE: "Average NAEP Score",
  AVERAGE_SCORE_PCT: "Average NAEP Score %",
  AM_AVERAGE_SCORE: "American Indian NAEP Score",
  AM_AVERAGE_SCORE_PCT: "American Indian NAEP Score %",
  AS_AVERAGE_SCORE: "Asian NAEP Score",
  AS_AVERAGE_SCORE_PCT: "Asian NAEP Score %",
  HI_AVERAGE_SCORE: "Hispanic NAEP Score",
  HI_AVERAGE_SCORE_PCT: "Hispanic NAEP Score %",
  BL_AVERAGE_SCORE: "African American NAEP Score",
  BL_AVERAGE_SCORE_PCT: "African American NAEP Score %",
  WH_AVERAGE_SCORE: "White NAEP Score",
  WH_AVERAGE_SCORE_PCT: "White NAEP Score %",
  HP_AVERAGE_SCORE: "Pacific Islander NAEP Score",
  HP_AVERAGE_SCORE_PCT: "Pacific Islander NAEP Score %",
  TR_AVERAGE_SCORE: "Multi-Race NAEP Score",
  TR_AVERAGE_SCORE_PCT: "Multi-Race NAEP Score %",
};

var selectedYear = minYear;
var selectedState = "Alabama";
var selectedAttributes = [];
var attributeColors = {};
var mapAttribute = defaultAttribute;

var data;
var yearData;
var stateData;
var topology;

function init() {
  Promise.all([d3.csv(data_source), d3.json(map_source)]).then(([d, t]) => {
    data = d;
    topology = t;
    filterDataByYear();
    filterDataByState();

    /* Map */
    initMap();

    /* Line */
    initLine();
  });
  renderAttributes();
  startAttributesList();
}

function filterDataByYear() {
  yearData = data.filter((row) => {
    return row["YEAR"] == selectedYear;
  });
}

function filterDataByState() {
  stateData = data.filter((row) => {
    return row["STATE"] == selectedState;
  });
}

function getRandomColor() {
  var o = Math.round;
  var r = Math.random;
  var s = 255;
  return `rgb(${o(r() * s)}, ${o(r() * s)}, ${o(r() * s)})`;
}

function round(number, decimalPlaces) {
  return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}
