var SelectSubtype = function selectSubtype(subtype){

    var appliedPerWeekLast365Day={};
    var appliedLast365Days={};
    // console.log($("#uniqueSelector .monthly-dropdown-menu").length);
    // var c = document.getElementById('subtypeMenu');
    // console.log(c);
    // $('#subtypeMenu').unbind('change');

  var initialStartDate = document.getElementById('monthly-dropdown-menu').value;
  console.log(initialStartDate);

  console.log(subtype,"^^");
  var typeM = subtype.substr(0, 1);
  var subtype = subtype.slice(1);


    /********************************************************************************/
    /* Get all activity in last year (START)
    /* ____    _  _____  _       ____ ____      _    ____  
    /*|  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
    /*| | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
    /*| |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
    /*|____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
    /********************************************************************************/

    // Original data grab
  // var initialStartDate = 365;
  var startDate = moment().subtract(initialStartDate, 'M').format("YYYY-MM-DD");
  var startDateMoment = moment().subtract(initialStartDate, 'M');

      // set up SQL query string
  var urlLast365Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + startDate + "' order by \"AppliedDate\"";
  // var urlLast30Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"EstProjectCost\",\"PermitType\",\"PermitTypeMapped\",\"Link\",\"OriginalAddress1\" from \"permitsResourceId\" where \"StatusDate\" > \'" + shortStartDate + "' order by \"AppliedDate\"";
      // encode URL
  var urlLast365 = baseURI + encodeURIComponent(urlLast365Query.replace("permitsResourceId", permitsResourceId));
  // var urlLast30 = baseURI + encodeURIComponent(urlLast30Query.replace("permitsResourceId", permitsResourceId));

  var records=[];

  requestJSON(urlLast365, function(json) {
    var records = json.result.records;


  console.log(records.length)


    //extract permits applied for the last year
    var appliedLast365Days = records.filter(function(d) { 
      return moment(d.AppliedDate) > startDateMoment; 
    });

    console.log(appliedLast365Days.length);


    // format record.AppliedDate to drop days and years
    // ?? DOES THIS DO ANYTHING IN THIS LOCATION ??

    records.forEach(function(record, inc, array) {
      record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
    })


    /* INITIAL CONSTRUCTION OF BAR CHART (START)


    /********************************************************************************/
    /* Calculated permits applied for by day and by type (START)
    /********************************************************************************/

    /********************************************************************************/
    
    weeklyBunch = [];


    for (var  i = 0; i<records.length; i++){
      var then = records[i].AppliedDate;



      // var thenYear=then.substr(0,4);
      // var thenMonth=then.substr(5,2);
      // var thenDay=then.substr(8,2);

      // var daysAgo = (timeSpanDays(thenYear, thenMonth, thenDay));


      var ago = moment(then);
      var weeksAgo = ago.startOf('isoWeek').format('YYYY-MM-DD');
      // var weeksAgo= Math.floor(daysAgo/7);
      // records[i].AppliedDate = moment(records[i].AppliedDate).format('YYYY-MM-DD');
      // var p = moment(records[i].AppliedDate).day();
      // var q = p.day();
      weeklyBunch.push([records[i]["AppliedDate"], ago, weeksAgo]);


      // console.log(weeksAgo,'________', records[i].AppliedDate);
    }

    console.log(weeklyBunch.length);

    var appliedPerWeekLast365Days = weeklyBunch.filter(function(d) {
        // console.log(moment(d[1]),"*********",startDateMoment);
        return (moment(d[1]).diff(startDateMoment) >= 0);
    });
    

    console.log(appliedPerWeekLast365Days.length);
    // var appliedLast365Days = records.filter(function(d) { 
    //   return moment(d.AppliedDate) > startDateMoment; 
    // })

    appliedLast365Days.forEach(function(day, inc, arr){
      // console.log(appliedLast365Days[inc],"#####", appliedPerWeekLast365Days[inc][1]);
      appliedLast365Days[inc]["week"] = appliedPerWeekLast365Days[inc][1];
    });

    // creates the data object
    // FURTHER DESCRIPTION NECESSARY {key_Month : [ {key_type : numb }]}

    // console.log(appliedPerWeekLast365Days);

    var appliedByDayBySubtype = d3.nest()
      .key(function(d) { return d.week })
      .key(function(d) { return d.PermitType })
      .rollup (function(v) { return v.length })
      .entries(appliedLast365Days);

    console.log(appliedByDayBySubtype);


    // Initiate arrays with type label 

    switch(typeM) {

      case "b":
        var subtypes = ["Other","NRB","New Residence","RA","Residential Accessory Building","Residential Addition","Residential Remodel","Commercial Remodel","NCR","Accessory Agricultural Building"];
     

        $(function() {
            $("#bld-monthly-dropdown-menu").val('b'+subtype);
        });
        
      break;
    
      case "m":
        var subtypes = ["Air Conditioning","Boiler","Evaporative Cooler","Furnace","Gas Log Fireplace","Other","Wood Stove","Solar Thermal"];

        $(function() {
                $("#mch-monthly-dropdown-menu").val('m'+subtype);
        });
            

      break;
    
      case "e":
        var subtypes = ["Commercial Electric", "Electrical Lift Station", "Electrical Re-Wiring", "Electrical Service Change", "Temporary Electrical Service", "Generator", "Solar Electrical System", "Other"];
   
        $(function() {
                $("#elc-monthly-dropdown-menu").val('e'+subtype);
        });
    

      break;

      case "p":
        var subtypes = ["Eldorado Springs Sanitation Hookup", "Gas Piping", "Water Heater", "Plumbing - Other"];

        $(function() {
                $("#plm-monthly-dropdown-menu").val('p'+subtype);
        });

      break;

      case "d":
        var subtypes = ["Commercial Deconstruction", "Residential Deconstruction", "Residential Demolition"];
   
        $(function() {
                $("#dem-monthly-dropdown-menu").val('d'+subtype);
        });

      break;

      case "o":
        var subtypes = ["Building Lot Determination", "Bridge", "Oil and Gas Development"];

        $(function() {
                $("#oth-monthly-dropdown-menu").val('o'+subtype);
        });

      break;

    }


    $("#uniqueSelector").on("click", $(".monthly-dropdown-menu"), function(){console.log(subtype, "!!!!")});

    // // $("#uniqueSelector select").on("change", gearUp())

    // console.log(document.getElementById('toggleWithPieClick').innerHTML);

    // // var c = eval(document.getElementById('toggleWithPieClick').innerHTML);


    

    // console.log(appliedByDayBySubtype);

    var output = {};

    // (C) Enumerates each type


    subtypes.forEach(function(subtyper) {
      output[subtyper] = appliedByDayBySubtype.map(function(week) {
          var o = {};
          o[week.key] = week.values.filter(function(val) {
            return val.key == subtyper;
          }).map(function(m) { return m.values; }).shift() || 0;
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

    console.log(weeks);

    // (G) push the value into the type-labeled array

    var columnData = Object.keys(output).map(function(type) {
        var a = output[type].map(function(month){
          return month[Object.keys(month)[0]];
        });
        return [type].concat(a);
      })

    console.log(subtype);

    console.log(columnData);

    var selectedColumnData = columnData.filter(function(subtypet){
      return subtypet[0] == subtype;
    });

    console.log(selectedColumnData);

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
        columns: selectedColumnData,
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