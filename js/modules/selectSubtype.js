var SelectSubtype = function (subtype){

  (function( $ ){
     $.fn.myfunction = function(divElement) {
        var bob2;
        var bob1 = ($(this).text());
        bob2 = bob1[337];
        // bob4= (6 + (divElement.element.innerText.match(/\n/g)||[]).length*10);
        // console.log($(this).text);
        // console.log(divElement.element.innerText);
        console.log($(this));
        console.log(typeof($(this).text()));


        bob5= (divElement.element.innerText.length);
        bob6= ($(this).text()).length;
        bob7= bob6-10-1;

        console.log($(divElement.element)[0].innerText);
        console.log(bob6);
        var bob3 = bob2;
        for (var i=bob7; i >= 0; i--){
          var bob2 = bob1[i];
          // console.log(i, bob2);
          var bob3 = bob3+bob2;
        }
        console.log(bob3);
        return bob3;
     }; 
  })( jQuery );


    console.log($("#uniqueSelector .monthly-dropdown-menu").length);
    console.log($("#uniqueSelector .monthly-dropdown-menu"));
    var c = document.getElementById('subtypeMenu');
    console.log(c);
    $('#subtypeMenu').unbind('change');


  var initialStartDate = $("#monthList-dropdown-menu").val().slice(11);
  console.log(initialStartDate);

  console.log(subtype,"^^");
  var typeM = subtype.substr(0, 2);
  var subtype = subtype.slice(2);
  console.log(typeM,"%^^%");

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
    var subRecords = clone(records); 
    var subRecords2 = clone(records); 


  console.log(subRecords)

    subRecords2 = subRecords.filter(function(record){
      return (((record["PermitType"]) == subtype) && (moment(record.AppliedDate).format("YYYY-MM-DD") > startDateMoment.format("YYYY-MM-DD")))
    })


    // format record.AppliedDate to drop days and years
    // ?? DOES THIS DO ANYTHING IN THIS LOCATION ??

    // subRecords2.forEach(function(record, inc, array) {
    //   record.AppliedDate = moment(record.AppliedDate).format('MMM-YY');
    // })

    //extract permits applied for the last year
    var appliedLast365Days = subRecords2.filter(function(d) { 
      return moment(d.AppliedDate) > startDateMoment; 
    });


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
      .entries(subRecords2);


    console.log(appliedByDayBySubtype);

    // (B) Initiate arrays with type label 

    switch(typeM) {

      case "bu":
        var subtypes = ["Other","NRB","New Residence","RA","Residential Accessory Building","Residential Addition","Residential Remodel","Commercial Remodel","NCR","Accessory Agricultural Building"];
     
      break;
    
      case "me":
        var subtypes = ["Air Conditioning","Boiler","Evaporative Cooler","Furnace","Gas Log Fireplace","Other","Wood Stove","Solar Thermal"];
      break;

      case "el":
        var subtypes = ["Commercial Electric", "Electrical Lift Station", "Electrical Re-Wiring", "Electrical Service Change", "Temporary Electrical Service", "Generator", "Solar Electrical System", "Other"];
      break;

      case "pl":
        var subtypes = ["Eldorado Springs Sanitation Hookup", "Gas Piping", "Water Heater", "Plumbing - Other"];
      break;

      case "de":
        var subtypes = ["Commercial Deconstruction", "Residential Deconstruction", "Residential Demolition"];
      break;

      case "ot":
        var subtypes = ["Building Lot Determination", "Bridge", "Oil and Gas Development"];
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
      output[subtyper] = appliedByDayBySubtype.map(function(month) {
          var o = {};
          o[month.key] = month.values.filter(function(val) {
            return val.key == subtype;
          }).map(function(m) { return m.values; }).shift() || 0;
          return o;
        })
    });

    console.log(appliedByDayBySubtype, subtypes, output);

    // (D) Enumerates each month
    // (E) initiates array of months
    // (F) Throws a blank into each arrays month if there were no records

    var months = appliedByDayBySubtype.map(function(month) {
      return month.key;
    });

    console.log(months);

    // (G) push the value into the type-labeled array
  
    console.log(output);
    console.log(typeof(output));

    // output=output[subtype];

    //  = output.filter(function(record){
    //   return ((record["PermitType"]) == subtype)
    // });


    function getObjValues(obj) {
        var o = [];
        for ( var key in obj ) {
          o.push(obj[key]);
        }
        return o;
    }


    // function getObjKeys(obj) {
    //     var o = [];
    //     for ( var elem in obj ) {
    //       o.push(elem.keys());
    //     }
    //     return o;
    // }

    console.log(Object.keys(output).indexOf(subtype));

    var columnData = Object.keys(output).map(function(type) {
        var a = output[type].map(function(month){
          return month[Object.keys(month)[0]];
        });
        return [type].concat(a);
      })
    
    console.log(Object.keys(columnData));


    console.log(columnData);

    var columnData=[columnData[Object.keys(output).indexOf(subtype)]];



    // var columnData = getObjValues(output);
    // .map(function(type) {
    //     var a = output[type].map(function(month){
    //       return month[Object.keys(month)[0]];
    //     });
    //     return [type].concat(a);
    //   })

    console.log(columnData);

    console.log('arr', getObjValues(output));
    console.log('keys', Object.keys(output));
    console.log('obj', output);

    var subtypeKeys = Object.keys(output);

    var permitsToLoad = 25;
    var totalPermits = appliedLast365Days.length-1;
    var permitStart = 1

    console.log(totalPermits);
    
    for (var i = totalPermits; i > totalPermits - 10; i--) {
      console.log(i);
      $("#recent" + permitStart).attr("href", appliedLast365Days[i].Link);
      $("#permit" + permitStart).text(appliedLast365Days[i].PermitNum);
      $("#address" + permitStart).text(appliedLast365Days[i].OriginalAddress1);
      permitStart++;
    }


    // (H) create the bar chart with months and types breakdown 
    /*
    /*  Bar Graph - Initial Load
    /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
    /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
    /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
    /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
    /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
    /************************************************************************************/

    var columnType = columnData[0][0];
    console.log(columnType);

    var chart = c3.generate({
      bindto: '#byDay',
      data: {
        columns: columnData,
        type: 'bar',
        types: { columnData:'bar'},
        onclick: function (d, i) {var devo = chart.categories()[d.index]; var bob = $(this["element"]).myfunction(this); console.log("date=>"+bob); var numberOfLineBreaks = (this.element.innerText.match(/\n/g)||[]).length; console.log('Number of breaks: ' + numberOfLineBreaks);var splitted = $(this.element).text(); console.log(splitted, "onclick"); return restrictList(d, bob, devo);}
        // , "this.element.innerText", this.element.innerText.toString(), "this.element", this.element, "this", this, "i", i, "offclick", Object.keys(d.index), "d", d, d.index); restrictList(d); return (console.log('boo-hoo')); }
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

  function restrictList(x, y, divElement){

    // console.log((divElement.element.innerText.match(/\n/g)||[]).length);
    // console.log(x);
    appliedLastYearByType = window.PermitDashboard.cache.last365.records;
    // console.log(appliedLastYearByType);
    // console.log(appliedLastYearByType.length);
    var totalPermitting = appliedLastYearByType.length-1;
    function isTheRightType(value) {
      // console.log(this, value);
      return value.PermitType == this.id;
    }
    function isTheRightDate(value) {
      // console.log(this, value);
      return value.AppliedDate == divElementls
      ;
    }
    var totalPermits = appliedLastYearByType.filter(isTheRightType, x);
    var selectedPermits = totalPermits.filter(isTheRightDate, y);
    console.log(x, y, selectedPermits.length);
    
    for (var i = 0; i < 10; i++) {
      $("#recent" + i).attr('');
      $("#permit" + i).empty('');
      $("#address" + i).empty('');
    }

    var permitStart = 1
    for (var i = (selectedPermits.length)-1; i >= 0; i--) {
      console.log(i, selectedPermits);
      $("#recent" + permitStart).attr("href", selectedPermits[i].Link);
      $("#permit" + permitStart).text(selectedPermits[i].PermitNum);
      $("#address" + permitStart).text(selectedPermits[i].OriginalAddress1);
      permitStart++;
    }
  };
};