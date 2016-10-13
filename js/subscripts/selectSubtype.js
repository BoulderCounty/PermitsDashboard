 function selectSubtype(subtype){


    console.log($("#uniqueSelector .monthly-dropdown-menu").length);
    var c = document.getElementById('subtypeMenu');
    console.log(c);
    $('#subtypeMenu').unbind('change');

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

    //extract permits applied for the last year
    var appliedLast365Days = records.filter(function(d) { 
      return moment(d.AppliedDate) > startDateMoment; 
    });


    // format record.AppliedDate to drop days and years
    // ?? DOES THIS DO ANYTHING IN THIS LOCATION ??

    records.forEach(function(record, inc, array) {
      record.AppliedDate = moment(record.AppliedDate).format('MMM-YY');
    })


    /* INITIAL CONSTRUCTION OF BAR CHART (START)


    /********************************************************************************/
    /* Calculated permits applied for by day and by type (START)
    /********************************************************************************/

    /********************************************************************************/
    
    // (A) creates the data object
    // FURTHER DESCRIPTION NECESSARY {key_Month : [ {key_type : numb }]}

    var appliedByDayBySubtype = d3.nest()
      .key(function(d) { return d.AppliedDate })
      .key(function(d) { return d.PermitType })
      .rollup (function(v) { return v.length })
      .entries(appliedLast365Days);

    // (B) Initiate arrays with type label 

    switch(typeM) {

      case "b":
        var subtypes = ["Other","NRB","New Residence","RA","Residential Accessory Building","Residential Addition","Residential Remodel","Commercial Remodel","NCR","Accessory Agricultural Building"];
     
      break;
    
      case "m":
        var subtypes = ["Air Conditioning","Boiler","Evaporative Cooler","Furnace","Gas Log Fireplace","Other","Wood Stove","Solar Thermal"];
        // $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu" onchange ="selectSubtype(value);"><option value="">ALL</option>'+
        //           '<option value="mac">Air Conditioning</option>'+
        //           '<option value="mboil">Boiler</option>'+
        //           '<option value="mevap">Evaporative Cooler</option>'+
        //           '<option value="mfurnace">Furnace</option>'+
        //           '<option value="mg-l-fire">Gas / Log Fireplace</option>'+
        //           '<option value="mstove">Wood Stove</option>'+
        //           '<option value="msolar">Solar Thermal</option>'+
        //           '<option value="momech">Other</option></select>');
      break;
    }
    //   case "e":
    //     var subtypes = ["Commercial Electric", "Electrical Lift Station", "Electrical Re-Wiring", "Electrical Service Change", "Temporary Electrical Service", "Generator", "Solar Electrical System", "Other"];
    //     $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu"><option value="">ALL</option>'+
    //               '<option value="ecom">Commercial Electric</option>'+
    //               '<option value="els">Electrical Lift Station</option>'+
    //               '<option value="erewire">Electrical Re-Wiring</option>'+
    //               '<option value="eservice">Electrical Service Change</option>'+
    //               '<option value="etemp">Temporary Electrical Service</option>'+
    //               '<option value="egen">Generator</option>'+
    //               '<option value="esolar">Solar Electrical System</option>'+
    //               '<option value="eoelec">Other</option></select>');
    //   break;

    //   case "p":
    //     var subtypes = ["Eldorado Springs Sanitation Hookup", "Gas Piping", "Water Heater", "Plumbing - Other"];
    //     $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu"><option value="">ALL</option>'+
    //               '<option value="pheat">Water Heater</option>'+
    //               '<option value="pgas">Gas Piping</option>'+
    //               '<option value="phook">Eldorado Springs Sanitation Hookup</option>'+
    //               '<option value="poplum">Plumbing - Other</option></select>');
    //   break;

    //   case "d":
    //     var subtypes = ["Commercial Deconstruction", "Residential Deconstruction", "Residential Demolition"];
    //     $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu"><option value="">ALL</option>'+
    //             '<option value="dcomm">Commercial Deconstruction</option>'+
    //             '<option value="dresdecon">Residential Deconstruction</option>'+
    //             '<option value="dresdemo">Residential Demolition</option></select>');
    //   break;

    //   case "o":
    //     var subtypes = ["Building Lot Determination", "Bridge", "Oil and Gas Development"];
    //     $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu"><option value="">ALL</option>'+
    //             '<option value="obridge">Bridge</option>'+
    //             '<option value="olot">Building Lot Determination</option>'+
    //             '<option value="ooilngas">Oil and Gas Development</option></select>'); 
    //   break;

    // }


     $("#uniqueSelector").on("click", $(".monthly-dropdown-menu"), function(){console.log(subtype, "!!!!")});

    // // $("#uniqueSelector select").on("change", gearUp())

    // console.log(document.getElementById('toggleWithPieClick').innerHTML);

    // // var c = eval(document.getElementById('toggleWithPieClick').innerHTML);


    

    // console.log(appliedByDayBySubtype);

    var output = {};
  
    // (C) Enumerates each type


    subtypes.forEach(function(subtype) {
      output[subtype] = appliedByDayBySubtype.map(function(month) {
          var o = {};
          o[month.key] = month.values.filter(function(val) {
            return val.key == subtype;
          }).map(function(m) { return m.values; }).shift() || 0;
          return o;
        })
    });

    console.log(subtypes, output);

    // (D) Enumerates each month
    // (E) initiates array of months
    // (F) Throws a blank into each arrays month if there were no records

    var months = appliedByDayBySubtype.map(function(month) {
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
      // legend: {
      //   show: false
      // }
      
    });

  });
  };