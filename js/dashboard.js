// SET GLOBAL VARIABLES

var permitsResourceId = "d914e871-21df-4800-a473-97a2ccdf9690";
var inspectionsResourceId = "";
var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
var initialStartDate = 365;
var startDate = moment().subtract(initialStartDate, 'd').format("YYYY-MM-DD");
// var shortStartDate = moment().subtract(30, 'd').format("YYYY-MM-DD");
var startDateMoment = moment().subtract(initialStartDate, 'd');
// var shortStartDateMoment = moment().subtract(30, 'd');

var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + startDate + "' order by \"AppliedDate\"";
  // var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
      // encode URL
var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
  // var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));

localStorage['yearQuery'] = urlLast365Query;
localStorage['year'] = urlLast365;

/******************************************************************************/

/* INITIAL DATA LOAD - Pre-rendered

/*****************************************************************************/

$(document).ready(function() {

  // Grab dropdown length of data to "breakdown"
  initialStartDate = document.getElementById('monthly-dropdown-menu').value;

     
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
    return JSON;
  }

  /********************************************************************************/
  /* Get all activity in last year (START)
  /* ____    _  _____  _       ____ ____      _    ____  
  /*|  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
  /*| | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
  /*| |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
  /*|____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
  /********************************************************************************/

  // Original data grab

      // set up SQL query string
  var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + startDate + "' order by \"AppliedDate\"";
  // var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
      // encode URL
  var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
  // var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));



  requestJSON(urlLast365, function(json) {
    var records = json.result.records;

    //extract permits applied for the last year
    var appliedLast365Days = records.filter(function(d) { 
      return moment(d.AppliedDate) > startDateMoment; 
    });

    // //extract permits applied for in last 30 days
    // var appliedLast30Days = records.filter(function(d) { 
    //   return moment(d.AppliedDate) > shortStartDateMoment; 
    // });
    
    //extract permits issued in last year
    var issuedLast365Days = records.filter(function(d) { 
      return moment(d.IssuedDate) > startDateMoment; 
    });

    // //extract permits issued in last 30 days
    // var issuedLast30Days = records.filter(function(d) { 
    //   return moment(d.IssuedDate) > shortStartDateMoment; 
    // });

    //total construction value for new project in last year
    var totalConstructionValue = d3.sum(appliedLast365Days, function(d) {
      return Number(d.EstProjectCost);
    });


    // format record.AppliedDate to drop days and years
    // ?? DOES THIS DO ANYTHING IN THIS LOCATION ??

    records.forEach(function(record, inc, array) {
      record.AppliedDate = moment(record.AppliedDate).format('MMM-YY');
    })

    $("#newApplications").text(appliedLast365Days.length);
    $("#issuedPermits").text(issuedLast365Days.length);
    $("#totalConstructionValue").text(numeral(totalConstructionValue).format('($ 0.00 a)'));

    /********************************************************************************/
    /* Load recent permit applications (Start)
    /********************************************************************************/
    /* NEED TO EXPAND THIS SECTION TO INCLUDE SUBSET AND 'INFINITE SCROLL'
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


    /* INITIAL CONSTRUCTION OF BAR CHART (START)


    /********************************************************************************/
    /* Calculated permits applied for by day and by type (START)
    /********************************************************************************/

    /********************************************************************************/
    
    // (A) creates the data object
    // FURTHER DESCRIPTION NECESSARY {key_Month : [ {key_type : numb }]}

    var appliedByDayByType = d3.nest()
      .key(function(d) { return d.AppliedDate })
      .key(function(d) { return d.PermitTypeMapped })
      .rollup (function(v) { return v.length })
      .entries(appliedLast365Days);

    // (B) Initiate arrays with type label 

    var types = ["Plumbing", "Other", "Roof", "Electrical", "Mechanical", "Building", "Demolition", "Pool/Spa", "Grading", "Fence"];

    console.log(appliedByDayByType);

    var output = {};
  
    // (C) Enumerates each type


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

    console.log(months);

    // (G) push the value into the type-labeled array
  
    var columnData = Object.keys(output).map(function(type) {
        var a = output[type].map(function(month){
          return month[Object.keys(month)[0]];
        });
        return [type].concat(a);
      })

    console.log(columnData);

    // (H) create the bar chart with months and types breakdown 
    /*
    /*  Bar Graph - Initial Load
    /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
    /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
    /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
    /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
    /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
    /************************************************************************************/


    var chart = c3.generate({
      bindto: '#byDay',
      data: {
        columns: columnData,
        type: 'bar',
        onclick: function(d, i) {
          console.log('%^&%&%^%^&%*&^%*^');
        }
      },
      grid: {
        y: {
          lines: [{value:0}]
        }
      },
      axis: {
        x: {
          type: 'category',
          categories: months
        }
      },
      legend: {
        show: false
      },
      
    });

    setTimeout(function () {
      chart.groups([['Building','Demolition','Electrical','Other','Mechanical','Plumbing', 'Roof', 'Fence', 'Pool/Spa', 'Grading']])
    }, 1000);
    /********************************************************************************/

    /********************************************************************************/
    /* Calculated permits applied for by day and by type (END)
    /********************************************************************************/


    /* INITIAL CONSTRUCTION OF BAR CHART (END)


    /********************************************************************************/
    
  });
  /********************************************************************************/
  /* Get all permit details in last year (END)
  /********************************************************************************/
  

  /********************************************************************************/
  /* Permits by type (START) - pie chart showing ratio of types
  /*
  /* ____    _  _____  _       ____ ____      _    ____  
  /*|  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
  /*| | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
  /*| |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
  /*|____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
  /********************************************************************************/ 

  // Get the number of instances of each type



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

    console.log(permitTypes);


    /*    Pie chart - Initial Load
    /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
    /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
    /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
    /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
    /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
    /************************************************************************************/


    var chart = c3.generate({
      bindto: '#permitTypes',
      legend: function () {return false;},
      data: {
        columns: permitTypes,
        type : 'donut',
        onclick: function (d, i) {
          console.log("onclick", d.id, i);
          var initialStartDate = document.getElementById('monthly-dropdown-menu').value;

          var startDate = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");
          var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";
          var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
          

          console.log(startDate, "***");

          // var urlLast365Query = localStorage['yearQuery'] || '0';
          // var urlLast365 = localStorage['year'];

          // console.log(urlLast30Query, "---");
          console.log(urlLast365Query, "-------------");
        
          var records = [];

          /******************************************************************************/
          /* ___     _  _____  _       ____ ____      _    ____  
          /*|  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
          /*| | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
          /*| |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
          /*|____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
          /*
          /******************************************************************************/

          requestJSON(urlLast365, function(json) {

            var records = json.result.records 

            console.log(records, "#");

            records.forEach(function(record, inc, array) {
            record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
            console.log(record.AppliedDate, "*");
          })   


          var startDateMoment = moment().subtract(initialStartDate, 'M');

          console.log(startDateMoment);

          var appliedLast365Days = records.filter(function(d) { 
            return moment(d.AppliedDate) > startDateMoment; 
          });




          var appliedLastYearByType = appliedLast365Days.filter(function(o) {
            return o.PermitTypeMapped === d.id;
          });

 

           //Get a distinct list of neighborhoods
          for (var i = 0; i < records.length; i++) {
            permitTypes.push([records[i]["PermitTypeMapped"], records[i].count]);
          }


          var appliedLast365Days = records.filter(function(d) { 
            return moment(d.AppliedDate) > startDateMoment; 
          });
              
              var appliedByDayByType = [];

                // compiles array for bar-graph
              var appliedByDayByType = d3.nest()

                // concatenates date
                .key(function(d) { return d.AppliedDate })

                // concatanates type
                .key(function(d) { return d.PermitTypeMapped })

                // takes the records and creates a count
                .rollup (function(v) { return v.length })

                // creates a d3 object from the records
                .entries(appliedLastYearByType);

              var types = ["Plumbing", "Other", "Roof", "Electrical", "Mechanical", "Building", "Demolition", "Pool/Spa", "Grading", "Fence"];

             var output = [];

                  console.log(appliedLastYearByType);
                  console.log(appliedByDayByType);

                  output[d.id] = appliedByDayByType.map(function(month) {
                      var o = {};
                      o[month.key] = month.values.filter(function(val) {
                        return val.key == d.id;
                      }).map(function(m) { return m.values; }).shift() || 0;
                      return o;
                    })
                             

                  var dates = appliedByDayByType.map(function(date) {
                    return date.key;
                  });


                  var columnData=[];
                  // console.log(columnData);

                  // dates.forEach(function(date, i){
                  //   var dArray = date;
                    // console.log(i);
                    lcount=0;

                    columnData = output[d.id].map(function(index){
                          // console.log(lcount,index);
                          var rObj = {};
                          rObj[dates[lcount]] = (index[dates[lcount]]);
                          lcount++;

                          // console.log(rObj);

                          return rObj;
                        });

                    console.log(columnData);

                    var returnObj = columnData.map(function(obj) {
                      return Object.keys(obj).sort().map(function(key) { 
                        return obj[key];
                      });
                    });

                    var returnObj = ([Object.keys(output)[0]]).concat(returnObj)

                    console.log(returnObj);

                    console.log(Object.keys(output)[0],'____________________________');

                    datesArray=[];

                    output[Object.keys(output)[0]].forEach(function(d, i) {

                      // console.log(moment([dates[i]], 'D MMM').format('D MMM'));

                      var dArray = [dates[i]];
                      datesArray.push(dArray);
                  
                    });

                    console.log(datesArray);


    /*  On Pie-Chart Click - Reloads The Bar-Chart With A Single Type
    /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
    /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
    /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
    /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
    /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
    /************************************************************************************/

                var chart = c3.generate({
                      bindto: '#byDay',
                      data: {
                        columns: [
                            returnObj
                        ],
                        type: 'bar',
                        colors: {
                           'Building': 'rgb(31, 119, 180)',
                           'Demolition': 'rgb(140, 86, 75)',
                           'Electrical': 'rgb(214, 39, 40)',
                           'Other': 'rgb(127, 127, 127)',
                           'Mechanical': 'rgb(44, 160, 44)',
                           'Roof': 'rgb(255, 127, 14)',
                           'Plumbing': 'rgb(148, 103, 189)' ,
                           'Pool/Spa': 'rgb(188, 189, 34)',
                           'Fence': 'rgb(23, 190, 207)',
                           'Grading': 'rgb(227, 119, 194)'
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
                      // onclick: function(d, i) {
                      //   console.log('%^&%&%^%^&%*&^%*^');
                      //   chart.flush();
                      // }
                    });

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
              

      donut: {
       title :  'Select for breakdown'
      }   
    })   
  });

  /********************************************************************************/
  /* Permits by type (END)
  /********************************************************************************/ 

  // /********************************************************************************/
  // /* Average Issuance Days (START)
  // /********************************************************************************/

  // var urlLast12Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"PermitTypeMapped\" from \"permitsResourceId\" where \"IssuedDate\" > \'" + startDate + "' and \"IssuedDate\" <> '' order by \"IssuedDate\" DESC";
  // var urlLast12 = baseURI + encodeURIComponent(urlLast12Query.replace("permitsResourceId", permitsResourceId));
  
  /********************************************************************************/
  /*  ____    _  _____  _       ____ ____      _    ____  
  /* |  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
  /* | | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
  /* | |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
  /* |____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
  /*
  /********************************************************************************/

  // requestJSON(urlLast12, function(json) {
  //   var records = json.result.records;

  //   var dateData = [];
  //   records.forEach(function(d) {
  //     var dateDataObj = {};
  //     var appliedDate = moment(d.AppliedDate);
  //     var issuedDate = moment(d.IssuedDate);
  //     dateDataObj.permitNum = d.PermitNum;
  //     dateDataObj.permitType = d.PermitTypeMapped;
  //     dateDataObj.dateDifference = Math.abs(appliedDate.diff(issuedDate, 'd'));
  //     dateDataObj.appliedDate = appliedDate.format('YYYY-MM-DD');
  //     dateDataObj.issuedDate = issuedDate.format('YYYY-MM-DD');
  //     dateData.push(dateDataObj);
  //   });

  //   var daysAnalysisByType = d3.nest()
  //     .key(function(d) { return d.permitType })
  //     .rollup (function(v) { return {
  //       avg: d3.mean(v, function(d) {return d.dateDifference}), 
  //       //high: d3.max(v, function (d) {return d.dateDifference}), 
  //       //low: d3.min(v, function (d) {return d.dateDifference}), 
  //       median: d3.median(v, function(d) {return d.dateDifference}), 
  //       standardDeviation: d3.deviation(v, function(d) {return d.dateDifference})
  //     }; })
  //     .entries(dateData);

  //   var avg = ['Average'];
  //   //var high = ['High'];
  //   //var low = ['Low'];
  //   var median = ['Median'];
  //   var stdDeviation = ['StdDeviation'];
  //   var permitTypes = [];

  //   daysAnalysisByType.forEach(function(d) {
  //     if (d.values.avg != undefined)
  //       avg.push(d.values.avg);
  //     else
  //       avg.push(0);
  //     //high.push(d.values.high);
  //     //low.push(d.values.low);
  //     if (d.values.median != undefined)
  //       median.push(d.values.median);
  //     else
  //       median.push(0);

  //     if (d.values.standardDeviation != undefined)
  //       stdDeviation.push(d.values.standardDeviation);
  //     else
  //       stdDeviation.push(0);

  //     permitTypes.push(d.key)
  //   });

    /*
    /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
    /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
    /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
    /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
    /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
    /************************************************************************************/


  //   var chart = c3.generate({
  //     bindto: '#timeTo',
  //     data: {
  //       columns: [
  //           avg,
  //           //high,
  //           //low,
  //           median,
  //           stdDeviation
  //       ],
  //       types: {
  //         Average: 'area-spline',
  //         //High: 'spline',
  //         //Low: 'spline',
  //         Median: 'spline', 
  //         StdDeviation: 'area-spline'
  //         // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
  //       },
  //       groups: [permitTypes]
  //       },
  //       axis: {
  //         x: {
  //           type: 'category',
  //           categories: permitTypes
  //         },
  //       }
  //   });

  // });
  // /********************************************************************************/
  // /* Average Issuance Days (END)
  // /********************************************************************************/

             
});

function forceDelay(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); } 
    while (curDate - date < millis);
}


function month_select(){
    var initialStartDate = document.getElementById('monthly-dropdown-menu').value;
    console.log(initialStartDate);

    var startDate = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");
    var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";
    var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
    

    console.log(startDate, "***");

    var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + startDate + "' order by \"AppliedDate\"";
    // var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
    var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
    // var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));


    // console.log(urlLast30Query, "---");
    console.log(urlLast365Query, "-------------");
  
    var records = [];


  /********************************************************************************/
  /*  ____    _  _____  _       ____ ____      _    ____  
  /* |  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
  /* | | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
  /* | |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
  /* |____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
  /*
  /********************************************************************************/


     

    requestJSON(urlLast365, function(json) {

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


        var startDateMoment = moment().subtract(initialStartDate, 'M');

        console.log(startDateMoment);

         

        var appliedLast365Days = records.filter(function(d) { 
          return moment(d.AppliedDate) > startDateMoment; 
        })

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

        /*  Loads Bar-Chart With Time-Frame Selected Data
        /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
        /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
        /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
        /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
        /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
        /************************************************************************************/


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
      
      var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";

      var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
        
      var records = [];



      /********************************************************************************/
      /*  ____    _  _____  _       ____ ____      _    ____  
      /* |  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
      /* | | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
      /* | |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
      /* |____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
      /*
      /********************************************************************************/

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
      

        /*    Reloads Pie-Chart With Time-Frame Selected Data
        /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
        /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
        /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
        /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
        /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
        /************************************************************************************/

      var chart = c3.generate({
        bindto: '#permitTypes',
        legend: function () {return false;},
        data: {
          columns: permitTypes,
          type : 'donut',
          onclick: function (d, i) {
            console.log("onclick", d.id, i);
            var initialStartDate = document.getElementById('monthly-dropdown-menu').value;

            var startDate = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");
            var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";
            var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
            

            console.log(startDate, "***");

            // var urlLast365Query = localStorage['yearQuery'] || '0';
            // var urlLast365 = localStorage['year'];

            // console.log(urlLast30Query, "---");
            console.log(urlLast365Query, "-------------");
          
            var records = [];



            /********************************************************************************/
            /*  ____    _  _____  _       ____ ____      _    ____  
            /* |  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
            /* | | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
            /* | |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
            /* |____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
            /*
            /********************************************************************************/

            requestJSON(urlLast365, function(json) {

              var records = json.result.records 

              console.log(records, "#");

              records.forEach(function(record, inc, array) {
              record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
              console.log(record.AppliedDate, "*");
            })   


            var initialStartDate = document.getElementById('monthly-dropdown-menu').value;

            var startDateMoment = moment().subtract(initialStartDate, 'M');

            console.log(startDateMoment);

            var appliedLast365Days = records.filter(function(d) { 
              return moment(d.AppliedDate) > startDateMoment; 
            });




            var appliedLastYearByType = appliedLast365Days.filter(function(o) {
              return o.PermitTypeMapped === d.id;
            });

   

             //Get a distinct list of neighborhoods
            for (var i = 0; i < records.length; i++) {
              permitTypes.push([records[i]["PermitTypeMapped"], records[i].count]);
            }


            var appliedLast365Days = records.filter(function(d) { 
              return moment(d.AppliedDate) > startDateMoment; 
            });
                
                var appliedByDayByType = [];

                  // compiles array for bar-graph
                var appliedByDayByType = d3.nest()

                  // concatenates date
                  .key(function(d) { return d.AppliedDate })

                  // concatanates type
                  .key(function(d) { return d.PermitTypeMapped })

                  // takes the records and creates a count
                  .rollup (function(v) { return v.length })

                  // creates a d3 object from the records
                  .entries(appliedLastYearByType);

                var types = ["Plumbing", "Other", "Roof", "Electrical", "Mechanical", "Building", "Demolition", "Pool/Spa", "Grading", "Fence"];

               var output = [];

                    console.log(appliedLastYearByType);
                    console.log(appliedByDayByType);

                    output[d.id] = appliedByDayByType.map(function(month) {
                        var o = {};
                        o[month.key] = month.values.filter(function(val) {
                          return val.key == d.id;
                        }).map(function(m) { return m.values; }).shift() || 0;
                        return o;
                      })
                               

                    var dates = appliedByDayByType.map(function(date) {
                      return date.key;
                    });


                    var columnData=[];
                    // console.log(columnData);

                    // dates.forEach(function(date, i){
                    //   var dArray = date;
                      // console.log(i);
                      lcount=0;

                      columnData = output[d.id].map(function(index){
                            // console.log(lcount,index);
                            var rObj = {};
                            rObj[dates[lcount]] = (index[dates[lcount]]);
                            lcount++;

                            // console.log(rObj);

                            return rObj;
                          });

                      console.log(columnData);

                      var returnObj = columnData.map(function(obj) {
                        return Object.keys(obj).sort().map(function(key) { 
                          return obj[key];
                        });
                      });

                      var returnObj = ([Object.keys(output)[0]]).concat(returnObj)

                      console.log(returnObj);

                      console.log(Object.keys(output)[0],'____________________________');

                      datesArray=[];

                      output[Object.keys(output)[0]].forEach(function(d, i) {

                        // console.log(moment([dates[i]], 'D MMM').format('D MMM'));

                        var dArray = [dates[i]];
                        datesArray.push(dArray);
                    
                      });

                      console.log(datesArray);


                      /*  Within Reloaded Pie-Chart - Enables Selection Based On Type
                      /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
                      /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
                      /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
                      /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
                      /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
                      /************************************************************************************/



                  var chart = c3.generate({
                        bindto: '#byDay',
                        data: {
                          columns: [
                              returnObj
                          ],
                          type: 'bar',
                          colors: {
                             'Building': 'rgb(31, 119, 180)',
                             'Demolition': 'rgb(140, 86, 75)',
                             'Electrical': 'rgb(44, 160, 44)',
                             'Other': 'rgb(127, 127, 127)',
                             'Mechanical': 'rgb(214, 39, 40)',
                             'Roof': 'rgb(255, 127, 14)',
                             'Plumbing': 'rgb(148, 103, 189)' ,
                             'Pool/Spa': 'rgb(188, 189, 34)',
                             'Fence': 'rgb(23, 190, 207)',
                             'Grading': 'rgb(227, 119, 194)'
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
                        // onclick: function(d, i) {
                        //   console.log('%^&%&%^%^&%*&^%*^');
                        //   chart.flush();
                        // }
                      });

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
              

      donut: {
       title :  'Select for breakdown'
      }   
    }) 

    setTimeout(function () {
      chart.groups([['Building','Demolition','Electrical','Other','Mechanical','Plumbing', 'Roof', 'Fence', 'Pool/Spa', 'Grading']])
    }, 1000);


    var records = [];

    // requestJSON(urlLast365, function(json) {

    //   var records = json.result.records 

    //   console.log(records, "#");

    //   records.forEach(function(record, inc, array) {
    //     record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
    //     console.log(record.AppliedDate, "*");
    //   })   
    
    //   console.log(records);

    //   var permitTypes = [];

    //   //Get a distinct list of neighborhoods
    //   for (var i = 0; i < records.length; i++) {
    //     permitTypes.push([records[i]["PermitTypeMapped"], records[i].count]);
    //   }

    //   console.log(permitTypes);

    //   return permitTypes;

    // })


    forceDelay(1500);

    

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