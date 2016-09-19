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
                initialStartDate = (parseInt(initialStartDate) + 1);
              }

  var startDate = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");
  var startDateMoment = moment().subtract(initialStartDate, 'M');

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
      return ((record["PermitType"]) == subtype && (moment(record.AppliedDate) > startDateMoment))
    })


  console.log(subRecords2.length)


    //extract permits applied for the last year
    var appliedLast365Days = subRecords.filter(function(d) { 
      return moment(d.AppliedDate) > startDateMoment; 
    });

    //extract permits issued in last year
    var issuedLast365Days2 = records.filter(function(d) { 
      return ((d["PermitType"]) == subtype && (moment(d.IssuedDate) > startDateMoment)); 
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

        var ago = moment(then);
        var weeksAgo = ago.startOf('isoWeek').format('YYYY-MM-DD');
        weeklyBunch.push([appliedLast365Days[i]["AppliedDate"], ago, weeksAgo]);

      }

      console.log(weeklyBunch.length);

    }

    else {
      records.forEach(function(record, inc, array) {
        record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');

      })

      weeklyBunch = [];

      for (var  i = 0; i<appliedLast365Days.length; i++){
        var then = appliedLast365Days[i].AppliedDate;
        var ago = moment(then).subtract(1, "months");
        var weeksAgo = ago.startOf('isoWeek').format('YYYY-MM');
        weeklyBunch.push([appliedLast365Days[i]["AppliedDate"], ago, weeksAgo]);

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
      // console.log(appliedLast365Days[inc],"#####", appliedPerWeekLast365Days[inc][2]);
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


    // Initiate arrays with type label 

    switch(typeM) {

      case "bu":
        var subtypes = ["Other","NRB","New Residence","RA","Residential Accessory Building","Residential Addition","Residential Remodel","Commercial Remodel","NCR","Accessory Agricultural Building"];
     

        $(function() {
            $("#bld-monthly-dropdown-menu").val('bu'+subtype);
        });
        
      break;
    
      case "me":
        var subtypes = ["Air Conditioning","Boiler","Evaporative Cooler","Furnace","Gas Log Fireplace","Other","Wood Stove","Solar Thermal"];

        $(function() {
                $("#mch-monthly-dropdown-menu").val('me'+subtype);
        });
            

      break;
    
      case "el":
        var subtypes = ["Commercial Electric", "Electrical Lift Station", "Electrical Re-Wiring", "Electrical Service Change", "Temporary Electrical Service", "Generator", "Solar Electrical System", "Other"];
   
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


    var chart = c3.generate({
      bindto: '#byDay',
      data: {
        columns: [selectedColumnData[0]],
        type: 'bar',
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