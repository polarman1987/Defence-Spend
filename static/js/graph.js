window.onresize = function() {
    location.reload();
}

queue()
   .defer(d3.json, "/spending_data")
   .await(makeGraphs);

function makeGraphs(error, projectsJson) {

    //Adding Responsivness to Graphs
    var mapWidth = $("#countryChartPie").width() /2;
    var mapWidth = $("#countryChartLine").width() /2;
    var mapWidth = $("#countryChartBar").width() /2;
    var mapWidth = $("#countryChartOrdinal").width() /2;

    console.log("mapWidth");


    defenceSpend = projectsJson;

    //Create a Crossfilter instance
    var ndx = crossfilter(defenceSpend);

    var dateFormat = d3.time.format("%Y-%m-%d");
    defenceSpend.forEach(function (d) {
    d["year"] = dateFormat.parse(d["year"]+"-01-01");
    });

    //Define Dimensions

    var countryDim = ndx.dimension(function (d) {
        return d["country"];
    });

    var yearDim = ndx.dimension(function (d) {
        return d["year"];
    });

    //added by Andrew 26/05/2018
    var spendDim = ndx.dimension(function (d) {
        return d["spend"];
    });


    //Calculate metrics
    var totalSpend = countryDim.group().reduceSum(dc.pluck('spend'));
    //Added - 19/05/2018
    var yearSpend = yearDim.group().reduceSum(dc.pluck('spend'));
    //added by Andrew - 26/05/2018
    var spendSpend = spendDim.group().reduceSum(dc.pluck('spend'));


    //Define charts
    var countryChart = dc.pieChart("#countryChartPie");

    //Added by Andrew Nicolaou - 15/05/2018
    var countryChartLine = dc.lineChart("#countryChartLine");

    //Added 19/05/2018
    var minDate = yearDim.bottom(1)[0]["year"];
    var maxDate = yearDim.top(1)[0]["year"];

    //added by Andrew - 26/05/2018
    var countryChartBar = dc.rowChart("#countryChartBar");

    //Added by Andrew - 26/05/2018
    var countryChartOrdinal = dc.lineChart("#countryChartOrdinal");


    //Pie-Chart
    countryChart
        .ordinalColors(["#08b929", "#ee1f0e", "#336eb2", "#aa6dd3", "#f57812"])
        .width(mapWidth)
        .height(250)
        .innerRadius(50)
        .transitionDuration(1600)
        .dimension(countryDim)
        .slicesCap(5)
        .group(totalSpend)
        .legend(dc.legend().x(700).y(30).gap(10));


    //Bar Chart added by Andrew - 26/05/2018
    countryChartBar
        .ordinalColors(["#08b929", "#ee1f0e", "#336eb2", "#aa6dd3", "#f57812"])
        .width(mapWidth)
        .height(220)
        .transitionDuration(1600)
        .dimension(countryDim)
        .group(totalSpend)
        .xAxis().ticks(10);


    //Added by Andrew - 26/05/2018
    countryChartOrdinal
        .ordinalColors(["#f5182f"])
        .width(mapWidth)
        .height(220)
        .margins({top: 10, right: 30, bottom: 30, left: 60})
        .dimension(yearDim)
        .group(yearSpend)
        .renderArea(false)
        .transitionDuration(1600)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .yAxis().ticks(8);

    //Added by Andrew Nicolaou - 15/05/2018
    //Line-Chart
    countryChartLine
        .ordinalColors(["#1706c9"])
        .width(mapWidth)
        .height(220)
        .margins({top: 30, right: 30, bottom: 30, left: 60})
        .dimension(yearDim)
        .group(yearSpend)
        .renderArea(true)
        .transitionDuration(1600)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .yAxis().ticks(10);

    dc.renderAll();
}