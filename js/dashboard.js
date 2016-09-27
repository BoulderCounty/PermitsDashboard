// SET GLOBAL VARIABLES

var permitsResourceId = "d914e871-21df-4800-a473-97a2ccdf9690";
var inspectionsResourceId = "";
var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
var selVar;
var fullStartDate = 1826;
// var fullStartDate = 365;

var url = window.location.href;    
if (url.indexOf('?') !== -1){
  selVar=location.search.slice(1);

  console.log(selVar);
  // url += '?12'
}else{
     var initialStartDate = 365;
}

var fstartDate = moment().subtract(fullStartDate, 'd').startOf('month').format("YYYY-MM-DD");
var startDate = moment().subtract(initialStartDate, 'd').startOf('month').format("YYYY-MM-DD");
// var shortStartDate = moment().subtract(30, 'd').format("YYYY-MM-DD");
var startDateMoment = moment().subtract(initialStartDate, 'd').startOf('month').format("YYYY-MM-DD");
// var shortStartDateMoment = moment().subtract(30, 'd');

var PermitDashboard = window.PermitDashboard || {};

var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + fstartDate + "' order by \"AppliedDate\"";
  // var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
      // encode URL
var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
  // var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));

var subtype="";
var returnedObj="";
var toggleSubtype=[];
var toggleSubtypeDate=[];

var d={};
d['id']="";


/******************************************************************************/

/* INITIAL DATA LOAD - Pre-rendered

/*****************************************************************************/

$(document).ready(function() {

  if ((!selVar) && (initialStartDate==365)){

    verify(selVar)

  }

  else (monthSelect(selVar));

});


var verify= function(selVar){

  PermitDashboard.cache = {};

  // Grab dropdown length of data to "breakdown"
  initialStartDate = (selVar || 12);


  /********************************************************************************/
  /* Get all activity in last year (START)
  /* 
  /* DATA GRAB
  /*
  /*    // Original data grab
  /*
  /********************************************************************************/

      // set up SQL query string
  var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + fstartDate + "' order by \"AppliedDate\"";
  // var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
      // encode URL
  var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
  // var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));



  requestJSON(urlLast365, function(json) {

    console.log("GGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTT_#1");

    var records = json.result.records;
    records.forEach(function(record, inc, array) {
      record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
      record.ShortAppliedDate = moment(record.AppliedDate).format('MMM-YY');
    })

    records.forEach(function(record, inc, array) {
      record.longAppliedDate = moment(record.AppliedDate).format();
    })


    var firstRecords = clone(records);

    PermitDashboard.cache.last365 = {
    records: records,
    url: urlLast365
    };

    // console.log(PermitDashboard.cache.last365.records);
    console.log(firstRecords);
    // console.log(PermitDashboard.cache.last365.records === firstRecords);

    //extract permits applied for the last year
    var appliedLast365Days = firstRecords.filter(function(d) { 
      console.log(d.AppliedDate, startDateMoment);
      return d.AppliedDate > startDateMoment; 
    });

    console.log(appliedLast365Days);

    // //extract permits applied for in last 30 days
    // var appliedLast30Days = records.filter(function(d) { 
    //   return moment(d.AppliedDate) > shortStartDateMoment; 
    // });
    
    //extract permits issued in last year
    var issuedLast365Days = firstRecords.filter(function(d) { 
      return d.IssuedDate > startDateMoment; 
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

    firstRecords.forEach(function(record, inc, array) {
      record.ShortAppliedDate = moment(record.AppliedDate).format('MMM-YY');
      record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
    })

    $("#newApplications").text(appliedLast365Days.length);
    $("#issuedPermits").text(issuedLast365Days.length);
    $("#totalConstructionValue").text(numeral(totalConstructionValue).format('( 0 a)'));

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
      .key(function(d) { return d.ShortAppliedDate })
      .key(function(d) { return d.PermitTypeMapped })
      .rollup (function(v) { return v.length })
      .entries(appliedLast365Days);

    // (B) Initiate arrays with type label 

    var types = [ "Building", "Roof", "Mechanical", "Electrical", "Plumbing", "Demolition", "Grading", "Other", "Pool/Spa", "Fence"];

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

    // (G) push the value into the type-labeled array
  
    var columnData = Object.keys(output).map(function(type) {
        var a = output[type].map(function(month){
          return month[Object.keys(month)[0]];
        });
        return [type].concat(a);
      })


    // (H) create the bar chart with months and types breakdown 
    /*
    /*  Bar Graph - Initial Load
    /*
    /* DATA PLOT

   
    /********************************************************************************/

    /********************************************************************************/
    /* Calculated permits applied for by day and by type (END)
    /********************************************************************************/


    /* INITIAL CONSTRUCTION OF BAR CHART (END)


    /********************************************************************************/
                        
    var chart = c3.generate({
      bindto: '#byDay',
      data: {
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
        columns: columnData,
        type: 'bar',
        onclick: function(d, i) {
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
      }
      
    });

  });
  /********************************************************************************/
  /* Get all permit details in last year (END)
  /********************************************************************************/
  

  /********************************************************************************/
  /* Permits by type (START) - pie chart showing ratio of types
  /*
  
  /* DATA GRAB
  /********************************************************************************/ 

  // Get the number of instances of each type


  var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + fstartDate + "' group by \"PermitTypeMapped\" order by Count desc";

  var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
      
  var records = [];

  requestJSON(permitTypesQ, function(json) {
    console.log("GGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTT_#2");
    var records = json.result.records; 
    PermitDashboard.cache.permitTypesQ = {
      records: records,
      url: permitTypesQ
    };
  

    var permitTypes = [];

    //Get a distinct list of neighborhoods
    for (var i = 0; i < records.length; i++) {
      permitTypes.push([records[i]["PermitTypeMapped"], records[i].count]);
    }


    /* PIE CHART INITIAL LOAD
    /* DATA PLOT */


    var chart = c3.generate({
      bindto: '#permitTypes',
      legend: function () {return false;},
      data: {
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
        columns: permitTypes,
        type : 'donut',
        onclick: function (d, i) {
          console.log("onclick", d.id, i);
          $("#innerSelectSubs").empty();
          $("#uniqueSelector").empty();
          clearDomElementUS();
          $(".monthly-dropdown-menu option:selected").val("");   

              // REMOVE CSS STYLE

          $("#uniqueSelector").html("<div style='display: inline-block'><i class='fa fa-bar-chart-o fa-fw'></i><span id='toggleWithPieClick'>Graph options - toggle between: <div class='btn-group' data-toggle='buttons'><label class='btn btn-primary btn-inline' id = '"+d.id+"' style = 'display: inline-block; border-top-right-radius: 0px; border-bottom-right-radius: 0px; width: 120px; margin-top: 2px;'><input type='radio' class='innerSelectSub' value='sub' autocomplete='off'> Subtype(s) </label></div>")

          var initialStartDate = selVar;

          var startDate = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");
          var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";
          var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
          
        
          var records = [];

          /******************************************************************************/
          /* 
          /* DATA GRAB
          /*
          /******************************************************************************/

          var grabLast365 = PermitDashboard.cache.last365;  

          requestJSONa(grabLast365, function(grabLast365) {

            var records = grabLast365.records;
            var baRecords = clone(records);
            var barredRecords = clone(records);

         

            var startDateMoment = moment().subtract(initialStartDate, 'months');
            startDateMoment = moment(startDateMoment).startOf('month');
            console.log(startDateMoment);


            baRecords.forEach(function(record, inc, array) {
              record['LongAppliedDate'] = moment(record.AppliedDate).format('YYYY-MM-DD');

              record.ShortAppliedDate = moment(record.AppliedDate).format('YYYY-MM');

              console.log(record.AppliedDate);
            })   



            var appliedLast365Days = baRecords.filter(function(d) { 
              return moment(d.LongAppliedDate) > startDateMoment; 
            });


            var appliedLastYearByType = appliedLast365Days.filter(function(o) {
              return o.PermitTypeMapped === d.id;
            });

   
             //Get a distinct list of neighborhoods
            for (var i = 0; i < baRecords.length; i++) {
              permitTypes.push([baRecords[i]["PermitTypeMapped"], baRecords[i].count]);
            }

            // var appliedLast365Days = baRecords.filter(function(d) { 
            //   return moment(d.AppliedDate) > startDateMoment; 
            // });
                
            var appliedByDayByType = [];

              // compiles array for bar-graph
            var appliedByDayByType = d3.nest()

              // concatenates date
              .key(function(d) { return d.ShortAppliedDate })

              // concatanates type
              .key(function(d) { return d.PermitTypeMapped })

              // takes the records and creates a count
              .rollup (function(v) { return v.length })

              // creates a d3 object from the records
              .entries(appliedLastYearByType);

            var types = ["Plumbing", "Other", "Roof", "Electrical", "Mechanical", "Building", "Demolition", "Pool/Spa", "Grading", "Fence"];

            var output = [];

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

                lcount=0;

                console.log(d.id);

                columnData = output[d.id].map(function(index){
                      // console.log(lcount,index);
                      var rObj = {};
                      rObj[dates[lcount]] = (index[dates[lcount]]);
                      lcount++;

                      // console.log(rObj);

                      return rObj;
                    });

                var returnObj = columnData.map(function(obj) {
                  return Object.keys(obj).sort().map(function(key) { 
                    return obj[key];
                  });
                });

                var returnObj = ([Object.keys(output)[0]]).concat(returnObj);

                window.returningObj = returnObj;

                console.log(Object.keys(output)[0],'_____');

                datesArray=[];

                output[Object.keys(output)[0]].forEach(function(d, i) {

                  var dArray = [dates[i]];
                  datesArray.push(dArray);
              
                });

                var ar = [];

                for (var i = 0; i < output[d.id].length; i++){
                  for(item in output[d.id][i]){
                      ar.push(output[d.id][i][item]);
                   }
                }

                console.log(ar);


                var total = 0;

                wereSum = ar.reduce((pv, cv) => pv+cv, 0);

                // var wereTotal = function (data) {
                //   for(var i=0, n=data.length; i < n; i++){ 
                //         total=total+data[i];
                //        }
                //   return total;
                //   };

                 //total construction value for new project in last year
                  var totalConstructionValue = d3.sum(appliedLast365Days, function(d) {
                    return Number(d.EstProjectCost);
                  });


                  // format record.AppliedDate to drop days and years
                  // ?? DOES THIS DO ANYTHING IN THIS LOCATION ??

                  // firstRecords.forEach(function(record, inc, array) {
                  //   record.AppliedDate = moment(record.AppliedDate).format('MMM-YY');
                  // })

                  $("#newApplications").text(wereSum);
                  $("#issuedPermits").text("n/a");
                  $("#totalConstructionValue").text(numeral(totalConstructionValue).format('( 0 a)'));

                  /*  On Pie-Chart Click - Reloads The Bar-Chart With A Single Type
                  /*
                  /*  DATA PLOT
                  /*     
                  /************************************************************************************/
                returnObjChart(returnObj, datesArray)    

                //
                // SUBTYPE BUTTON
                //
                          
                  toggleSubtype = [];           
                  $("#uniqueSelector").on('click', $(".monthly-dropdown-menu"),
                    function (){
                      console.log(this);
                      var selectedSubtype = this.querySelector("div").querySelector("span").querySelector("div").querySelector("label").id;
                      console.log(selectedSubtype);
                      returnedObj = ToggleBarGraph(selectedSubtype, '', returnObj);
                      // console.log('***', returnedObj, '***');
                    })
                });

        

                console.log('****^^*****', $("#monthList-dropdown-menu").value)

        }
      },
 

      donut: {
       title :  'Select for breakdown'
      }   
    })  

    console.log('pop');
  });





};


function monthSelect(months){

     var country = document.getElementById("monthList-dropdown-menu");
     console.log("index.html?"+months.toString());
     // country.options[country.options.selectedIndex].selected='false';
     country.value=("index.html?"+months.toString());
    // console.log(country);

    var initialStartDate = months;

    var startDate = moment().subtract(initialStartDate, 'months').format("YYYY-MM-DD"); 

    // console.log(PermitDashboard.cache.last365.records);
    // console.log(firstRecords);
    // console.log(PermitDashboard.cache.last365.records === firstRecords);


  
    var records = [];


    /********************************************************************************/
    /*  
    /*  DATA GRAB
    /*
    /********************************************************************************/

    PermitDashboard.cache = {};  

    requestJSON(urlLast365, function(last365) {

      var records = last365.result.records; 

      var timeRecords = clone(records);

      var firstRecords = clone(records);

      PermitDashboard.cache.last365 = {
      records: records
      // url: urlLast365
      };

      if (initialStartDate > 6){
        var startDateMoment = moment().subtract(initialStartDate, 'months').startOf('month');
      }
      else{
        var startDateMoment = moment().subtract(initialStartDate, 'months');
      }


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

      $("#newApplications").text(appliedLast365Days.length);
      $("#issuedPermits").text(issuedLast365Days.length);
      $("#totalConstructionValue").text(numeral(totalConstructionValue).format('( 0 a)'));

      var bld;
      var roof;
      var mech;
      var ele;
      var plm;
      var demo;
      var grad;
      var other;
      var spa;
      var fnc;
      var datesArray;

      switch (initialStartDate){


        case '1':


          console.log(startDate, "***");
          $('#toggleWithPieClick').empty();
          $('#toggleWithPieClick').text(" Applications by Day ");

          var appliedLast365Days = timeRecords.filter(function(d) { 
            return moment(d.AppliedDate) > startDateMoment; 
          })

          appliedLast365Days.forEach(function(rec, i, arr){
            appliedLast365Days[i]['AppliedDate'] = moment(appliedLast365Days[i]['AppliedDate']).format('MMM-DD');
          });

          var returnedData = BreakItDown(timeRecords, appliedLast365Days);

          timeRecords.forEach(function(record, increment, array) {
            record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
          });

          var bld = returnedData.bld;
          var roof = returnedData.roof;
          var mech = returnedData.mech;
          var ele = returnedData.ele;
          var plm = returnedData.plm;
          var demo = returnedData.demo;
          var grad = returnedData.grad;
          var other = returnedData.other;
          var spa = returnedData.spa;
          var fnc = returnedData.fnc;
          var datesArray = returnedData.datesArray;

        break;

        case '7':
        case '8':
        case '9':
        case '10':
        case '11':
        case '12':
        case '24':
        case '36':
        case '48':
        case '60':



          console.log(startDate, "***");
          $('#toggleWithPieClick').empty();
          $('#toggleWithPieClick').text(" Applications by Month ");


          startDateMoment = moment(startDateMoment).startOf('month');

          var appliedLast365Days = timeRecords.filter(function(d) { 
            return moment(d.AppliedDate) > startDateMoment; 
          })

          appliedLast365Days.forEach(function(rec, i, arr){
            appliedLast365Days[i]['AppliedDate'] = moment(appliedLast365Days[i]['AppliedDate']);
          });


          timeRecords.forEach(function(record, inc, array) {
            record.AppliedDate = moment(record.AppliedDate).format('MMM-YYYY');
          })

          var returnedData = BreakItDown(timeRecords, appliedLast365Days);

          var bld = returnedData.bld;
          var roof = returnedData.roof;
          var mech = returnedData.mech;
          var ele = returnedData.ele;
          var plm = returnedData.plm;
          var demo = returnedData.demo;
          var grad = returnedData.grad;
          var other = returnedData.other;
          var spa = returnedData.spa;
          var fnc = returnedData.fnc;
          var datesArray = returnedData.datesArray;
           
          break;

           
        default:


          console.log(startDate, "***");
          $('#toggleWithPieClick').empty();
          $('#toggleWithPieClick').text(" Applications by Week ");

          weeklyBunch = [];


          for (var  i = 0; i<timeRecords.length; i++){
            var then = timeRecords[i].AppliedDate;


            var ago = moment(then);
            var weeksAgoLabel = ago.startOf('isoWeek').format('MMM-DD');
            weeklyBunch.push([timeRecords[i]["AppliedDate"], weeksAgoLabel]);


          }

          startDateMoment = startDateMoment.startOf('isoWeek');
          var appliedPerWeekLast365Days = weeklyBunch.filter(function(d) {
              return (moment(d[0]) > startDateMoment);
            });
          
          // console.log(appliedPerWeekLast365Days);
         
          var appliedLast365Days = timeRecords.filter(function(d) { 
            return moment(d.AppliedDate) > startDateMoment; 
          })


          appliedLast365Days.forEach(function(day, inc, arr){
            appliedLast365Days[inc]["week"] = appliedPerWeekLast365Days[inc][1];
          })

          var returnedData = BreakItDown(timeRecords, appliedLast365Days);

        
          var bld = returnedData.bld;
          var roof = returnedData.roof;
          var mech = returnedData.mech;
          var ele = returnedData.ele;
          var plm = returnedData.plm;
          var demo = returnedData.demo;
          var grad = returnedData.grad;
          var other = returnedData.other;
          var spa = returnedData.spa;
          var fnc = returnedData.fnc;
          var datesArray = returnedData.datesArray;

        break;
  

      };    


      /*  Loads Bar-Chart With Time-Frame Selected Data
      /*
      /*   DATA PLOT
      /************************************************************************************/        

      console.log('reload');

      wholePieChart(bld, roof, mech, ele, plm, demo, grad, other, spa, fnc, datesArray);    

      // var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";

      // var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
        
      var records = [];



      /********************************************************************************/
      
      /*  DATA GRAB
      
      /********************************************************************************/

      var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";

      var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));

      // var grabPermitTypesQ = PermitDashboard.cache.permitTypesQ;


      console.log(permitTypesQ);

      console.log('REPIE');
      
      requestJSON(permitTypesQ, function(json) {
        console.log("GGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTT_#X");
        var records = json.result.records; 
        // var records = PermitTypesQ.records;
        var repieRecords = clone(records); 


        repieRecords.forEach(function(record, inc, array) {
          record.AppliedDate = moment(record.AppliedDate);
        })   

        repieRecording = repieRecords.filter(function(d) { 
            return moment(d.AppliedDate) > startDateMoment; 
          })
        
        console.log(repieRecording)

        var permitTypes = [];

        //Get a distinct list of neighborhoods
        for (var i = 0; i < repieRecording.length; i++) {
          permitTypes.push([repieRecording[i]["PermitTypeMapped"], repieRecording[i].count]);
        }
      

        /*    Reloads Pie-Chart With Time-Frame Selected Data
        /*
        /*     DATA PLOT     
        /*
        /************************************************************************************/
        wholePieChart(bld, roof, mech, ele, plm, demo, grad, other, spa, fnc, datesArray)
        
        var chart = c3.generate({
          bindto: '#permitTypes',
          legend: {show: true},
          // legend: function () {return false;},
          data: {
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
            columns: permitTypes,
            type : 'donut',
            onclick: function (d, i) {
              console.log("onclick", d.id, i);
              var initialStartDate = months;

              if (initialStartDate > 6) {
                initialStartDate = (parseInt(initialStartDate) + 1);
              }

              var startDate = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");
              var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";
              var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
              

              console.log(startDate, "***");

              console.log(urlLast365Query, "-------------");
            
              var records = [];



              /********************************************************************************/
              
              /*  DATA GRAB 

              /********************************************************************************/


              var grabLast365 = PermitDashboard.cache.last365;

              console.log(grabLast365);

              requestJSONa(grabLast365, function(json) {
                var records = json.records 
                var rebarRecords = clone(records); 

                console.log(months);
                // console.log(document.getElementById('monthList-dropdown-menu').value, "#");

                switch (months){

                  case '1':
                    rebarRecords.forEach(function(record, inc, array) {
                      record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
                      console.log(record.AppliedDate, "%%");
                    });

                    weeklyBunch = [];
                  break;

                  case '2':
                  case '3':
                  case '4':
                  case '5':
                  case '6':


                    weeklyBunch = [];


                    for (var  i = 0; i<rebarRecords.length; i++){
                      var then = rebarRecords[i].AppliedDate;


                      var ago = moment(then);
                      var weeksAgoLabel = ago.startOf('isoWeek').format('MMM-DD-YY');
                      weeklyBunch.push([timeRecords[i]["AppliedDate"], weeksAgoLabel]);


                    };

                    console.log(weeklyBunch);
                   

                    console.log('WEEKS');

                  break;

                  default:
                    rebarRecords.forEach(function(record, inc, array) {
                    record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');

                    weeklyBunch=[];
                  })   

                };

                var initialStartDate = months;
                if (initialStartDate > 6){
                  initialStartDate = (parseInt(initialStartDate) + 1);
                }
                // THERE ARE SOME DUPLICATE EQUATIONS BETWEEN THESE COMMENTS USED TO COMPUTE WEEKLY TOTALS IN PARALLEL = TOP

                var startDateMoment = moment().subtract(initialStartDate, 'M');
                var weekStartDateMoment =  startDateMoment.startOf('isoWeek');
                console.log(weekStartDateMoment);


                var appliedLast365Days = rebarRecords.filter(function(d) { 
                  return moment(d.AppliedDate) > startDateMoment; 
                });

                var appliedPerWeekSelectedDays = weeklyBunch.filter(function(d) {
                  return (moment(d[0]) > weekStartDateMoment);
                });


                var appliedLastYearByType = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === d.id;
                });

       
                 //Get a distinct list of neighborhoods?

                for (var i = 0; i < rebarRecords.length; i++) {
                  permitTypes.push([rebarRecords[i]["PermitTypeMapped"], rebarRecords[i].count]);
                }
                  
                if (initialStartDate > 1 && initialStartDate < 7){

                  appliedLast365Days.forEach(function(day, inc, arr){
                    appliedLast365Days[inc]["week"] = appliedPerWeekSelectedDays[inc][1];
                  });

                };

                var appliedByDayByType = [];
                var weeklyAppliedByDayByType = [];

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

                var weeklyAppliedByDayByType = d3.nest()  

                  // concatenates date
                  .key(function(d) { return d.week })

                  // concatanates type
                  .key(function(d) { return d.PermitTypeMapped })

                  // takes the records and creates a count
                  .rollup (function(v) { return v.length })

                  // creates a d3 object from the records
                  .entries(appliedLastYearByType);

                var types = ["Plumbing", "Other", "Roof", "Electrical", "Mechanical", "Building", "Demolition", "Pool/Spa", "Grading", "Fence"];

                var output = [];
                var weeklyOutput = [];

                console.log(appliedLastYearByType);
                console.log(weeklyAppliedByDayByType);

                output[d.id] = appliedByDayByType.map(function(month) {
                    var o = {};
                    o[month.key] = month.values.filter(function(val) {
                      return val.key == d.id;
                    }).map(function(m) { return m.values; }).shift() || 0;
                    return o;
                  })

              

                weeklyOutput[d.id] = weeklyAppliedByDayByType.map(function(month){
                    var o = {};
                    o[month.key] = month.values.filter(function(val) {
                      return val.key == d.id;
                    }).map(function(m) { return m.values; }).shift() || 0;
                    return o;
                })
                           
                console.log(output);
                console.log(weeklyOutput);

                console.log(appliedByDayByType);

                var dates = appliedByDayByType.map(function(date) {
                  return date.key;
                });

                var weeklyDates = weeklyAppliedByDayByType.map(function(date) {
                  return date.key;
                })

                requestJSONa(grabLast365, function(last365) {

                  var records = grabLast365.records;
                  var firstRecords = clone(records);


                  firstRecords = firstRecords.filter(function(r){
                    return  r['PermitTypeMapped'] == d.id;
                  })


                  var ar = [];

                  for (var i = 0; i < output[d.id].length; i++){
                    for(item in output[d.id][i]){
                        ar.push(output[d.id][i][item]);
                     }
                  };

                  console.log(ar);

                  //extract permits applied for the last year
                  var appliedLast365Days = firstRecords.filter(function(d) { 
                    return moment(d.AppliedDate) > startDateMoment; 
                  });

                  
                  //extract permits issued in last year
                  var issuedLast365Days = firstRecords.filter(function(d) { 
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

                  firstRecords.forEach(function(record, inc, array) {
                    record.AppliedDate = moment(record.AppliedDate).format('MMM-YY');
                  })

                  $("#newApplications").text(appliedLast365Days.length);
                  $("#issuedPermits").text(issuedLast365Days.length);
                  $("#totalConstructionValue").text(numeral(totalConstructionValue).format('( 0 a)'));

                })



                var columnData=[];
                var weeklyColumnData=[];

                lcount=0;

                columnData = output[d.id].map(function(index){
                  var rObj = {};
                  rObj[dates[lcount]] = (index[dates[lcount]]);
                  lcount++;
                  return rObj;
                });

                lcount=0;

                weeklyColumnData = weeklyOutput[d.id].map(function(index){
                  var rObj = {};
                  rObj[weeklyDates[lcount]] = (index[weeklyDates[lcount]]);
                  lcount++;
                  return rObj;
                });

                console.log(columnData);
                console.log(weeklyColumnData);

                var returnObj = columnData.map(function(obj) {
                  return Object.keys(obj).sort().map(function(key) { 
                    return obj[key];
                  });
                });

                var weeklyReturnObj = weeklyColumnData.map(function(obj){
                  return Object.keys(obj).sort().map(function(key) { 
                    return obj[key];
                  });
                })


                console.log(weeklyReturnObj);

                returnObj = ([Object.keys(output)[0]]).concat(returnObj)

                weeklyReturnObj = ([Object.keys(output)[0]]).concat(weeklyReturnObj)

                console.log(weeklyReturnObj);

                window.returningObj = weeklyReturnObj;
                window.datesingArray = datesArray;
                // window.weeklyReturningObj = returnObj;

                console.log(Object.keys(output)[0],'____________________________');

                datesArray=[];

                output[Object.keys(output)[0]].forEach(function(d, i) {

                  var dArray = [dates[i]];
                  datesArray.push(dArray);
              
                });

                weeklyDatesArray=[];

                weeklyOutput[Object.keys(weeklyOutput)[0]].forEach(function(d, i) {

                  var wdArray = [weeklyDates[i]];
                  weeklyDatesArray.push(wdArray);
              
                });

                console.log(datesArray);

                    // THERE ARE SOME DUPLICATE EQUATIONS BETWEEN THESE COMMENTS USED TO COMPUTE WEEKLY TOTALS IN PARALLEL = BOTTOM

                  /*  Within Reloaded Pie-Chart - Enables Selection Based On Type
                  
                  /*    DATA PLOT
                  
                  /************************************************************************************/
                
                switch (months){
                  // document.getElementById('monthList-dropdown-menu').value){

                  case '2':
                  case '3':
                  case '4':
                  case '5':
                  case '6':

                    returnObjChart(weeklyReturnObj, weeklyDatesArray);

                  break;

                  default:

                    returnObjChart(returnObj, datesArray);

                }
                    //
                    //     SUBTYPE BUTTON
                    //
                    //             
                    //     REMOVE INLINE CSS
                    

                    $('#toggleWithPieClick').empty();

                    document.getElementById("toggleWithPieClick").innerHTML= ("<span style='display: inline-block; border-top-right-radius: 0px; border-bottom-right-radius: 0px; width: 400px; margin-top: 2px;'>Graph options - toggle between: <span class='btn-group' data-toggle='buttons'><label class='btn btn-primary btn-inline' style = 'display: inline-block; border-top-right-radius: 0px; border-bottom-right-radius: 0px;'><input type='radio' class='innerSelectSub' value='sub' autocomplete='off'> Subtype(s) </label></span></span>");
                    $('#uniqueSelector').css({'padding-top': '14px'});

                  $('#toggleWithPieClick').on('click', $('#innerSelectSub'), function(e){
                    console.log(d.id);
                    console.log(e);
                    console.log(e.target);
                    if ((toggleSubtypeDate%2)!=0){

                     returnObjChart(returnObj, datesArray)
                    
                    }

                    else{
                      subtypeVar = e.target.id  || d.id;
                      subtypeVar = (subtypeVar.charAt(0)+subtypeVar.charAt(1));
                      console.log(subtypeVar);
                      SubtypeRadioButtons(subtypeVar);
                    }

                    toggleSubtypeDate++;
                  });

                  $(document).on('select', $('.monthly-dropdown-menu'), function(e){
                    console.log(e);
                    subtypeVar = e.target.id  || d.id;
                    subtypeVar = subtypeVar.charAt(0);
                    console.log(subtypeVar);
                    SubtypeRadioButtons(subtypeVar);
                  });


                })
              }
            },

          donut: {
           title :  'Select for breakdown'
          }   
        }) 

    // setTimeout(function () {
    //   chart.groups([['Building','Demolition','Electrical','Other','Mechanical','Plumbing', 'Roof', 'Fence', 'Pool/Spa', 'Grading']])
    // }, 1000);
    var label = d3.select('text.c3-chart-arcs-title');

    console.log(label.text);

    var records = [];

    

    forceDelay(1500);

    

      });
  
  });

  function forceDelay(millis) {
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); } 
      while (curDate - date < millis);
  }


};


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


 function clone(obj) {
      if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

      if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
      else
        var temp = obj.constructor();

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj['isActiveClone'] = null;
          temp[key] = clone(obj[key]);
          delete obj['isActiveClone'];
        }
      }

      return temp;
    }

function requestJSONa(JSONa, callback) {
  callback(JSONa);
  return JSONa;
};

function timeSpanDays(year, month, day){
  now = new Date();
  dateEnd = new Date(year, month - 1, day); // months are zero-based
  days = (dateEnd - now) / 1000/60/60/24;   // convert milliseconds to days
  return Math.round(days);
}

function clearDomElementUS(){
  var old_element = document.getElementById("uniqueSelector");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
};

function wholePieChart(bld, roof, mech, ele, plm, demo, grad, other, spa, fnc, datesArray){
  var chart = c3.generate({
    bindto: '#byDay',
    data: {
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
      columns: [
          bld,
          roof,
          mech,
          ele,
          plm,
          demo,
          grad,
          other,
          spa,
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
}


function returnObjChart(returnObj, datesArray){
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
};     