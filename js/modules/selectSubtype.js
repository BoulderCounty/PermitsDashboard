var SelectSubtype = function selectSubtype(subtype){

    var appliedPerWeekLast365Day={};
    var appliedLast365Days={};
    var records={};
    // console.log($("#uniqueSelector .monthly-dropdown-menu").length);
    // var c = document.getElementById('subtypeMenu');
    // console.log(c);
    // $('#subtypeMenu').unbind('change');

  var initialStartDate = document.getElementById('monthList-dropdown-menu').value;
  console.log(initialStartDate);

  console.log(subtype,"^^");
  var breaker = document.getElementById('monthList-dropdown-menu').value;
  var typeM = subtype.substr(0, 2);
  var subtype = subtype.slice(2);


    /********************************************************************************/
    /* Get all activity in last year (START)
    /*
    /* DATA GRAB
    /*
    /********************************************************************************/

    // Original data grab
  // var initialStartDate = 365;

  if (initialStartDate > 6) {
                initialStartDate = (parseInt(initialStartDate));
              }

  var startDate = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");
  var startDateMoment = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");

      // set up SQL query string
  // var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + startDate + "' order by \"AppliedDate\"";
  // var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
      // encode URL
  // var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
  // var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));

  var records=[];

  var grabLast365 = PermitDashboard.cache.last365;  

  requestJSONa(grabLast365, function(json) {
      var records = json.records;
      var subRecords = clone(records); 
      var subRecords2 = clone(records); 


  console.log(subRecords)

    subRecords2 = subRecords.filter(function(record){
      return ((record["PermitType"]) == subtype && (moment(record.AppliedDate).format("YYYY-MM-DD") > startDateMoment))
    })


  console.log(subRecords2.length)


    //extract permits applied for the last year
    var appliedLast365Days = subRecords.filter(function(d) { 
      return moment(d.longAppliedDate).format("YYYY-MM-DD") > startDateMoment; 
    });

    //extract permits issued in last year
    var issuedLast365Days2 = records.filter(function(d) { 
      return ((d["PermitType"]) == subtype && (moment(d.IssuedDate).format("YYYY-MM-DD") > startDateMoment)); 
    });

       //total construction value for new project in last year
    var totalConstructionValue2 = d3.sum(subRecords2, function(d) {
      return Number(d.EstProjectCost);
    });

    console.log(appliedLast365Days.length);


    $("#newApplications").text(subRecords2.length);
    $("#issuedPermits").text(issuedLast365Days2.length);
    $("#issuedPermits").show();
    $("#totalConstructionValue").text(numeral(totalConstructionValue2).format('( 0 a)'));


    // format record.AppliedDate to drop days and years
    // ?? DOES THIS DO ANYTHING IN THIS LOCATION ??

    if (breaker < 7) {
      records.forEach(function(record, inc, array) {
        record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');

        weeklyBunch = [];

      })

      for (var  i = 0; i<appliedLast365Days.length; i++){
        var then = appliedLast365Days[i].AppliedDate;

        var ago = moment(then).format("YYYY-MM-DD");
        var weeksAgo = ago.startOf('isoWeek').format('YYYY-MM-DD');
        weeklyBunch.push([appliedLast365Days[i]["longAppliedDate"], ago, weeksAgo]);

      }

      console.log(weeklyBunch.length);

    }

    else {
      records.forEach(function(record, inc, array) {
        record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');

      })

      weeklyBunch = [];

      for (var  i = 0; i<appliedLast365Days.length; i++){
        var then = appliedLast365Days[i].longAppliedDate;
        var ago = moment(then);
        // .subtract(1, "months");
        var weeksAgo = ago.startOf('isoWeek').format("YYYY-MM");
        weeklyBunch.push([appliedLast365Days[i]["longAppliedDate"], ago, weeksAgo]);

      }
    }


    /* INITIAL CONSTRUCTION OF BAR CHART (START)


    /********************************************************************************/
    /* Calculated permits applied for by day and by type (START)
    /********************************************************************************/

    /********************************************************************************/
    
    // weeklyBunch = [];


    // for (var  i = 0; i<appliedLast365Days.length; i++){
    //   var then = appliedLast365Days[i].AppliedDate;



    //   var ago = moment(then);
    //   var weeksAgo = ago.startOf('isoWeek').format('YYYY-MM');
    //   weeklyBunch.push([appliedLast365Days[i]["AppliedDate"], ago, weeksAgo]);

    // }

    // console.log(weeklyBunch.length);

    var appliedPerWeekLast365Days = weeklyBunch;

    // .filter(function(d) {
    //     // console.log(moment(d[1]),"*********",startDateMoment);
    //     return (moment(d[1]).diff(startDateMoment) >= 0);
    // });
    

    console.log(appliedPerWeekLast365Days.length);
    // var appliedLast365Days = records.filter(function(d) { 
    //   return moment(d.AppliedDate) > startDateMoment; 
    // })

    appliedLast365Days.forEach(function(day, inc, arr){
      console.log(appliedLast365Days[inc],"#####", appliedPerWeekLast365Days[inc][2]);
      appliedLast365Days[inc]["week"] = appliedPerWeekLast365Days[inc][2];
    });

    // creates the data object
    // FURTHER DESCRIPTION NECESSARY {key_Month : [ {key_type : numb }]}

    // console.log(appliedPerWeekLast365Days);

    console.log(appliedLast365Days);

    if (breaker < 7) { 
      var appliedByDayBySubtype = d3.nest()
        .key(function(d) { return d.AppliedDate })
        .key(function(d) { return d.PermitType })
        .rollup (function(v) { return v.length })
        .entries(appliedLast365Days);

        console.log('days');

      }

    else {

      var appliedByDayBySubtype = d3.nest()
        .key(function(d) { return d.week })
        .key(function(d) { return d.PermitType })
        .rollup (function(v) { return v.length })
        .entries(appliedLast365Days);

      }

    console.log(appliedByDayBySubtype);

    var subColor = {};

                           // 'Electrical': 'hsl(360, 69.2%, 49.6%)',
                           // 'Other': 'hsl(0, 0%, 49.8%)',
                           // 'Mechanical': 'hsl(120, 56.9%, 40.0%)',
                           // 'Roof': 'hsl(30, 100%, 50.2%)',
                           // 'Plumbing': 'hsl(271, 39.4%, 57.3%)' ,
                           // 'Pool/Spa': 'hsl(60, 69.5%, 43.7%)',
                           // 'Fence': 'hsl(186, 80%, 45.1%)',
                           // 'Grading': 'hsl(318, 65.9%, 67.8%)'
    // Initiate arrays with type label 

    switch(typeM) {

      case "bu":
        var subtypes = ["Other","NRB","New Residence","RA","Residential Accessory Building","Residential Addition","Residential Remodel","Commercial Remodel","NCR","Accessory Agricultural Building"];

        var subColor = {   
                        "Other" : 'hsl(205, 70.6%, 1.4%)',
                        "NRB" : 'hsl(205, 70.6%, 11.4%)',
                        "New Residence" : 'hsl(205, 70.6%, 21.4%)',  
                        "RA" : 'hsl(205, 70.6%, 31.4%)',
                        "Residential Accessory Building" : 'hsl(205, 70.6%, 41.4%)', 
                        "Residential Addition" : 'hsl(205, 70.6%, 51.4%)',
                        "Residential Remodel" : 'hsl(205, 70.6%, 61.4%)',
                        "Commercial Remodel" : 'hsl(205, 70.6%, 71.4%)', 
                        "NCR" : 'hsl(205, 70.6%, 81.4%)',
                        "Accessory Agricultural Building" : 'hsl(205, 70.6%, 91.4%)'
                        };
     

        $(function() {
            $("#bld-monthly-dropdown-menu").val('bu'+subtype);
        });
        
      break;
    
      case "me":
        var subtypes = ["Air Conditioning","Boiler","Evaporative Cooler","Furnace","Gas Log Fireplace","Other","Wood Stove","Solar Thermal"];

        subColor =  {
                    "Air Conditioning": 'hsl(120, 56.9%, 10.0%)',
                    "Boiler": 'hsl(120, 56.9%, 20.0%)',
                    "Evaporative Cooler": 'hsl(120, 56.9%, 30.0%)',
                    "Furnace": 'hsl(120, 56.9%, 40.0%)',
                    "Gas Log Fireplace": 'hsl(120, 56.9%, 50.0%)',
                    "Other": 'hsl(120, 56.9%, 60.0%)',
                    "Wood Stove": 'hsl(120, 56.9%, 70.0%)',
                    "Solar Thermal": 'hsl(120, 56.9%, 80.0%)'
                  };

        $(function() {
                $("#mch-monthly-dropdown-menu").val('me'+subtype);
        });
            

      break;
    
      case "el":
        var subtypes = ["Commercial Electric", "Electrical Lift Station", "Electrical Re-Wiring", "Electrical Service Change", "Temporary Electrical Service", "Generator", "Solar Electrical System", "Other"];
   
        subColor = {"Commercial Electric": 'hsl(360, 69.2%, 19.6%)',
                     "Electrical Lift Station" : 'hsl(360, 69.2%, 29.6%)',
                     "Electrical Re-Wiring": 'hsl(360, 69.2%, 39.6%)',
                     "Electrical Service Change": 'hsl(360, 69.2%, 49.6%)',
                     "Temporary Electrical Service": 'hsl(360, 69.2%, 59.6%)',
                     "Generator": 'hsl(360, 69.2%, 69.6%)',
                     "Solar Electrical System": 'hsl(360, 69.2%, 79.6%)',
                     "Other": 'hsl(360, 69.2%, 89.6%)'};

        $(function() {
                $("#elc-monthly-dropdown-menu").val('el'+subtype);
        });
    

      break;

      case "pl":
        var subtypes = ["Eldorado Springs Sanitation Hookup", "Gas Piping", "Water Heater", "Plumbing - Other"];

        $(function() {
                $("#plm-monthly-dropdown-menu").val('pl'+subtype);
        });

      break;

      case "de":
        var subtypes = ["Commercial Deconstruction", "Residential Deconstruction", "Residential Demolition"];
   
        subColor = {"Commercial Deconstruction": 'hsl(10, 30.2%, 12.2%)',
                    "Residential Deconstruction": 'hsl(10, 30.2%, 42.2%)',
                    "Residential Demolition": 'hsl(10, 30.2%, 72.2%)'};

        $(function() {
                $("#dem-monthly-dropdown-menu").val('de'+subtype);
        });

      break;

      case "ot":
        var subtypes = ["Building Lot Determination", "Bridge", "Oil and Gas Development"];

        $(function() {
                $("#oth-monthly-dropdown-menu").val('ot'+subtype);
        });

      break;

      default:

      console.log('no subtype!?!?!?!?!?!?!??!?!?!');

    }


    // $("#uniqueSelector").on("click", $(".monthly-dropdown-menu"), function(){console.log(subtype, "!!!!")});

    // // $("#uniqueSelector select").on("change", gearUp())

    // console.log(document.getElementById('toggleWithPieClick').innerHTML);

    // // var c = eval(document.getElementById('toggleWithPieClick').innerHTML);


//     
 //     ___________   _____    ______________.___. ___________._______  ___   ___ ___________________________________
 //     \_   _____/  /  _  \  /   _____/\__  |   | \_   _____/|   \   \/  /  /   |   \_   _____/\______   \_   _____/
 //      |    __)_  /  /_\  \ \_____  \  /   |   |  |    __)  |   |\     /  /    ~    \    __)_  |       _/|    __)_ 
 //      |        \/    |    \/        \ \____   |  |     \   |   |/     \  \    Y    /        \ |    |   \|        \
 //     /_______  /\____|__  /_______  / / ______|  \___  /   |___/___/\  \  \___|_  /_______  / |____|_  /_______  /
 //              \/         \/        \/  \/             \/              \_/        \/        \/         \/        \/ 


    // console.log(appliedByDayBySubtype);

    var output = {};

    // // (C) Enumerates each type
    // console.log(appliedByDayBySubtype);
    // appliedByDayBySubtype2 =[];

    // appliedByDayBySubtype.map(function(week){
    //   week.key=moment(week.key).format("YYYY-MM");
    //   console.log(week.key)
    // });

    // for(var week in appliedByDayBySubtype){
    //   appliedByDayBySubtype2.push({country : country, data : countries[country] / countries_count[country]})
    // }


    // // var result = _.mapValues(appliedByDayBySubtype, function (e) {
    // //   return _.reduce(e, function (prev, current) {
    // //     return _(current)
    // //       .pick(_.isNumber)
    // //       .mapValues(function (value, key) {
    // //          return (prev[key] || 0) + value;
    // //       })
    // //       .value();
    // //   }, {});
    // // });

    // console.log(appliedByDayBySubtype2);




    subtypes.forEach(function(subtyper) {
      output[subtyper] = appliedByDayBySubtype.map(function(week) {
          var o = {};
          o[week.key] = week.values.filter(function(val) {
            return val.key == subtyper;
          }).map(function(m) { return m.values; }).shift() || '0';
          return o;
        })
    });

    console.log(subtypes, output);

    // (D) Enumerates each month
    // (E) initiates array of months
    // (F) Throws a blank into each arrays month if there were no records

    var weeks = appliedByDayBySubtype.map(function(week) {
      return week.key;
    });


    // (G) push the value into the type-labeled array

    var columnData = Object.keys(output).map(function(type) {
        var a = output[type].map(function(month){
          return month[Object.keys(month)[0]];
        });
        return [type].concat(a);
      })

    // console.log(subtype);

    console.log(columnData);

    var selectedColumnData = columnData.filter(function(subtypet){
      return (subtypet[0] == subtype);
    });

    console.log(selectedColumnData);
    console.log(weeks);

    // console.log(selectedColumnData);

    // (H) create the bar chart with months and types breakdown 
    /*
    /*  Bar Graph - Initial Load
    /*
    /*  DATA PLOT    
    /*
    /************************************************************************************/
    console.log(typeof(subColor));

    var chart = c3.generate({
      bindto: '#byDay',
      data: {
        columns: [selectedColumnData[0]],
        type: 'bar',
        colors: subColor
        },
      grid: {
        y: {
          lines: [{value:0}]
        }
      },
      axis: {
        x: {
          type: 'category',
          categories: weeks
        }
      },
      // legend: {
      //   show: false
      // }
      
    });

  });
};

window.SelectSubtype = SelectSubtype;