const maxYear = 2015;
const minYear = 1992;
var year = minYear;
var attributes = ["Total Investment", "Total Revenue", "Enrolment"]

function updateYearInput() {
    year = d3.select("#year-input").property("value");
    if (year > maxYear) {
        year = maxYear;
    }
    if (year < minYear) {
        year = minYear;
    }
    d3.select("#slider-input").property("value", year);
    updateMap(year)
}

function updateYearSlider() {
    year = d3.select("#slider-input").property("value");
    d3.select("#year-input").property("value", year);
    updateMap(year)
}

function renderAttributes() {
    var menu = d3.select("#attribute-menu");

    attributes.forEach(attribute => {
        menu.append("li")
            .append("button")
            .attr("id", attribute)
            .attr("class", "dropdown-item")
            .attr("type", "button")
            .on("click", () => {
                selectAttribute(attribute);
            })
            .text(attribute);
    });
}

function selectAttribute(attribute) {
    button = d3
        .select(`button[id='${attribute}']`);

    isToggled = button
        .classed("active");

    if (isToggled) {
        button.classed("active", false);
    }
    else {
        button.classed("active", true);
    }
}


/* Attributes list */
function startAttributesList() {
    new Sortable(d3.select("#attributes-list").node(), {
        animation: 150,
    });
}
