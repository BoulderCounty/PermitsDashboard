var SelectPieSlice = function (d, i) {

  console.log("onclick", d.id, i);
  $("#innerSelectSubs").empty();
  $("#uniqueSelector").empty();
  clearDomElementUS();
  // $(".monthly-dropdown-menu option:selected").val("");   

      // REMOVE CSS STYLE
  console.log(d.id);
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

    months = 12;
    initialStartDate = 12;
    console.log(initialStartDate);

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

    console.log(appliedLastYearByType);
        
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

    console.log(appliedByDayByType);

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
    window.weeklyReturningObj = returnObj;

    console.log(Object.keys(output)[0],'_____');

    datesArray=[];

    output[Object.keys(output)[0]].forEach(function(d, i) {

      var dArray = [dates[i]];
      datesArray.push(dArray);
  
    });

    window.datesingArray = datesArray;

    var ar = [];

    for (var i = 0; i < output[d.id].length; i++){
      for(item in output[d.id][i]){
          ar.push(output[d.id][i][item]);
       }
    }

    console.log(ar);

    var total = 0;

    wereSum = ar.reduce(function(pv, cv, i, ar) {return pv+cv});
    //             arr[i].reduce(function(a, b){
    //     return a >= b ? a : b;
    // }

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
    ReturnObjChart(returnObj, datesArray)    

    var permitsToLoad = 25;
    var totalPermits = appliedLastYearByType.length-1;
    var permitStart = 1
    
    for (var i = totalPermits; i > totalPermits - 100; i--) {
      $("#recent" + permitStart).attr("href", appliedLastYearByType[i].Link);
      $("#permit" + permitStart).text(appliedLastYearByType[i].PermitNum);
      $("#address" + permitStart).text(appliedLastYearByType[i].OriginalAddress1);
      permitStart++;
    }


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
      }
    )
  });  

      console.log('****^^*****', $("#monthList-dropdown-menu").value)

};

window.SelectPieSlice = SelectPieSlice;