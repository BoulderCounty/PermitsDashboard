var permitsResourceId = "d914e871-21df-4800-a473-97a2ccdf9690";
var inspectionsResourceId = "";
var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
var startDate = moment().subtract(365, 'd').format("YYYY-MM-DD");
var shortStartDate = moment().subtract(30, 'd').format("YYYY-MM-DD");
var startDateMoment = moment().subtract(365, 'd');
var shortStartDateMoment = moment().subtract(30, 'd');

$(document).ready(function() {
     
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

  /********************************************************************************/
  /* Get all activity in last year (START)
  /********************************************************************************/

  var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + startDate + "' order by \"AppliedDate\"";
  var urlLast7Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
  var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
  var urlLast7 = baseURI + encodeURIComponent(urlLast7Query.replace("permitsResourceId", permitsResourceId));

  requestJSON(urlLast365, function(json) {
    var records = json.result.records;

    //extract permits applied for in last 30 days
    var appliedLast365Days = records.filter(function(d) { 
      return moment(d.AppliedDate) > startDateMoment; 
    });

    //extract permits applied for in last 30 days
    var appliedLast7Days = records.filter(function(d) { 
      return moment(d.AppliedDate) > shortStartDateMoment; 
    });
    
    //extract permits issued in last 30 days
    var issuedLast365Days = records.filter(function(d) { 
      return moment(d.IssuedDate) > startDateMoment; 
    });

    //extract permits issued in last 30 days
    var issuedLast7Days = records.filter(function(d) { 
      return moment(d.IssuedDate) > shortStartDateMoment; 
    });

    //total construction value for new project in last 30 days
    var totalConstructionValue = d3.sum(appliedLast365Days, function(d) {
      return Number(d.EstProjectCost);
    });


    records.forEach(function(record, inc, array) {
      record.AppliedDate = moment(record.AppliedDate).format('MMM');
    })

    $("#newApplications").text(appliedLast7Days.length);
    $("#issuedPermits").text(issuedLast7Days.length);
    $("#totalConstructionValue").text(numeral(totalConstructionValue).format('($ 0.00 a)'));

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
    
    var appliedByDayByType = d3.nest()
      .key(function(d) { return d.AppliedDate })
      .key(function(d) { return d.PermitTypeMapped })
      .rollup (function(v) { return v.length })
      .entries(appliedLast365Days);

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
    var bldAdded = false, demoAdded = false, eleAdded = false, otherAdded = false, mechAdded = false,  pspAdded = false, fncAdded = false, roofAdded = false, plmAdded = false;
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

        if (i.key == "Plumbing") {
          plm.push(i.values);
          plmAdded = true;    
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
      if (!roofAdded);
        roof.push(0);
      if (!fncAdded);
        fnc.push(0);
      if (!pspAdded);
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

    setTimeout(function () {
      chart.groups([['Building','Demolition','Electrical','Other','Mechanical','Plumbing']])
    }, 1000);

    /********************************************************************************/
    /* Calculated permits applied for by day and by type (END)
    /********************************************************************************/
    
  });
  /********************************************************************************/
  /* Get all permit details in last 30 days (END)
  /********************************************************************************/
  
  /********************************************************************************/
  /* Get all inspections in last 30 days (START)
  /********************************************************************************/

  forceDelay(1000);

  var urlLast365InspectionsQuery = "SELECT \"PermitNum\",\"InspType\",\"Result\",\"ScheduledDate\",\"InspectedDate\",\"InspectionNotes\" from \"inspectionsResourceId\" where \"InspectedDate\" > \'" + startDate + "' order by \"InspectedDate\" DESC";
  
  var urlLast365Inspections = baseURI + encodeURIComponent(urlLast365InspectionsQuery.replace("inspectionsResourceId", inspectionsResourceId));

  requestJSON(urlLast365Inspections, function(json) {
    var records = json.result.records;

    $("#inspectionCount").text(records.length);

  });
  
  /********************************************************************************/
  /* Get all inspections in last 30 days (END)
  /********************************************************************************/

  /********************************************************************************/
  /* Permits by type (START)
  /********************************************************************************/ 

  forceDelay(1000);

  var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";

  var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
      
  requestJSON(permitTypesQ, function(json) {
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
        type : 'pie',
        onmouseover: function (d, i) {
          console.log("onmouseover", d.id, i);
          requestJSON(urlLast7, function(json) {
              var records = json.result.records;
              //extract permits applied for in last 7 days
              var appliedLast7Days = records.filter(function(d) { 
                return moment(d.AppliedDate) > shortStartDateMoment; 
              });
              
              //extract permits issued in last 7 days
              var issuedLast7Days = records.filter(function(d) { 
                return moment(d.IssuedDate) > shortStartDateMoment; 
              });

              console.log(d);

              switch(d.id) {

                case "Building":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Building";
                  });
                  break;

                case "Electrical":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Electrical";
                  });
                  break;

                case "Plumbing":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Plumbing";
                  });
                  break;

                case "Mechanical":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                                                          console.log("ERROR2!");
                    return o.PermitTypeMapped === "Mechanical";
                  });
                  break;

                case "Roof":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    console.log("ERROR!")
                    return o.PermitTypeMapped === "Roof";
                  });
                  break;

                case "Grading":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Grading";
                  });
                  break;

                case "Demolition":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Demolition";
                  });
                  break;

                case "Pool/Spa":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Pool/Spa";
                  });
                  break;

                case "Fence":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Fence";
                  });
                  break;

                case "Other":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
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
                if (!roofAdded);
                  roof.push(0);
                if (!fncAdded);
                  fnc.push(0);
                if (!pspAdded);
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
          console.log('works!')
        },
      donut: {
        title: "Permit Types"
      },
    } 
    })    
  });

  /********************************************************************************/
  /* Permits by type (END)
  /********************************************************************************/ 

  /********************************************************************************/
  /* Average Issuance Days (START)
  /********************************************************************************/

  var urlLast12Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"PermitTypeMapped\" from \"permitsResourceId\" where \"IssuedDate\" > \'" + startDate + "' and \"IssuedDate\" <> '' order by \"IssuedDate\" DESC";
  var urlLast12 = baseURI + encodeURIComponent(urlLast12Query.replace("permitsResourceId", permitsResourceId));
  
  requestJSON(urlLast12, function(json) {
    var records = json.result.records;

    var dateData = [];
    records.forEach(function(d) {
      var dateDataObj = {};
      var appliedDate = moment(d.AppliedDate);
      var issuedDate = moment(d.IssuedDate);
      dateDataObj.permitNum = d.PermitNum;
      dateDataObj.permitType = d.PermitTypeMapped;
      dateDataObj.dateDifference = Math.abs(appliedDate.diff(issuedDate, 'd'));
      dateDataObj.appliedDate = appliedDate.format('YYYY-MM-DD');
      dateDataObj.issuedDate = issuedDate.format('YYYY-MM-DD');
      dateData.push(dateDataObj);
    });

    var daysAnalysisByType = d3.nest()
      .key(function(d) { return d.permitType })
      .rollup (function(v) { return {
        avg: d3.mean(v, function(d) {return d.dateDifference}), 
        //high: d3.max(v, function (d) {return d.dateDifference}), 
        //low: d3.min(v, function (d) {return d.dateDifference}), 
        median: d3.median(v, function(d) {return d.dateDifference}), 
        standardDeviation: d3.deviation(v, function(d) {return d.dateDifference})
      }; })
      .entries(dateData);

    var avg = ['Average'];
    //var high = ['High'];
    //var low = ['Low'];
    var median = ['Median'];
    var stdDeviation = ['StdDeviation'];
    var permitTypes = [];

    daysAnalysisByType.forEach(function(d) {
      if (d.values.avg != undefined)
        avg.push(d.values.avg);
      else
        avg.push(0);
      //high.push(d.values.high);
      //low.push(d.values.low);
      if (d.values.median != undefined)
        median.push(d.values.median);
      else
        median.push(0);

      if (d.values.standardDeviation != undefined)
        stdDeviation.push(d.values.standardDeviation);
      else
        stdDeviation.push(0);

      permitTypes.push(d.key)
    });

    var chart = c3.generate({
      bindto: '#timeTo',
      data: {
        columns: [
            avg,
            //high,
            //low,
            median,
            stdDeviation
        ],
        types: {
          Average: 'area-spline',
          //High: 'spline',
          //Low: 'spline',
          Median: 'spline', 
          StdDeviation: 'area-spline'
          // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
        },
        groups: [permitTypes]
      },
      axis: {
              x: {
                type: 'category',
                categories: permitTypes
              }
            }
    });

  });
  /********************************************************************************/
  /* Average Issuance Days (END)
  /********************************************************************************/
             
});

function forceDelay(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); } 
    while (curDate - date < millis);
}
