var Building = function Building(config){
	console.log("START:", config);
	var records = [];


	      /********************************************************************************/
	      /*  ____    _  _____  _       ____ ____      _    ____  
	      /* |  _ \  / \|_   _|/ \     / ___|  _ \    / \  | __ ) 
	      /* | | | |/ _ \ | | / _ \   | |  _| |_) |  / _ \ |  _ \ 
	      /* | |_| / ___ \| |/ ___ \  | |_| |  _ <  / ___ \| |_) |
	      /* |____/_/   \_\_/_/   \_\  \____|_| \_\/_/   \_\____/ 
	      /*
	      /********************************************************************************/
	if (!config){

		var grabLast365 = PermitDashboard.cache.last365;
		console.log(grabLast365);

		requestJSONa(grabLast365, function(json) {

		    var records = json.records;
		    var buildRecords = clone(records);

		    console.log(buildRecords, "#");

			switch (document.getElementById('monthList-dropdown-menu').value){

		  		case '1':
		    		buildRecords.forEach(function(record, inc, array) {
		     		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
		    	});
		  		break;
		     
		  		default:
		   			buildRecords.forEach(function(record, inc, array) {
		    		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
		  		})   

		  	}; 

		  	var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

		  	var startDateMoment = moment().subtract(initialStartDate, 'M');

		 	console.log(startDateMoment);

			var appliedLast365Days = buildRecords.filter(function(d) { 
			   return moment(d.AppliedDate) > startDateMoment; 
			});


		  	var appliedLastYearByType = appliedLast365Days.filter(function(o) {
		    	return o.PermitTypeMapped === "Building";
		  	});

		  	permitTypes=[];

			//Get a distinct list of neighborhoods
			for (var i = 0; i < buildRecords.length; i++) {
			    permitTypes.push([buildRecords[i]["PermitType"], buildRecords[i].count]);
			}


			var appliedLast365Days = buildRecords.filter(function(d) { 
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

		    var subtypes = ["Other","NRB","New Residence","RA","Residential Accessory Building","Residential Addition","Residential Remodel","Commercial Remodel","NCR","Accessory Agricultural Building"];
		     
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
	}

	else {


		var grabLast365 = PermitDashboard.cache.last365;

		console.log(grabLast365);

		var config = config.slice(1);

		requestJSONa(grabLast365, function(json) {

	    	var records = json.records;
		    var buildRecords = clone(records);

		    console.log(records, "#");


		    switch (document.getElementById('monthList-dropdown-menu').value){

			  		case '1':
			    		buildRecords.forEach(function(record, inc, array) {
			     		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
			     		// console.log(record.AppliedDate, "%%");
			    	});
			  		break;
			     
			  		default:
			   			buildRecords.forEach(function(record, inc, array) {
			    		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
			    		// console.log(record.AppliedDate, "*");
			  		})   

			  	}; 

		  	var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

		  	var startDateMoment = moment().subtract(initialStartDate, 'M');

		 	console.log(startDateMoment);

			var appliedLast365Days = buildRecords.filter(function(d) { 
			   return moment(d.AppliedDate) > startDateMoment; 
			});


		  	var appliedLastYearByType = appliedLast365Days.filter(function(o) {
		    	return o.PermitTypeMapped === "Building";
		  	});

		  	permitTypes=[];

			//Get a distinct list of neighborhoods
			for (var i = 0; i < buildRecords.length; i++) {
			    permitTypes.push([buildRecords[i]["PermitType"], buildRecords[i].count]);
			}


			var appliedLast365Days = buildRecords.filter(function(d) { 
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
	          /*  DATA PLOT 
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

	$("#innerSelectSubs").html('<select id="bld-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value=""></option>'+

            '<optgroup label="Residential">'+    
                                            '<option value="bNRB">New Residence Building</option>'+
                                            '<option value="bNew Residence">New Residence</option>'+
                                            '<option value="bRA">Residential Accessory</option>'+
                                            '<option value="bResidential Accessory Building">Residential Accessory Building</option>'+
                                            '<option value="bResidential Addition"">Residential Addition</option>'+
                                            '<option value="bResidential Remodel">Residential Remodel</option></optgroup><optgroup label="Commercial">'+
                                            '<option value="bCommercial Remodel">Commercial Remodel</option>'+
                                            '<option value="bNCR">New Commercial Residence</option></optgroup><optgroup label="Agriculture">'+
                                            '<option value="bAccessory Agricultural Building">Accessory Agriculture Building</option></optgroup>'+
                                            '<option value="bobuild">Other</option></select>');

	console.log('*******  ',config,'  *******');
	return subtype;



};

window.Building = Building;