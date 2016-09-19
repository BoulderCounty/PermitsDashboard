var resourceId = "d914e871-21df-4800-a473-97a2ccdf9690";
var permitsResourceId = "d914e871-21df-4800-a473-97a2ccdf9690";
var inspectionsResourceId = "";
//var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";

// Helper function to make request for JSONP.
function requestJSON(url, callback) {
  $.ajax({
    beforeSend: function() {
      // Handle the beforeSend event
    },
    url: url,
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
      // $('.canvas').show();
      // $('#loading').hide();
       
    }
  });
}

var dateCalc = moment().subtract(12, 'M').format("YYYY-MM-DD");

//============================================================================
// In SQL Query string, original 'IssuedDate' has been changed to 'StatusDate'
//============================================================================
var permitDescQuery = "SELECT \"Description\" from \"resource_id\" WHERE \"StatusDate\" >= \'" + dateCalc + "\'";
var permitDesc = baseURI + encodeURIComponent(permitDescQuery.replace("resource_id", resourceId));

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

requestJSON(permitDesc, function(json) {

  console.log(json);

});

requestJSON(urlLast365, function(json){

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

})

  /********************************************************************************/
  /* Average Issuance Days (START)
  /********************************************************************************/

  console.log ('*****', startDate, "*****")
  var urlLast12Query = "SELECT \"PermitNum\",\"AppliedDate\",\"IssuedDate\",\"CompletedDate\",\"PermitTypeMapped\" from \"permitsResourceId\" where \"IssuedDate\" > \'" + startDate + "' and \"IssuedDate\" <> '' order by \"IssuedDate\" DESC";
  var urlLast12 = baseURI + encodeURIComponent(urlLast12Query.replace("permitsResourceId", permitsResourceId));
  
  /********************************************************************************/
  /*  ____    _  _____  _       ____ ____      _    ____  
  /* |  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
  /* | | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
  /* | |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
  /* |____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
  /*
  /********************************************************************************/

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
      if (dateDataObj.dateDifference > 60) {dateDataObj.dateDifference = 30;}// || dateDataObj.dateDifference = dateDataObj.dateDifference}
      dateDataObj.appliedDate = appliedDate.format('YYYY-MM-DD');
      dateDataObj.issuedDate = issuedDate.format('YYYY-MM-DD');
      if (dateDataObj.dateDifference < 60) {dateData.push(dateDataObj);}
      else {console.log(dateDataObj);}
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

      console.log(daysAnalysisByType);

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

    /*
    /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
    /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
    /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
    /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
    /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
    /************************************************************************************/


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
          },
        }
    });

  });
  /********************************************************************************/
  /* Average Issuance Days (END)
  /********************************************************************************/


 /********************************************************************************/
  /* Average Completion Days (START)
  /********************************************************************************/

  /********************************************************************************/
  /*  ____    _  _____  _       ____ ____      _    ____  
  /* |  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
  /* | | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
  /* | |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
  /* |____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
  /*
  /********************************************************************************/

  requestJSON(urlLast12, function(json) {
    var records = json.result.records;

    var dateData = [];
    records.forEach(function(d) {
      var dateDataObj = {};
      var appliedDate = moment(d.AppliedDate);
      var completedDate = moment(d.CompletedDate);
      dateDataObj.permitNum = d.PermitNum;
      dateDataObj.permitType = d.PermitTypeMapped;
      dateDataObj.dateDifference = Math.abs(appliedDate.diff(completedDate, 'd'));
      if (dateDataObj.dateDifference > 180) {dateDataObj.dateDifference = 30;}// || dateDataObj.dateDifference = dateDataObj.dateDifference}
      dateDataObj.appliedDate = appliedDate.format('YYYY-MM-DD');
      dateDataObj.completedDate = completedDate.format('YYYY-MM-DD');
      if (dateDataObj.dateDifference < 180) {dateData.push(dateDataObj);}

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

    /*
    /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
    /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
    /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
    /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
    /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
    /************************************************************************************/


    var chart = c3.generate({
      bindto: '#timeFor',
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
          },
        }
    });

  });
  /********************************************************************************/
  /* Average Completion Days (END)
  /********************************************************************************/

  var ctx = $("#myChart");

  var myBubbleChart = new Chart(ctx,{
    type: 'bubble',
    data: data,
    options: options
});