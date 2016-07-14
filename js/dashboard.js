var permitsResourceId = "d914e871-21df-4800-a473-97a2ccdf9690";
var inspectionsResourceId = "";
var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
var iSD = document.getElementById('monthly-dropdown-menu').value;
iSD = 365;
var startDate = moment().subtract(iSD, 'd').format("YYYY-MM-DD");
var shortStartDate = moment().subtract(30, 'd').format("YYYY-MM-DD");
var startDateMoment = moment().subtract(iSD, 'd');
var shortStartDateMoment = moment().subtract(30, 'd');

debugger;

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
  var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
  var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
  var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));

  requestJSON(urlLast365, function(json) {
    var records = json.result.records;

    //extract permits applied for in last 30 days
    var appliedLast365Days = records.filter(function(d) { 
      return moment(d.AppliedDate) > startDateMoment; 
    });

    //extract permits applied for in last 30 days
    var appliedLast30Days = records.filter(function(d) { 
      return moment(d.AppliedDate) > shortStartDateMoment; 
    });
    
    //extract permits issued in last 30 days
    var issuedLast365Days = records.filter(function(d) { 
      return moment(d.IssuedDate) > startDateMoment; 
    });

    //extract permits issued in last 30 days
    var issuedLast30Days = records.filter(function(d) { 
      return moment(d.IssuedDate) > shortStartDateMoment; 
    });

    //total construction value for new project in last 30 days
    var totalConstructionValue = d3.sum(appliedLast365Days, function(d) {
      return Number(d.EstProjectCost);
    });


    records.forEach(function(record, inc, array) {
      record.AppliedDate = moment(record.AppliedDate).format('MMM');
    })

    $("#newApplications").text(appliedLast365Days.length);
    $("#issuedPermits").text(issuedLast365Days.length);
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
    var grad = ['Grading'];
    var datesArray = [];
    // var bldAdded = false, demoAdded = false, eleAdded = false, otherAdded = false, mechAdded = false,  pspAdded = false, fncAdded = false, roofAdded = false, plmAdded = false, gradAdded = false;
    var tempArray = [];

    appliedByDayByType.forEach(function(d) {

      console.log(d);
      var dArray = d.key;
      console.log(dArray);
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
      gradAdded = false;


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

        if (i.key == "Grading") {
          grad.push(i.values);
          gradAdded = true;    
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
      if (!gradAdded)
        grad.push(0);


    });

    var chart = c3.generate({
      bindto: '#byDay',
      data: {
        columns: [
            bld,
            roof,
            mech,
            ele,
            plm,
            demo,
            grad,
            other,
            psp,
            fnc
        ],
        type: 'bar'//,
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
      },
      legend: {
        show: false
      }
    });

    setTimeout(function () {
      chart.groups([['Building','Demolition','Electrical','Other','Mechanical','Plumbing', 'Roof', 'Fence', 'Pool/Spa', 'Grading']])
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

  // forceDelay(1000);

  // var urlLast365InspectionsQuery = "";

  // var urlLast365InspectionsQuery = "SELECT \"PermitNum\",\"InspType\",\"Result\",\"ScheduledDate\",\"InspectedDate\",\"InspectionNotes\" from \"inspectionsResourceId\" where \"InspectedDate\" > \'" + startDate + "' order by \"InspectedDate\" DESC";
  
  // var urlLast365Inspections = "";

  // var urlLast365Inspections = baseURI + encodeURIComponent(urlLast365InspectionsQuery.replace("inspectionsResourceId", inspectionsResourceId));

  // requestJSON(urlLast365Inspections, function(json) {
  //   var records = json.result.records;

  //   $("#inspectionCount").text(records.length);

  // });
  
  /********************************************************************************/
  /* Get all inspections in last 30 days (END)
  /********************************************************************************/

  /********************************************************************************/
  /* Permits by type (START)
  /********************************************************************************/ 

  forceDelay(1000);

  var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";

  var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
      
    var records = [];

  requestJSON(permitTypesQ, function(json) {
    var records = json.result.records 

    records.forEach(function(record, inc, array) {
      record.AppliedDate = moment(record.AppliedDate).format('MMMM');
    })   
  
    console.log(records);

    var permitTypes = [];

    //Get a distinct list of neighborhoods
    for (var i = 0; i < records.length; i++) {
      permitTypes.push([records[i]["PermitTypeMapped"], records[i].count]);
    }

    var chart = c3.generate({
      bindto: '#permitTypes',
      legend: function () {return false;},
      data: {
        columns: permitTypes,
        type : 'donut',
        onclick: function (d, i) {
          console.log("onclick", d.id, i);
          requestJSON(urlLast30, function(json) {
              var records = json.result.records;

              //extract permits applied for in last 30 days
              var appliedLast30Days = records.filter(function(d) { 
                return moment(d.AppliedDate) > shortStartDateMoment; 
              });


              appliedLast30Days.forEach(function(record, inc, array) {
                if ($('div#byDay > svg').attr('width') > 768){
                  record.AppliedDate = moment(record.AppliedDate).format('D MMMM');
                }
                else {
                  record.AppliedDate = moment(record.AppliedDate).format('DD');
                }
              }); 
              
              console.log(appliedLast30Days);

              //extract permits issued in last 30 days
              var issuedLast30Days = records.filter(function(d) { 
                return moment(d.IssuedDate) > shortStartDateMoment; 
              });

              console.log(d);

              switch(d.id) {

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
                    return o.PermitTypeMapped === "Mechanical";
                  });
                  break;

                case "Roof":
                  var appliedLastWeek = appliedLast30Days.filter(function(o) {
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
              var grad = ['Grading'];
              var datesArray = [];
              var bldAdded = false, demoAdded = false, eleAdded = false, otherAdded = false, mechAdded = false, plmAdded = false, gradAdded = false;
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
                gradAdded = false;

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
                  if (i.key == "Grading") {
                    grad.push(i.values);
                    gradAdded = true;    
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
                if (!gradAdded)
                  grad.push(0);
            
              });


            switch(d.id){
              case ('Building') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            bld
                        ],
                        type: 'bar',
                        colors: {
                           Building: 'rgb(31, 119, 180)'
                        }
                      },
                      // grid: {y: {lines: [{value: AVERAGE}]}},
                      axis: {
                          y: {tick : {format: d3.format('d')}},
                          x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                break;
                  }

              case ('Demolition') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            demo
                        ],
                        type: 'bar',
                        colors: {
                           Demolition: 'rgb(140, 86, 75)'
                        }
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Electrical') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            ele
                        ],
                        type: 'bar',
                        colors: {
                           Electrical: 'rgb(44, 160, 44)'
                        }
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Other') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            other
                        ],
                        type: 'bar',
                        colors: {
                           Other: 'rgb(127, 127, 127)'
                        }
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Mechanical') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            mech
                        ],
                        type: 'bar',
                        colors: {
                           Mechanical: 'rgb(214, 39, 40)'
                        }
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }
                
              case ('Roof') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            roof
                        ],
                        type: 'bar',
                        colors: {
                           Roof: 'rgb(255, 127, 14)'
                        }
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Plumbing') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            plm
                        ],
                        type: 'bar',
                        colors: {
                           Plumbing: 'rgb(148, 103, 189)'
                        }
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Grading') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            grad
                        ],
                        type: 'bar',
                        colors: {
                           Grading: 'rgb(227, 119, 194)'
                        }
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Pool/Spa') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            psp
                        ],
                        type: 'bar',
                        colors: {
                           'Pool/Spa': 'rgb(188, 189, 34)'
                        }
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Fence') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            fnc
                        ],
                        type: 'bar',
                        colors: {
                           Fence: 'rgb(23, 190, 207)'
                        }
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                          y: {tick : {format: d3.format('d')}},
                          x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

                }

              $('#toggleWithPieClick').text(' Applications by Day over last Month ');
          });
        }
      },
      // legend: {
      //     item: {
      //       onmouseover: function (id) {
      //         console.log("onmouseover", id);
      //         requestJSON(urlLast30, function(json) {
      //           var records = json.result.records;
      //           //extract permits applied for in last 7 days
              
/*
*******************************************
**
** THE FOLLOWING SEVERAL HUNDRED LINES OF CODE DEAL WITH THE LEGEND INTERACTION AND NEED TO BE REFACTORED
**
*******************************************
*/
          //       console.log(records);

          //       var appliedLast30Days = records.filter(function(d) { 
          //         return moment(d.AppliedDate) > shortStartDateMoment; 
          //       });
                
          //       //extract permits issued in last 7 days
          //       var issuedLast30Days = records.filter(function(d) { 
          //         return moment(d.IssuedDate) > shortStartDateMoment; 
          //       });

          //       console.log(id);

          //       switch(id) {

          //         case "Building":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Building";
          //           });
          //           break;

          //         case "Electrical":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Electrical";
          //           });
          //           break;

          //         case "Plumbing":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Plumbing";
          //           });
          //           break;

          //         case "Mechanical":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Mechanical";
          //           });
          //           break;

          //         case "Roof":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Roof";
          //           });
          //           break;

          //         case "Grading":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Grading";
          //           });
          //           break;

          //         case "Demolition":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Demolition";
          //           });
          //           break;

          //         case "Pool/Spa":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Pool/Spa";
          //           });
          //           break;

          //         case "Fence":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Fence";
          //           });
          //           break;

          //         case "Other":
          //           var appliedLastWeek = appliedLast30Days.filter(function(o) {
          //             return o.PermitTypeMapped === "Other";
          //           });
          //           break;
          //         }
              
          //     var appliedByDayByType = [];
          //     var appliedByDayByType = d3.nest()
          //       .key(function(d) { return d.AppliedDate })
          //       .key(function(d) { return d.PermitTypeMapped })
          //       .rollup (function(v) { return v.length })
          //       .entries(appliedLastWeek);

          //     var bld = ['Building'];
          //     var demo = ['Demolition'];
          //     var ele = ['Electrical'];
          //     var other = ['Other'];
          //     var mech = ['Mechanical'];
          //     var plm = ['Plumbing'];
          //     var psp = ['Pool/Spa'];
          //     var fnc = ['Fence'];
          //     var grad = ['Grading'];
          //     var roof = ['Roof'];
          //     var datesArray = [];
          //     var bldAdded = false, demoAdded = false, eleAdded = false, otherAdded = false, mechAdded = false, plmAdded = false, pspAdded = false, fncAdded = false, gradAdded = false, roofAdded = false;
          //     var tempArray = [];

          //     appliedByDayByType.forEach(function(d) {

          //       console.log(d);

          //       var dArray = d.key;
          //       datesArray.push(dArray);

          //       bldAdded = false;
          //       demoAdded = false;
          //       eleAdded = false;
          //       otherAdded = false;
          //       mechAdded = false;
          //       plmAdded = false;
          //       pspAdded = false;
          //       fncAdded = false;
          //       roofAdded = false;
          //       gradAdded = false;

          //       d.values.forEach(function(i) {
                  
          //         if (i.key == "Building") {
          //           bld.push(i.values);
          //           bldAdded = true;
          //         }
          //         if (i.key == "Demolition") {
          //           demo.push(i.values);
          //           demoAdded = true;
          //         }
          //         if (i.key == "Electrical") {
          //           ele.push(i.values);
          //           eleAdded = true;
          //         }
          //         if (i.key == "Other") {
          //           other.push(i.values);
          //           otherAdded = true;
          //         }
          //         if (i.key == "Mechanical") {
          //           mech.push(i.values);
          //           mechAdded = true;
          //         }
          //         if (i.key == "Plumbing") {
          //           plm.push(i.values);
          //           plmAdded = true;    
          //         }
          //         if (i.key == "Roof") {
          //           roof.push(i.values);
          //           roofAdded = true;    
          //         }
          //         if (i.key == "Pool/Spa") {
          //           psp.push(i.values);
          //           pspAdded = true;    
          //         }
          //         if (i.key == "Fence") {
          //           fnc.push(i.values);
          //           fncAdded = true;    
          //         }

          //       });

          //       if (!bldAdded)
          //         bld.push(0);
          //       if (!demoAdded)
          //         demo.push(0);
          //       if (!eleAdded)
          //         ele.push(0);
          //       if (!mechAdded)
          //         mech.push(0);
          //       if (!otherAdded)
          //         other.push(0);
          //       if (!plmAdded)
          //         plm.push(0);
          //       if (!roofAdded)
          //         roof.push(0);
          //       if (!fncAdded)
          //         fnc.push(0);
          //       if (!pspAdded)
          //         psp.push(0);
            
          //     });

          //   var chart = c3.generate({
          //         bindto: '#byDay',
          //         data: {
          //           columns: [
          //               bld,
          //               demo,
          //               ele,
          //               other,
          //               mech,
          //               plm,
          //               roof,
          //               fnc,
          //               psp
          //           ],
          //           type: 'bar'//,
          //           //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
          //         },
          //         grid: {
          //           y: {
          //             lines: [{value:0}]
          //           }
          //         },
          //         axis: {
          //           x: {
          //             type: 'category',
          //             categories: datesArray
          //           }
          //         }
          //       });

          //     // console.log(appliedLast30Days);
          // });
          // console.log('works!')}
          //   }
          // },
      donut: {
       title :  'Select for breakdown'
      }   
    }) 
            console.log(chart.select(this));
            console.log(this);
            // label.html('');   
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

  // function month_select(){
  //   var iSD = document.getElementById('monthly-dropdown-menu').value;
  //   console.log(iSD);


  //   var startDate = moment().subtract(iSD, 'd').format("YYYY-MM-DD");
  //   var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";
  //   var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
      
  //   var records = [];

  //   requestJSON(permitTypesQ, function(json) {
  //     var records = json.result.records 

  //     records.forEach(function(record, inc, array) {
  //       record.AppliedDate = moment(record.AppliedDate).format('MMMM');
  //     })   
    
  //     console.log(records);

  //     var permitTypes = [];

  //     //Get a distinct list of neighborhoods
  //     for (var i = 0; i < records.length; i++) {
  //       permitTypes.push([records[i]["PermitTypeMapped"], records[i].count]);
  //     }

  //     var chart = c3.generate({
  //       bindto: '#permitTypes',
  //       data: {
  //         columns: permitTypes,
  //         type : 'pie',
  //       },
  //       donut: {
  //         title: "Permit Types"
  //       }
  //     });
  //   });

  // };
             
});

function forceDelay(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); } 
    while (curDate - date < millis);
}


function month_select(){
    var iSD = document.getElementById('monthly-dropdown-menu').value;
    console.log(iSD);

    var startDate = moment().subtract(iSD, 'M').format("YYYY-MM-DD");
    var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";
    var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
    

    console.log(startDate, "***", shortStartDate);

    var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + startDate + "' order by \"AppliedDate\"";
    var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
    var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
    var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));


    console.log(urlLast30Query, "---");
    console.log(urlLast365Query, "-------------");
  
    var records = [];

    requestJSON(urlLast30, function(json) {

      var records = json.result.records 

      console.log(records, "#");

      records.forEach(function(record, inc, array) {
      record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
      console.log(record.AppliedDate, "*");
    })   
  
    console.log(records);

    var permitTypes = [];

    //Get a distinct list of neighborhoods
    for (var i = 0; i < records.length; i++) {
      permitTypes.push([records[i]["PermitTypeMapped"], records[i].count]);
    }

    var startDateMoment = moment().subtract(iSD, 'M');

    console.log(startDateMoment);

    var appliedLast365Days = records.filter(function(d) { 
      return moment(d.AppliedDate) > startDateMoment; 
    });

    console.log(appliedLast365Days);

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
    var grad = ['Grading'];
    var datesArray = [];
    // var bldAdded = false, demoAdded = false, eleAdded = false, otherAdded = false, mechAdded = false,  pspAdded = false, fncAdded = false, roofAdded = false, plmAdded = false, gradAdded = false;
    var tempArray = [];

    appliedByDayByType.forEach(function(d) {

      console.log(d);
      var dArray = d.key;
      console.log(dArray);
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
      gradAdded = false;


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

        if (i.key == "Grading") {
          grad.push(i.values);
          gradAdded = true;    
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
      if (!gradAdded)
        grad.push(0);


    });

    var chart = c3.generate({
      bindto: '#byDay',
      data: {
        columns: [
            bld,
            roof,
            mech,
            ele,
            plm,
            demo,
            grad,
            other,
            psp,
            fnc
        ],
        type: 'bar'//,
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
      },
      legend: {
        show: false
      }
    });

    setTimeout(function () {
      chart.groups([['Building','Demolition','Electrical','Other','Mechanical','Plumbing', 'Roof', 'Fence', 'Pool/Spa', 'Grading']])
    }, 1000);


    var chart = c3.generate({
      bindto: '#permitTypes',
      data: {
        columns: permitTypes,
        type : 'donut',
        onclick : function (d, i) {

          console.log(startDate, "onclick", d.id, i);
          var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + startDate + "' order by \"AppliedDate\"";
          var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
          var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
          var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));

          var startDateMoment = moment().subtract(iSD, 'M');

          requestJSON(urlLast365, function(json) {
              var records = json.result.records;

              //extract permits applied for in last 30 days
              var appliedLast365Days = records.filter(function(d) { 
                return moment(d.AppliedDate) > startDateMoment; 
              });


              appliedLast365Days.forEach(function(record, inc, array) {
                if ($('div#byDay > svg').attr('width') > 768){
                  record.AppliedDate = moment(record.AppliedDate).format('D MMMM');
                }
                else {
                  record.AppliedDate = moment(record.AppliedDate).format('DD');
                }
              }); 
              
              console.log(appliedLast365Days);

              //extract permits issued in last 30 days
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
                    return o.PermitTypeMapped === "Mechanical";
                  });
                  break;

                case "Roof":
                  var appliedLastWeek = appliedLast365Days.filter(function(o) {
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

              var bld = ['Building'];
              var demo = ['Demolition'];
              var ele = ['Electrical'];
              var other = ['Other'];
              var mech = ['Mechanical'];
              var plm = ['Plumbing'];
              var psp = ['Pool/Spa'];
              var fnc = ['Fence'];
              var roof = ['Roof'];
              var grad = ['Grading'];
              var datesArray = [];
              var bldAdded = false, demoAdded = false, eleAdded = false, otherAdded = false, mechAdded = false, plmAdded = false, gradAdded = false;
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
                gradAdded = false;

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
                  if (i.key == "Grading") {
                    grad.push(i.values);
                    gradAdded = true;    
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
                if (!gradAdded)
                  grad.push(0);
            
              });


            switch(d.id){
              case ('Building') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            bld
                        ],
                        type: 'bar',
                        colors: {
                           Building: 'rgb(31, 119, 180)'
                        }
                      },
                      legend: {
                         show: false
                      },
            // CONTENT TO ADD     // grid: {y: {lines: [{value: AVERAGE}]}},
                      axis: {
                          y: {tick : {format: d3.format('d')}},
                          x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                break;
                  }

              case ('Demolition') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            demo
                        ],
                        type: 'bar',
                        colors: {
                           Demolition: 'rgb(140, 86, 75)'
                        }
                      },
                      legend: {
                         show: false
                      },
                      grid: {y: {lines: [{value:0}]
                    }
                  },
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Electrical') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            ele
                        ],
                        type: 'bar',
                        colors: {
                           Electrical: 'rgb(214, 39, 40)'
                        }
                      },
                      legend: {
                         show: false
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Other') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            other
                        ],
                        type: 'bar',
                        colors: {
                           Other: 'rgb(23, 190, 207)'
                        }
                      },
                      legend: {
                         show: false
                      },
                      grid: {y: {lines: [{value:0}]}
                      },
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Mechanical') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            mech
                        ],
                        type: 'bar',
                        colors: {
                           Mechanical: 'rgb(44, 160, 44)'
                        }
                      },
                      legend: {
                         show: false
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }
                
              case ('Roof') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            roof
                        ],
                        type: 'bar',
                        colors: {
                           Roof: 'rgb(255, 127, 14)'
                        }
                      },
                      legend: {
                         show: false
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Plumbing') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            plm
                        ],
                        type: 'bar',
                        colors: {
                           Plumbing: 'rgb(148, 103, 189)'
                        }
                      },
                      legend: {
                         show: false
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Grading') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            grad
                        ],
                        type: 'bar',
                        colors: {
                           Grading: 'rgb(227, 119, 194)'
                        }
                      },
                      legend: {
                         show: false
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Pool/Spa') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            psp
                        ],
                        type: 'bar',
                        colors: {
                           'Pool/Spa': 'rgb(127, 127, 127)'
                        }
                      },
                      legend: {
                         show: false
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                        y: {tick : {format: d3.format('d')}},
                        x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

              case ('Fence') : {
                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            fnc
                        ],
                        type: 'bar',
                        colors: {
                           Fence: 'rgb(188, 189, 34)'
                        }
                      },
                      legend: {
                         show: false
                      },
                      grid: {y: {lines: [{value:0}]}},
                      axis: {
                          y: {tick : {format: d3.format('d')}},
                          x: {
                          type: 'category',
                          categories: datesArray
                      }
                      }
                    });
                  break;
                  }

                }

              $('#toggleWithPieClick').text(' Applications by Day over last ');
          });
        console.log('Boo!!');
      var chart2 = c3.generate({
        bindto: '#byDay',
        data: {
          columns: permitTypes,
          type : 'donut'
        }
      });  
        chart2.flush();          
        }
      },
      donut : {
       title :  'Select for breakdown'
      }
    });
  });

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
};