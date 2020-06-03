// Get data 

d3.csv("/data/SteelTimber1.csv").then(function (cities) {
  console.log("cities", cities[0]);

  // *** Get unique values to use in drop down menus 
  var uniqueOption = [... new Set(cities.map(a => a.Option))]
  var uniqueID = [... new Set(cities.map(a => a.ID))]
  var uniquePrimarySpan = [... new Set(cities.map(a => a['Primary beam span (m)']))]
  var uniqueSecondarySpan = [... new Set(cities.map(a => a['Secondary beam span (m)']))]
  var uniqueBeamDepth = [... new Set(cities.map(a => a['Beam Depth']))]

    // *** Set Slider range to number of options 
  $(document).ready(function () {
    $("#customRange1").attr("max", uniquePrimarySpan.length - 1);
    $("#customRange2").attr("max", uniqueSecondarySpan.length - 1);
    $("#customRange3").attr("max", uniqueBeamDepth.length - 1);
  });

  function myDashboard() {

    var primarySelected = document.getElementById('output1').innerHTML = uniquePrimarySpan[$("#customRange1").val()];
    var secondarySelected = document.getElementById('output2').innerHTML = uniqueSecondarySpan[$("#customRange2").val()];
    var beamDepthSelected = document.getElementById('output3').innerHTML = uniqueBeamDepth[$("#customRange3").val()];

    // filter data based on dropdown menu value 
    var filteredData1 = cities.filter(function (obj) {
      return (obj['Primary beam span (m)'] == primarySelected) && (obj['Secondary beam span (m)'] == secondarySelected) && (obj['Beam Depth'] == beamDepthSelected);
      //return (obj['ID'] == IDSelected);
    });

    // get subset of data to graph from filtered data 
    var xdata = filteredData1.map(a => a.Option);
    var totalCarbon = filteredData1.map(a => a['Total Embodied Carbon [kgCO2e/m2]']);
    var timberCarbon = filteredData1.map(a => a['Timber Embodied Carbon [kgCO2e/m2] ']);
    var steelCarbon = filteredData1.map(a => a['Steel Embodied Carbon [kgCO2e/m2]']);
    var reinforcementCarbon = filteredData1.map(a => a['Reinforcement Embodied Carbon [kgCO2e/m2] ']);
    var concreteCarbon = filteredData1.map(a => a['Concrete Embodied Carbon [kgCO2e/m2] ']);
    var foundationsCarbon = filteredData1.map(a => a['Foundations Embodied Carbon [kgCO2e/m2] ']);

    // Graph of total embodied carbon for 1 option 
    var plotly1Data = [
      {
        x: xdata,
        y: totalCarbon,
        type: 'bar'
      }
    ];
    Plotly.newPlot('Plotly1', plotly1Data, {yaxis: {title: 'Embodied Carbon (kgCO2e/m2)'},});

    // breakdown of embodied carbon by material 
    var trace1 = { x: xdata, y: timberCarbon, name: 'Timber', type: 'bar' };
    var trace2 = { x: xdata, y: steelCarbon, name: 'Steel', type: 'bar' };
    var trace3 = { x: xdata, y: reinforcementCarbon, name: 'Reinforcement', type: 'bar' };
    var trace4 = { x: xdata, y: concreteCarbon, name: 'Concrete', type: 'bar' };
    var trace5 = { x: xdata, y: foundationsCarbon, name: 'Foundations', type: 'bar' };

    Plotly.newPlot('Plotly2', [trace2, trace3, trace4, trace5, trace1], {yaxis: {title: 'Embodied Carbon (kgCO2e/m2)'}, barmode: 'relative'});
}

  myDashboard()

  // *** When User Inputs  gets changed: 
  $(".form-control, .custom-range").change(function () {
    myDashboard()
  });

  // Convert data into 1D Arrays 
  var xdata = cities.map(a => a.ID);
  var ydata = cities.map(a => a['Total Embodied Carbon [kgCO2e/m2]']);

  // Create Plotly Overview Chart 
  var data2 = [
    {
      x: xdata,
      y: ydata,
      type: 'bar'
    }
  ];

  Plotly.newPlot('myDiv', data2, {yaxis: {title: 'Embodied Carbon (kgCO2e/m2)'},});

});