// SET GLOBAL VARIABLES

var permitsResourceId = "d914e871-21df-4800-a473-97a2ccdf9690";
var inspectionsResourceId = "";
var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
var selVar;
var subtype="";
var returnedObj="";
var toggleSubtype=[];
var toggleSubtypeDate=[];
var d={};
d['id']="";
// var fullerStartDate = 1826;
var fullerStartDate = 1826;
var PermitDashboard = window.PermitDashboard || {};

var url = window.location.href;    
if (url.indexOf('?') !== -1){
  selVar=location.search.slice(1);

  console.log(selVar);
}else{
     var initialStartDate = 365;
}


var fullStartDate = moment().subtract(fullerStartDate, 'd').startOf('month').format("YYYY-MM-DD");
var startDate = moment().subtract(initialStartDate, 'd').startOf('month').format("YYYY-MM-DD");
var startDateMoment = moment().subtract(initialStartDate, 'd').startOf('month');
var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + fullStartDate + "' group by \"PermitTypeMapped\" order by Count desc";
var permitTypesQue = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));

/********************************************************************************/
/* Get all activity in last year - DATA GRAB (START) // original data grab
/********************************************************************************/



      // set up SQL query string
var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + fullStartDate + "' order by \"AppliedDate\"";
      // encode URL
var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));


$(document).ready(function() {
  verify(selVar);
});


var verify = function(selVar){

  PermitDashboard.cache = {};

  // Grab dropdown length of data to "breakdown"
  initialStartDate = (selVar || 12);
  
  requestJSON(urlLast365, function(json) {

    var records = json.result.records;

    records.forEach(function(record, inc, array) {
      record.ShortAppliedDate = moment(record.AppliedDate).format('MMM-YY');
    })

    PermitDashboard.cache.last365 = {
    records: records,
    url: urlLast365
    };

    var appliedLast365Days = SummaryBoxes(records);

    /********************************************************************************/
    /* Load recent permit applications (Start)
    /********************************************************************************/
    
    var permitsToLoad = 10;
    var totalPermits = appliedLast365Days.length-1;
    var permitStart = 1
    
    for (var i = totalPermits; i > totalPermits - 100; i--) {
      $("#recent" + permitStart).attr("href", appliedLast365Days[i].Link);
      $("#permit" + permitStart).text(appliedLast365Days[i].PermitNum);
      $("#address" + permitStart).text(appliedLast365Days[i].OriginalAddress1);
      permitStart++;
    }

    /********************************************************************************/
    /* Load recent permit applications (END)
    /********************************************************************************/
    
    /********************************************************************************/
    /* Calculated permits applied for by day and by type (START)
    /********************************************************************************/

    // (A) creates the data object
    // FURTHER DESCRIPTION NECESSARY {key_Month : [ {key_type : numb }]}
    
    var appliedByDayByType = typeAndMonthBreakout(appliedLast365Days);

    var types = [ "Building", "Roof", "Mechanical", "Electrical", "Plumbing", "Demolition", "Grading", "Other", "Pool/Spa", "Fence"];

    var output = {};

    types.forEach(function(type) {
      output[type] = appliedByDayByType.map(function(month) {
          var o = {};
          o[month.key] = month.values.filter(function(val) {
            return val.key == type;
          }).map(function(m) { return m.values; }).shift() || 0;
          return o;
        })
    }); 

    // (D) Enumerates each month
    // (E) initiates array of months
    // (F) Throws a blank into each arrays month if there were no records

    var months = appliedByDayByType.map(function(month) {
      return month.key;
    });

    // (G) push the value into the type-labeled array
  
    var columnData = Object.keys(output).map(function(type) {
        var a = output[type].map(function(month){
          return month[Object.keys(month)[0]];
        });
        return [type].concat(a);
      })


    // (H) create the bar chart with months and types breakdown
    console.log(columnData);
    console.log(months);

    plotBarChart(columnData, months);

    /********************************************************************************/
    /* Calculated permits applied for by day and by type (END)
    /********************************************************************************/
    
  });
  /********************************************************************************/
  /* Get all permit details in last 30 days (END)
  /********************************************************************************/
 
}

  /********************************************************************************/
  /* Permits by type (START)
  /********************************************************************************/ 

    
requestJSON(permitTypesQue, function(json) {
  var records = json.result.records    

  var permitTypes = [];

  //Get a distinct list of neighborhoods
  for (var i = 0; i < records.length; i++) {
    permitTypes.push([records[i]["PermitTypeMapped"], records[i].count]);
  }

  var chart = c3.generate({
    bindto: '#permitTypes',
    data: {
      columns: permitTypes,
      type : 'donut',
      onclick: function (d, i){SelectPieClick(d, i, urlLast365, fullStartDate)}
/*      function (d, i) {
        console.log("onmouseover", d.id, i);
        requestJSON(urlLast365, function(json) {
            var records = json.result.records;
            //extract permits applied for in last 7 days
            var appliedLast365Days = records.filter(function(d) { 
              return moment(d.AppliedDate) > shortStartDateMoment; 
            });
            
            //extract permits issued in last 7 days
            var issuedLast365Days = records.filter(function(d) { 
              return moment(d.IssuedDate) > shortStartDateMoment; 
            });

            console.log(d);

            switch(d.id) {

              case "Building":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === "Building";
                });
                break;

              case "Electrical":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === "Electrical";
                });
                break;

              case "Plumbing":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === "Plumbing";
                });
                break;

              case "Mechanical":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  console.log("ERROR2!");
                  return o.PermitTypeMapped === "Mechanical";
                });
                break;

              case "Roof":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  console.log("ERROR!")
                  return o.PermitTypeMapped === "Roof";
                });
                break;

              case "Grading":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === "Grading";
                });
                break;

              case "Demolition":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === "Demolition";
                });
                break;

              case "Pool/Spa":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === "Pool/Spa";
                });
                break;

              case "Fence":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === "Fence";
                });
                break;

              case "Other":
                var appliedLastWeek = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === "Other";
                });
                break;
            }
            
            var appliedByDayByType = [];
            var appliedByDayByType = d3.nest()
              .key(function(d) { return d.AppliedDate })
              .key(function(d) { return d.PermitTypeMapped })
              .rollup (function(v) { return v.length })
              .entries(appliedLastWeek);

            console.log(appliedByDayByType);
            


            var bld = ['Building'];
            var demo = ['Demolition'];
            var ele = ['Electrical'];
            var other = ['Other'];
            var mech = ['Mechanical'];
            var plm = ['Plumbing'];
            var psp = ['Pool/Spa'];
            var fnc = ['Fence'];
            var roof = ['Roof'];
            var datesArray = [];
            var bldAdded = false, demoAdded = false, eleAdded = false, otherAdded = false, mechAdded = false, plmAdded = false;
            var tempArray = [];

            appliedByDayByType.forEach(function(d) {

              console.log(d);

              var dArray = d.key;
              datesArray.push(dArray);

              bldAdded = false;
              demoAdded = false;
              eleAdded = false;
              otherAdded = false;
              mechAdded = false;
              plmAdded = false;
              pspAdded = false;
              fncAdded = false;
              roofAdded = false;

              d.values.forEach(function(i) {
                
                if (i.key == "Building") {
                  bld.push(i.values);
                  bldAdded = true;
                }
                if (i.key == "Demolition") {
                  demo.push(i.values);
                  demoAdded = true;
                }
                if (i.key == "Electrical") {
                  ele.push(i.values);
                  eleAdded = true;
                }
                if (i.key == "Other") {
                  other.push(i.values);
                  otherAdded = true;
                }
                if (i.key == "Mechanical") {
                  mech.push(i.values);
                  mechAdded = true;
                }
                if (i.key == "Plumbing") {
                  plm.push(i.values);
                  plmAdded = true;    
                }
                if (i.key == "Roof") {
                  roof.push(i.values);
                  roofAdded = true;    
                }
                if (i.key == "Pool/Spa") {
                  psp.push(i.values);
                  pspAdded = true;    
                }
                if (i.key == "Fence") {
                  fnc.push(i.values);
                  fncAdded = true;    
                }

              });

              if (!bldAdded)
                bld.push(0);
              if (!demoAdded)
                demo.push(0);
              if (!eleAdded)
                ele.push(0);
              if (!mechAdded)
                mech.push(0);
              if (!otherAdded)
                other.push(0);
              if (!plmAdded)
                plm.push(0);
              if (!roofAdded)
                roof.push(0);
              if (!fncAdded)
                fnc.push(0);
              if (!pspAdded)
                psp.push(0);
          
            });

          console.log(d);

          // switch
          switch (d.id){

            case 'Building':
              var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      bld
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
            break;


            case 'Roof':
              var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      roof
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
            break;

            case 'Fence':
              var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      fnc
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
            break;

            case 'Demolition':
              var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      demo
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
            break;

            case 'Electrical':
              var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      ele
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
             break;

             case 'Other':
             var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      other
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
             break;

             case 'Mechanical':
             var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      mech
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
            break;

            case 'Plumbing':
              var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      plm
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
            break;

            case 'Pool/Spa':
              var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      psp
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
            break;

            case 'Roof':
              var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      roof
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });
            break;

          };

            $('#toggleWrollover').text(' Applications by Day ');
        });
      }
    },
    legend: {
        item: {
          onmouseover: function (id) {
            console.log("onmouseover", id);
            requestJSON(urlLast30, function(json) {
              var records = json.result.records;
              //extract permits applied for in last 7 days
              var appliedLast30Days = records.filter(function(d) { 
                return moment(d.AppliedDate) > shortStartDateMoment; 
              });
              
              //extract permits issued in last 7 days
              var issuedLast30Days = records.filter(function(d) { 
                return moment(d.IssuedDate) > shortStartDateMoment; 
              });

              console.log(id);

              switch(id) {

                case "Building":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    return o.PermitTypeMapped === "Building";
                  });
                  break;

                case "Electrical":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    return o.PermitTypeMapped === "Electrical";
                  });
                  break;

                case "Plumbing":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    return o.PermitTypeMapped === "Plumbing";
                  });
                  break;

                case "Mechanical":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    console.log("ERROR2!");
                    return o.PermitTypeMapped === "Mechanical";
                  });
                  break;

                case "Roof":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    console.log("ERROR!")
                    return o.PermitTypeMapped === "Roof";
                  });
                  break;

                case "Grading":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    return o.PermitTypeMapped === "Grading";
                  });
                  break;

                case "Demolition":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    return o.PermitTypeMapped === "Demolition";
                  });
                  break;

                case "Pool/Spa":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    return o.PermitTypeMapped === "Pool/Spa";
                  });
                  break;

                case "Fence":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    return o.PermitTypeMapped === "Fence";
                  });
                  break;

                case "Other":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
                    return o.PermitTypeMapped === "Other";
                  });
                  break;
                }
            
            var appliedByDayByType = [];
            var appliedByDayByType = d3.nest()
              .key(function(d) { return d.AppliedDate })
              .key(function(d) { return d.PermitTypeMapped })
              .rollup (function(v) { return v.length })
              .entries(appliedLastWeek);

            var bld = ['Building'];
            var demo = ['Demolition'];
            var ele = ['Electrical'];
            var other = ['Other'];
            var mech = ['Mechanical'];
            var plm = ['Plumbing'];
            var psp = ['Pool/Spa'];
            var fnc = ['Fence'];
            var roof = ['Roof'];
            var datesArray = [];
            var bldAdded = false, demoAdded = false, eleAdded = false, otherAdded = false, mechAdded = false, plmAdded = false;
            var tempArray = [];

            appliedByDayByType.forEach(function(d) {

              console.log(d);

              var dArray = d.key;
              datesArray.push(dArray);

              bldAdded = false;
              demoAdded = false;
              eleAdded = false;
              otherAdded = false;
              mechAdded = false;
              plmAdded = false;
              pspAdded = false;
              fncAdded = false;
              roofAdded = false;

              d.values.forEach(function(i) {
                
                if (i.key == "Building") {
                  bld.push(i.values);
                  bldAdded = true;
                }
                if (i.key == "Demolition") {
                  demo.push(i.values);
                  demoAdded = true;
                }
                if (i.key == "Electrical") {
                  ele.push(i.values);
                  eleAdded = true;
                }
                if (i.key == "Other") {
                  other.push(i.values);
                  otherAdded = true;
                }
                if (i.key == "Mechanical") {
                  mech.push(i.values);
                  mechAdded = true;
                }
                if (i.key == "Plumbing") {
                  plm.push(i.values);
                  plmAdded = true;    
                }
                if (i.key == "Roof") {
                  roof.push(i.values);
                  roofAdded = true;    
                }
                if (i.key == "Pool/Spa") {
                  psp.push(i.values);
                  pspAdded = true;    
                }
                if (i.key == "Fence") {
                  fnc.push(i.values);
                  fncAdded = true;    
                }

              });

              if (!bldAdded)
                bld.push(0);
              if (!demoAdded)
                demo.push(0);
              if (!eleAdded)
                ele.push(0);
              if (!mechAdded)
                mech.push(0);
              if (!otherAdded)
                other.push(0);
              if (!plmAdded)
                plm.push(0);
              if (!roofAdded)
                roof.push(0);
              if (!fncAdded)
                fnc.push(0);
              if (!pspAdded)
                psp.push(0);
          
            });



          var chart = c3.generate({
                bindto: '#byDay',
                data: {
                  columns: [
                      bld,
                      demo,
                      ele,
                      other,
                      mech,
                      plm,
                      roof,
                      fnc,
                      psp
                  ],
                  type: 'bar'//,
                  //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                },
                grid: {
                  y: {
                    lines: [{value:0}]
                  }
                },
                axis: {
                  x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });

            // console.log(appliedLast7Days);
        });
        console.log('works!')}
          }
        */
        },

    donut: {
     title :  'rollover for breakdown'
    }   
  }) 
          console.log(chart.select(this));
          console.log(this);
          // label.html('');   
});

/********************************************************************************/
/* Permits by type (END)
/********************************************************************************/ 


function forceDelay(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); } 
    while (curDate - date < millis);
}

// Small function that breaks down yearly dataset by type and by month

function typeAndMonthBreakout(appliedLast365Days){
    var appliedByDayByType = d3.nest()
    .key(function(d) { return d.ShortAppliedDate })
    .key(function(d) { return d.PermitTypeMapped })
    .rollup (function(v) { return v.length })
    .entries(appliedLast365Days);

    return appliedByDayByType;
  }

     
// Helper function to make request for JSONP.
function requestJSON(url, callback) {
  $.ajax({
    beforeSend: function() {
      // Handle the beforeSend event
    },
    url: url,
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
       
    }
  });
}


function plotBarChart(columnsData, datesArray){
    var chart = c3.generate({
    bindto: '#byDay',
    data: {
      columns: columnsData,
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
      }
    },
    axis: {
        // y: {tick : {format: d3.format('d')}},
        x: {
        type: 'category',
        categories: datesArray
      }
    }
  });
};     
