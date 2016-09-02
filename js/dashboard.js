// SET GLOBAL VARIABLES

var permitsResourceId = "d914e871-21df-4800-a473-97a2ccdf9690";
var inspectionsResourceId = "";
var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
// var fullStartDate = 1826;
var fullStartDate = 365;

var initialStartDate = 365;
var fstartDate = moment().subtract(fullStartDate, 'd').startOf('month').format("YYYY-MM-DD");
var startDate = moment().subtract(initialStartDate, 'd').startOf('month').format("YYYY-MM-DD");
// var shortStartDate = moment().subtract(30, 'd').format("YYYY-MM-DD");
var startDateMoment = moment().subtract(initialStartDate, 'd').startOf('month');
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

    PermitDashboard.cache = {};

  // Grab dropdown length of data to "breakdown"
  initialStartDate = document.getElementById('monthList-dropdown-menu').value;


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
    console.log("GGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTT");
    var records = json.result.records;

    var firstRecords = clone(records);

    PermitDashboard.cache.last365 = {
    records: records,
    url: urlLast365
    };

    console.log(PermitDashboard.cache.last365.records);
    console.log(firstRecords);
    console.log(PermitDashboard.cache.last365.records === firstRecords);

    //extract permits applied for the last year
    var appliedLast365Days = firstRecords.filter(function(d) { 
      return moment(d.AppliedDate) > startDateMoment; 
    });

    // //extract permits applied for in last 30 days
    // var appliedLast30Days = records.filter(function(d) { 
    //   return moment(d.AppliedDate) > shortStartDateMoment; 
    // });
    
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

    var types = [ "Building", "Roof", "Mechanical", "Electrical", "Plumbing", "Demolition", "Grading", "Other", "Pool/Spa", "Fence"];

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

    console.log(types, output);

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
    console.log("GGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTT");
    var records = json.result.records; 
    PermitDashboard.cache.permitTypesQ = {
      records: records,
      url: permitTypesQ
    };

    // records.forEach(function(record, inc, array) {
    //   record.AppliedDate = moment(record.AppliedDate);
    // })   
  
    console.log(records);

    var permitTypes = [];

    //Get a distinct list of neighborhoods
    for (var i = 0; i < records.length; i++) {
      permitTypes.push([records[i]["PermitTypeMapped"], records[i].count]);
    }

    console.log(permitTypes);
    /* PIE CHART INITIAL LOAD
    /* DATA PLOT */


    var chart = c3.generate({
      bindto: '#permitTypes',
      legend: function () {return false;},
      data: {
        columns: permitTypes,
        type : 'donut',
        onclick: function (d, i) {
          console.log("onclick", d.id, i);
          $("#innerSelectSubs").empty();
          $("#uniqueSelector").empty();
          clearDomElementUS();
          $(".monthly-dropdown-menu option:selected").val("");   

              // REMOVE CSS STYLE

          $("#uniqueSelector").html("<div style='display: inline-block'><i class='fa fa-bar-chart-o fa-fw'></i><span id='toggleWithPieClick'>Graph options - toggle between: <div class='btn-group' data-toggle='buttons'><label class='btn btn-primary btn-inline' id = '"+d.id+"' style = 'display: inline-block'><input type='radio' class='innerSelectSub' value='sub' autocomplete='off'> Subtype(s) </label></div>")

          var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

          // if (initialStartDate==12){
          //   $("#uniqueSelector").append("<span id='innerSelectSubs'></span>");
          // }

          console.log(initialStartDate);

          var startDate = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");
          var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";
          var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
          

          console.log(startDate, "***");

          console.log(urlLast365Query, "-------------");
        
          var records = [];

          /******************************************************************************/
          /* 
          /* DATA GRAB
          /*
          /******************************************************************************/

          var grabLast365 = PermitDashboard.cache.last365;  

          console.log(grabLast365)  

          requestJSONa(grabLast365, function(grabLast365) {

            console.log("1-", grabLast365);
            // console.log("2-", json);

            var records = grabLast365.records;
            var baRecords = clone(records);

            console.log("3-", baRecords);



            baRecords.forEach(function(record, inc, array) {
              record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
              // console.log(record.AppliedDate);
            })   

            var startDateMoment = moment().subtract(initialStartDate, 'months');

            console.log(startDateMoment);

            var appliedLast365Days = baRecords.filter(function(d) { 
              return moment(d.AppliedDate) > startDateMoment; 
            });


            var appliedLastYearByType = appliedLast365Days.filter(function(o) {
              return o.PermitTypeMapped === d.id;
            });

   
             //Get a distinct list of neighborhoods
            for (var i = 0; i < baRecords.length; i++) {
              permitTypes.push([baRecords[i]["PermitTypeMapped"], baRecords[i].count]);
            }


            var appliedLast365Days = baRecords.filter(function(d) { 
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

                console.log(columnData);

                var returnObj = columnData.map(function(obj) {
                  return Object.keys(obj).sort().map(function(key) { 
                    return obj[key];
                  });
                });

                var returnObj = ([Object.keys(output)[0]]).concat(returnObj);

                console.log(returnObj);

                window.returningObj = returnObj;

                console.log(Object.keys(output)[0],'____________________________');

                datesArray=[];

                output[Object.keys(output)[0]].forEach(function(d, i) {

                  // console.log(moment([dates[i]], 'D MMM').format('D MMM'));

                  var dArray = [dates[i]];
                  datesArray.push(dArray);
              
                });

                console.log(datesArray);


                  /*  On Pie-Chart Click - Reloads The Bar-Chart With A Single Type
                  /*
                  /*  DATA PLOT
                  /*     
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
                  axis: {
                      y: {tick : {format: d3.format('d')}},
                      x: {
                      type: 'category',
                      categories: datesArray
                    }
                  }
                });     

                      //
                      // SUBTYPE BUTTON
                      //
                                
                        toggleSubtype = [];           
                        console.log('OOOOOOPS!');
                        $("#uniqueSelector").on('click', $(".monthly-dropdown-menu"),
                          function (){
                            var selectedSubtype = this.querySelector("div").querySelector("span").querySelector("div").querySelector("label").id;
                            console.log(selectedSubtype);
                            returnedObj = ToggleBarGraph(selectedSubtype, toggleSubtype, returnObj);
                            console.log('***', returnedObj, '***');
                          })
                      });

              

                console.log('****^^*****', $("#monthList-dropdown-menu").value)

                // });
        }
      },
 

      donut: {
       title :  'Select for breakdown'
      }   
    })   
  });

  
             
});


function monthSelect(months){

    var initialStartDate = document.getElementById('monthList-dropdown-menu').value;
    console.log(initialStartDate);

    var startDate = moment().subtract(initialStartDate, 'months').format("YYYY-MM-DD");    

    console.log(startDate, "***");
    $('#toggleWithPieClick').empty();
    $('#toggleWithPieClick').text(" Applications by Month ");
  
    var records = [];


    /********************************************************************************/
    /*  
    /*  DATA GRAB
    /*
    /********************************************************************************/

    var grabLast365 = window.PermitDashboard.cache.last365;     

    requestJSONa(grabLast365, function(last365) {

      var records = grabLast365.records; 

      var timeRecords = clone(records);

      var startDateMoment = moment().subtract(initialStartDate, 'months');

      switch (initialStartDate){

        case '1':
          timeRecords.forEach(function(record, increment, array) {
            record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
            console.log(record.AppliedDate, "%%");
          });

          var appliedLast365Days = timeRecords.filter(function(d) { 
            return moment(d.AppliedDate) > startDateMoment; 
          })

          console.log(appliedLast365Days);

          appliedLast365Days.forEach(function(rec, i, arr){
            appliedLast365Days[i]['AppliedDate'] = moment(appliedLast365Days[i]['AppliedDate']).format('MMM-DD');
          }); //= appliedLast365Days.AppliedDate.format('MM-DD');


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
          /*
          /*   DATA PLOT
          /************************************************************************************/



          var chart = c3.generate({
            bindto: '#byDay',
            data: {
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

        break;

        case '9':
        case '10':
        case '11':
        case '12':
        case '24':
        case '36':
        case '48':
        case '60':

          console.log(timeRecords.length);
          timeRecords.forEach(function(record, inc, array) {
            record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
            console.log(record.AppliedDate, "*");
          })

          console.log(timeRecords.length);
         
          var appliedLast365Days = timeRecords.filter(function(d) { 
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
          /*
          /*   DATA PLOT
          /************************************************************************************/


          var chart = c3.generate({
            bindto: '#byDay',
            data: {
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
         
        break;

           
        default:
          console.log(records, '$$$$$');

          weeklyBunch = [];


          for (var  i = 0; i<timeRecords.length; i++){
            var then = timeRecords[i].AppliedDate;


            // var thenYear=then.substr(0,4);
            // var thenMonth=then.substr(5,2);
            // var thenDay=then.substr(8,2);

            // var daysAgo = (timeSpanDays(thenYear, thenMonth, thenDay));


            var ago = moment(then);
            var weeksAgoLabel = ago.startOf('isoWeek').format('MMM-DD');
            weeklyBunch.push([timeRecords[i]["AppliedDate"], weeksAgoLabel]);


          }

          startDateMoment = startDateMoment.startOf('isoWeek');
          // console.log(weeksAgoLabel, startDateMoment);
          var appliedPerWeekLast365Days = weeklyBunch.filter(function(d) {
              return (moment(d[0]) > startDateMoment);
            });
          
          // console.log(appliedPerWeekLast365Days);
         
          var appliedLast365Days = timeRecords.filter(function(d) { 
            return moment(d.AppliedDate) > startDateMoment; 
          })

          console.log(appliedLast365Days);

          appliedLast365Days.forEach(function(day, inc, arr){
            // console.log(appliedLast365Days[inc], appliedPerWeekLast365Days[inc]);
            appliedLast365Days[inc]["week"] = appliedPerWeekLast365Days[inc][1];
          })

          console.log(appliedLast365Days);


          var appliedByDayByType = d3.nest()
            .key(function(d) { return d.week })
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
          /*
          /*    DATA PLOT
          /************************************************************************************/


          var chart = c3.generate({
            bindto: '#byDay',
            data: {
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

        break;

      };    

      // var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";

      // var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
        
      var records = [];



      /********************************************************************************/
      
      /*  DATA GRAB
      
      /********************************************************************************/

      var grabPermitTypesQ = PermitDashboard.cache.permitTypesQ;

      console.log(grabPermitTypesQ);

      requestJSONa(grabPermitTypesQ, function(json) {
        var records = grabPermitTypesQ.records;
        var repieRecords = clone(records); 

        repieRecords.forEach(function(record, inc, array) {
          record.AppliedDate = moment(record.AppliedDate);
        })   
      
        console.log(repieRecords);

        var permitTypes = [];

        //Get a distinct list of neighborhoods
        for (var i = 0; i < repieRecords.length; i++) {
          permitTypes.push([repieRecords[i]["PermitTypeMapped"], repieRecords[i].count]);
        }
      

        console.log(permitTypes);

        /*    Reloads Pie-Chart With Time-Frame Selected Data
        /*
        /*     DATA PLOT     
        /*
        /************************************************************************************/

        var chart = c3.generate({
          bindto: '#permitTypes',
          legend: {show: true},
          // legend: function () {return false;},
          data: {
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
                        },
            columns: permitTypes,
            type : 'donut',
            onclick: function (d, i) {
              console.log("onclick", d.id, i);
              var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

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

              requestJSONa(grabLast365, function(json) {
                var records = json.records 
                var rebarRecords = clone(records); 


                console.log(records, "#");

                switch (document.getElementById('monthList-dropdown-menu').value){

                  case '1':
                    rebarRecords.forEach(function(record, inc, array) {
                      record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
                      console.log(record.AppliedDate, "%%");
                    });
                  break;
                     
                  default:
                    rebarRecords.forEach(function(record, inc, array) {
                    record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
                    // console.log(record.AppliedDate, "*");
                  })   

                }; 

                var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

                var startDateMoment = moment().subtract(initialStartDate, 'M');

                console.log(startDateMoment);

                var appliedLast365Days = rebarRecords.filter(function(d) { 
                  return moment(d.AppliedDate) > startDateMoment; 
                });


                var appliedLastYearByType = appliedLast365Days.filter(function(o) {
                  return o.PermitTypeMapped === d.id;
                });

       
                 //Get a distinct list of neighborhoods
                for (var i = 0; i < records.length; i++) {
                  permitTypes.push([rebarRecords[i]["PermitTypeMapped"], rebarRecords[i].count]);
                }


                var appliedLast365Days = rebarRecords.filter(function(d) { 
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

                lcount=0;

                columnData = output[d.id].map(function(index){
                  var rObj = {};
                  rObj[dates[lcount]] = (index[dates[lcount]]);
                  lcount++;

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

                window.returningObj = returnObj;

                console.log(Object.keys(output)[0],'____________________________');

                datesArray=[];

                output[Object.keys(output)[0]].forEach(function(d, i) {


                var dArray = [dates[i]];
                datesArray.push(dArray);
            
              });

              console.log(datesArray);


              /*  Within Reloaded Pie-Chart - Enables Selection Based On Type
              
              /*    DATA PLOT
              
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
                axis: {
                    y: {tick : {format: d3.format('d')}},
                    x: {
                    type: 'category',
                    categories: datesArray
                  }
                }
              });

              
                    //
                    //     SUBTYPE BUTTON
                    //
                    //             
                    //     REMOVE INLINE CSS
                    

                    $('#toggleWithPieClick').empty();

                    document.getElementById("toggleWithPieClick").innerHTML= ("<span style='display: inline-block'><span></span><span id='toggleWithPieClick'>Graph options - toggle between: <span class='btn-group' data-toggle='buttons'><label class='btn btn-primary btn-inline' style = 'display: inline-block'><input type='radio' class='innerSelectSub' value='sub' autocomplete='off'> Subtype(s) </label></span>");
                          
                  $('#toggleWithPieClick').on('click', $('#innerSelectSub'), function(e){
                    console.log(d.id);
                    console.log(e);
                    console.log(e.target);
                    if ((toggleSubtypeDate%2)!=0){
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
                        axis: {
                            y: {tick : {format: d3.format('d')}},
                            x: {
                            type: 'category',
                            categories: datesArray
                          }
                        }
                      });
                    }

                    else{
                      subtypeVar = e.target.id  || d.id;
                      subtypeVar = subtypeVar.charAt(0);
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
  console.log("replacing");  
  var old_element = document.getElementById("uniqueSelector");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  console.log("replaced");
};