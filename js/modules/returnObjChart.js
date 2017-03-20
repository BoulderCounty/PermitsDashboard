var ReturnObjChart = function ReturnObjChart(returnObj, datesArray){
    var chart = c3.generate({
      bindto: '#byDay',
      data: {
        columns: [
            returnObj
        ],
        type: 'bar',
        colors: {
           'Building': 'hsl(205, 70.6%, 41.4%)',
           'Demolition': 'hsl(10, 30.2%, 42.2%)',
           'Electrical': 'hsl(360, 69.2%, 49.6%)',
           'Other': 'hsl(0, 0%, 49.8%)',
           'Mechanical': 'hsl(120, 56.9%, 40.0%)',
           'Roof': 'hsl(30, 100%, 50.2%)',
           'Plumbing': 'hsl(271, 39.4%, 57.3%)' ,
           'Pool/Spa': 'hsl(60, 69.5%, 43.7%)',
           'Fence': 'hsl(186, 80%, 45.1%)',
           'Grading': 'hsl(318, 65.9%, 67.8%)'
        },
        onclick: function (e){console.log('pow')}
      },
      axis: {
          y: {tick : {format: d3.format('d')}},
          x: {
          type: 'category',
          categories: datesArray
        }
      }
  });
};

window.ReturnObjChart = ReturnObjChart;