var permitTypesQuery = "SELECT \"PermitTypeMapped\", count(*) as Count from \"permitsResourceId\" where \"IssuedDate\" > '" + startDate + "' group by \"PermitTypeMapped\" order by Count desc";

var permitTypesQ = baseURI + encodeURIComponent(permitTypesQuery.replace("permitsResourceId", permitsResourceId));
        
var records = [];



      /********************************************************************************/
      /*  ____    _  _____  _       ____ ____      _    ____  
      /* |  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
      /* | | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
      /* | |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
      /* |____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
      /*
      /********************************************************************************/

requestJSON(urlLast365, function(json) {

    var records = json.result.records 

    console.log(records, "#");

	switch (document.getElementById('monthly-dropdown-menu').value){

  		case '1':
    		records.forEach(function(record, inc, array) {
     		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
     		// console.log(record.AppliedDate, "%%");
    	});
  		break;
     
  		default:
   			records.forEach(function(record, inc, array) {
    		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
    		// console.log(record.AppliedDate, "*");
  		})   

  	}; 

  	var initialStartDate = document.getElementById('monthly-dropdown-menu').value;

  	var startDateMoment = moment().subtract(initialStartDate, 'M');

 	console.log(startDateMoment);

	var appliedLast365Days = records.filter(function(d) { 
	   return moment(d.AppliedDate) > startDateMoment; 
	});




  	var appliedLastYearByType = appliedLast365Days.filter(function(o) {
    	return o.PermitTypeMapped === "Electrical";
  	});

  	permitTypes=[];

	//Get a distinct list of neighborhoods
	for (var i = 0; i < records.length; i++) {
	    permitTypes.push([records[i]["PermitType"], records[i].count]);
	}


	var appliedLast365Days = records.filter(function(d) { 
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

    var subtypes = ["Commercial Electric", "Electrical Lift Station", "Electrical Re-Wiring", "Electrical Service Change", "Temporary Electrical Service", "Generator", "Solar Electrical System", "Other"];
     
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
          /*     //    ) ) // | |  /__  ___/ // | |       //   ) ) / /        //   ) ) /__  ___/ 
          /*    //    / / //__| |    / /    //__| |      //___/ / / /        //   / /    / /     
          /*   //    / / / ___  |   / /    / ___  |     / ____ / / /        //   / /    / /      
          /*  //    / / //    | |  / /    //    | |    //       / /        //   / /    / /       
          /* //____/ / //     | | / /    //     | |   //       / /____/ / ((___/ /    / /       
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

$("#subtypeMenu").html('<select id="bld-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="selectSubtype(value);"><option value="">ALL</option>'+
                '<option value="eCommercial Electric">Commercial Electric</option>'+
                '<option value="eElectrical Lift Station">Electrical Lift Station</option>'+
                '<option value="eElectrical Re-Wiring">Electrical Re-Wiring</option>'+
                '<option value="eElectrical Service Change">Electrical Service Change</option>'+
                '<option value="eTemporary Electrical Service">Temporary Electrical Service</option>'+
                '<option value="eGenerator">Generator</option>'+
                '<option value="eSolar Electrical System">Solar Electrical System</option>'+
                '<option value="eElectrical Other">Electical Other</option></select>');
