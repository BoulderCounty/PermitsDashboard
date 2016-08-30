var Demolition = function Demolition(config){

  var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";

  var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
          
  var records = [];



        /********************************************************************************/
        /*
        /*  DATA GRAB
        /*
        /********************************************************************************/

  if (!config){      

    var grabLast365 = PermitDashboard.cache.last365;
    console.log(grabLast365);

    requestJSONa(grabLast365, function(json) {

      var records = json.records;
      var demoRecords = clone(records); 

      console.log(demoRecords, "#");

    	switch (document.getElementById('monthList-dropdown-menu').value){

    		case '1':
      		demoRecords.forEach(function(record, inc, array) {
       		 record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
        	});
    		break;
       
    		default:
     			demoRecords.forEach(function(record, inc, array) {
        		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
      		})   

    	}; 

    	var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

    	var startDateMoment = moment().subtract(initialStartDate, 'M');

     	console.log(startDateMoment);

    	var appliedLast365Days = demoRecords.filter(function(d) { 
    	   return moment(d.AppliedDate) > startDateMoment; 
    	});




    	var appliedLastYearByType = appliedLast365Days.filter(function(o) {
      	return o.PermitTypeMapped === "Demolition";
    	});

    	permitTypes=[];

    	//Get a distinct list of neighborhoods
    	for (var i = 0; i < demoRecords.length; i++) {
    	    permitTypes.push([demoRecords[i]["PermitType"], demoRecords[i].count]);
    	}


    	var appliedLast365Days = demoRecords.filter(function(d) { 
    	   return moment(d.AppliedDate) > startDateMoment; 
    	});
    	    
    	var appliedByDayByType = [];

    	// compiles array for bar-graph
    	var appliedByDayByType = d3.nest()

        // concatenates date
        .key(function(d) { return d.AppliedDate })

        // concatanates type
        .key(function(d) { return d.PermitType })

        // takes the records and creates a count
        .rollup (function(v) { return v.length })

        // creates a d3 object from the records
        .entries(appliedLastYearByType);

      var subtypes = ["Commercial Deconstruction", "Residential Deconstruction", "Residential Demolition"];
       
      var output = [];

      console.log(appliedLastYearByType);
      console.log(appliedByDayByType);

                 
    	subtypes.forEach(function(subtype) {
        output[subtype] = appliedByDayByType.map(function(month) {
            var o = {};
            o[month.key] = month.values.filter(function(val) {
              return val.key == subtype;
            }).map(function(m) { return m.values; }).shift() || 0;
            return o;
          })
      });


      var dates = appliedByDayByType.map(function(date) {
        return date.key;
      });


      var columnData=[];
    	lcount=0;

    	columnData = Object.keys(output).map(function(type) {
        var a = output[type].map(function(month){
          return month[Object.keys(month)[0]];
        });
        return [type].concat(a);
    	});

    	console.log(columnData);

    	

    	var returnObj = ([Object.keys(output)[0]]).concat(returnObj)
  	  datesArray=[];
  	  output[Object.keys(output)[0]].forEach(function(d, i) {
  		    var dArray = [dates[i]];
  	    	datesArray.push(dArray);
  	  });

      console.log(datesArray);


              /*  Within Reloaded Pie-Chart - Enables Selection Based On Type
              /*
              /*    DATA PLOT
              /*
              /************************************************************************************/



      var chart = c3.generate({
        bindto: '#byDay',
        data: {
          columns : columnData
          ,
          type: 'bar'//,
        }, 
        axis: {
            y: {tick : {format: d3.format('d')}},
            x: {
            type: 'category',
            categories: datesArray
          }
        }
      });

                
    });

  }

  else {

            var grabLast365 = PermitDashboard.cache.last365;

            requestJSONa(grabLast365, function(json) {

            var records = json.records 
            var demoRecords = clone(records); 

        console.log(demoRecords, "#");

      switch (document.getElementById('monthList-dropdown-menu').value){

          case '1':
            demoRecords.forEach(function(record, inc, array) {
            record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
          });
          break;
         
          default:
            demoRecords.forEach(function(record, inc, array) {
            record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
            // console.log(record.AppliedDate, "*");
          })   

        }; 

        var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

        var startDateMoment = moment().subtract(initialStartDate, 'M');

      console.log(startDateMoment);

      var appliedLast365Days = demoRecords.filter(function(d) { 
         return moment(d.AppliedDate) > startDateMoment; 
      });




        var appliedLastYearByType = appliedLast365Days.filter(function(o) {
          return o.PermitTypeMapped === "Demolition";
        });

        permitTypes=[];

      //Get a distinct list of neighborhoods
      for (var i = 0; i < demoRecords.length; i++) {
          permitTypes.push([demoRecords[i]["PermitType"], demoRecords[i].count]);
      }


      var appliedLast365Days = demoRecords.filter(function(d) { 
         return moment(d.AppliedDate) > startDateMoment; 
      });
          
      var appliedByDayByType = [];

      // compiles array for bar-graph
      var appliedByDayByType = d3.nest()

        // concatenates date
        .key(function(d) { return d.AppliedDate })

        // concatanates type
        .key(function(d) { return d.PermitType })

        // takes the records and creates a count
        .rollup (function(v) { return v.length })

        // creates a d3 object from the records
        .entries(appliedLastYearByType);

        var subtypes = [config];
         
        var output = [];

        console.log(appliedLastYearByType);
        console.log(appliedByDayByType);

                   
        subtypes.forEach(function(subtype) {
          output[subtype] = appliedByDayByType.map(function(month) {
              var o = {};
              o[month.key] = month.values.filter(function(val) {
                return val.key == subtype;
              }).map(function(m) { return m.values; }).shift() || 0;
              return o;
            })
        });


        var dates = appliedByDayByType.map(function(date) {
          return date.key;
        });


        var columnData=[];
        // console.log(columnData);

        // dates.forEach(function(date, i){
        //   var dArray = date;
          // console.log(i);
      lcount=0;

      columnData = Object.keys(output).map(function(type) {
            var a = output[type].map(function(month){
              return month[Object.keys(month)[0]];
            });
            return [type].concat(a);
      });

      console.log(columnData);

      

        var returnObj = ([Object.keys(output)[0]]).concat(returnObj)
        datesArray=[];
        output[Object.keys(output)[0]].forEach(function(d, i) {
            var dArray = [dates[i]];
            datesArray.push(dArray);
      });

      console.log(datesArray);


              /*  Within Reloaded Pie-Chart - Enables Selection Based On Type
              /*
              /*   DATA PLOT
              /*
              /************************************************************************************/




      var chart = c3.generate({
        bindto: '#byDay',
        data: {
          columns : columnData
          ,
          type: 'bar'//,
        }, 
        axis: {
            y: {tick : {format: d3.format('d')}},
            x: {
            type: 'category',
            categories: datesArray
          }
        }
      });

                
    });

  }


  $("#innerSelectSubs").html('<select id="dem-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
                              '<option value="dCommercial Deconstruction">Commercial Deconstruction</option>'+
                              '<option value="dResidential Deconstruction">Residential Deconstruction</option>'+
                              '<option value="dResidential Demolition">Residential Demolition</option></select>');

  return subtype;

};

window.Demolition = Demolition;